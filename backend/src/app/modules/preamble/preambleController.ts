import { NextFunction, Request, Response } from 'express';
import { Preamble } from './preambleModel';
import {
  preambleSchema,
  addTableRowSchema,
  updateTableRowSchema,
} from './preambleValidation';

// Get Preamble
export const getPreamble = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let preamble = await Preamble.findOne();

    if (!preamble) {
      preamble = await Preamble.create({
        heading: 'heading',
        paragraph: 'paragraph',
        subtitle: 'subtitle',
        tableRows: [],
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Preamble retrieved successfully',
      data: preamble,
    });
  } catch (error) {
    next(error);
  }
};

// Create Complete Preamble Document
export const createPreamble = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { heading, paragraph, subtitle, tableRows } = req.body;

    const validatedData = preambleSchema.parse({
      heading,
      paragraph,
      subtitle,
      tableRows: tableRows || [],
    });

    const existingPreamble = await Preamble.findOne();

    if (existingPreamble) {
      return res.status(400).json({
        success: false,
        message: 'Preamble already exists. Use update instead.',
      });
    }

    const preamble = new Preamble(validatedData);
    await preamble.save();

    res.status(201).json({
      success: true,
      message: 'Preamble created successfully',
      data: preamble,
    });
  } catch (error) {
    next(error);
  }
};

// Update Main Fields (heading, paragraph, subtitle)
export const updateMainFields = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { heading, paragraph, subtitle } = req.body;

    const updateFields: any = {};

    if (heading) updateFields.heading = heading;
    if (paragraph) updateFields.paragraph = paragraph;
    if (subtitle) updateFields.subtitle = subtitle;

    let preamble = await Preamble.findOne();

    if (!preamble) {
      return res.status(404).json({
        success: false,
        message: 'Preamble not found. Please create one first.',
      });
    }

    const updatedPreamble = await Preamble.findByIdAndUpdate(
      preamble._id,
      { $set: updateFields },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: 'Main fields updated successfully',
      data: updatedPreamble,
    });
  } catch (error) {
    next(error);
  }
};

// Add Table Row
export const addTableRow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, particulars, status } = req.body;

    const validatedData = addTableRowSchema.parse({
      title,
      particulars,
      status: status || 'Active',
    });

    const preamble = await Preamble.findOne();

    if (!preamble) {
      return res.status(404).json({
        success: false,
        message: 'Preamble not found',
      });
    }

    preamble.tableRows.push(validatedData);
    await preamble.save();

    res.status(201).json({
      success: true,
      message: 'Table row added successfully',
      data: preamble,
    });
  } catch (error) {
    next(error);
  }
};

// Update Table Row
export const updateTableRow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, title, particulars, status } = req.body;

    const validatedData = updateTableRowSchema.parse({
      id,
      title,
      particulars,
      status,
    });

    const updateFields = {
      'tableRows.$.title': validatedData.title,
      'tableRows.$.particulars': validatedData.particulars,
      'tableRows.$.status': validatedData.status,
    };

    const updatedPreamble = await Preamble.findOneAndUpdate(
      { 'tableRows._id': validatedData.id },
      { $set: updateFields },
      { new: true },
    );

    if (!updatedPreamble) {
      return res.status(404).json({
        success: false,
        message: 'Table row not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Table row updated successfully',
      data: updatedPreamble,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Table Row
export const deleteTableRow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;

    const result = await Preamble.findOneAndUpdate(
      { 'tableRows._id': id },
      { $pull: { tableRows: { _id: id } } },
      { new: true },
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Table row not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Table row removed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
