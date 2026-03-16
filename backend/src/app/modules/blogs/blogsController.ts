// controllers/blog.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Category, BlogPost } from './blogsModel';
import { BlogPostSchema } from './blogsValidation';
import { appError } from '../../errors/appError';
import { cloudinary } from '../../config/cloudinary';
import { CategorySchema } from './blogsValidation';
import z, { success } from 'zod';

export const getWholeDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const blogs = await BlogPost.find()
      .populate('category', 'name slug')
      .sort({ date: -1 });

    res.json({
      success: true,
      statusCode: 200,
      message:
        blogs.length > 0
          ? 'All blog posts retrieved successfully'
          : 'No blogs available',
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, date, readTime, tags, category, content, status } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      next(new appError('Category not found', 404));
      return;
    }

    // Validate hero image
    if (!files?.hero?.[0]) {
      next(new appError('Hero image is required', 400));
      return;
    }

    const heroImage = files.hero[0].path;

    const validated = BlogPostSchema.parse({
      title,
      date: Number(date),
      readTime,
      hero: heroImage,
      tags: JSON.parse(tags),
      category,
      content,
      status,
    });

    const blog = new BlogPost(validated);
    await blog.save();
    await blog.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Blog post created successfully',
      data: blog,
    });
    return;
  } catch (error) {
    // Clean up uploaded file on error
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files?.hero?.[0]?.path) {
      const publicId = files.hero[0].path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`blog/hero/${publicId}`);
      }
    }
    next(error);
  }
};

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, date, readTime, tags, category, content, status } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const blog = await BlogPost.findById(id);
    if (!blog) {
      next(new appError('Blog post not found', 404));
      return;
    }

    // Check if category exists (if being updated)
    if (category && category !== blog.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        next(new appError('Category not found', 404));
        return;
      }
    }

    const updateData: any = {
      title: title || blog.title,
      date: date ? Number(date) : blog.date,
      readTime: readTime || blog.readTime,
      tags: tags ? JSON.parse(tags) : blog.tags,
      category: category || blog.category,
      content: content || blog.content,
      status: status || blog.status,
    };

    // Update hero image if provided
    if (files?.hero?.[0]) {
      const oldHeroPublicId = blog.hero.split('/').pop()?.split('.')[0];
      if (oldHeroPublicId) {
        await cloudinary.uploader.destroy(`blog/hero/${oldHeroPublicId}`);
      }
      updateData.hero = files.hero[0].path;
    } else {
      updateData.hero = blog.hero;
    }

    const validated = BlogPostSchema.partial().parse(updateData);
    const updated = await BlogPost.findByIdAndUpdate(id, validated, {
      new: true,
    }).populate('category', 'name slug');

    res.json({
      success: true,
      statusCode: 200,
      message: 'Blog post updated successfully',
      data: updated,
    });
    return;
  } catch (error) {
    // Clean up uploaded file on error
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files?.hero?.[0]?.path) {
      const publicId = files.hero[0].path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`blog/hero/${publicId}`);
      }
    }
    next(error);
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const blog = await BlogPost.findById(id);
    if (!blog) {
      next(new appError('Blog post not found', 404));
      return;
    }

    await BlogPost.findByIdAndDelete(id);

    res.json({
      success: true,
      statusCode: 200,
      message: 'Blog post deleted successfully',
      data: null,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let categories = await Category.find().sort({ name: 1 });

    // If no categories exist, create test data
    if (categories.length === 0) {
      const testCategories = [
        { name: 'Travel', slug: 'travel' },
        { name: 'Food & Cuisine', slug: 'food-cuisine' },
        { name: 'Culture', slug: 'culture' },
      ];
      await Category.insertMany(testCategories);
      categories = await Category.find().sort({ name: 1 });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Categories retrieved successfully',
      data: categories,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = CategorySchema.parse(req.body);

    // Check if category already exists
    const existingCategory = await Category.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${validatedData.name}$`, 'i') } },
        { slug: validatedData.slug },
      ],
    });

    if (existingCategory) {
      next(new appError('Category name or slug already exists', 400));
      return;
    }

    const category = await Category.create(validatedData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Category created successfully',
      data: category,
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.message,
      });
    }
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const validatedData = CategorySchema.partial().parse(req.body);

    const category = await Category.findById(id);

    if (!category) {
      next(new appError('Category not found', 404));
      return;
    }

    // Check if new name or slug already exists
    if (validatedData.name || validatedData.slug) {
      const existingCategory = await Category.findOne({
        $or: [
          validatedData.name
            ? { name: { $regex: new RegExp(`^${validatedData.name}$`, 'i') } }
            : {},
          validatedData.slug ? { slug: validatedData.slug } : {},
        ],
        _id: { $ne: id },
      });

      if (existingCategory) {
        next(new appError('Category name or slug already exists', 400));
        return;
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.message,
      });
    }
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      next(new appError('Category not found', 404));
      return;
    }

    // Delete all blogs in this category
    const blogsCount = await BlogPost.countDocuments({ category: id });
    await BlogPost.deleteMany({ category: id });

    // Delete the category
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Category deleted successfully. ${blogsCount} associated blog(s) also deleted.`,
      data: null,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check if user is logged in
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      next(new appError('Please login to post a comment', 401));
      return;
    }

    const { id } = req.params; // blog post id
    const { commentBody } = req.body;

    // Validate comment body
    if (!commentBody || commentBody.trim() === '') {
      next(new appError('Comment body is required', 400));
      return;
    }

    // Check if blog exists
    const blog = await BlogPost.findById(id);
    if (!blog) {
      next(new appError('Blog post not found', 404));
      return;
    }

    // Add comment
    blog.comments.push({
      commentBody: commentBody.trim(),
      created_at: new Date(),
      status: 'active',
    });

    await blog.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Comment added successfully',
      data: blog.comments[blog.comments.length - 1],
    });
    return;
  } catch (error) {
    next(error);
  }
};
