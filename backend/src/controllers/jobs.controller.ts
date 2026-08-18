import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { paginationSchema } from '../validators/schemas';

/**
 * GET /api/jobs
 * List published, non-expired job listings.
 */
export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.query as { type?: string };
    const { page, limit } = paginationSchema.parse(req.query);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
      OR: [{ closingDate: null }, { closingDate: { gte: today } }],
    };

    if (type) {
      where.employmentType = type;
    }

    const [total, jobs] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        orderBy: [{ closingDate: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          location: true,
          employmentType: true,
          closingDate: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      data: jobs,
      meta: { total, page, limit },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/jobs/:slug
 * Single job detail.
 */
export const getJobBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const job = await prisma.job.findFirst({
      where: {
        slug: req.params.slug,
        status: 'PUBLISHED',
        OR: [{ closingDate: null }, { closingDate: { gte: today } }],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        location: true,
        employmentType: true,
        description: true,
        requirements: true,
        responsibilities: true,
        closingDate: true,
        createdAt: true,
      },
    });

    if (!job) {
      res.status(404).json({ error: { message: 'Job not found' } });
      return;
    }

    res.json({ data: job });
  } catch (err) {
    next(err);
  }
};
