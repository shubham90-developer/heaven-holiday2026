import { aboutUsUpdateValidation } from './aboutus.validation';
import { NextFunction, Request, Response } from 'express';
import { AboutUs } from './aboutus.model';
import { appError } from '../../errors/appError';
import { cloudinary } from '../../config/cloudinary';
import { z } from 'zod';

export const getAboutUs = async (req: Request, res: Response) => {
  try {
    const aboutUs = await AboutUs.findOne();

    if (!aboutUs) {
      return res.status(404).json({
        success: false,
        message: 'About Us content not found',
      });
    }

    res.status(200).json({
      success: true,
      data: aboutUs.aboutus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching aboutus section',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateAboutUs = async (req: Request, res: Response) => {
  try {
    // ← changed: using imported validation instead of inline
    const parsed = aboutUsUpdateValidation.parse({ getaboutus: req.body });
    const validatedData = parsed.getaboutus ?? {};

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.video?.[0]) {
      validatedData.video = files.video[0].path;
    }
    if (files?.thumbnail?.[0]) {
      validatedData.thumbnail = files.thumbnail[0].path;
    }

    let aboutUs = await AboutUs.findOne();

    if (!aboutUs) {
      aboutUs = await AboutUs.create({
        aboutus: validatedData,
      });

      return res.status(201).json({
        success: true,
        message: 'About Us content created successfully',
        data: aboutUs.aboutus,
      });
    } else {
      // delete old video from cloudinary if new video uploaded
      if (aboutUs.aboutus.video && files?.video?.[0]) {
        try {
          const urlParts = aboutUs.aboutus.video.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0];
          const folderPath = urlParts.slice(-2, -1)[0];

          await cloudinary.uploader.destroy(`${folderPath}/${publicId}`, {
            resource_type: 'video',
          });
        } catch (cloudinaryError) {
          console.error('Error deleting old video:', cloudinaryError);
        }
      }

      // delete old thumbnail from cloudinary if new thumbnail uploaded
      if (aboutUs.aboutus.thumbnail && files?.thumbnail?.[0]) {
        try {
          const urlParts = aboutUs.aboutus.thumbnail.split('/');
          const publicId = urlParts[urlParts.length - 1].split('.')[0];
          const folderPath = urlParts.slice(-2, -1)[0];

          await cloudinary.uploader.destroy(`${folderPath}/${publicId}`);
        } catch (cloudinaryError) {
          console.error('Error deleting old thumbnail:', cloudinaryError);
        }
      }

      aboutUs.aboutus = {
        ...aboutUs.aboutus,
        ...validatedData,
      };

      await aboutUs.save();

      return res.status(200).json({
        success: true,
        message: 'About Us content updated successfully',
        data: aboutUs.aboutus,
      });
    }
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
      message: 'Error saving About Us content',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
