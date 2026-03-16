import { NextFunction, Request, Response } from 'express';
import {
  createCardSchema,
  updateCardSchema,
  validateCardLimit,
} from './partnerValidation';
import { Card } from './partnerModel';

// GET all cards
export const getAllCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cards retrieved successfully',
      data: cards,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE new card
export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentCount = await Card.countDocuments();
    const limitCheck = await validateCardLimit(currentCount);

    if (!limitCheck.isValid) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: limitCheck.error,
      });
    }

    const iconFile = req.file;

    if (!iconFile) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Icon is required',
      });
    }

    // Get Cloudinary URL from multer upload
    const icon = iconFile.path;

    // Parse cities from string to array
    const cities = req.body.cities ? JSON.parse(req.body.cities) : [];

    // Validate with Zod
    const validatedData = createCardSchema.parse({
      icon: icon,
      title: req.body.title,
      description: req.body.description,
      cities: cities,
      status: req.body.status || 'active',
    });

    // Create new card
    const newCard = new Card({
      icon: validatedData.icon,
      title: validatedData.title,
      description: validatedData.description,
      cities: validatedData.cities,
      status: validatedData.status,
    });

    await newCard.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Card created successfully',
      data: newCard,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE card
export const updateCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const iconFile = req.file;

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Card not found',
      });
    }

    // Prepare update data
    const updateData: any = {};

    if (req.body.title) {
      updateData.title = req.body.title;
    }

    if (req.body.description) {
      updateData.description = req.body.description;
    }

    if (req.body.cities) {
      updateData.cities = JSON.parse(req.body.cities);
    }

    if (req.body.status) {
      updateData.status = req.body.status;
    }

    if (iconFile) {
      updateData.icon = iconFile.path;
    }

    // Validate with Zod
    const validatedData = updateCardSchema.parse(updateData);

    // Update card
    Object.assign(card, validatedData);
    await card.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Card updated successfully',
      data: card,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE card
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const card = await Card.findByIdAndDelete(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Card not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Card deleted successfully',
      data: card,
    });
  } catch (error) {
    next(error);
  }
};
