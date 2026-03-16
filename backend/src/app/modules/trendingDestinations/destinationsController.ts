import { NextFunction, Request, Response } from 'express';
import { TrendingDestination } from './destinationsModel';
import {
  updateTitleSchema,
  addDestinationSchema,
  updateDestinationBodySchema,
} from './destinationsValidation';

import { appError } from '../../errors/appError';
import { cloudinary } from '../../config/cloudinary';

export const updateTitle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = updateTitleSchema.parse(req.body);

    let doc = await TrendingDestination.findOne();
    if (!doc) {
      doc = await TrendingDestination.create({
        title: validated.title,

        destinations: [],
      });
    } else {
      doc.title = validated.title;
      await doc.save();
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Title updated successfully',
      data: {
        title: doc.title,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getTrendingDestinations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { category, status } = req.query;

    const doc = await TrendingDestination.findOne();
    if (!doc) {
      res.json({
        success: true,
        statusCode: 200,
        message: 'Trending destinations retrieved successfully',
        data: {
          title: 'Trending Destinations',
          subtitle: '',
          destinations: [],
        },
      });
      return;
    }

    let destinations = [...doc.destinations];

    // Apply filters
    if (category === 'World' || category === 'India') {
      destinations = destinations.filter((d) => d.category === category);
    }

    if (status === 'active' || status === 'inactive') {
      destinations = destinations.filter((d) => d.status === status);
    }

    // Sort by order
    destinations.sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      statusCode: 200,
      message: 'Trending destinations retrieved successfully',
      data: {
        title: doc.title,

        destinations,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const createDestination = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, tours, departures, guests, category, status, order } =
      req.body;

    let doc = await TrendingDestination.findOne();
    if (!doc) {
      doc = await TrendingDestination.create({
        title: 'Trending Destinations',
        subtitle: '',
        destinations: [],
      });
    }

    // Check if destination with same title already exists
    const existing = doc.destinations.find(
      (d) => d.title.toLowerCase() === title?.toLowerCase(),
    );
    if (existing) {
      next(new appError('Destination with this title already exists', 400));
      return;
    }

    // Image is required
    if (!req.file) {
      next(new appError('Image is required', 400));
      return;
    }

    const image = req.file.path;

    const validated = addDestinationSchema.parse({
      title,
      image,
      tours: Number(tours) || 0,
      departures: Number(departures) || 0,
      guests: Number(guests) || 0,
      category,
      status:
        status === 'active' || status === true || status === 'true'
          ? 'active'
          : 'inactive',
      order: Number(order) || 0,
    });

    // Add destination to array
    doc.destinations.push(validated as any);
    await doc.save();

    const addedDestination = doc.destinations[doc.destinations.length - 1];

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Destination created successfully',
      data: addedDestination,
    });
    return;
  } catch (error) {
    // Cleanup uploaded image if validation fails
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(
          `restaurant-destinations/${publicId}`,
        );
      }
    }
    next(error);
  }
};

export const updateDestination = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, tours, departures, guests, category, status, order } =
      req.body;

    const doc = await TrendingDestination.findOne();
    if (!doc) {
      next(new appError('Destination not found', 404));
      return;
    }

    // Find destination
    const destination = doc.destinations.find((d) => d._id?.toString() === id);

    if (!destination) {
      next(new appError('Destination not found', 404));
      return;
    }

    // Check if new title conflicts with another destination
    if (title && title.toLowerCase() !== destination.title.toLowerCase()) {
      const existing = doc.destinations.find(
        (d) =>
          d.title.toLowerCase() === title.toLowerCase() &&
          d._id?.toString() !== id,
      );
      if (existing) {
        next(new appError('Destination with this title already exists', 400));
        return;
      }
    }

    // Build update data
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (tours !== undefined) updateData.tours = Number(tours);
    if (departures !== undefined) updateData.departures = Number(departures);
    if (guests !== undefined) updateData.guests = Number(guests);
    if (category !== undefined) updateData.category = category;
    if (order !== undefined) updateData.order = Number(order);
    if (status !== undefined) {
      updateData.status =
        status === 'active' || status === true || status === 'true'
          ? 'active'
          : 'inactive';
    }

    // Handle image update
    if (req.file) {
      const oldImagePublicId = destination.image
        .split('/')
        .pop()
        ?.split('.')[0];
      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(
          `restaurant-destinations/${oldImagePublicId}`,
        );
      }
      updateData.image = req.file.path;
    }

    // Validate update data
    const validated = updateDestinationBodySchema.parse(updateData);

    // Apply updates
    Object.assign(destination, validated);
    await doc.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Destination updated successfully',
      data: destination,
    });
    return;
  } catch (error) {
    // Cleanup uploaded image if validation fails
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(
          `restaurant-destinations/${publicId}`,
        );
      }
    }
    next(error);
  }
};

export const deleteDestination = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const doc = await TrendingDestination.findOne();
    if (!doc) {
      next(new appError('Destination not found', 404));
      return;
    }

    // Find destination index
    const destinationIndex = doc.destinations.findIndex(
      (d) => d._id?.toString() === id,
    );

    if (destinationIndex === -1) {
      next(new appError('Destination not found', 404));
      return;
    }

    // Remove destination from array
    const deletedDestination = doc.destinations[destinationIndex];
    doc.destinations.splice(destinationIndex, 1);
    await doc.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Destination deleted successfully',
      data: deletedDestination,
    });
    return;
  } catch (error) {
    next(error);
  }
};
