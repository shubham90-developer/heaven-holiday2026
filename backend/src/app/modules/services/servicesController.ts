import { Request, Response, NextFunction } from 'express';
import MainModel from './servicesModel';
import {
  mainValidationSchema,
  updateValidationSchema,
  itemUpdateValidationSchema,
} from './servicesValidation';
import { cloudinary } from '../../config/cloudinary';

export const getAllMain = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let data = await MainModel.findOne().sort({ createdAt: -1 });

    if (!data) {
      data = await MainModel.create({
        title: 'default services title',
        subtitle: 'default subtitle',
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createMain = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedBody = {
      ...req.body,
      items: req.body.items ? JSON.parse(req.body.items) : [],
    };

    if (req.file && parsedBody.items && parsedBody.items.length > 0) {
      const result = await cloudinary.uploader.upload(req.file.path);

      const itemIndexWithoutIcon = parsedBody.items.findIndex(
        (item: any) => !item.icon || item.icon === '',
      );

      if (itemIndexWithoutIcon !== -1) {
        parsedBody.items[itemIndexWithoutIcon].icon = result.secure_url;
      }
    }

    const validatedData = mainValidationSchema.parse(parsedBody);

    const main = await MainModel.create(validatedData);

    res.status(201).json({
      success: true,
      message: 'Main created successfully',
      data: main,
    });
  } catch (error) {
    next(error);
  }
};

// Update only main fields (title, subtitle) - does NOT touch items array
export const updateMainFields = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Only allow title and subtitle updates
    const parsedBody: any = {};

    if (req.body.title !== undefined) {
      parsedBody.title = req.body.title;
    }

    if (req.body.subtitle !== undefined) {
      parsedBody.subtitle = req.body.subtitle;
    }

    // Validate only the fields being updated
    const validatedData = updateValidationSchema.parse(parsedBody);

    const main = await MainModel.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!main) {
      return res.status(404).json({
        success: false,
        message: 'Main not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Main fields updated successfully',
      data: main,
    });
  } catch (error) {
    next(error);
  }
};

// Update a specific item in the items array
export const updateMainItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, itemIndex } = req.params;

    const parsedBody: any = {
      ...req.body,
    };

    // Handle icon upload if file is present
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      parsedBody.icon = result.secure_url;
    }

    // Validate the item update
    const validatedItem = itemUpdateValidationSchema.parse(parsedBody);

    const main = await MainModel.findById(id);

    if (!main) {
      return res.status(404).json({
        success: false,
        message: 'Main not found',
      });
    }

    const index = parseInt(itemIndex);

    if (index < 0 || index >= main.items.length) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Preserve existing icon if not uploading new one
    if (!parsedBody.icon && main.items[index].icon) {
      validatedItem.icon = main.items[index].icon;
    }

    // Update specific item while preserving other fields
    main.items[index] = {
      ...main.items[index],
      ...validatedItem,
    };

    await main.save();

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: main,
    });
  } catch (error) {
    next(error);
  }
};

// Update entire items array (your original updateMain logic)
export const updateMainItemsArray = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const parsedBody = {
      items: req.body.items ? JSON.parse(req.body.items) : [],
    };

    // Only process icon upload if a file was sent
    if (req.file && parsedBody.items && parsedBody.items.length > 0) {
      const result = await cloudinary.uploader.upload(req.file.path);

      const itemIndexWithoutIcon = parsedBody.items.findIndex(
        (item: any) => !item.icon || item.icon === '',
      );

      if (itemIndexWithoutIcon !== -1) {
        parsedBody.items[itemIndexWithoutIcon].icon = result.secure_url;
      }
    } else {
      // If no new icon uploaded, preserve existing icons
      const existingMain = await MainModel.findById(id);
      if (existingMain && parsedBody.items) {
        parsedBody.items = parsedBody.items.map((item: any, index: number) => {
          // If icon is empty/missing, use existing icon from database
          if ((!item.icon || item.icon === '') && existingMain.items[index]) {
            return {
              ...item,
              icon: existingMain.items[index].icon,
            };
          }
          return item;
        });
      }
    }

    const validatedData = updateValidationSchema.parse(parsedBody);

    const main = await MainModel.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!main) {
      return res.status(404).json({
        success: false,
        message: 'Main not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Items array updated successfully',
      data: main,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMain = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const main = await MainModel.findById(id);

    if (!main) {
      return res.status(404).json({
        success: false,
        message: 'Main not found',
      });
    }

    await main.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Main deleted successfully',
      data: main,
    });
  } catch (error) {
    next(error);
  }
};
