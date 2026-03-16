// controllers/department.controller.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Department } from './openingsModel';
import { departmentValidationSchema } from './openingsValidation';
import { appError } from '../../errors/appError';
import { Location } from './openingsModel';
import { locationValidationSchema } from './openingsValidation';
// Create Department
export const createDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = departmentValidationSchema.parse(req.body);

    // Check if department already exists
    const existingDepartment = await Department.findOne({
      name: { $regex: new RegExp(`^${validatedData.name}$`, 'i') },
    });

    if (existingDepartment) {
      return next(new appError('Department already exists', 400));
    }

    const department = await Department.create(validatedData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Department created successfully',
      data: department,
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

// Get All Departments
export const getAllDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isActive = req.query.isActive as string;

    const filter: any = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const departments = await Department.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Departments retrieved successfully',
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

// Update Department
export const updateDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const validatedData = departmentValidationSchema.partial().parse(req.body);

    const department = await Department.findById(id);

    if (!department) {
      return next(new appError('Department not found', 404));
    }

    // Check if new name already exists
    if (validatedData.name && validatedData.name !== department.name) {
      const existingDepartment = await Department.findOne({
        name: { $regex: new RegExp(`^${validatedData.name}$`, 'i') },
        _id: { $ne: id },
      });

      if (existingDepartment) {
        return next(new appError('Department name already exists', 400));
      }
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Department updated successfully',
      data: updatedDepartment,
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

// Delete Department
export const deleteDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);

    if (!department) {
      return next(new appError('Department not found', 404));
    }

    await Department.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Department deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle Department Status
export const toggleDepartmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);

    if (!department) {
      return next(new appError('Department not found', 404));
    }

    department.isActive = !department.isActive;
    await department.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Department ${
        department.isActive ? 'activated' : 'deactivated'
      } successfully`,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// Create Location
export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = locationValidationSchema.parse(req.body);

    // Check if location already exists
    const existingLocation = await Location.findOne({
      name: { $regex: new RegExp(`^${validatedData.name}$`, 'i') },
    });

    if (existingLocation) {
      return next(new appError('Location already exists', 400));
    }

    const location = await Location.create(validatedData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Location created successfully',
      data: location,
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

// Get All Locations
export const getAllLocations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isActive = req.query.isActive as string;

    const filter: any = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const locations = await Location.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Locations retrieved successfully',
      data: locations,
    });
  } catch (error) {
    next(error);
  }
};

// Update Location
export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const validatedData = locationValidationSchema.partial().parse(req.body);

    const location = await Location.findById(id);

    if (!location) {
      return next(new appError('Location not found', 404));
    }

    // Check if new name already exists
    if (validatedData.name && validatedData.name !== location.name) {
      const existingLocation = await Location.findOne({
        name: { $regex: new RegExp(`^${validatedData.name}$`, 'i') },
        _id: { $ne: id },
      });

      if (existingLocation) {
        return next(new appError('Location name already exists', 400));
      }
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Location updated successfully',
      data: updatedLocation,
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

// Delete Location
export const deleteLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);

    if (!location) {
      return next(new appError('Location not found', 404));
    }

    await Location.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Location deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle Location Status
export const toggleLocationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);

    if (!location) {
      return next(new appError('Location not found', 404));
    }

    location.isActive = !location.isActive;
    await location.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Location ${
        location.isActive ? 'activated' : 'deactivated'
      } successfully`,
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

import { Job } from './openingsModel';
import {
  jobValidationSchema,
  jobItemValidationSchema,
} from './openingsValidation';

// Get Job Page (title, subtitle, jobs array)
export const getJobPage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let jobPage = await Job.findOne()
      .populate('jobs.department', 'name')
      .populate('jobs.location', 'name');

    if (!jobPage) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Default job page information',
        data: {
          title: 'Test Title',
          subtitle: 'Test Subtitle',
          jobs: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Job page retrieved successfully',
      data: jobPage,
    });
  } catch (error) {
    next(error);
  }
};

