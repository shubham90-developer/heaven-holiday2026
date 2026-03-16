// controllers/TravelDealBanner.controller.ts
import { Request, Response } from 'express';

import { TravelDealBanner } from './travelDealModel';
import { travelDealBannerValidation } from './travelDealValidation';
import { z } from 'zod';

// ================= GET HERO BANNER =================
export const getTravelDealBanner = async (req: Request, res: Response) => {
  try {
    let document = await TravelDealBanner.findOne();

    // If no document exists, create one with default values
    if (!document) {
      document = new TravelDealBanner({
        image: '/assets/img/default-banner.jpg',
        status: 'inactive',
      });
      await document.save();

      return res.json({
        success: true,
        statusCode: 200,
        message: 'Default hero banner created and retrieved',
        data: document,
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Hero banner retrieved successfully',
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hero banner',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= UPDATE HERO BANNER (ADMIN ONLY) =================
export const updateTravelDealBanner = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const newImageFile = req.file;

    // Find existing document
    let document = await TravelDealBanner.findOne();

    // If no document exists, create one with default values
    if (!document) {
      const imageUrl = newImageFile?.path || '/assets/img/default-banner.jpg';

      const validatedData = travelDealBannerValidation.parse({
        image: imageUrl,
        status: status || 'inactive',
      });

      document = new TravelDealBanner(validatedData);
      await document.save();

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Hero banner created successfully',
        data: document,
      });
    }

    // Update existing document
    const imageUrl = newImageFile?.path || document.image;

    const validatedData = travelDealBannerValidation.parse({
      image: imageUrl,
      status: status !== undefined ? status : document.status,
    });

    document.image = validatedData.image;
    document.status = validatedData.status;

    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Hero banner updated successfully',
      data: document,
    });
  } catch (error) {
    console.error('Update hero banner error:', error);

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
      message: 'Error updating hero banner',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
