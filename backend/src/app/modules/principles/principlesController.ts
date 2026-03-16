import { NextFunction, Request, Response } from 'express';
import { Principle } from './principlesModel';
import {
  updatePrincipleValidation,
  principleDetailValidation,
} from './principlesValidation';

// GET - Get the single main principle
export const getPrinciple = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let principle = await Principle.findOne();

    // If no principle exists, create a new one with default values
    if (!principle) {
      principle = await Principle.create({
        title: 'Default Principle Title',
        description: '<p>Default principle description</p>',
        details: [], // Empty array as requested
      });
    }

    res.status(200).json({ success: true, data: principle });
  } catch (error) {
    next(error);
  }
};

// UPDATE - Update main fields (title & description)
export const updateMainFields = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate request body
    const validatedData = updatePrincipleValidation
      .pick({ title: true, description: true })
      .parse(req.body);

    const principle = await Principle.findOneAndUpdate(
      {},
      { $set: validatedData },
      { new: true, runValidators: true },
    );

    if (!principle)
      return res.status(404).json({
        success: false,
        message: 'Principle not found',
      });

    res.status(200).json({ success: true, data: principle });
  } catch (error) {
    next(error);
  }
};

// ADD - Add a new detail to details array
export const addDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate request body for single detail
    const validatedDetail = principleDetailValidation.parse(req.body);

    const principle = await Principle.findOneAndUpdate(
      {},
      { $push: { details: validatedDetail } },
      { new: true, runValidators: true },
    );

    if (!principle)
      return res.status(404).json({
        success: false,
        message: 'Principle not found',
      });

    res.status(200).json({ success: true, data: principle });
  } catch (error) {
    next(error);
  }
};

// UPDATE - Update a single detail inside details array
export const updateDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Validate the update body (partial allowed)
    const validatedDetail = principleDetailValidation.partial().parse(req.body);

    // Map fields to positional update
    const updateFields = Object.fromEntries(
      Object.entries(validatedDetail).map(([k, v]) => [`details.$.${k}`, v]),
    );

    const principle = await Principle.findOneAndUpdate(
      { 'details._id': id },
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!principle)
      return res.status(404).json({
        success: false,
        message: 'Detail not found',
      });

    res.status(200).json({ success: true, data: principle });
  } catch (error) {
    next(error);
  }
};

export const deleteDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid detail ID',
      });
    }

    const principle = await Principle.findOneAndUpdate(
      {},
      { $pull: { details: { _id: id } } },
      { new: true },
    );

    if (!principle) {
      return res.status(404).json({
        success: false,
        message: 'Detail not found',
      });
    }

    res.status(200).json({ success: true, data: principle });
  } catch (error) {
    next(error);
  }
};
