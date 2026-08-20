import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { applicationStatusSchema, paginationSchema } from '../../validators/schemas';
import { storageService } from '../../services/storage/storage.service';

/** GET /api/admin/applications */
export const adminListApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { jobId, status } = req.query as { jobId?: string; status?: string };

    const where: Record<string, unknown> = {};
    if (jobId) where.jobId = jobId;
    if (status) where.applicationStatus = status;

    const [total, applications] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          applicationStatus: true,
          createdAt: true,
          job: { select: { id: true, title: true, slug: true } },
        },
      }),
    ]);

    res.json({ data: applications, meta: { total, page, limit } });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/applications/:id */
export const adminGetApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { job: true },
    });

    if (!application) {
      res.status(404).json({ error: { message: 'Application not found' } });
      return;
    }

    res.json({ data: application });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/applications/:id/cv
 * Securely streams private candidate CV or provides signed URL.
 * Requires authenticated admin/editor credentials.
 */
export const adminGetApplicationCV = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      select: { cvUrl: true, cvFileName: true, cvFileType: true },
    });

    if (!application) {
      res.status(404).json({ error: { message: 'Application not found' } });
      return;
    }

    if (!application.cvUrl) {
      res.status(404).json({ error: { message: 'No CV attached to this application' } });
      return;
    }

    const storageKey = application.cvUrl;
    const download = req.query.download === 'true';

    // 1. Try streaming from local-private storage
    const fileResult = await storageService.getPrivateFileStream(storageKey);
    if (fileResult) {
      const disposition = download ? 'attachment' : 'inline';
      res.setHeader('Content-Type', fileResult.mimeType || 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `${disposition}; filename="${application.cvFileName || fileResult.fileName}"`
      );
      if (fileResult.fileSize) {
        res.setHeader('Content-Length', fileResult.fileSize);
      }
      fileResult.stream.pipe(res);
      return;
    }

    // 2. Try generating signed URL for cloud storage (S3 / Supabase)
    const signedUrl = await storageService.getSignedUrl(storageKey, 900);
    if (signedUrl) {
      if (download) {
        res.redirect(signedUrl);
        return;
      }
      res.json({
        data: {
          storageKey,
          fileName: application.cvFileName,
          mimeType: application.cvFileType,
          signedUrl,
          expiresIn: 900,
        },
      });
      return;
    }

    res.status(404).json({ error: { message: 'CV file not found in storage' } });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/applications/:id/status */
export const adminPatchApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = applicationStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { message: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
      });
      return;
    }

    const existing = await prisma.application.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Application not found' } });
      return;
    }

    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: { applicationStatus: parseResult.data.applicationStatus },
    });

    res.json({ data: application });
  } catch (err) {
    next(err);
  }
};
