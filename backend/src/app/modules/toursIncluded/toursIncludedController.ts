// controllers/includes.controller.ts
import { Request, Response } from 'express';
import { Includes } from './toursIncludedModel';
import {
  IncludesSchema,
  UpdateIncludesSchema,
} from './toursIncludedValidation';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';

// ================= GET ALL INCLUDES =================
export const getAllIncludes = async (req: Request, res: Response) => {
  try {
    const includes = await Includes.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      statusCode: 200,
      message: 'Includes retrieved successfully',
      data: includes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching includes',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const createInclude = async (req: Request, res: Response) => {
  try {
    const { title, status } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: 'Image is required',
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'includes',
      resource_type: 'auto',
    });

    const validatedData = IncludesSchema.parse({
      title,
      image: uploadResult.secure_url,
      status: status || 'active',
    });

    const newInclude = new Includes(validatedData);
    await newInclude.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Include created successfully',
      data: newInclude,
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
      message: 'Error creating include',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= UPDATE INCLUDE =================
export const updateInclude = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    const newImageFile = req.file;

    const existingInclude = await Includes.findById(id);

    if (!existingInclude) {
      return res.status(404).json({
        success: false,
        message: 'Include not found',
      });
    }

    let imageUrl = existingInclude.image;

    // If new image is uploaded, upload to Cloudinary
    if (newImageFile) {
      // Delete old image from Cloudinary (optional)
      const publicId = existingInclude.image.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`includes/${publicId}`);
      }

      const uploadResult = await cloudinary.uploader.upload(newImageFile.path, {
        folder: 'includes',
        resource_type: 'auto',
      });
      imageUrl = uploadResult.secure_url;
    }

    const validatedData = UpdateIncludesSchema.parse({
      title: title || existingInclude.title,
      image: imageUrl,
      status: status || existingInclude.status,
    });

    const updatedInclude = await Includes.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Include updated successfully',
      data: updatedInclude,
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
      message: 'Error updating include',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= DELETE INCLUDE =================
export const deleteInclude = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const include = await Includes.findById(id);

    if (!include) {
      return res.status(404).json({
        success: false,
        message: 'Include not found',
      });
    }

    // Delete image from Cloudinary (optional)
    const publicId = include.image.split('/').pop()?.split('.')[0];
    if (publicId) {
      await cloudinary.uploader.destroy(`includes/${publicId}`);
    }

    await Includes.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Include deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting include',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
