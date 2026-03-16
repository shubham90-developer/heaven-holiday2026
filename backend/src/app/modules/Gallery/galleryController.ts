import { NextFunction, Request, Response } from 'express';
import { Gallery } from './galleryModel';
import { galleryInfoValidation, imageValidation } from './galleryValidation';

export const getGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let gallery = await Gallery.findOne();

    if (!gallery) {
      return res.json({
        success: true,
        statusCode: 200,
        message: 'No gallery found',
        data: { title: '', subtitle: '', images: [] },
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Gallery retrieved successfully',
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, subtitle } = req.body;

    // Validate with Zod
    const validatedData = galleryInfoValidation.parse({
      title,
      subtitle,
    });

    // Find existing gallery
    let gallery = await Gallery.findOne();

    if (!gallery) {
      // Create new gallery if doesn't exist
      gallery = new Gallery({
        title: validatedData.title,
        subtitle: validatedData.subtitle,
        images: [],
      });
    } else {
      // Update existing gallery
      gallery.title = validatedData.title;
      gallery.subtitle = validatedData.subtitle;
    }

    await gallery.save();

    res.status(200).json({
      success: true,
      message: 'Gallery info updated successfully',
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

export const addImageToGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const imageUrl = req.file?.path;
    const { status } = req.body; // ✅ ADD THIS LINE

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image is required',
      });
    }

    const validatedData = imageValidation.parse({
      url: imageUrl,
      status: status || 'active',
    });

    let gallery = await Gallery.findOne();

    if (!gallery) {
      gallery = new Gallery({
        title: 'Gallery',
        subtitle: 'Our Collection',
        images: [
          {
            url: validatedData.url,
            status: validatedData.status,
          },
        ],
      });
    } else {
      gallery.images.push({
        url: validatedData.url,
        status: validatedData.status,
      });
    }

    await gallery.save();

    res.status(201).json({
      success: true,
      message: 'Image added successfully',
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImageFromGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { imageId } = req.body;

    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: 'Image ID is required',
      });
    }

    const gallery = await Gallery.findOneAndUpdate(
      { 'images._id': imageId },
      { $pull: { images: { _id: imageId } } },
      { new: true },
    );

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image removed successfully',
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

export const updateImageStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { imageId, status } = req.body;

    if (!imageId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Image ID and status are required',
      });
    }

    // Validate status
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be active or inactive',
      });
    }

    const gallery = await Gallery.findOneAndUpdate(
      { 'images._id': imageId },
      { $set: { 'images.$.status': status } },
      { new: true },
    );

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image status updated successfully',
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};