// Update Title and Subtitle
export const updateJobPageHeader = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, subtitle } = req.body;

    const headerSchema = z.object({
      title: z.string().max(200).trim().optional(),
      subtitle: z.string().max(500).trim().optional(),
    });

    const validatedData = headerSchema.parse({ title, subtitle });

    let jobPage = await Job.findOne();

    if (!jobPage) {
      jobPage = await Job.create({
        title: validatedData.title || 'Test Title',
        subtitle: validatedData.subtitle || 'Test Subtitle',
        jobs: [],
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Job page created successfully',
        data: jobPage,
      });
    }

    if (validatedData.title) jobPage.title = validatedData.title;
    if (validatedData.subtitle) jobPage.subtitle = validatedData.subtitle;

    await jobPage.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Job page header updated successfully',
      data: jobPage,
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

// Create Job Item (Add to jobs array)
export const createJobItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = jobItemValidationSchema.parse(req.body);

    // Check if department exists
    const departmentExists = await Department.findById(
      validatedData.department,
    );
    if (!departmentExists) {
      return next(new appError('Department not found', 404));
    }

    // Check if location exists
    const locationExists = await Location.findById(validatedData.location);
    if (!locationExists) {
      return next(new appError('Location not found', 404));
    }

    let jobPage = await Job.findOne();

    if (!jobPage) {
      jobPage = await Job.create({
        title: 'Test Title',
        subtitle: 'Test Subtitle',
        jobs: [validatedData],
      });
    } else {
      jobPage.jobs.push(validatedData as any);
      await jobPage.save();
    }

    await jobPage.populate('jobs.department jobs.location', 'name');

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Job item created successfully',
      data: jobPage,
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

// Get All Job Items (FIXED)
export const getAllJobItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let jobPage = await Job.findOne()
      .populate('jobs.department', 'name')
      .populate('jobs.location', 'name');

    if (!jobPage) {
      jobPage = await Job.create({
        title: 'Current Openings',
        subtitle:
          "We're currently looking to fill the following roles on our team.",
        jobs: [],
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Job items retrieved successfully',
      data: {
        title: jobPage.title,
        subtitle: jobPage.subtitle,
        jobs: jobPage.jobs || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update Job Item
export const updateJobItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { jobId } = req.params;
    const validatedData = jobItemValidationSchema.partial().parse(req.body);

    // Check if department exists (if provided)
    if (validatedData.department) {
      const departmentExists = await Department.findById(
        validatedData.department,
      );
      if (!departmentExists) {
        return next(new appError('Department not found', 404));
      }
    }

    // Check if location exists (if provided)
    if (validatedData.location) {
      const locationExists = await Location.findById(validatedData.location);
      if (!locationExists) {
        return next(new appError('Location not found', 404));
      }
    }

    const jobPage = await Job.findOne({ 'jobs._id': jobId });

    if (!jobPage) {
      return next(new appError('Job item not found', 404));
    }

    const jobItemIndex = jobPage.jobs.findIndex(
      (job: any) => job._id.toString() === jobId,
    );

    // Update the job item
    Object.assign(jobPage.jobs[jobItemIndex], validatedData);
    await jobPage.save();

    await jobPage.populate('jobs.department jobs.location', 'name');

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Job item updated successfully',
      data: jobPage.jobs[jobItemIndex],
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

// Delete Job Item
export const deleteJobItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { jobId } = req.params;

    const jobPage = await Job.findOne({ 'jobs._id': jobId });

    if (!jobPage) {
      return next(new appError('Job item not found', 404));
    }

    jobPage.jobs = jobPage.jobs.filter(
      (job: any) => job._id.toString() !== jobId,
    );

    await jobPage.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Job item deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Update Job Item Status
export const updateJobItemStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive', 'closed'].includes(status)) {
      return next(
        new appError(
          'Invalid status. Must be active, inactive, or closed',
          400,
        ),
      );
    }

    const jobPage = await Job.findOne({ 'jobs._id': jobId });

    if (!jobPage) {
      return next(new appError('Job item not found', 404));
    }

    const jobItemIndex = jobPage.jobs.findIndex(
      (job: any) => job._id.toString() === jobId,
    );

    jobPage.jobs[jobItemIndex].status = status;
    await jobPage.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Job item status updated to ${status} successfully`,
      data: jobPage.jobs[jobItemIndex],
    });
  } catch (error) {
    next(error);
  }
};
