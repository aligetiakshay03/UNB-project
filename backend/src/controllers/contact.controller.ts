import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { contactSchema } from '../validators/schemas';
import { emailService } from '../services/email/email.service';

/**
 * POST /api/contact
 * Submit a contact enquiry, persist to database, and trigger email notification.
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

    // 1. Persist enquiry to PostgreSQL
    const enquiry = await prisma.enquiry.create({
      data: { name, email, phone, enquiryType, message },
    });

    // 2. Dispatch Email Notification (Asynchronous / Non-blocking)
    emailService.sendContactNotification({
      id: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      enquiryType: enquiry.enquiryType,
      message: enquiry.message,
      createdAt: enquiry.createdAt,
    }).catch((emailErr) => {
      console.error(`[EMAIL DISPATCH ERROR] Contact notification failed for enquiry ${enquiry.id}:`, (emailErr as Error).message);
    });

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
