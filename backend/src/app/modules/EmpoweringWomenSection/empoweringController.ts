// controllers/empowering.controller.ts
import { Request, Response } from 'express';

import { Empowering } from './empoweringModel';
import { updateEmpoweringSchema } from './empoweringValidation';
import { z } from 'zod';

export const getEmpowering = async (req: Request, res: Response) => {
  try {
    const empowering = await Empowering.findOne();

    if (!empowering) {
      return res.status(200).json({
        success: true,
        data: {
          title: 'test',
          subtitle: 'test',
          paragraphs: [],
          footerTitle: 'test',
          disclaimer: 'test',
          isActive: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: empowering,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching empowering section',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateEmpowering = async (req: Request, res: Response) => {
  try {
    // Validate the incoming request with Zod
    const validated = updateEmpoweringSchema.parse({
      body: req.body,
    });

    const validatedData = validated.body;

    // Update or create document (upsert)
    const empowering = await Empowering.findOneAndUpdate(
      {}, // Empty filter to match the single document
      { $set: validatedData },
      {
        new: true,
        runValidators: true,
        upsert: true, // Create if doesn't exist
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: 'Empowering content updated successfully',
      data: empowering,
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
      message: 'Error updating Empowering content',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
