import { NextFunction, Request, Response } from 'express';

import { createFormSchema, updateFormStatusSchema } from './formValidation';
import { BecomePartnerForm } from './formModel';

// GET all forms
export const getAllForms = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const forms = await BecomePartnerForm.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Forms retrieved successfully',
      data: forms,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE new form
export const createForm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate with Zod
    const validatedData = createFormSchema.parse(req.body);

    // Create new form
    const newForm = new BecomePartnerForm({
      fullName: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      address: validatedData.address,
      country: validatedData.country,
      city: validatedData.city,
      pincode: validatedData.pincode,
      state: validatedData.state,
      message: validatedData.message || '',
      cardTitle: validatedData.cardTitle,
      status: 'pending', // Default status
    });

    await newForm.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Form submitted successfully',
      data: newForm,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE form status
export const updateFormStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Validate with Zod
    const validatedData = updateFormStatusSchema.parse(req.body);

    const form = await BecomePartnerForm.findById(id);

    if (!form) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Form not found',
      });
    }

    // Update status
    form.status = validatedData.status;
    await form.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Form status updated successfully',
      data: form,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE form
export const deleteForm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const form = await BecomePartnerForm.findByIdAndDelete(id);

    if (!form) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Form not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Form deleted successfully',
      data: form,
    });
  } catch (error) {
    next(error);
  }
};
