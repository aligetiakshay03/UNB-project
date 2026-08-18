import { Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { prisma } from '../../lib/prisma';
import { productSchema, contentStatusSchema, paginationSchema } from '../../validators/schemas';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

function generateSlug(name: string): string {
  return slugify(name, { lower: true, strict: true });
}

/** GET /api/admin/products — all statuses */
export const adminListProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { status, category } = req.query as { status?: string; category?: string };

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (category) where.category = { slug: category };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: { category: true },
      }),
    ]);

    res.json({ data: products, meta: { total, page, limit } });
  } catch (err) {
    next(err);
  }
};

/** POST /api/admin/products */
export const adminCreateProduct = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = productSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { message: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
      });
      return;
    }

    const data = parseResult.data;
    const slug = generateSlug(data.name);

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        categoryId: data.categoryId,
        shortDescription: data.shortDescription,
        description: data.description,
        imageUrl,
        isFeatured: data.isFeatured ?? false,
        status: data.status ?? 'DRAFT',
        displayOrder: data.displayOrder ?? 0,
      },
      include: { category: true, variants: true },
    });

    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/admin/products/:id */
export const adminUpdateProduct = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Product not found' } });
      return;
    }

    const parseResult = productSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { message: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
      });
      return;
    }

    const data = parseResult.data;
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(data.name && { name: data.name, slug: generateSlug(data.name) }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.description !== undefined && { description: data.description }),
        ...(imageUrl && { imageUrl }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.status && { status: data.status }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      },
      include: { category: true, variants: true },
    });

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/products/:id — ADMIN only */
export const adminDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Product not found' } });
      return;
    }

    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ data: { message: 'Product deleted' } });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/products/:id/status */
export const adminPatchProductStatus = async (
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

    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Product not found' } });
      return;
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { status: parseResult.data.status },
    });

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/categories */
export const adminGetCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
};

