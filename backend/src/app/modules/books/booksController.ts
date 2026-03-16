import { NextFunction, Request, Response } from 'express';

import { createBookSchema, updateBookSchema } from './booksValidation';

import Book from './booksModel';

// GET all books
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Books retrieved successfully',
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE new book
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coverImgFile = (req.files as any)?.['coverImg']?.[0];
    const imagesFiles = (req.files as any)?.['images'];

    if (!coverImgFile) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Cover image is required',
      });
    }

    if (!imagesFiles || imagesFiles.length === 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'At least one image is required',
      });
    }

    // Get Cloudinary URLs from multer upload
    const coverImg = coverImgFile.path;
    const images = imagesFiles.map((file: any) => file.path);

    // Validate with Zod
    const validatedData = createBookSchema.parse({
      body: {
        coverImg,
        images,
        title: req.body.title,
        status: req.body.status || 'active',
      },
    });

    // Create new book
    const newBook = new Book({
      coverImg: validatedData.body.coverImg,
      title: validatedData.body.title,
      images: validatedData.body.images,
      status: validatedData.body.status,
    });

    await newBook.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Book created successfully',
      data: newBook,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE book
export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const coverImgFile = (req.files as any)?.['coverImg']?.[0];
    const imagesFiles = (req.files as any)?.['images'];

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Book not found',
      });
    }

    // Prepare update data
    const updateData: any = {};

    if (req.body.title) {
      updateData.title = req.body.title;
    }

    if (req.body.status) {
      updateData.status = req.body.status;
    }

    if (coverImgFile) {
      updateData.coverImg = coverImgFile.path;
    }

    if (imagesFiles && imagesFiles.length > 0) {
      updateData.images = imagesFiles.map((file: any) => file.path);
    }

    // Validate with Zod
    const validatedData = updateBookSchema.parse({
      body: updateData,
    });

    // Update book
    Object.assign(book, validatedData.body);
    await book.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE book
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Book deleted successfully',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// ADD single image to existing book
export const addImagesToBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const imageFiles = req.files as Express.Multer.File[];

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'At least one image is required',
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Book not found',
      });
    }

    // Add multiple images to array
    const newImages = imageFiles.map((file) => file.path);
    book.images.push(...newImages);
    await book.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `${imageFiles.length} image(s) added successfully`,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// REMOVE single image from book
export const removeImageFromBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Image URL is required',
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Book not found',
      });
    }

    // Remove image from array
    book.images = book.images.filter((img) => img !== imageUrl);
    await book.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Image removed successfully',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};
