import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { paginationSchema } from '../validators/schemas';

/**
 * GET /api/news
 * List published news articles with pagination.
 */
export const getNews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category } = req.query as { category?: string };
    const { page, limit } = paginationSchema.parse(req.query);

    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (category) {
      where.category = category;
    }

    const [total, articles] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          summary: true,
          content: true,
          featuredImage: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      data: articles,
      meta: { total, page, limit },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/news/:slug
 * Single news article.
 */
export const getNewsBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const article = await prisma.news.findUnique({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
    });

    if (!article) {
      res.status(404).json({ error: { message: 'Article not found' } });
      return;
    }

    res.json({ data: article });
  } catch (err) {
    next(err);
  }
};
