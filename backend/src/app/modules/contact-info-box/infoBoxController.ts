// controllers/contactfeatures.controller.ts
import { Request, Response } from 'express';
import { ContactFeatures } from './infoBoxModel';
import {
  createContactFeaturesSchema,
  createFeatureSchema,
  updateFeatureSchema,
  deleteFeatureSchema,
  updateHighlightSchema,
} from './infoBoxValidation';

import { z } from 'zod';

// ================= GET CONTACT FEATURES =================
export const getContactFeatures = async (req: Request, res: Response) => {
  try {
    let document = await ContactFeatures.findOne();

    if (!document) {
      const newDoc = await ContactFeatures.create({
        features: [],
        highlight: {
          message: 'test',
          happyTravellers: '0',
          successfulTours: '0',
        },
      });
      return res.status(200).json({
        success: true,
        data: {
          newDoc,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact features',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= CREATE CONTACT FEATURES DOCUMENT =================
export const createContactFeatures = async (req: Request, res: Response) => {
  try {
    const validated = createContactFeaturesSchema.parse({
      body: req.body,
    });

    const { message, happyTravellers, successfulTours } = validated.body;

    // Check if document already exists
    let document = await ContactFeatures.findOne();

    if (document) {
      return res.status(400).json({
        success: false,
        message:
          'Contact features document already exists. Use update instead.',
      });
    }

    // Create new document
    document = await ContactFeatures.create({
      features: [],
      highlight: {
        message,
        happyTravellers,
        successfulTours,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Contact features created successfully',
      data: document,
    });
  } catch (error) {
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
      message: 'Error creating contact features',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= CREATE FEATURE =================
export const createFeature = async (req: Request, res: Response) => {
  try {
    const validated = createFeatureSchema.parse({
      body: req.body,
    });

    const { title, description, isActive = true } = validated.body;

    let document = await ContactFeatures.findOne();

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Contact features document not found. Please create it first.',
      });
    }

    // Add new feature
    document.features.push({ title, description, isActive } as any);
    await document.save();

    const newFeature = document.features[document.features.length - 1];

    res.status(201).json({
      success: true,
      message: 'Feature created successfully',
      data: newFeature,
    });
  } catch (error) {
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
      message: 'Error creating feature',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= UPDATE FEATURE =================
export const updateFeature = async (req: Request, res: Response) => {
  try {
    const validated = updateFeatureSchema.parse({
      params: req.params,
      body: req.body,
    });

    const { featureId } = validated.params;
    const updateData = validated.body;

    let document = await ContactFeatures.findOne();

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Contact features document not found',
      });
    }

    const featureIndex = document.features.findIndex(
      (feature: any) => feature._id.toString() === featureId,
    );

    if (featureIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }

    // Update feature fields
    if (updateData.title !== undefined) {
      document.features[featureIndex].title = updateData.title;
    }

    if (updateData.description !== undefined) {
      document.features[featureIndex].description = updateData.description;
    }

    if (updateData.isActive !== undefined) {
      document.features[featureIndex].isActive = updateData.isActive;
    }

    await document.save();

    res.status(200).json({
      success: true,
      message: 'Feature updated successfully',
      data: document.features[featureIndex],
    });
  } catch (error) {
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
      message: 'Error updating feature',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= DELETE FEATURE =================
export const deleteFeature = async (req: Request, res: Response) => {
  try {
    const validated = deleteFeatureSchema.parse({
      params: req.params,
    });

    const { featureId } = validated.params;

    let document = await ContactFeatures.findOne();

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Contact features document not found',
      });
    }

    const featureIndex = document.features.findIndex(
      (feature: any) => feature._id.toString() === featureId,
    );

    if (featureIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }

    // Remove feature
    document.features.splice(featureIndex, 1);
    await document.save();

    res.status(200).json({
      success: true,
      message: 'Feature deleted successfully',
    });
  } catch (error) {
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
      message: 'Error deleting feature',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================= UPDATE HIGHLIGHT =================
export const updateHighlight = async (req: Request, res: Response) => {
  try {
    const validated = updateHighlightSchema.parse({
      body: req.body,
    });

    const updateData = validated.body;

    let document = await ContactFeatures.findOne();

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Contact features document not found',
      });
    }

    // Update highlight fields
    if (updateData.message !== undefined) {
      document.highlight.message = updateData.message;
    }

    if (updateData.happyTravellers !== undefined) {
      document.highlight.happyTravellers = updateData.happyTravellers;
    }

    if (updateData.successfulTours !== undefined) {
      document.highlight.successfulTours = updateData.successfulTours;
    }

    await document.save();

    res.status(200).json({
      success: true,
      message: 'Highlight updated successfully',
      data: document,
    });
  } catch (error) {
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
      message: 'Error updating highlight',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
