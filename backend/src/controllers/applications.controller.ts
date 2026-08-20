import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { applicationSchema } from '../validators/schemas';
import { storageService } from '../services/storage/storage.service';
import { emailService } from '../services/email/email.service';
import { captchaService } from '../services/captcha/captcha.service';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/**
 * POST /api/jobs/:jobId/apply
 * Submit a job application. CV file is stored in private storage (never publicly accessible).
 * Dispatches notification email to HR.
 */
export const applyForJob = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let uploadedStorageKey: string | undefined;

  try {
    // 1. CAPTCHA Verification (handles token in header or multipart body)
    const headerToken = req.headers['x-captcha-token'] as string | undefined;
    const bodyToken = (req.body?.captchaToken || req.body?.captcha_token) as string | undefined;
    const token = headerToken || bodyToken;
    const provider = captchaService.getProviderName();
    const isProd = process.env.NODE_ENV === 'production';

    if (token || (provider !== 'mock' && isProd)) {
      if (!token) {
        res.status(400).json({ error: { message: 'CAPTCHA token is required', code: 'CAPTCHA_REQUIRED' } });
        return;
      }
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const captchaResult = await captchaService.verifyToken(token, clientIp);
      if (!captchaResult.success) {
        res.status(400).json({ error: { message: captchaResult.error || 'CAPTCHA verification failed', code: 'CAPTCHA_INVALID' } });
        return;
      }
    }

    // 2. Validate Body
    const parseResult = applicationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: {
          message: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        },
      });
      return;
    }

    const { name, email, phone, coverMessage } = parseResult.data;

    // 3. Verify Job Exists and is Open
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const job = await prisma.job.findFirst({
      where: {
        id: req.params.jobId,
        status: 'PUBLISHED',
        OR: [{ closingDate: null }, { closingDate: { gte: today } }],
      },
    });

    if (!job) {
      res.status(404).json({ error: { message: 'Job not found or no longer accepting applications' } });
      return;
    }

    // 4. Private CV Storage Upload (Atomic Transaction Flow)
    let cvUrl: string | undefined;
    let cvFileName: string | undefined;
    let cvFileSize: number | undefined;
    let cvFileType: string | undefined;

    if (req.file) {
      try {
        const uploadResult = await storageService.uploadPrivateFile({
          buffer: req.file.buffer,
          fileName: req.file.originalname,
          mimeType: req.file.mimetype,
          folder: 'cv',
        });

        uploadedStorageKey = uploadResult.storageKey;
        cvUrl = uploadResult.storageKey;
        cvFileName = uploadResult.fileName;
        cvFileSize = uploadResult.fileSize;
        cvFileType = uploadResult.mimeType;
      } catch (storageErr) {
        console.error('[STORAGE ERROR] Failed to upload CV to private storage:', (storageErr as Error).message);
        res.status(500).json({ error: { message: 'Failed to securely store CV file. Application aborted.' } });
        return;
      }
    }

    // 5. Database Persistence
    let application;
    try {
      application = await prisma.application.create({
        data: {
          jobId: req.params.jobId,
          name,
          email,
          phone,
          coverMessage,
          cvUrl,
          cvFileName,
          cvFileSize,
          cvFileType,
          applicationStatus: 'NEW',
        },
      });
    } catch (dbErr) {
      // Rollback: if DB save fails, delete uploaded private file to avoid orphan files
      if (uploadedStorageKey) {
        await storageService.deletePrivateFile(uploadedStorageKey).catch(() => {});
      }
      throw dbErr;
    }

    // 6. Asynchronous Email Dispatch
    emailService.sendApplicationNotification({
      id: application.id,
      name: application.name,
      email: application.email,
      phone: application.phone,
      coverMessage: application.coverMessage,
      hasCv: !!req.file,
      cvFileName: application.cvFileName,
      jobTitle: job.title,
      jobSlug: job.slug,
      createdAt: application.createdAt,
    }).catch((emailErr) => {
      console.error(`[EMAIL DISPATCH ERROR] Job application email failed for ID ${application.id}:`, (emailErr as Error).message);
    });

    res.status(201).json({
      data: {
        message: 'Application submitted successfully',
        id: application.id,
      },
    });
  } catch (err) {
    next(err);
  }
};
