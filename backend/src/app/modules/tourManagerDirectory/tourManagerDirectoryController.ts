import { NextFunction, Request, Response } from 'express';
import { TourManagerDirectory } from './tourManagerDirectoryModel';
import {
  createTourManagerDirectorySchema,
  addManagerSchema,
} from './tourManagerDirectoryValidation';
import { appError } from '../../errors/appError';
import { cloudinary } from '../../config/cloudinary';

export const getTourManagerDirectory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, letter, status } = req.query;

    const directory = await TourManagerDirectory.findOne().sort({
      createdAt: -1,
    });

    if (!directory) {
      next(new appError('Tour manager directory not found', 404));
      return;
    }

    let filteredManagers = directory.managers;

    // Filter by status
    if (status && (status === 'active' || status === 'inactive')) {
      const statusValue = status === 'active' ? 'Active' : 'Inactive';
      filteredManagers = filteredManagers.filter(
        (manager) => manager.status === statusValue,
      );
    }

    // Filter by search term
    if (search && typeof search === 'string') {
      filteredManagers = filteredManagers.filter((manager) =>
        manager.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Filter by first letter
    if (letter && typeof letter === 'string') {
      filteredManagers = filteredManagers.filter((manager) =>
        manager.name.toLowerCase().startsWith(letter.toLowerCase()),
      );
    }

    // Sort by name alphabetically
    filteredManagers.sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      statusCode: 200,
      message: 'Tour manager directory retrieved successfully',
      data: {
        _id: directory._id,
        heading: directory.heading,
        managers: filteredManagers,
        createdAt: directory.createdAt,
        updatedAt: directory.updatedAt,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Create or update tour manager directory (for heading)
export const updateDirectoryHeading = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { heading } = req.body;

    if (!heading) {
      next(new appError('Heading is required', 400));
      return;
    }

    const existing = await TourManagerDirectory.findOne();

    if (existing) {
      // Update existing
      existing.heading = heading;
      await existing.save();

      res.json({
        success: true,
        statusCode: 200,
        message: 'Tour manager directory heading updated successfully',
        data: existing,
      });
      return;
    } else {
      // Create new
      const validated = createTourManagerDirectorySchema.parse({
        heading,
        managers: [],
      });

      const directory = new TourManagerDirectory(validated);
      await directory.save();

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Tour manager directory created successfully',
        data: directory,
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

// Add a manager to the directory
export const addManager = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, status } = req.body;

    if (!req.file) {
      next(new appError('Image is required', 400));
      return;
    }

    const directory = await TourManagerDirectory.findOne();

    if (!directory) {
      next(
        new appError(
          'Tour manager directory not found. Please create directory first.',
          404,
        ),
      );
      return;
    }

    const existingManager = directory.managers.find(
      (m) => m.name.toLowerCase() === name.toLowerCase(),
    );

    if (existingManager) {
      if (req.file?.path) {
        const publicId = req.file.path.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(
            `tour-manager-directory/${publicId}`,
          );
        }
      }
      next(new appError('Manager with this name already exists', 400));
      return;
    }

    const image = req.file.path;
    const validated = addManagerSchema.parse({
      name,
      image,
      status:
        status === 'Active' || status === true || status === 'true'
          ? 'Active'
          : 'Inactive',
    });

    directory.managers.push(validated);
    await directory.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Manager added successfully',
      data: directory,
    });
    return;
  } catch (error) {
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`tour-manager-directory/${publicId}`);
      }
    }
    next(error);
  }
};

// Update a manager
export const updateManager = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { managerId } = req.params;
    const { name, status } = req.body;

    const directory = await TourManagerDirectory.findOne({
      'managers._id': managerId,
    });

    if (!directory) {
      // Clean up uploaded file if directory not found
      if (req.file?.path) {
        const publicId = req.file.path.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(
            `tour-manager-directory/${publicId}`,
          );
        }
      }
      next(new appError('Manager not found', 404));
      return;
    }

    const manager = directory.managers.find(
      (m) => m._id?.toString() === managerId,
    );

    if (!manager) {
      // Clean up uploaded file if manager not found
      if (req.file?.path) {
        const publicId = req.file.path.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(
            `tour-manager-directory/${publicId}`,
          );
        }
      }
      next(new appError('Manager not found', 404));
      return;
    }

    // Check if name is being changed to an existing one
    if (name && name !== manager.name) {
      const existingManager = directory.managers.find(
        (m) => m.name.toLowerCase() === name.toLowerCase(),
      );

      if (existingManager) {
        // Clean up uploaded file if duplicate name
        if (req.file?.path) {
          const publicId = req.file.path.split('/').pop()?.split('.')[0];
          if (publicId) {
            await cloudinary.uploader.destroy(
              `tour-manager-directory/${publicId}`,
            );
          }
        }
        next(new appError('Manager with this name already exists', 400));
        return;
      }
    }

    // Update name if provided
    if (name) {
      manager.name = name;
    }

    // Update status if provided
    if (status !== undefined) {
      manager.status =
        status === 'Active' || status === true || status === 'true'
          ? 'Active'
          : 'Inactive';
    }

    // Handle image update
    if (req.file) {
      const oldImagePublicId = manager.image.split('/').pop()?.split('.')[0];
      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(
          `tour-manager-directory/${oldImagePublicId}`,
        );
      }
      manager.image = req.file.path;
    }

    await directory.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Manager updated successfully',
      data: directory,
    });
    return;
  } catch (error) {
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`tour-manager-directory/${publicId}`);
      }
    }
    next(error);
  }
};

// Delete a manager
export const deleteManager = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { managerId } = req.params;

    const directory = await TourManagerDirectory.findOne({
      'managers._id': managerId,
    });

    if (!directory) {
      next(new appError('Manager not found', 404));
      return;
    }

    const managerIndex = directory.managers.findIndex(
      (m) => m._id?.toString() === managerId,
    );

    if (managerIndex === -1) {
      next(new appError('Manager not found', 404));
      return;
    }

    // Delete image from cloudinary
    const manager = directory.managers[managerIndex];
    const imagePublicId = manager.image.split('/').pop()?.split('.')[0];
    if (imagePublicId) {
      await cloudinary.uploader.destroy(
        `tour-manager-directory/${imagePublicId}`,
      );
    }

    // Remove manager from array
    directory.managers.splice(managerIndex, 1);
    await directory.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Manager deleted successfully',
      data: directory,
    });
    return;
  } catch (error) {
    next(error);
  }
};
