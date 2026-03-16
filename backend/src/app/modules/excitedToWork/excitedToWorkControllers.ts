// controllers/excitedtowork.controller.ts
import { Request, Response } from 'express';

import { ExcitedToWork } from './excitedToWorkModel';
import { updateExcitedToWorkSchema } from './excitedToWorkValidation';
import { z } from 'zod';

export const getExcitedToWork = async (req: Request, res: Response) => {
  try {
    const excitedToWork = await ExcitedToWork.findOne();

    if (!excitedToWork) {
      return res.status(200).json({
        success: true,
        data: {
          title: 'test',
          subtitle: 'test',
          email: 'test@example.com',
          isActive: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: excitedToWork,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching excited to work section',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateExcitedToWork = async (req: Request, res: Response) => {
  try {
    const validated = updateExcitedToWorkSchema.parse({
      body: req.body,
    });

    const validatedData = validated.body;

    const excitedToWork = await ExcitedToWork.findOneAndUpdate(
      {},
      { $set: validatedData },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: 'Excited to work content updated successfully',
      data: excitedToWork,
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

    res.status(500).json({
      success: false,
      message: 'Error updating excited to work content',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
