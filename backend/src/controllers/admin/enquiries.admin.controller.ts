import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { paginationSchema } from '../../validators/schemas';

/** GET /api/admin/enquiries */
export const adminListEnquiries = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { enquiryType } = req.query as { enquiryType?: string };

    const where: Record<string, unknown> = {};
    if (enquiryType) where.enquiryType = enquiryType;

    const [total, enquiries] = await Promise.all([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({ data: enquiries, meta: { total, page, limit } });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/enquiries/:id */
export const adminGetEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: req.params.id },
    });

    if (!enquiry) {
      res.status(404).json({ error: { message: 'Enquiry not found' } });
      return;
    }

    res.json({ data: enquiry });
  } catch (err) {
    next(err);
  }
};
