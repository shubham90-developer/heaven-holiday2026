// controllers/annualReturn.controller.ts
import { NextFunction, Request, Response } from 'express';

import { AnnualReturn } from './returnModel';

import { annualReturnItemValidation } from './returnValidation';
import { appError } from '../../errors/appError';
import { cloudinary } from '../../config/cloudinary';

// ================= GET ANNUAL RETURN =================
export const getAnnualReturn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let document = await AnnualReturn.findOne();

    // If no document exists, create one with default values
    if (!document) {
      document = new AnnualReturn({
        items: [
          {
            title: 'Test FY 2023-2024',
            particulars: '/assets/pdf/annual-return/test.pdf',
            status: 'active',
          },
        ],
        status: 'active',
      });
      await document.save();

      res.json({
        success: true,
        statusCode: 200,
        message: 'Default annual return created and retrieved',
        data: document,
      });
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Annual return retrieved successfully',
      data: document,
    });
    return;
  } catch (error) {
    next(error);
  }
};

// ================= ADD ITEM (ADMIN ONLY) =================
export const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, particulars, status } = req.body;

    if (!title) {
      next(new appError('Title is required', 400));
      return;
    }

    // Find existing document
    let document = await AnnualReturn.findOne();

    if (!document) {
      next(
        new appError(
          'Annual return section not found. Please create it first.',
          404,
        ),
      );
      return;
    }

    // Check max items limit
    if (document.items.length >= 50) {
      next(new appError('Maximum 50 items allowed', 400));
      return;
    }

    // Handle PDF upload if file is provided
    let pdfUrl = particulars || '';
    if (req.file) {
      pdfUrl = req.file.path; // Cloudinary URL
    }

    if (!pdfUrl) {
      next(new appError('Particulars (PDF) is required', 400));
      return;
    }

    // Validate item data
    const validated = annualReturnItemValidation.parse({
      title,
      particulars: pdfUrl,
      status: status || 'active',
    });

    // Add new item
    document.items.push({
      title: validated.title,
      particulars: validated.particulars,
      status: validated.status || 'active',
    });

    await document.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Item added successfully',
      data: document,
    });
    return;
  } catch (error) {
    // Clean up uploaded PDF on error
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`annual-return-pdfs/${publicId}`);
      }
    }
    next(error);
  }
};

// ================= UPDATE ITEM (ADMIN ONLY) =================
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { itemId } = req.params;
    const { title, particulars, status } = req.body;

    if (!title) {
      next(new appError('Title is required', 400));
      return;
    }

    // Find existing document
    let document = await AnnualReturn.findOne();

    if (!document) {
      next(new appError('Annual return not found', 404));
      return;
    }

    // Find item by _id
    const item = document.items.id(itemId);

    if (!item) {
      next(new appError('Item not found', 404));
      return;
    }

    // Handle PDF upload if new file is provided
    let pdfUrl = particulars || item.particulars;
    if (req.file) {
      // Delete old PDF from cloudinary if it exists and is a cloudinary URL
      if (item.particulars && item.particulars.includes('cloudinary')) {
        const oldPublicId = item.particulars.split('/').pop()?.split('.')[0];
        if (oldPublicId) {
          await cloudinary.uploader.destroy(
            `annual-return-pdfs/${oldPublicId}`,
          );
        }
      }
      pdfUrl = req.file.path; // New Cloudinary URL
    }

    // Update item
    item.title = title;
    item.particulars = pdfUrl;
    if (status !== undefined) item.status = status;

    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Item updated successfully',
      data: document,
    });
    return;
  } catch (error) {
    // Clean up uploaded PDF on error
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`annual-return-pdfs/${publicId}`);
      }
    }
    next(error);
  }
};

// ================= DELETE ITEM (ADMIN ONLY) =================
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { itemId } = req.params;

    // Find existing document
    let document = await AnnualReturn.findOne();

    if (!document) {
      next(new appError('Annual return not found', 404));
      return;
    }

    // Find item by _id
    const item = document.items.id(itemId);

    if (!item) {
      next(new appError('Item not found', 404));
      return;
    }

    // Delete PDF from cloudinary if it's a cloudinary URL
    if (item.particulars && item.particulars.includes('cloudinary')) {
      const publicId = item.particulars.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`annual-return-pdfs/${publicId}`);
      }
    }

    // Remove item
    item.deleteOne();
    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Item deleted successfully',
      data: document,
    });
    return;
  } catch (error) {
    next(error);
  }
};
