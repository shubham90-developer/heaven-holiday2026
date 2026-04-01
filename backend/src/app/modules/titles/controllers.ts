import { Request, Response, NextFunction } from 'express';
import { PageTitles } from './model';
import {
  pageTitlesValidationSchema,
  pageTitlesUpdateValidationSchema,
} from './validation';

const DEFAULT_PAGE_TITLES = {
  offersTitle: 'Our Special Offers',
  offersSubtitle: 'Discover our exclusive deals and discounts',
  servicesTitle: 'Our Services',
  worldTitle: 'World Tours',
  indiaTitle: 'India Tours',
  blogsTitle: 'Latest Blogs',
  podcastTitle: 'Our Podcasts',
};

export const getPageTitles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let data = await PageTitles.findOne().sort({ createdAt: -1 });

    if (!data) {
      data = await PageTitles.create(DEFAULT_PAGE_TITLES);
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePageTitles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = pageTitlesUpdateValidationSchema.parse(req.body);

    let data = await PageTitles.findOne().sort({ createdAt: -1 });

    if (!data) {
      // If no document exists, create with defaults merged with provided data
      const merged = { ...DEFAULT_PAGE_TITLES, ...validatedData };
      const fullValidated = pageTitlesValidationSchema.parse(merged);
      data = await PageTitles.create(fullValidated);
    } else {
      data = await PageTitles.findByIdAndUpdate(data._id, validatedData, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Page titles updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
