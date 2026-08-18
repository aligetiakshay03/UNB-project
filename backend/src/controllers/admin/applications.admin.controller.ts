import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { applicationStatusSchema, paginationSchema } from '../../validators/schemas';

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
 * [IMPLEMENTATION DECISION REQUIRED] In production, fetch CV from cloud storage
 * and stream it to the client. This placeholder returns the stored URL.
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

    // [CLIENT DECISION REQUIRED] Replace with actual signed-URL generation / proxied stream
    res.json({
      data: {
        cvUrl: application.cvUrl,
        cvFileName: application.cvFileName,
        cvFileType: application.cvFileType,
        note: 'Direct signed-URL generation requires cloud storage integration',
      },
    });
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
