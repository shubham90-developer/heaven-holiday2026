// controllers/visaInfo.controller.ts
import { NextFunction, Request, Response } from 'express';

import { VisaInfo } from './singaporeVisaModel';
import { visaInfoValidation } from './singaporeVisaValidation';

export const getVisaInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let document = await VisaInfo.findOne();

    // If no document exists, create one with test values
    if (!document) {
      document = new VisaInfo({
        heading: 'Test Heading',
        description: 'Test Description',
        status: 'active',
      });
      await document.save();

      res.json({
        success: true,
        statusCode: 200,
        message: 'Default visa info created and retrieved',
        data: document,
      });
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Visa info retrieved successfully',
      data: document,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateVisaInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { heading, description, status } = req.body;

    // Find existing document
    let document = await VisaInfo.findOne();

    // If no document exists, create one
    if (!document) {
      const validatedData = visaInfoValidation.parse({
        heading: heading || 'Test Heading',
        description: description || 'Test Description',
        status: status || 'active',
      });

      document = new VisaInfo(validatedData);
      await document.save();

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Visa info created successfully',
        data: document,
      });
      return;
    }

    // Prepare update data
    const updateData: any = {};
    if (heading !== undefined) updateData.heading = heading;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    // Validate update data
    const validatedData = visaInfoValidation.parse(updateData);

    // Update existing document
    if (validatedData.heading !== undefined)
      document.heading = validatedData.heading;
    if (validatedData.description !== undefined)
      document.description = validatedData.description;
    if (validatedData.status !== undefined)
      document.status = validatedData.status;

    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Visa info updated successfully',
      data: document,
    });
    return;
  } catch (error) {
    next(error);
  }
};
