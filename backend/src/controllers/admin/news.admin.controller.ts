import { Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { prisma } from '../../lib/prisma';
import { newsSchema, contentStatusSchema, paginationSchema } from '../../validators/schemas';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

/** GET /api/admin/news */
export const adminListNews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { status } = req.query as { status?: string };

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [total, articles] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({ data: articles, meta: { total, page, limit } });
  } catch (err) {
    next(err);
  }
};

/** POST /api/admin/news */
export const adminCreateNews = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = newsSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { message: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
      });
      return;
    }

    const data = parseResult.data;
    const slug = generateSlug(data.title);

    const featuredImage = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const publishedAt =
      data.status === 'PUBLISHED' && !data.publishedAt
        ? new Date()
        : data.publishedAt
        ? new Date(data.publishedAt)
        : undefined;

    const article = await prisma.news.create({
      data: {
        title: data.title,
        slug,
        category: data.category,
        summary: data.summary,
        content: data.content,
        featuredImage,
        status: data.status ?? 'DRAFT',
        publishedAt: publishedAt ?? null,
      },
    });

    res.status(201).json({ data: article });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/admin/news/:id */
export const adminUpdateNews = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Article not found' } });
      return;
    }

    const parseResult = newsSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { message: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
      });
      return;
    }

    const data = parseResult.data;
    const featuredImage = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    // Auto-set publishedAt when promoting to PUBLISHED for the first time
    const publishedAt =
      data.status === 'PUBLISHED' && !existing.publishedAt
        ? new Date()
        : undefined;

    const article = await prisma.news.update({
      where: { id: req.params.id },
      data: {
        ...(data.title && { title: data.title, slug: generateSlug(data.title) }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.summary !== undefined && { summary: data.summary }),
        ...(data.content && { content: data.content }),
        ...(featuredImage && { featuredImage }),
        ...(data.status && { status: data.status }),
        ...(publishedAt && { publishedAt }),
      },
    });

    res.json({ data: article });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/news/:id */
export const adminDeleteNews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Article not found' } });
      return;
    }

    await prisma.news.delete({ where: { id: req.params.id } });
    res.json({ data: { message: 'Article deleted' } });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/news/:id/status */
export const adminPatchNewsStatus = async (
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

    const existing = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Article not found' } });
      return;
    }

    const publishedAt =
      parseResult.data.status === 'PUBLISHED' && !existing.publishedAt
        ? new Date()
        : undefined;

    const article = await prisma.news.update({
      where: { id: req.params.id },
      data: {
        status: parseResult.data.status,
        ...(publishedAt && { publishedAt }),
      },
    });

    res.json({ data: article });
  } catch (err) {
    next(err);
  }
};
