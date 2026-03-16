// faq.controller.ts
import { NextFunction, Request, Response } from 'express';

import { FAQ } from './faqModel';
import { createFAQSchema, updateFAQSchema } from './faqValidation';

import { appError } from '../../errors/appError';

// Create FAQ
export const createFAQ = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { question, answer, status } = req.body;

    // Validate the input
    const validatedData = createFAQSchema.parse({
      question,
      answer,
      status,
    });

    // Create a new FAQ
    const faq = await FAQ.create(validatedData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

// Get all FAQs
export const getAllFAQs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        faqs.length > 0 ? 'FAQs retrieved successfully' : 'No FAQs found',
      data: faqs, // Returns empty array [] if no FAQs found
    });
  } catch (error) {
    next(error);
  }
};

// Update FAQ
export const updateFAQ = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { question, answer, status } = req.body;

    // Find the FAQ to update
    const faq = await FAQ.findById(id);

    if (!faq) {
      return next(new appError('FAQ not found', 404));
    }

    // Prepare update data
    const updateData: any = {};

    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (status !== undefined) updateData.status = status;

    // Check if there are any updates
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'No changes to update',
        data: faq,
      });
    }

    // Validate the update data
    const validatedData = updateFAQSchema.parse(updateData);

    // Update the FAQ
    const updatedFAQ = await FAQ.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'FAQ updated successfully',
      data: updatedFAQ,
    });
  } catch (error) {
    next(error);
  }
};

// Delete FAQ
export const deleteFAQ = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Find and delete the FAQ
    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return next(new appError('FAQ not found', 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'FAQ deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
