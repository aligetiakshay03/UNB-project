import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

/**
 * GET /api/products
 * List published products, optionally filtered by category slug or featured flag.
 */
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, featured } = req.query as {
      category?: string;
      featured?: string;
    };

    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (category) {
      where.category = { slug: category };
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        imageUrl: true,
        isFeatured: true,
        displayOrder: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    res.json({ data: products });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/:slug
 * Single product with variants.
 */
export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!product) {
      res.status(404).json({ error: { message: 'Product not found' } });
      return;
    }

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};
