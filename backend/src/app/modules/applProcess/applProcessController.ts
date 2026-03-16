import { NextFunction, Request, Response } from 'express';

import {
  createApplicationSchema,
  updateApplicationSchema,
} from './applProcessValidation';
import { ApplicationProcess } from './applProcessModel';

// GET all applications
export const getAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const applications = await ApplicationProcess.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Applications retrieved successfully',
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE new application
export const createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Image is required',
      });
    }

    const image = imageFile.path;

    const validatedData = createApplicationSchema.parse({
      title: req.body.title,
      description: req.body.description,
      image: image,
    });

    // Create new application
    const newApplication = new ApplicationProcess({
      title: validatedData.title,
      description: validatedData.description,
      image: validatedData.image,
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Application created successfully',
      data: newApplication,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE application
export const updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const imageFile = req.file;

    const application = await ApplicationProcess.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Application not found',
      });
    }

    // Prepare update data
    const updateData: any = {};

    if (req.body.title) {
      updateData.title = req.body.title;
    }

    if (req.body.description) {
      updateData.description = req.body.description;
    }

    if (imageFile) {
      updateData.image = imageFile.path;
    }

    // Validate with Zod
    const validatedData = updateApplicationSchema.parse(updateData);

    // Update application
    Object.assign(application, validatedData);
    await application.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE application
export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const application = await ApplicationProcess.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Application deleted successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
