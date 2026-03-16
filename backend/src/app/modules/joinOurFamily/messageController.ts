// controllers/contentController.ts
import { NextFunction, Request, Response } from 'express';
import Content from './messageModel';
import { contentSchema, ContentValidation } from './messageValidation';

// GET - Fetch content (single document)
export const getContent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let content = await Content.findOne();

    if (!content) {
      return res.json({
        success: true,
        statusCode: 200,
        message: 'No content found',
        data: {
          title: '',
          subtitle: '',
          description: '',
          button: { text: 'Join Our Family', link: '#' },
        },
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Content retrieved successfully',
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updateData = req.body;

    const validatedData = contentSchema.partial().parse(updateData);

    // Find existing content
    let content = await Content.findOne();

    if (!content) {
      // Create new content if doesn't exist
      content = new Content({
        title: validatedData.title || '',
        subtitle: validatedData.subtitle || '',
        description: validatedData.description || '',
        button: validatedData.button || { text: 'Join Our Family', link: '#' },
      });
    } else {
      // Update only provided fields
      if (validatedData.title !== undefined) {
        content.title = validatedData.title;
      }
      if (validatedData.subtitle !== undefined) {
        content.subtitle = validatedData.subtitle;
      }
      if (validatedData.description !== undefined) {
        content.description = validatedData.description;
      }
      if (validatedData.button !== undefined) {
        // If button is provided, merge with existing or set new
        content.button = {
          text:
            validatedData.button.text ||
            content.button?.text ||
            'Join Our Family',
          link: validatedData.button.link || content.button?.link || '#',
        };
      }
    }

    await content.save();

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content,
    });
  } catch (error) {
    next(error);
  }
};
