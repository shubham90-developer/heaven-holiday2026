import { NextFunction, Request, Response } from 'express';
import { Document } from 'mongoose';
import { BrandsSection } from './brandsModel';
import {
  brandValidation,
  brandUpdateValidation,
  industryValidation,
  industryUpdateValidation,
  brandsSectionUpdateValidation,
} from './brandsValidation';
import { appError } from '../../errors/appError';
import { cloudinary } from '../../config/cloudinary';

// ============================================
// BRAND CRUD OPERATIONS
// ============================================

export const createBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, industry, isActive } = req.body;

    // Validate the input
    const validatedData = brandValidation.parse({
      name,
      industry,
      isActive: isActive === 'true' || isActive === true,
    });

    // Get or create the BrandsSection document
    let brandsSection = await BrandsSection.findOne();

    if (!brandsSection) {
      brandsSection = new BrandsSection({
        heading: 'Heaven Holiday has proudly served 350+ corporates to date...',
        brands: [],
        industries: [],
        isActive: true,
      });
    }

    // Add the new brand to the brands array
    brandsSection.brands.push(validatedData);
    await brandsSection.save();

    // Get the newly added brand
    const newBrand = brandsSection.brands[brandsSection.brands.length - 1];

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Brand created successfully',
      data: newBrand,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllBrands = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { active } = req.query;

    const brandsSection = await BrandsSection.findOne();

    if (!brandsSection || brandsSection.brands.length === 0) {
      res.json({
        success: true,
        statusCode: 200,
        message: 'No brands found',
        data: [],
      });
      return;
    }

    // Convert to plain array to allow filtering
    let brands: any[] = [...brandsSection.brands];

    if (active === 'true') {
      brands = brands.filter((brand) => brand.isActive);
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Brands retrieved successfully',
      data: brands,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brandId = req.params.id;

    const brandsSection = await BrandsSection.findOne();

    if (!brandsSection) {
      next(new appError('Brand not found', 404));
      return;
    }

    const brand = brandsSection.brands.id(brandId);

    if (!brand) {
      next(new appError('Brand not found', 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Brand retrieved successfully',
      data: brand,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brandId = req.params.id;
    const { name, industry, isActive } = req.body;

    // Find the BrandsSection document
    const brandsSection = await BrandsSection.findOne();

    if (!brandsSection) {
      next(new appError('Brand not found', 404));
      return;
    }

    const brand = brandsSection.brands.id(brandId);

    if (!brand) {
      next(new appError('Brand not found', 404));
      return;
    }

    // Prepare update data
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (industry !== undefined) {
      updateData.industry = industry;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive === 'true' || isActive === true;
    }

    // Validate the update data
    if (Object.keys(updateData).length > 0) {
      const validatedData = brandUpdateValidation.parse(updateData);

      // Update the brand properties
      Object.assign(brand, validatedData);
      await brandsSection.save();

      res.json({
        success: true,
        statusCode: 200,
        message: 'Brand updated successfully',
        data: brand,
      });
      return;
    }

    // If no updates provided
    res.json({
      success: true,
      statusCode: 200,
      message: 'No changes to update',
      data: brand,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brandId = req.params.id;

    const brandsSection = await BrandsSection.findOne();

    if (!brandsSection) {
      next(new appError('Brand not found', 404));
      return;
    }

    const brand = brandsSection.brands.id(brandId);

    if (!brand) {
      next(new appError('Brand not found', 404));
      return;
    }

    // Remove the brand from the array
    brand.deleteOne();
    await brandsSection.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Brand deleted successfully',
      data: brand,
    });
    return;
  } catch (error) {
    next(error);
  }
};

// ============================================
// INDUSTRY CRUD OPERATIONS
// ============================================

export const createIndustry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { isActive } = req.body;

    // Check if image is uploaded
    if (!req.file) {
      next(new appError('Industry image is required', 400));
      return;
    }

    // Get the image URL from req.file
    const image = req.file.path;

    // Validate the input
    const validatedData = industryValidation.parse({
      image,
      isActive: isActive === 'true' || isActive === true,
    });

    // Get or create the BrandsSection document
    let brandsSection = await BrandsSection.findOne();

    if (!brandsSection) {
      brandsSection = new BrandsSection({
        heading: 'Heaven Holiday has proudly served 350+ corporates to date...',
        brands: [],
        industries: [],
        isActive: true,
      });
    }

    // Add the new industry to the industries array
    brandsSection.industries.push(validatedData);
    await brandsSection.save();

    // Get the newly added industry
    const newIndustry =
      brandsSection.industries[brandsSection.industries.length - 1];

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Industry created successfully',
      data: newIndustry,
    });
    return;
  } catch (error) {
    // If error occurs during industry creation, delete the uploaded image
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`industries/${publicId}`);
      }
    }
    next(error);
  }
};

