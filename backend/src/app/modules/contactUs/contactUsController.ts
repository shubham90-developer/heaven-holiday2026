import { Request, Response } from 'express';
import { z } from 'zod';
import { contactDetailsZodSchema } from './contactUsValidation';
import { ContactUs } from './contactUsModel';

import { appError } from '../../errors/appError';
import { cloudinary } from '../../config/cloudinary'; // optional if you use images/videos

// GET Contact Details
export const getContactDetails = async (req: Request, res: Response) => {
  try {
    let contactDetails = await ContactUs.findOne();

    if (!contactDetails) {
      contactDetails = await ContactUs.create({
        offices: {
          title: 'Our Offices',
          description: '',
          mapLink: '',
        },
        callUs: {
          title: 'Call Us',
          phoneNumbers: [],
        },
        writeToUs: {
          title: 'Write to Us',
          emails: [],
        },
        socialLinks: {
          facebook: '',
          youtube: '',
          linkedin: '',
          instagram: '',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: contactDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact details',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
// UPDATE Contact Details (PUT)
export const updateContactDetails = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = contactDetailsZodSchema.parse(req.body);

    let contactDetails = await ContactUs.findOne();

    if (!contactDetails) {
      // Create new document if it doesn't exist
      contactDetails = await ContactUs.create(validatedData);

      return res.status(201).json({
        success: true,
        message: 'Contact details created successfully',
        data: contactDetails,
      });
    }

    // Merge updates
    contactDetails.offices = {
      ...contactDetails.offices,
      ...validatedData.offices,
    };
    contactDetails.callUs = {
      ...contactDetails.callUs,
      ...validatedData.callUs,
    };
    contactDetails.writeToUs = {
      ...contactDetails.writeToUs,
      ...validatedData.writeToUs,
    };
    contactDetails.socialLinks = {
      ...contactDetails.socialLinks,
      ...validatedData.socialLinks,
    };

    await contactDetails.save();

    res.status(200).json({
      success: true,
      message: 'Contact details updated successfully',
      data: contactDetails,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saving contact details',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// PATCH partial update (optional)
export const patchContactDetails = async (req: Request, res: Response) => {
  try {
    // Allow partial updates
    const contactPatchSchema = contactDetailsZodSchema.partial();
    const validatedData = contactPatchSchema.parse(req.body);

    let contactDetails = await ContactUs.findOne();

    if (!contactDetails) {
      contactDetails = await ContactUs.create(validatedData);
      return res.status(201).json({
        success: true,
        message: 'Contact details created successfully',
        data: contactDetails,
      });
    }

    // Merge only provided fields
    contactDetails.set(validatedData);
    await contactDetails.save();

    res.status(200).json({
      success: true,
      message: 'Contact details updated successfully',
      data: contactDetails,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saving contact details',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
