import { NextFunction, Request, Response } from 'express';

import Enquiry from './enquiryModel';
import {
  createEnquirySchema,
  updateEnquirySchema,
  deleteEnquirySchema,
} from './enquiryValidation';

// Create Enquiry
export const createEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createEnquirySchema.parse(req.body);
    const newEnquiry = await Enquiry.create(validatedData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Enquiry created successfully',
      data: newEnquiry,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Enquiries
export const getAllEnquiries = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, page = '1', limit = '10', search } = req.query;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mono: { $regex: search, $options: 'i' } },
        { destinations: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalEnquiries = await Enquiry.countDocuments(filter);

    // If no enquiries exist, create test data
    if (totalEnquiries === 0) {
      const testEnquiry = [
        {
          name: 'admin',
          mono: '9876543210',
          destinations: 'Goa, Kerala',
          status: 'active',
        },
      ];

      await Enquiry.insertOne(testEnquiry);

      // Re-fetch with the new data
      const newEnquiries = await Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      const newTotalEnquiries = await Enquiry.countDocuments(filter);
      const newTotalPages = Math.ceil(newTotalEnquiries / limitNum);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Test enquiries created and retrieved successfully',
        data: newEnquiries,
        pagination: {
          currentPage: pageNum,
          totalPages: newTotalPages,
          totalEnquiries: newTotalEnquiries,
          limit: limitNum,
        },
      });
    }

    const totalPages = Math.ceil(totalEnquiries / limitNum);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Enquiries retrieved successfully',
      data: enquiries,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalEnquiries,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update Enquiry
export const updateEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const validatedData = updateEnquirySchema.parse({ id, ...req.body });
    const { id: _, ...updateData } = validatedData;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'No data provided to update',
        data: null,
      });
    }

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEnquiry) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Enquiry not found',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Enquiry updated successfully',
      data: updatedEnquiry,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Enquiry
export const deleteEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const validatedData = deleteEnquirySchema.parse({ id });

    const deletedEnquiry = await Enquiry.findByIdAndDelete(validatedData.id);

    if (!deletedEnquiry) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Enquiry not found',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Enquiry deleted successfully',
      data: deletedEnquiry,
    });
  } catch (error) {
    next(error);
  }
};
