import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { applicationSchema } from '../validators/schemas';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/**
 * POST /api/jobs/:jobId/apply
 * Submit a job application. CV file is optional; file stored as placeholder URL.
 * In production, the Buffer from multer memory storage should be uploaded
 * to the chosen cloud storage provider (S3, GCS, Azure Blob, etc.) before
 * saving the resulting URL to the database.
 */
export const applyForJob = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate body
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

    // Verify job exists and is open
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

    // Handle CV file
    let cvUrl: string | undefined;
    let cvFileName: string | undefined;
    let cvFileSize: number | undefined;
    let cvFileType: string | undefined;

    if (req.file) {
      // [CLIENT DECISION REQUIRED] Replace this placeholder with actual cloud storage upload
      // e.g., AWS S3, GCS, Azure Blob. The file buffer is at req.file.buffer
      cvUrl = `[FILE_STORAGE_PLACEHOLDER]/${Date.now()}_${req.file.originalname}`;
      cvFileName = req.file.originalname;
      cvFileSize = req.file.size;
      cvFileType = req.file.mimetype;
    }

    const application = await prisma.application.create({
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

    // [IMPLEMENTATION DECISION] Optionally send notification email here

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
