// controllers/celebrate.controller.ts
import { NextFunction, Request, Response } from 'express';

import { Celebrate } from './offer-bannerModel';
import { celebrateValidation, slideValidation } from './offer-bannerValidation';
import { appError } from '../../errors/appError';
import { cloudinary } from '../../config/cloudinary';

export const getCelebrate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let document = await Celebrate.findOne();

    // If no document exists, create one with default values
    if (!document) {
      document = new Celebrate({
        heading: 'Travel. Explore. Celebrate.',
        slides: [],
        status: 'active',
      });
      await document.save();

      res.json({
        success: true,
        statusCode: 200,
        message: 'Default celebrate section created and retrieved',
        data: document,
      });
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Celebrate section retrieved successfully',
      data: document,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateMainFields = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { heading, status } = req.body;

    // Find existing document
    let document = await Celebrate.findOne();

    // If no document exists, create one
    if (!document) {
      const validated = celebrateValidation.parse({
        heading: heading || 'Travel. Explore. Celebrate.',
        status: status || 'active',
      });

      document = new Celebrate({
        heading: validated.heading,
        slides: [],
        status: validated.status,
      });
      await document.save();

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Celebrate section created successfully',
        data: document,
      });
      return;
    }

    // Validate update data
    const updateData: any = {};
    if (heading !== undefined) updateData.heading = heading;
    if (status !== undefined) updateData.status = status;

    const validated = celebrateValidation.parse(updateData);

    // Update main fields only
    if (validated.heading !== undefined) document.heading = validated.heading;
    if (validated.status !== undefined) document.status = validated.status;

    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Main fields updated successfully',
      data: document,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const addSlide = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { link, order, status } = req.body;

    if (!req.file) {
      next(new appError('Image is required', 400));
      return;
    }

    if (!order) {
      next(new appError('Order is required', 400));
      return;
    }

    // Find existing document
    let document = await Celebrate.findOne();

    if (!document) {
      next(
        new appError(
          'Celebrate section not found. Please create main fields first.',
          404,
        ),
      );
      return;
    }

    // Check max slides limit
    if (document.slides.length >= 10) {
      // Delete uploaded image from cloudinary
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`celebrate-slides/${publicId}`);
      }
      next(new appError('Maximum 10 slides allowed', 400));
      return;
    }

    const image = req.file.path;

    // Validate slide data
    const validated = slideValidation.parse({
      image,
      link: link || '/tour-details',
      order: parseInt(order),
      status: status || 'active',
    });

    // Add new slide
    document.slides.push(validated);
    await document.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Slide added successfully',
      data: document,
    });
    return;
  } catch (error) {
    // Clean up uploaded image on error
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`celebrate-slides/${publicId}`);
      }
    }
    next(error);
  }
};

export const updateSlide = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slideId } = req.params;
    const { link, order, status } = req.body;

    if (!order) {
      next(new appError('Order is required', 400));
      return;
    }

    // Find existing document
    let document = await Celebrate.findOne();

    if (!document) {
      next(new appError('Celebrate section not found', 404));
      return;
    }

    // Find slide by _id
    const slide = document.slides.id(slideId);

    if (!slide) {
      next(new appError('Slide not found', 404));
      return;
    }

    // If new image is uploaded, delete old one and update
    if (req.file) {
      const oldImagePublicId = slide.image.split('/').pop()?.split('.')[0];
      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(
          `celebrate-slides/${oldImagePublicId}`,
        );
      }
      slide.image = req.file.path;
    }

    // Update slide fields
    slide.link = link || slide.link;
    slide.order = parseInt(order);
    if (status !== undefined) slide.status = status;

    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Slide updated successfully',
      data: document,
    });
    return;
  } catch (error) {
    // Clean up uploaded image on error
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`celebrate-slides/${publicId}`);
      }
    }
    next(error);
  }
};

export const deleteSlide = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slideId } = req.params;

    // Find existing document
    let document = await Celebrate.findOne();

    if (!document) {
      next(new appError('Celebrate section not found', 404));
      return;
    }

    // Find slide by _id
    const slide = document.slides.id(slideId);

    if (!slide) {
      next(new appError('Slide not found', 404));
      return;
    }

    // Delete image from cloudinary
    const imagePublicId = slide.image.split('/').pop()?.split('.')[0];
    if (imagePublicId) {
      await cloudinary.uploader.destroy(`celebrate-slides/${imagePublicId}`);
    }

    // Remove slide
    slide.deleteOne();
    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Slide deleted successfully',
      data: document,
    });
    return;
  } catch (error) {
    next(error);
  }
};
