import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Zod Validation Schemas
export const stepValidationSchema = z.object({
  stepNo: z.coerce.number().int().min(1, 'Step number must be at least 1'),
  stepTitle: z.string().min(1, 'Step title is required').trim(),
  stepDescription: z.string().min(1, 'Step description is required').trim(),
  image: z.string().trim().optional(),
});

export const onlineBookingValidationSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .trim()
    .default('Online Booking'),
  description: z.string().min(1, 'Description is required').trim(),
  steps: z
    .array(stepValidationSchema)
    .optional()
    .default([])
    .refine(
      (steps) => {
        if (steps.length === 0) return true;
        const stepNumbers = steps.map((s) => s.stepNo);
        return new Set(stepNumbers).size === stepNumbers.length;
      },
      { message: 'Step numbers must be unique' },
    ),
});

// Validation middleware for updating main fields
export const validateUpdateBooking = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updateValidation = z.object({
      title: z.string().min(1, 'Title is required').optional(),
      description: z.string().min(1, 'Description is required').optional(),
    });

    updateValidation.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.message,
      });
    }
    next(error);
  }
};

// Validation middleware for creating step
export const validateCreateStep = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = stepValidationSchema.parse(req.body);

    // Store validated data back to req.body
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.message,
      });
    }
    next(error);
  }
};

// Validation middleware for updating step
export const validateUpdateStep = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updateStepValidation = z.object({
      stepNo: z.coerce.number().int().min(1).optional(),
      stepTitle: z.string().min(1).trim().optional(),
      stepDescription: z.string().min(1).trim().optional(),
      image: z.string().trim().optional(),
    });

    const validatedData = updateStepValidation.parse(req.body);

    // Store validated data back to req.body
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.message,
      });
    }
    next(error);
  }
};
