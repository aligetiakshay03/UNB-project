import { Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { prisma } from '../../lib/prisma';
import { jobSchema, contentStatusSchema, paginationSchema } from '../../validators/schemas';

function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

/** GET /api/admin/jobs */
export const adminListJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { status } = req.query as { status?: string };

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [total, jobs] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({ data: jobs, meta: { total, page, limit } });
  } catch (err) {
    next(err);
  }
};

/** POST /api/admin/jobs */
export const adminCreateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = jobSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { message: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
      });
      return;
    }

    const data = parseResult.data;
    const slug = generateSlug(data.title);

    const job = await prisma.job.create({
      data: {
        title: data.title,
        slug,
        location: data.location,
        employmentType: data.employmentType,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        closingDate: data.closingDate ? new Date(data.closingDate) : null,
        status: data.status ?? 'DRAFT',
      },
    });

    res.status(201).json({ data: job });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/admin/jobs/:id */
export const adminUpdateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Job not found' } });
      return;
    }

    const parseResult = jobSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { message: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
      });
      return;
    }

    const data = parseResult.data;

    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: {
        ...(data.title && { title: data.title, slug: generateSlug(data.title) }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.employmentType !== undefined && { employmentType: data.employmentType }),
        ...(data.description && { description: data.description }),
        ...(data.requirements !== undefined && { requirements: data.requirements }),
        ...(data.responsibilities !== undefined && { responsibilities: data.responsibilities }),
        ...(data.closingDate !== undefined && {
          closingDate: data.closingDate ? new Date(data.closingDate) : null,
        }),
        ...(data.status && { status: data.status }),
      },
    });

    res.json({ data: job });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/jobs/:id */
export const adminDeleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Job not found' } });
      return;
    }

    await prisma.job.delete({ where: { id: req.params.id } });
    res.json({ data: { message: 'Job deleted' } });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/jobs/:id/status */
export const adminPatchJobStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = contentStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { message: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
      });
      return;
    }

    const existing = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Job not found' } });
      return;
    }

    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: { status: parseResult.data.status },
    });

    res.json({ data: job });
  } catch (err) {
    next(err);
  }
};
