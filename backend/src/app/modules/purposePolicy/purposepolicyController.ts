import { NextFunction, Request, Response } from 'express';
import { PurposePolicy } from './purposePolicyModel';
import { addCardSchema } from './purposePolicyValidation';
import z from 'zod';
// Get Purpose Policy
export const getPurposePolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let purposePolicy = await PurposePolicy.findOne();

    if (!purposePolicy) {
      purposePolicy = await PurposePolicy.create({
        heading: 'heading',
        subtitle: 'subtitle',
        cards: [],
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Purpose Policy retrieved successfully',
      data: purposePolicy,
    });
  } catch (error) {
    next(error);
  }
};

// Update Main Fields (heading, subtitle)
export const updateMainFields = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { heading, subtitle } = req.body;

    const updateFields: any = {};

    if (heading) updateFields.heading = heading;
    if (subtitle) updateFields.subtitle = subtitle;

    let purposePolicy = await PurposePolicy.findOne();

    if (!purposePolicy) {
      return res.status(404).json({
        success: false,
        message: 'Purpose Policy not found. Please create one first.',
      });
    }

    const updatedPurposePolicy = await PurposePolicy.findByIdAndUpdate(
      purposePolicy._id,
      { $set: updateFields },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: 'Main fields updated successfully',
      data: updatedPurposePolicy,
    });
  } catch (error) {
    next(error);
  }
};

// Add Card

export const addCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate request body
    const validatedData = addCardSchema.parse(req.body);

    // Get uploaded image URL from Cloudinary
    const img = req.file?.path;

    if (!img) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required',
      });
    }

    const purposePolicy = await PurposePolicy.findOne();

    if (!purposePolicy) {
      return res.status(404).json({
        success: false,
        message: 'Purpose Policy not found',
      });
    }

    purposePolicy.cards.push({
      img,
      description: validatedData.description,
      status: validatedData.status || 'Active',
    });

    await purposePolicy.save();

    res.status(201).json({
      success: true,
      message: 'Card added successfully',
      data: purposePolicy,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.message,
      });
    }
    next(error);
  }
};

// Update Card
export const updateCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, img, description, status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Card ID is required',
      });
    }

    const updateFields: any = {};
    if (img) updateFields['cards.$.img'] = img;
    if (description) updateFields['cards.$.description'] = description;
    if (status) updateFields['cards.$.status'] = status;

    const updatedPurposePolicy = await PurposePolicy.findOneAndUpdate(
      { 'cards._id': id },
      { $set: updateFields },
      { new: true },
    );

    if (!updatedPurposePolicy) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Card updated successfully',
      data: updatedPurposePolicy,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Card
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Card ID is required',
      });
    }

    const result = await PurposePolicy.findOneAndUpdate(
      { 'cards._id': id },
      { $pull: { cards: { _id: id } } },
      { new: true },
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Card removed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
