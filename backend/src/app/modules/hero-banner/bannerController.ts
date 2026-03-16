import { NextFunction, Request, Response } from 'express';
import { HeroBanner } from './bannerModel';
import { heroBannerValidation } from './bannerValidation';
import { cloudinary } from '../../config/cloudinary';
import { appError } from '../../errors/appError';
import { success } from 'zod';
import { ZodError } from 'zod';

export const getHeroBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let heroBanners = await HeroBanner.find();

    if (!heroBanners) {
      return res.json({
        success: false,
        statusCode: 404,
        message: 'Hero Banner not found',
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Hero banner retrieved successfully',
      data: heroBanners,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateHeroBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bannerId, link, status } = req.body;
    const imageUrl = req.file?.path;

    // Include status in validation
    const validatedData = heroBannerValidation.partial().parse({
      image: imageUrl,
      link,
      status,
    });

    // Build update fields
    const updateFields = {
      'banners.$.link': validatedData.link,
      'banners.$.status': validatedData.status,
      ...(validatedData.image && { 'banners.$.image': validatedData.image }),
    };

    const updatedHeroBanner = await HeroBanner.findOneAndUpdate(
      { 'banners._id': bannerId },
      { $set: updateFields },
      { new: true },
    );

    if (!updatedHeroBanner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: updatedHeroBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const createHeroBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: 'Image is required' });
    }

    const { link, status } = req.body;

    const validatedData = heroBannerValidation.parse({
      image: imageUrl,
      link,
      status: status || 'inactive',
    });

    let heroBanner = await HeroBanner.findOne();

    if (!heroBanner) {
      heroBanner = new HeroBanner({ banners: [validatedData] });
    } else {
      heroBanner.banners.push(validatedData);
    }

    await heroBanner.save();

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: heroBanner,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteHeroBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;

    const result = await HeroBanner.findOneAndUpdate(
      { 'banners._id': id },
      { $pull: { banners: { _id: id } } },
      { new: true },
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
