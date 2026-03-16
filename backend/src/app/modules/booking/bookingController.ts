import { NextFunction, Request, Response } from 'express';

import OnlineBooking from './bookingModel';
import {
  onlineBookingValidationSchema,
  stepValidationSchema,
} from './bookingValidation';

import { appError } from '../../errors/appError';
import { cloudinary } from '../../config/cloudinary';
import { z } from 'zod';

export const getOnlineBooking = async (req: Request, res: Response) => {
  try {
    let onlineBooking = await OnlineBooking.findOne();

    if (!onlineBooking) {
      onlineBooking = await OnlineBooking.create({
        title: 'Online Booking',
        description: 'description',
        steps: [],
      });
    }

    res.status(200).json({
      success: true,
      data: onlineBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching online booking content',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update title and description
export const updateOnlineBooking = async (req: Request, res: Response) => {
  try {
    const updateValidation = z.object({
      title: z.string().min(1, 'Title is required').optional(),
      description: z.string().min(1, 'Description is required').optional(),
    });

    const validatedData = updateValidation.parse(req.body);

    let onlineBooking = await OnlineBooking.findOne();

    if (!onlineBooking) {
      onlineBooking = await OnlineBooking.create({
        title: validatedData.title || 'Online Booking',
        description: validatedData.description || 'Test description',
        steps: [],
      });

      return res.status(201).json({
        success: true,
        message: 'Online booking content created successfully',
        data: onlineBooking,
      });
    }

    // Update only provided fields
    if (validatedData.title) onlineBooking.title = validatedData.title;
    if (validatedData.description)
      onlineBooking.description = validatedData.description;

    await onlineBooking.save();

    res.status(200).json({
      success: true,
      message: 'Online booking content updated successfully',
      data: onlineBooking,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating online booking content',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const createStep = async (req: Request, res: Response) => {
  try {
    // Parse stepNo from string to number
    const parsedData = {
      ...req.body,
      stepNo: parseInt(req.body.stepNo),
    };

    const validatedData = stepValidationSchema.parse(parsedData);

    // Upload image to Cloudinary if provided
    if (req.file) {
      validatedData.image = (req.file as any).path;
    }

    let onlineBooking = await OnlineBooking.findOne();

    if (!onlineBooking) {
      onlineBooking = await OnlineBooking.create({
        title: 'Online Booking',
        description: 'Test description',
        steps: [validatedData],
      });

      return res.status(201).json({
        success: true,
        message: 'Step created successfully',
        data: validatedData,
      });
    }

    // Check if step number already exists
    const stepExists = onlineBooking.steps.some(
      (step) => step.stepNo === validatedData.stepNo,
    );

    if (stepExists) {
      return res.status(400).json({
        success: false,
        message: `Step number ${validatedData.stepNo} already exists`,
      });
    }

    onlineBooking.steps.push(validatedData);
    await onlineBooking.save();

    res.status(201).json({
      success: true,
      message: 'Step created successfully',
      data: validatedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating step',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update a step by stepNo
export const updateStep = async (req: Request, res: Response) => {
  try {
    const stepNo = parseInt(req.params.stepNo);

    if (isNaN(stepNo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step number',
      });
    }

    const validatedData = req.body;

    // Upload new image to Cloudinary if provided
    if (req.file) {
      validatedData.image = (req.file as any).path;
    }

    const onlineBooking = await OnlineBooking.findOne();

    if (!onlineBooking) {
      return res.status(404).json({
        success: false,
        message: 'Online booking document not found',
      });
    }

    const stepIndex = onlineBooking.steps.findIndex(
      (step) => step.stepNo === stepNo,
    );

    if (stepIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Step ${stepNo} not found`,
      });
    }

    const oldStep = onlineBooking.steps[stepIndex];

    // Delete old image from Cloudinary if new image is uploaded
    if (oldStep.image && req.file) {
      try {
        const urlParts = oldStep.image.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        const folderPath = urlParts.slice(-2, -1)[0];

        await cloudinary.uploader.destroy(`${folderPath}/${publicId}`);
      } catch (cloudinaryError) {
        console.error('Error deleting old image:', cloudinaryError);
      }
    }

    // Check if new stepNo conflicts with existing steps
    if (validatedData.stepNo && validatedData.stepNo !== stepNo) {
      const conflictExists = onlineBooking.steps.some(
        (step, idx) =>
          step.stepNo === validatedData.stepNo && idx !== stepIndex,
      );

      if (conflictExists) {
        return res.status(400).json({
          success: false,
          message: `Step number ${validatedData.stepNo} already exists`,
        });
      }
    }

    // Update step fields
    onlineBooking.steps[stepIndex] = {
      stepNo: validatedData.stepNo ?? oldStep.stepNo,
      stepTitle: validatedData.stepTitle ?? oldStep.stepTitle,
      stepDescription: validatedData.stepDescription ?? oldStep.stepDescription,
      image: validatedData.image ?? oldStep.image,
    };

    await onlineBooking.save();

    res.status(200).json({
      success: true,
      message: 'Step updated successfully',
      data: onlineBooking.steps[stepIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating step',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete a step by stepNo
export const deleteStep = async (req: Request, res: Response) => {
  try {
    const stepNo = parseInt(req.params.stepNo);

    if (isNaN(stepNo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step number',
      });
    }

    const onlineBooking = await OnlineBooking.findOne();

    if (!onlineBooking) {
      return res.status(404).json({
        success: false,
        message: 'Online booking document not found',
      });
    }

    const stepIndex = onlineBooking.steps.findIndex(
      (step) => step.stepNo === stepNo,
    );

    if (stepIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Step ${stepNo} not found`,
      });
    }

    const deletedStep = onlineBooking.steps[stepIndex];

    // Delete image from Cloudinary if exists
    if (deletedStep.image) {
      try {
        const urlParts = deletedStep.image.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        const folderPath = urlParts.slice(-2, -1)[0];

        await cloudinary.uploader.destroy(`${folderPath}/${publicId}`);
      } catch (cloudinaryError) {
        console.error('Error deleting image:', cloudinaryError);
      }
    }

    // Remove step from array
    onlineBooking.steps.splice(stepIndex, 1);
    await onlineBooking.save();

    res.status(200).json({
      success: true,
      message: 'Step deleted successfully',
      data: deletedStep,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting step',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
