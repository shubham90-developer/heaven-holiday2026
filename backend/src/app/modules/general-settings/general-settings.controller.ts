// settings.controller.ts

import { NextFunction, Request, Response } from 'express';
import { GeneralSettings } from './general-settings.model';
import { settingsUpdateValidation } from './general-settings.validation';
import { appError } from '../../errors/appError';
import { cloudinary } from '../../config/cloudinary';

const DUMMY_DEFAULTS = {
  companyName: 'Heaven Holiday',
  companyLogo: '',
  paymentGateways: '',
  favicon: '',
  copyrightText: '© 2025 Heaven Holiday. All rights reserved.',
  tollFree1: '1800 22 7979',
  tollFree2: '1800 313 5555',
  callUs1: '+91 22 2101 7979',
  callUs2: '+91 22 2101 6969',
  nriWithinIndia: '+91 915 200 4511',
  nriOutsideIndia: '+91 887 997 2221',
  supportEmail: 'travel@heavenholiday.com',
  businessHoursFrom: '10:00',
  businessHoursTo: '19:00',
  cautionEnabled: false,
  cautionText: '',
  travelPlannerEnabled: true,
  travelPlannerLabel: 'Plan My Trip',
  travelPlannerLink: '/plan-trip',
};

const destroyCloudinaryImage = async (url: string, folder: string) => {
  try {
    const fileName = url.split('/').pop()?.split('.')[0];
    if (fileName) await cloudinary.uploader.destroy(`${folder}/${fileName}`);
  } catch {
    // non-blocking — log but don't throw
    console.error('Cloudinary destroy failed for:', url);
  }
};

export const getSettings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let settings = await GeneralSettings.findOne();

    // No document yet → seed with dummy defaults
    if (!settings) {
      settings = await GeneralSettings.create(DUMMY_DEFAULTS);
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Settings retrieved successfully',
      data: settings,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uploadedUrls: { url: string; folder: string }[] = [];

  try {
    let settings = await GeneralSettings.findOne();
    if (!settings) {
      settings = await GeneralSettings.create(DUMMY_DEFAULTS);
    }

    const rawUpdate: Record<string, any> = { ...req.body };

    if (rawUpdate.cautionEnabled !== undefined) {
      rawUpdate.cautionEnabled =
        rawUpdate.cautionEnabled === 'true' ||
        rawUpdate.cautionEnabled === true;
    }
    if (rawUpdate.travelPlannerEnabled !== undefined) {
      rawUpdate.travelPlannerEnabled =
        rawUpdate.travelPlannerEnabled === 'true' ||
        rawUpdate.travelPlannerEnabled === true;
    }

    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    if (files?.companyLogo?.[0]) {
      const newUrl = files.companyLogo[0].path;
      uploadedUrls.push({ url: newUrl, folder: 'settings-logo' });

      if (settings.companyLogo) {
        await destroyCloudinaryImage(settings.companyLogo, 'settings-logo');
      }
      rawUpdate.companyLogo = newUrl;
    }
    if (files?.paymentGateways?.[0]) {
      const newUrl = files.paymentGateways[0].path;
      uploadedUrls.push({ url: newUrl, folder: 'settings-logo' });

      if (settings.paymentGateways) {
        await destroyCloudinaryImage(settings.paymentGateways, 'settings-logo');
      }
      rawUpdate.paymentGateways = newUrl;
    }

    if (files?.favicon?.[0]) {
      const newUrl = files.favicon[0].path;
      uploadedUrls.push({ url: newUrl, folder: 'settings-favicon' });

      if (settings.favicon) {
        await destroyCloudinaryImage(settings.favicon, 'settings-favicon');
      }
      rawUpdate.favicon = newUrl;
    }

    if (Object.keys(rawUpdate).length === 0) {
      res.json({
        success: true,
        statusCode: 200,
        message: 'No changes to update',
        data: settings,
      });
      return;
    }

    const validatedData = settingsUpdateValidation.parse(rawUpdate);

    const updated = await GeneralSettings.findOneAndUpdate(
      {},
      { $set: validatedData },
      { new: true, upsert: true, runValidators: true },
    );

    res.json({
      success: true,
      statusCode: 200,
      message: 'Settings updated successfully',
      data: updated,
    });
    return;
  } catch (error) {
    for (const { url, folder } of uploadedUrls) {
      await destroyCloudinaryImage(url, folder);
    }
    next(error);
  }
};
