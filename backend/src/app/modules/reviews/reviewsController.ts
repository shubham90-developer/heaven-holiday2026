import { NextFunction, Request, Response } from 'express';
import { TourReview } from './reviewsModel';
import { tourReviewSchema } from './reviewsValidation';

export const getTourReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let doc = await TourReview.findOne();
    if (!doc) {
      doc = await TourReview.create({
        mainTitle: 'default title',
        mainSubtitle: 'default subtitle',
        reviews: [],
        isActive: true,
      });
    }

    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const updateMainFields = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = tourReviewSchema
      .pick({ mainTitle: true, mainSubtitle: true })
      .parse(req.body);

    const doc = await TourReview.findOneAndUpdate(
      {},
      { $set: validated },
      { new: true, runValidators: true },
    );

    if (!doc)
      return res.status(404).json({
        success: false,
        message: 'Tour review not found',
      });

    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviewSchema = tourReviewSchema.shape.reviews.element;
    const validated = reviewSchema.parse(req.body);

    const doc = await TourReview.findOneAndUpdate(
      {},
      { $push: { reviews: validated } },
      { new: true, runValidators: true },
    );

    if (!doc)
      return res.status(404).json({
        success: false,
        message: 'Tour review not found',
      });

    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const reviewSchema = tourReviewSchema.shape.reviews.element;
    const validated = reviewSchema.partial().parse(req.body);

    const updateFields = Object.fromEntries(
      Object.entries(validated).map(([k, v]) => [`reviews.$.${k}`, v]),
    );

    const doc = await TourReview.findOneAndUpdate(
      { 'reviews._id': id },
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!doc)
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });

    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const doc = await TourReview.findOneAndUpdate(
      {},
      { $pull: { reviews: { _id: id } } },
      { new: true },
    );

    if (!doc)
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });

    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};
