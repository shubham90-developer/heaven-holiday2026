import { NextFunction, Request, Response } from 'express';
import { TourManager } from './tourManagerModel';
import {
  createTourManagerSchema,
  updateTourManagerSchema,
} from './tourManagerValidation';

import { appError } from '../../errors/appError';

export const getTourManagers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let tourManagers = await TourManager.findOne().sort({
      createdAt: -1,
    });
    if (!tourManagers) {
      tourManagers = await TourManager.create({
        title: 'title',
        subtitle: 'subtitle',
        description: 'description',
      });
    }
    res.json({
      success: true,
      statusCode: 200,
      message: 'Tour managers retrieved successfully',
      data: tourManagers,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const createTourManager = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, subtitle, description } = req.body;

    const existing = await TourManager.findOne();

    const validated = createTourManagerSchema.parse({
      title,
      subtitle,
      description,
    });

    const tourManager = new TourManager(validated);
    await tourManager.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Tour manager created successfully',
      data: tourManager,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateTourManager = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description } = req.body;

    const tourManager = await TourManager.findOne({
      _id: id,
    });

    if (!tourManager) {
      next(new appError('Tour manager not found', 404));
      return;
    }

    const updateData: any = {
      title: title || tourManager.title,
      subtitle: subtitle || tourManager.subtitle,
      description: description || tourManager.description,
    };

    const validated = updateTourManagerSchema.parse(updateData);

    const updated = await TourManager.findByIdAndUpdate(id, validated, {
      new: true,
    });

    res.json({
      success: true,
      statusCode: 200,
      message: 'Tour manager updated successfully',
      data: updated,
    });
    return;
  } catch (error) {
    next(error);
  }
};
