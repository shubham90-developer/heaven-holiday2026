// feedback.controller.ts
import { NextFunction, Request, Response } from 'express';
import Feedback from './feedbackModel';
import { feedbackValidationSchema } from './feedbackValidation';
import { appError } from '../../errors/appError';

export const createFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, mobile, email, experience } = req.body;

    // Validate the input
    const validatedData = feedbackValidationSchema.parse({
      name,
      mobile,
      email,
      experience,
    });

    // Create a new feedback
    const feedback = await Feedback.create(validatedData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get query parameters for pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalFeedbacks = await Feedback.countDocuments();

    // Fetch feedbacks with pagination, sorted by latest first
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'No feedback found',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Feedbacks retrieved successfully',
      data: feedbacks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalFeedbacks / limit),
        totalFeedbacks,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};
