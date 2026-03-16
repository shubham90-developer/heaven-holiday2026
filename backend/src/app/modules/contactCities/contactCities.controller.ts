import { Request, Response, NextFunction } from 'express';
import { City } from './contactCities.model';
import { ICity } from './contactCities.interface';
import { cloudinary } from '../../config/cloudinary';

export const getCities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cities = await City.find();
    res.json({
      success: true,
      statusCode: 200,
      message: 'Cities retrieved successfully',
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

export const createCity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body: Partial<ICity> = req.body;
    const iconFile = req.file;
    if (!iconFile)
      return res
        .status(400)
        .json({ success: false, message: 'Icon is required' });
    const uploadResult = await cloudinary.uploader.upload(iconFile.path, {
      folder: 'cities',
    });
    body.icon = uploadResult.secure_url;
    const city = await City.create(body);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'City created successfully',
      data: city,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const body: Partial<ICity> = req.body;
    const city = await City.findById(id);
    if (!city)
      return res
        .status(404)
        .json({ success: false, message: 'City not found' });
    const iconFile = req.file;
    if (iconFile) {
      const uploadResult = await cloudinary.uploader.upload(iconFile.path, {
        folder: 'cities',
      });
      if (city.icon) {
        const publicId = city.icon.split('/').pop()?.split('.')[0];
        if (publicId) await cloudinary.uploader.destroy(`cities/${publicId}`);
      }
      body.icon = uploadResult.secure_url;
    }
    const updatedCity = await City.findByIdAndUpdate(id, body, { new: true });
    res.json({
      success: true,
      statusCode: 200,
      message: 'City updated successfully',
      data: updatedCity,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const city = await City.findById(id);
    if (!city)
      return res
        .status(404)
        .json({ success: false, message: 'City not found' });
    if (city.icon) {
      const publicId = city.icon.split('/').pop()?.split('.')[0];
      if (publicId) await cloudinary.uploader.destroy(`cities/${publicId}`);
    }
    await City.findByIdAndDelete(id);
    res.json({
      success: true,
      statusCode: 200,
      message: 'City deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
