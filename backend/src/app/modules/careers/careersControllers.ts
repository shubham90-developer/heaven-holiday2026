// careers.controller.ts
import { NextFunction, Request, Response } from 'express';
import Careers from './careersModel';
import { careersValidationSchema } from './careersValidation';

export const getCareers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const careers = await Careers.findOne();

    // If no document exists, return default values (not from DB)
    if (!careers) {
      const defaultCareers = {
        title: 'Welcome to our World!',
        description:
          'Come join our team at Heaven Holiday to experience an exciting workplace culture, fantastic colleagues, and a people-first community that empowers you to grow.',
        buttonText: 'View current openings',
        buttonLink: '/careers',
        videoThumbnail: '/assets/img/about/1.avif',
        videoUrl:
          'https://www.youtube.com/embed/5acM-mzLTaU?si=YUw-L4EWkRHsn9ar',
      };

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Default careers information (no document exists in database)',
        data: defaultCareers,
      });
    }

    // If document exists, return actual data from DB
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Careers information retrieved successfully',
      data: careers,
    });
  } catch (error) {
    next(error);
  }
};

// Update careers info - creates document if doesn't exist, updates if exists
export const updateCareers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, buttonText, buttonLink } = req.body;

    // Extract files from upload.fields()
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const videoUrl = files?.video ? files.video[0].path : undefined;
    const thumbnailUrl = files?.thumbnail ? files.thumbnail[0].path : undefined;

    // Find existing careers document
    const careers = await Careers.findOne();

    // Prepare update data
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (buttonText !== undefined) updateData.buttonText = buttonText;
    if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
    if (thumbnailUrl !== undefined) updateData.videoThumbnail = thumbnailUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

    // If no changes provided
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'No data provided to update',
        data: null,
      });
    }

    // Validate the update data with existing or default values
    const validatedData = careersValidationSchema.parse({
      title: updateData.title || careers?.title || 'Welcome to our World!',
      description:
        updateData.description ||
        careers?.description ||
        'Come join our team at Heaven Holiday to experience an exciting workplace culture, fantastic colleagues, and a people-first community that empowers you to grow.',
      buttonText:
        updateData.buttonText || careers?.buttonText || 'View current openings',
      buttonLink: updateData.buttonLink || careers?.buttonLink || '/careers',
      videoThumbnail:
        updateData.videoThumbnail ||
        careers?.videoThumbnail ||
        '/assets/img/about/1.avif',
      videoUrl:
        updateData.videoUrl ||
        careers?.videoUrl ||
        'https://www.youtube.com/embed/5acM-mzLTaU?si=YUw-L4EWkRHsn9ar',
    });

    // Update existing or create new document
    const updatedCareers = await Careers.findOneAndUpdate({}, validatedData, {
      new: true,
      upsert: true, // Create if doesn't exist
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: careers
        ? 'Careers information updated successfully'
        : 'Careers information created successfully',
      data: updatedCareers,
    });
  } catch (error) {
    console.error('=== ERROR IN UPDATE CAREERS ===');
    console.error('Error:', error);
    next(error);
  }
};
