import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { contactSchema } from '../validators/schemas';

/**
 * POST /api/contact
 * Submit a contact enquiry.
 */
export const submitEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = contactSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: {
          message: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        },
      });
      return;
    }

    const { name, email, phone, enquiryType, message } = parseResult.data;

    const enquiry = await prisma.enquiry.create({
      data: { name, email, phone, enquiryType, message },
    });

    // [IMPLEMENTATION DECISION] Optionally send notification email here

    res.status(201).json({
      data: {
        message: 'Enquiry submitted successfully',
        id: enquiry.id,
      },
    });
  } catch (err) {
    next(err);
  }
};
