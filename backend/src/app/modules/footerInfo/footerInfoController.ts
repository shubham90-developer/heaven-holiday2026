import { NextFunction, Request, Response } from 'express';
import { FooterInfo } from './footerInfoModel';
import { footerInfoSchema } from './footerInfoValidation';
import { appError } from '../../errors/appError';

// GET single FooterInfo
export const getFooterInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let doc = await FooterInfo.findOne({ isActive: true });
    if (!doc) {
      doc = await FooterInfo.create({
        title: 'title',
        description: 'description',
        isActive: true,
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Footer info retrieved successfully',
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE FooterInfo (single document)
export const updateFooterInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = footerInfoSchema.parse(req.body);

    const updated = await FooterInfo.findOneAndUpdate(
      { isActive: true },
      payload,
      { new: true },
    );

    if (!updated) return next(new appError('Footer info not found', 404));

    res.json({
      success: true,
      statusCode: 200,
      message: 'Footer info updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
