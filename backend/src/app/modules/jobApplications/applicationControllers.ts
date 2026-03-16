// jobApplication.controller.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { JobApplication } from './applicationsModel';
import {
  createJobApplicationSchema,
  updateStatusSchema,
} from './applicationValidation';

import { appError } from '../../errors/appError';

// Create Job Application
export const createJobApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const resumeUrl = req.file?.path;

    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required',
      });
    }

    const applicationData = {
      ...req.body,
      resume: resumeUrl,
    };

    // Validate data
    const validatedData = createJobApplicationSchema.parse(applicationData);

    // Create application
    const application = await JobApplication.create(validatedData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    next(error);
  }
};

// Get All Job Applications
export const getAllJobApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;

    const filter: any = {};

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Search by name or email
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const applications = await JobApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await JobApplication.countDocuments(filter);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Applications retrieved successfully',
      data: applications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validatedData = updateStatusSchema.parse({ status });

    const application = await JobApplication.findById(id);

    if (!application) {
      return next(new appError('Application not found', 404));
    }

    application.status = validatedData.status;
    await application.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Application status updated to ${validatedData.status} successfully`,
      data: application,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    next(error);
  }
};

// Delete Job Application
export const deleteJobApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findById(id);

    if (!application) {
      return next(new appError('Application not found', 404));
    }

    await JobApplication.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Application deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
