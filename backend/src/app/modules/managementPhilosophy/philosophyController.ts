import { NextFunction, Request, Response } from 'express';
import { Management } from './philosophyModel';
import { addCardSchema, updateCardSchema } from './philosophyValidation';

// Get Management
export const getManagement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let management = await Management.findOne();

    if (!management) {
      management = await Management.create({
        heading: 'heading',
        paragraph: 'paragraph',
        cards: [],
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Management retrieved successfully',
      data: management,
    });
  } catch (error) {
    next(error);
  }
};

// Update Main Fields (heading, paragraph)
export const updateMainFields = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { heading, paragraph } = req.body;

    const updateFields: any = {};

    if (heading) updateFields.heading = heading;
    if (paragraph) updateFields.paragraph = paragraph;

    let management = await Management.findOne();

    if (!management) {
      return res.status(404).json({
        success: false,
        message: 'Management not found. Please create one first.',
      });
    }

    const updatedManagement = await Management.findByIdAndUpdate(
      management._id,
      { $set: updateFields },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: 'Main fields updated successfully',
      data: updatedManagement,
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
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image is required',
      });
    }

    const { name, status } = req.body;

    const validatedData = addCardSchema.parse({
      name,
      image: imageUrl,
      status: status || 'Active',
    });

    const management = await Management.findOne();

    if (!management) {
      return res.status(404).json({
        success: false,
        message: 'Management not found',
      });
    }

    management.cards.push(validatedData);
    await management.save();

    res.status(201).json({
      success: true,
      message: 'Card added successfully',
      data: management,
    });
  } catch (error) {
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
    const { id, name, status } = req.body;
    const imageUrl = req.file?.path;

    const validatedData = updateCardSchema.parse({
      id,
      name,
      image: imageUrl,
      status,
    });

    const updateFields: any = {
      'cards.$.name': validatedData.name,
      'cards.$.status': validatedData.status,
    };

    if (validatedData.image) {
      updateFields['cards.$.image'] = validatedData.image;
    }

    const updatedManagement = await Management.findOneAndUpdate(
      { 'cards._id': validatedData.id },
      { $set: updateFields },
      { new: true },
    );

    if (!updatedManagement) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Card updated successfully',
      data: updatedManagement,
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

    const result = await Management.findOneAndUpdate(
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
