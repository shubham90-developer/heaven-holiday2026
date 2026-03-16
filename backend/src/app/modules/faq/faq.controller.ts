// controllers/faq.controller.ts
import { Request, Response } from 'express';

import { FAQ } from './faq.model';
import {
  createCategorySchema,
  createFAQSchema,
  updateCategorySchema,
  updateFAQSchema,
  deleteCategorySchema,
  deleteFAQSchema,
} from './faq.validation';

import { z } from 'zod';

// Get all categories and FAQs
export const getAllFAQs = async (req: Request, res: Response) => {
  try {
    let faqDoc = await FAQ.findOne();

    if (!faqDoc) {
      // Return empty structure if no document exists
      return res.status(200).json({
        success: true,
        data: {
          categories: [],
          faqs: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      data: faqDoc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQs',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get all categories only
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    let faqDoc = await FAQ.findOne();

    if (!faqDoc) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: faqDoc.categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get FAQs by category
export const getFAQsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    let faqDoc = await FAQ.findOne();

    if (!faqDoc) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const filteredFAQs = faqDoc.faqs.filter((faq) => faq.category === category);

    res.status(200).json({
      success: true,
      data: filteredFAQs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQs by category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const validated = createCategorySchema.parse({
      body: req.body,
    });

    const { category, isActive = true } = validated.body;

    let faqDoc = await FAQ.findOne();

    if (!faqDoc) {
      // Create new document if doesn't exist
      faqDoc = await FAQ.create({
        categories: [{ category, isActive }],
        faqs: [],
      });

      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: faqDoc.categories[0],
      });
    }

    // Check if category already exists
    const categoryExists = faqDoc.categories.some(
      (cat) => cat.category.toLowerCase() === category.toLowerCase(),
    );

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    // Add new category to existing document
    faqDoc.categories.push({ category, isActive } as any);
    await faqDoc.save();

    const newCategory = faqDoc.categories[faqDoc.categories.length - 1];

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Create a new FAQ
export const createFAQ = async (req: Request, res: Response) => {
  try {
    const validated = createFAQSchema.parse({
      body: req.body,
    });

    const { category, question, answer, isActive = true } = validated.body;

    let faqDoc = await FAQ.findOne();

    if (!faqDoc) {
      return res.status(404).json({
        success: false,
        message: 'FAQ document not found. Please create a category first.',
      });
    }

    // Check if category exists
    const categoryExists = faqDoc.categories.some(
      (cat) => cat.category === category,
    );

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category does not exist. Please create the category first.',
      });
    }

    // Add new FAQ
    faqDoc.faqs.push({ category, question, answer, isActive } as any);
    await faqDoc.save();

    const newFAQ = faqDoc.faqs[faqDoc.faqs.length - 1];

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: newFAQ,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating FAQ',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const validated = updateCategorySchema.parse({
      params: req.params,
      body: req.body,
    });

    const { categoryId } = validated.params;
    const updateData = validated.body;

    let faqDoc = await FAQ.findOne();

    if (!faqDoc) {
      return res.status(404).json({
        success: false,
        message: 'FAQ document not found',
      });
    }

    // Find category by _id
    const categoryIndex = faqDoc.categories.findIndex(
      (cat: any) => cat._id.toString() === categoryId,
    );

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Update category
    if (updateData.category) {
      // Check if new category name already exists
      const categoryExists = faqDoc.categories.some(
        (cat: any, index) =>
          index !== categoryIndex &&
          cat.category.toLowerCase() === updateData.category?.toLowerCase(),
      );

      if (categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists',
        });
      }

      const oldCategoryName = faqDoc.categories[categoryIndex].category;
      faqDoc.categories[categoryIndex].category = updateData.category;

      // Update category name in all FAQs
      faqDoc.faqs.forEach((faq: any) => {
        if (faq.category === oldCategoryName) {
          faq.category = updateData.category;
        }
      });
    }

    if (updateData.isActive !== undefined) {
      faqDoc.categories[categoryIndex].isActive = updateData.isActive;
    }

    await faqDoc.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: faqDoc.categories[categoryIndex],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update a FAQ
export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const validated = updateFAQSchema.parse({
      params: req.params,
      body: req.body,
    });

    const { faqId } = validated.params;
    const updateData = validated.body;

    let faqDoc = await FAQ.findOne();

    if (!faqDoc) {
      return res.status(404).json({
        success: false,
        message: 'FAQ document not found',
      });
    }

    // Find FAQ by _id
    const faqIndex = faqDoc.faqs.findIndex(
      (faq: any) => faq._id.toString() === faqId,
    );

    if (faqIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    // Check if new category exists
    if (updateData.category) {
      const categoryExists = faqDoc.categories.some(
        (cat) => cat.category === updateData.category,
      );

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category does not exist',
        });
      }

      faqDoc.faqs[faqIndex].category = updateData.category;
    }

    if (updateData.question) {
      faqDoc.faqs[faqIndex].question = updateData.question;
    }

    if (updateData.answer) {
      faqDoc.faqs[faqIndex].answer = updateData.answer;
    }

    if (updateData.isActive !== undefined) {
      faqDoc.faqs[faqIndex].isActive = updateData.isActive;
    }

    await faqDoc.save();

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: faqDoc.faqs[faqIndex],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating FAQ',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const validated = deleteCategorySchema.parse({
      params: req.params,
    });

    const { categoryId } = validated.params;

    let faqDoc = await FAQ.findOne();

    if (!faqDoc) {
      return res.status(404).json({
        success: false,
        message: 'FAQ document not found',
      });
    }

    // Find category by _id
    const categoryIndex = faqDoc.categories.findIndex(
      (cat: any) => cat._id.toString() === categoryId,
    );

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const categoryName = faqDoc.categories[categoryIndex].category;

    // Check if there are FAQs associated with this category
    const hasFAQs = faqDoc.faqs.some((faq) => faq.category === categoryName);

    if (hasFAQs) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot delete category. Please delete all associated FAQs first.',
      });
    }

    // Remove category
    faqDoc.categories.splice(categoryIndex, 1);
    await faqDoc.save();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete a FAQ
export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const validated = deleteFAQSchema.parse({
      params: req.params,
    });

    const { faqId } = validated.params;

    let faqDoc = await FAQ.findOne();

    if (!faqDoc) {
      return res.status(404).json({
        success: false,
        message: 'FAQ document not found',
      });
    }

    // Find FAQ by _id
    const faqIndex = faqDoc.faqs.findIndex(
      (faq: any) => faq._id.toString() === faqId,
    );

    if (faqIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    // Remove FAQ
    faqDoc.faqs.splice(faqIndex, 1);
    await faqDoc.save();

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting FAQ',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
