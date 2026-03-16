// controllers/holidaySection.controller.ts
import { Request, Response } from 'express';
import { HolidaySection } from './holidayModel';
import { holidaySectionValidation } from './holidayValidation';
import { z } from 'zod';

// ================= GET HOLIDAY SECTION =================
export const getHolidaySection = async (req: Request, res: Response) => {
  try {
    let document = await HolidaySection.findOne();

    // If no document exists, create one with test values and empty array
    if (!document) {
      document = new HolidaySection({
        heading: 'Test Heading',
        subheading: 'Test Subheading',
        features: [],
        status: 'inactive',
      });
      await document.save();

      return res.json({
        success: true,
        statusCode: 200,
        message: 'Default holiday section created and retrieved',
        data: document,
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Holiday section retrieved successfully',
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching holiday section',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= UPDATE MAIN FIELDS (ADMIN ONLY) =================
export const updateMainFields = async (req: Request, res: Response) => {
  try {
    const { heading, subheading, status } = req.body;

    // Find existing document
    let document = await HolidaySection.findOne();

    // If no document exists, create one
    if (!document) {
      document = new HolidaySection({
        heading: heading || 'Test Heading',
        subheading: subheading || 'Test Subheading',
        features: [],
        status: status || 'inactive',
      });
      await document.save();

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Holiday section created successfully',
        data: document,
      });
    }

    // Update main fields only
    if (heading !== undefined) document.heading = heading;
    if (subheading !== undefined) document.subheading = subheading;
    if (status !== undefined) document.status = status;

    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Main fields updated successfully',
      data: document,
    });
  } catch (error) {
    console.error('Update main fields error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating main fields',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= ADD FEATURE (ADMIN ONLY) =================
export const addFeature = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
      });
    }

    // Find existing document
    let document = await HolidaySection.findOne();

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Holiday section not found. Please create main fields first.',
      });
    }

    // Check max features limit
    if (document.features.length >= 8) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 8 features allowed',
      });
    }

    // Add new feature
    document.features.push({
      title: title.trim(),
      description: description.trim(),
    });

    await document.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Feature added successfully',
      data: document,
    });
  } catch (error) {
    console.error('Add feature error:', error);

    res.status(500).json({
      success: false,
      message: 'Error adding feature',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= UPDATE FEATURE (ADMIN ONLY) =================
export const updateFeature = async (req: Request, res: Response) => {
  try {
    const { featureId } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
      });
    }

    // Find existing document
    let document = await HolidaySection.findOne();

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Holiday section not found',
      });
    }

    // Find feature by _id
    const feature = document.features.id(featureId);

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }

    // Update feature
    feature.title = title.trim();
    feature.description = description.trim();

    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Feature updated successfully',
      data: document,
    });
  } catch (error) {
    console.error('Update feature error:', error);

    res.status(500).json({
      success: false,
      message: 'Error updating feature',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= DELETE FEATURE (ADMIN ONLY) =================
export const deleteFeature = async (req: Request, res: Response) => {
  try {
    const { featureId } = req.params;

    // Find existing document
    let document = await HolidaySection.findOne();

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Holiday section not found',
      });
    }

    // Check minimum features requirement
    if (document.features.length <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete. At least 1 feature is required',
      });
    }

    // Find and remove feature
    const feature = document.features.id(featureId);

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }

    feature.deleteOne();
    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Feature deleted successfully',
      data: document,
    });
  } catch (error) {
    console.error('Delete feature error:', error);

    res.status(500).json({
      success: false,
      message: 'Error deleting feature',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= LEGACY: UPDATE HOLIDAY SECTION (ADMIN ONLY) =================
// Keep this for backward compatibility
export const updateHolidaySection = async (req: Request, res: Response) => {
  try {
    const { heading, subheading, features, status } = req.body;

    // Find existing document
    let document = await HolidaySection.findOne();

    // Parse features if it's a string
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid features format',
        });
      }
    }

    // If no document exists, create one with test values
    if (!document) {
      const validatedData = holidaySectionValidation.parse({
        heading: heading || 'Test Heading',
        subheading: subheading || 'Test Subheading',
        features: parsedFeatures || [],
        status: status || 'inactive',
      });

      document = new HolidaySection(validatedData);
      await document.save();

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Holiday section created successfully',
        data: document,
      });
    }

    // Prepare update data
    const updateData: any = {};

    if (heading !== undefined) updateData.heading = heading;
    if (subheading !== undefined) updateData.subheading = subheading;
    if (parsedFeatures !== undefined) updateData.features = parsedFeatures;
    if (status !== undefined) updateData.status = status;

    // Validate update data
    const validatedData = holidaySectionValidation.parse(updateData);

    // Update existing document
    if (validatedData.heading !== undefined)
      document.heading = validatedData.heading;
    if (validatedData.subheading !== undefined)
      document.subheading = validatedData.subheading;
    if (validatedData.features !== undefined && validatedData.features) {
      // Clear existing features and add new ones
      document.features.splice(0, document.features.length);
      validatedData.features.forEach((feature: any) => {
        document.features.push(feature);
      });
    }
    if (validatedData.status !== undefined)
      document.status = validatedData.status;

    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Holiday section updated successfully',
      data: document,
    });
  } catch (error) {
    console.error('Update holiday section error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating holiday section',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
