import { NextFunction, Request, Response } from 'express';
import { OfferBanner } from './offer-banner.model';
import { offerBannerValidation } from './offer-banner.validation';

export const getOfferBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let offerBanners = await OfferBanner.find();

    if (!offerBanners) {
      return res.json({
        success: false,
        statusCode: 404,
        message: 'offer Banner not found',
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'offer banner retrieved successfully',
      data: offerBanners,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateOfferBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bannerId, link, status } = req.body;
    const imageUrl = req.file?.path;

    // Include status in validation
    const validatedData = offerBannerValidation.partial().parse({
      image: imageUrl,
      link,
      status,
    });

    // Build update fields
    const updateFields = {
      'banners.$.link': validatedData.link,
      'banners.$.status': validatedData.status,
      ...(validatedData.image && { 'banners.$.image': validatedData.image }),
    };

    const updatedHeroBanner = await OfferBanner.findOneAndUpdate(
      { 'banners._id': bannerId },
      { $set: updateFields },
      { new: true },
    );

    if (!updatedHeroBanner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: updatedHeroBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const createOfferBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: 'Image is required' });
    }

    const { link, status } = req.body;

    const validatedData = offerBannerValidation.parse({
      image: imageUrl,
      link,
      status: status || 'inactive',
    });

    let offerBanner = await OfferBanner.findOne();

    if (!offerBanner) {
      offerBanner = new OfferBanner({ banners: [validatedData] });
    } else {
      offerBanner.banners.push(validatedData);
    }

    await offerBanner.save();

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: offerBanner,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteOfferBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;

    const result = await OfferBanner.findOneAndUpdate(
      { 'banners._id': id },
      { $pull: { banners: { _id: id } } },
      { new: true },
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