export const getAllIndustries = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { active } = req.query;

    const brandsSection = await BrandsSection.findOne();

    if (!brandsSection || brandsSection.industries.length === 0) {
      res.json({
        success: true,
        statusCode: 200,
        message: 'No industries found',
        data: [],
      });
      return;
    }

    // Convert to plain array to allow filtering
    let industries: any[] = [...brandsSection.industries];

    if (active === 'true') {
      industries = industries.filter((industry) => industry.isActive);
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Industries retrieved successfully',
      data: industries,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getIndustryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const industryId = req.params.id;

    const brandsSection = await BrandsSection.findOne();

    if (!brandsSection) {
      next(new appError('Industry not found', 404));
      return;
    }

    const industry = brandsSection.industries.id(industryId);

    if (!industry) {
      next(new appError('Industry not found', 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Industry retrieved successfully',
      data: industry,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateIndustryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const industryId = req.params.id;
    const { isActive } = req.body;

    // Find the BrandsSection document
    const brandsSection = await BrandsSection.findOne();

    if (!brandsSection) {
      next(new appError('Industry not found', 404));
      return;
    }

    const industry = brandsSection.industries.id(industryId);

    if (!industry) {
      next(new appError('Industry not found', 404));
      return;
    }

    // Prepare update data
    const updateData: any = {};

    if (isActive !== undefined) {
      updateData.isActive = isActive === 'true' || isActive === true;
    }

    // If there's a new image
    if (req.file) {
      updateData.image = req.file.path;

      // Delete the old image from cloudinary if it exists
      if (industry.image) {
        const publicId = industry.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`industries/${publicId}`);
        }
      }
    }

    // Validate the update data
    if (Object.keys(updateData).length > 0) {
      const validatedData = industryUpdateValidation.parse(updateData);

      // Update the industry properties
      Object.assign(industry, validatedData);
      await brandsSection.save();

      res.json({
        success: true,
        statusCode: 200,
        message: 'Industry updated successfully',
        data: industry,
      });
      return;
    }

    // If no updates provided
    res.json({
      success: true,
      statusCode: 200,
      message: 'No changes to update',
      data: industry,
    });
    return;
  } catch (error) {
    // If error occurs and image was uploaded, delete it
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`industries/${publicId}`);
      }
    }
    next(error);
  }
};

export const deleteIndustryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const industryId = req.params.id;

    const brandsSection = await BrandsSection.findOne();

    if (!brandsSection) {
      next(new appError('Industry not found', 404));
      return;
    }

    const industry = brandsSection.industries.id(industryId);

    if (!industry) {
      next(new appError('Industry not found', 404));
      return;
    }

    // Delete the image from cloudinary
    if (industry.image) {
      const publicId = industry.image.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`industries/${publicId}`);
      }
    }

    // Remove the industry from the array
    industry.deleteOne();
    await brandsSection.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Industry deleted successfully',
      data: industry,
    });
    return;
  } catch (error) {
    next(error);
  }
};

// ============================================
// BRANDS SECTION OPERATIONS
// ============================================

export const getBrandsSection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let brandsSection = await BrandsSection.findOne();

    // If no section exists, create a default one
    if (!brandsSection) {
      brandsSection = new BrandsSection({
        heading: 'Heaven Holiday has proudly served 350+ corporates to date...',
        brands: [],
        industries: [],
        isActive: true,
      });
      await brandsSection.save();
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Brands section retrieved successfully',
      data: brandsSection,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateBrandsSectionHeading = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { heading, isActive } = req.body;

    // Find or create the BrandsSection document
    let brandsSection = await BrandsSection.findOne();

    if (!brandsSection) {
      brandsSection = new BrandsSection({
        heading: 'Heaven Holiday has proudly served 350+ corporates to date...',
        brands: [],
        industries: [],
        isActive: true,
      });
    }

    // Prepare update data
    const updateData: any = {};

    if (heading !== undefined) {
      updateData.heading = heading;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive === 'true' || isActive === true;
    }

    if (Object.keys(updateData).length === 0) {
      res.json({
        success: true,
        statusCode: 200,
        message: 'No changes to update',
        data: brandsSection,
      });
      return;
    }

    // Validate the update data
    const validatedData = brandsSectionUpdateValidation.parse(updateData);

    // Update the section
    Object.assign(brandsSection, validatedData);
    await brandsSection.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Brands section updated successfully',
      data: brandsSection,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getActiveBrandsSection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brandsSection = await BrandsSection.findOne({ isActive: true });

    if (!brandsSection) {
      res.json({
        success: true,
        statusCode: 200,
        message: 'No active brands section found',
        data: null,
      });
      return;
    }

    // Convert to plain arrays to allow filtering
    const activeBrands = [...brandsSection.brands].filter(
      (brand: any) => brand.isActive,
    );
    const activeIndustries = [...brandsSection.industries].filter(
      (industry: any) => industry.isActive,
    );

    const responseData = {
      _id: brandsSection._id,
      heading: brandsSection.heading,
      brands: activeBrands,
      industries: activeIndustries,
      isActive: brandsSection.isActive,
      createdAt: brandsSection.createdAt,
      updatedAt: brandsSection.updatedAt,
    };

    res.json({
      success: true,
      statusCode: 200,
      message: 'Active brands section retrieved successfully',
      data: responseData,
    });
    return;
  } catch (error) {
    next(error);
  }
};
