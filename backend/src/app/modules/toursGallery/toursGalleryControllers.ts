import { Request, Response } from 'express';
import Gallery from './toursGalleryModel';
import {
  createGallerySchema,
  updateGallerySchema,
  createImageSchema,
  updateImageSchema,
} from './toursGalleryValidation';
import { z } from 'zod';
import { cloudinary } from '../../config/cloudinary';

export const getGallery = async (req: Request, res: Response) => {
  try {
    let gallery = await Gallery.findOne();

    if (!gallery) {
      gallery = await Gallery.create({
        title: 'title',
        subtitle: 'subtitle',
        images: [],
      });
    }

    res.json({
      success: true,
      data: gallery,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery',
    });
  }
};

export const createGallery = async (req: Request, res: Response) => {
  try {
    const existing = await Gallery.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Gallery already exists',
      });
    }

    const validated = createGallerySchema.parse(req.body);
    const gallery = await Gallery.create(validated);

    res.status(201).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create gallery',
    });
  }
};

export const updateGallery = async (req: Request, res: Response) => {
  try {
    const validated = updateGallerySchema.parse(req.body);

    const gallery = await Gallery.findOneAndUpdate({}, validated, {
      new: true,
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    res.json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update gallery',
    });
  }
};

export const getImages = async (req: Request, res: Response) => {
  try {
    const gallery = await Gallery.findOne();

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    res.json({
      success: true,
      data: gallery.images,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch images',
    });
  }
};

// NEW: Upload image to Cloudinary and add to gallery
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { alt, isFeatured } = req.body;

    if (!alt) {
      return res.status(400).json({
        success: false,
        message: 'Alt text  are required',
      });
    }

    const imageData = {
      src: req.file.path, // Cloudinary URL
      alt: alt,

      isFeatured: isFeatured === 'true' || isFeatured === true,
    };

    const gallery = await Gallery.findOneAndUpdate(
      {},
      { $push: { images: imageData } },
      { new: true },
    );

    if (!gallery) {
      // Delete uploaded image from Cloudinary if gallery not found
      const publicId = req.file.filename;
      await cloudinary.uploader.destroy(publicId);

      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    const lastImage = gallery.images[gallery.images.length - 1];

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: lastImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
    });
  }
};

// Original addImage (for URL-based images)
export const addImage = async (req: Request, res: Response) => {
  try {
    const validated = createImageSchema.parse(req.body);

    const gallery = await Gallery.findOneAndUpdate(
      {},
      { $push: { images: validated } },
      { new: true },
    );

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    const lastImage = gallery.images[gallery.images.length - 1];

    res.status(201).json({
      success: true,
      data: lastImage,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add image',
    });
  }
};

// NEW: Update image with optional file upload
export const updateImageWithUpload = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const { alt, isFeatured } = req.body;

    const gallery = await Gallery.findOne({ 'images._id': imageId });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    const imageToUpdate = gallery.images.find(
      (img: any) => img._id.toString() === imageId,
    );

    if (!imageToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    // Build update fields
    const updateFields: Record<string, any> = {};

    // If new file is uploaded, delete old image from Cloudinary
    if (req.file) {
      // Extract public_id from old Cloudinary URL
      const oldUrl = imageToUpdate.src;
      const urlParts = oldUrl.split('/');
      const publicIdWithExt = urlParts[urlParts.length - 1];
      const publicId = `tours-gallery/${publicIdWithExt.split('.')[0]}`;

      // Delete old image
      await cloudinary.uploader.destroy(publicId);

      // Set new image URL
      updateFields['images.$.src'] = req.file.path;
    }

    if (alt) updateFields['images.$.alt'] = alt;

    if (isFeatured !== undefined) {
      updateFields['images.$.isFeatured'] =
        isFeatured === 'true' || isFeatured === true;
    }

    const updatedGallery = await Gallery.findOneAndUpdate(
      { 'images._id': imageId },
      { $set: updateFields },
      { new: true },
    );

    const updatedImage = updatedGallery!.images.find(
      (img: any) => img._id.toString() === imageId,
    );

    res.json({
      success: true,
      message: 'Image updated successfully',
      data: updatedImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update image',
    });
  }
};

// Original updateImage (without file upload)
export const updateImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const validated = updateImageSchema.parse(req.body);

    const updateFields: Record<string, any> = {};
    Object.entries(validated).forEach(([key, value]) => {
      updateFields[`images.$.${key}`] = value;
    });

    const gallery = await Gallery.findOneAndUpdate(
      { 'images._id': imageId },
      { $set: updateFields },
      { new: true },
    );

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    const updatedImage = gallery.images.find(
      (img: any) => img._id.toString() === imageId,
    );

    if (!updatedImage) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    res.json({
      success: true,
      data: updatedImage,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update image',
    });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;

    const gallery = await Gallery.findOne({ 'images._id': imageId });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    // Find the image to get Cloudinary URL
    const imageToDelete = gallery.images.find(
      (img: any) => img._id.toString() === imageId,
    );

    if (imageToDelete) {
      // Extract public_id from Cloudinary URL
      const url = imageToDelete.src;
      if (url.includes('cloudinary.com')) {
        const urlParts = url.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `tours-gallery/${publicIdWithExt.split('.')[0]}`;

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Remove from database
    const updatedGallery = await Gallery.findOneAndUpdate(
      { 'images._id': imageId },
      { $pull: { images: { _id: imageId } } },
      { new: true },
    );

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
    });
  }
};
