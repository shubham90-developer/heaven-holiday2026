import { NextFunction, Request, Response } from 'express';
import VideoBlog, { Category } from './videoBlogModel';
import {
  videoBlogSchema,
  videoBlogUpdateSchema,
  categorySchema,
} from './videoBlogValidation';

// ========== VIDEO BLOG CRUD ==========

// 1. GET ALL VIDEO BLOGS
export const getAllVideoBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const videoBlogs = await VideoBlog.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      statusCode: 200,
      message: 'Video blogs retrieved successfully',
      data: videoBlogs,
    });
  } catch (error) {
    next(error);
  }
};

// 2. CREATE VIDEO BLOG
export const createVideoBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = videoBlogSchema.parse(req.body);

    const videoBlog = new VideoBlog(validatedData);
    await videoBlog.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Video blog created successfully',
      data: videoBlog,
    });
  } catch (error) {
    next(error);
  }
};

// 3. UPDATE VIDEO BLOG
export const updateVideoBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const validatedData = videoBlogUpdateSchema.parse(req.body);

    const videoBlog = await VideoBlog.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!videoBlog) {
      return res.status(404).json({
        success: false,
        message: 'Video blog not found',
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Video blog updated successfully',
      data: videoBlog,
    });
  } catch (error) {
    next(error);
  }
};

// 4. DELETE VIDEO BLOG
export const deleteVideoBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const videoBlog = await VideoBlog.findByIdAndDelete(id);

    if (!videoBlog) {
      return res.status(404).json({
        success: false,
        message: 'Video blog not found',
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Video blog deleted successfully',
      data: videoBlog,
    });
  } catch (error) {
    next(error);
  }
};

// ========== CATEGORY MANAGEMENT (Single Document) ==========

// 5. GET ALL CATEGORIES
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let categoryDoc = await Category.findOne();

    // If no category document exists, create one with empty array
    if (!categoryDoc) {
      categoryDoc = new Category({ categories: [] });
      await categoryDoc.save();
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Categories retrieved successfully',
      data: categoryDoc.categories,
    });
  } catch (error) {
    next(error);
  }
};

// 6. ADD CATEGORY
export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = categorySchema.parse(req.body);

    let categoryDoc = await Category.findOne();

    if (!categoryDoc) {
      categoryDoc = new Category({ categories: [] });
    }

    // Check if category name already exists
    const exists = categoryDoc.categories.some(
      (cat) => cat.name.toLowerCase() === validatedData.name.toLowerCase(),
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists',
      });
    }

    categoryDoc.categories.push({
      name: validatedData.name,
      status: validatedData.status || 'active',
    });

    await categoryDoc.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Category added successfully',
      data: categoryDoc.categories,
    });
  } catch (error) {
    next(error);
  }
};

// 7. UPDATE CATEGORY
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const { name, status } = req.body;

    if (!name && !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name or status to update',
      });
    }

    const categoryDoc = await Category.findOne();

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: 'Category document not found',
      });
    }

    // Find category by _id in the array
    const categoryItem = categoryDoc.categories.find(
      (cat) => cat._id?.toString() === categoryId,
    );

    if (!categoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if new name already exists (excluding current category)
    if (name) {
      const exists = categoryDoc.categories.some(
        (cat) =>
          cat._id?.toString() !== categoryId &&
          cat.name.toLowerCase() === name.toLowerCase(),
      );

      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists',
        });
      }

      categoryItem.name = name;
    }

    if (status) {
      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be active or inactive',
        });
      }
      categoryItem.status = status;
    }

    await categoryDoc.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Category updated successfully',
      data: categoryDoc.categories,
    });
  } catch (error) {
    next(error);
  }
};

// 8. DELETE CATEGORY
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;

    const categoryDoc = await Category.findOneAndUpdate(
      { 'categories._id': categoryId },
      { $pull: { categories: { _id: categoryId } } },
      { new: true },
    );

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Category deleted successfully',
      data: categoryDoc.categories,
    });
  } catch (error) {
    next(error);
  }
};
