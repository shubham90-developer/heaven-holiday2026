// counter.controller.ts
import { NextFunction, Request, Response } from 'express';
import { Counter } from './counter.model';
import { counterValidation } from './counter.validation';
import { appError } from '../../errors/appError';

export const getCounter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let counter = await Counter.findOne();

    if (!counter) {
      counter = await Counter.create({
        title: 'Default Title',
        subTitle: 'Default Subtitle',
        guests: 0,
        toursCompleted: 0,
        tourExpert: 0,
        tourDestination: 0,
        bigTravelCompany: 'Default Company',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Counter retrieved successfully',
      data: counter,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCounter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      subTitle, // Changed from subtitle
      guests,
      toursCompleted,
      tourExpert,
      tourDestination,
      bigTravelCompany,
    } = req.body;

    // Find the counter to update
    const counter = await Counter.findOne();

    if (!counter) {
      return next(new appError('Counter not found', 404));
    }

    // Prepare update data
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (subTitle !== undefined) updateData.subTitle = subTitle; // Changed from subtitle
    if (guests !== undefined) updateData.guests = guests;
    if (toursCompleted !== undefined)
      updateData.toursCompleted = toursCompleted;
    if (tourExpert !== undefined) updateData.tourExpert = tourExpert;
    if (tourDestination !== undefined)
      updateData.tourDestination = tourDestination;
    if (bigTravelCompany !== undefined)
      updateData.bigTravelCompany = bigTravelCompany;

    // Validate the update data (only if there are updates)
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'No changes to update',
        data: counter,
      });
    }

    const validatedData = counterValidation.parse({
      title: updateData.title || counter.title,
      subTitle: updateData.subTitle || counter.subTitle,
      guests:
        updateData.guests !== undefined ? updateData.guests : counter.guests,
      toursCompleted:
        updateData.toursCompleted !== undefined
          ? updateData.toursCompleted
          : counter.toursCompleted,
      tourExpert:
        updateData.tourExpert !== undefined
          ? updateData.tourExpert
          : counter.tourExpert,
      tourDestination:
        updateData.tourDestination !== undefined
          ? updateData.tourDestination
          : counter.tourDestination,
      bigTravelCompany: updateData.bigTravelCompany || counter.bigTravelCompany,
    });

    // Update the counter
    const updatedCounter = await Counter.findOneAndUpdate({}, validatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Counter updated successfully',
      data: updatedCounter, // Changed from updateCounter (was a typo)
    });
  } catch (error) {
    next(error);
  }
};
