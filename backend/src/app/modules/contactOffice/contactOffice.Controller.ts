import { Request, Response } from 'express';
import { Office } from './contactOffice.Model';

import {
  createOfficeSchema,
  updateOfficeSchema,
} from './contactOffice.validation';

import { z } from 'zod';

export const getAllOffices = async (req: Request, res: Response) => {
  try {
    const offices = await Office.find();
    res.status(200).json({
      success: true,
      data: offices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching offices',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getOfficeById = async (req: Request, res: Response) => {
  try {
    const office = await Office.findById(req.params.id);
    if (!office) {
      return res.status(404).json({
        success: false,
        message: 'Office not found',
      });
    }

    res.status(200).json({
      success: true,
      data: office,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching office',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const createOffice = async (req: Request, res: Response) => {
  try {
    const validatedData = createOfficeSchema.parse(req.body);

    const newOffice = await Office.create(validatedData);

    res.status(201).json({
      success: true,
      message: 'Office created successfully',
      data: newOffice,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating office',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateOffice = async (req: Request, res: Response) => {
  try {
    const validatedData = updateOfficeSchema.parse(req.body);

    const updatedOffice = await Office.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true },
    );

    if (!updatedOffice) {
      return res.status(404).json({
        success: false,
        message: 'Office not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Office updated successfully',
      data: updatedOffice,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating office',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteOffice = async (req: Request, res: Response) => {
  try {
    const deletedOffice = await Office.findByIdAndDelete(req.params.id);

    if (!deletedOffice) {
      return res.status(404).json({
        success: false,
        message: 'Office not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Office deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting office',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update office times for a specific office
export const updateOfficeTimes = async (req: Request, res: Response) => {
  try {
    const { officeTimes } = req.body;

    if (
      !officeTimes ||
      !Array.isArray(officeTimes) ||
      officeTimes.length !== 7
    ) {
      return res.status(400).json({
        success: false,
        message: 'Office times must include all 7 days of the week',
      });
    }

    const updatedOffice = await Office.findByIdAndUpdate(
      req.params.id,
      { officeTimes },
      { new: true, runValidators: true },
    );

    if (!updatedOffice) {
      return res.status(404).json({
        success: false,
        message: 'Office not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Office times updated successfully',
      data: updatedOffice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating office times',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Add a holiday to an office
export const addHoliday = async (req: Request, res: Response) => {
  try {
    const { date, description } = req.body;

    if (!date || !description) {
      return res.status(400).json({
        success: false,
        message: 'Date and description are required',
      });
    }

    const office = await Office.findById(req.params.id);

    if (!office) {
      return res.status(404).json({
        success: false,
        message: 'Office not found',
      });
    }

    office.holidays = office.holidays || [];
    office.holidays.push({ date: new Date(date), description });
    await office.save();

    res.status(200).json({
      success: true,
      message: 'Holiday added successfully',
      data: office,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding holiday',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Remove a holiday from an office
export const removeHoliday = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required',
      });
    }

    const office = await Office.findById(req.params.id);

    if (!office) {
      return res.status(404).json({
        success: false,
        message: 'Office not found',
      });
    }

    const holidayDate = new Date(date);
    office.holidays =
      office.holidays?.filter(
        (holiday) => holiday.date.toDateString() !== holidayDate.toDateString(),
      ) || [];

    await office.save();

    res.status(200).json({
      success: true,
      message: 'Holiday removed successfully',
      data: office,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing holiday',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get all holidays for an office
export const getOfficeHolidays = async (req: Request, res: Response) => {
  try {
    const office = await Office.findById(req.params.id);

    if (!office) {
      return res.status(404).json({
        success: false,
        message: 'Office not found',
      });
    }

    res.status(200).json({
      success: true,
      data: office.holidays || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching holidays',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Check if office is currently open
export const checkOfficeStatus = async (req: Request, res: Response) => {
  try {
    const office = await Office.findById(req.params.id);

    if (!office) {
      return res.status(404).json({
        success: false,
        message: 'Office not found',
      });
    }

    const now = new Date();
    const currentDay = now
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase() as
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
      | 'saturday'
      | 'sunday';

    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Check if today is a holiday
    const isHoliday = office.holidays?.some(
      (holiday) => holiday.date.toDateString() === now.toDateString(),
    );

    if (isHoliday) {
      return res.status(200).json({
        success: true,
        isOpen: false,
        reason: 'Holiday',
        message: 'Office is closed for holiday',
      });
    }

    // Check office times for current day
    const todaySchedule = office.officeTimes.find(
      (ot) => ot.day === currentDay,
    );

    if (!todaySchedule || !todaySchedule.isOpen) {
      return res.status(200).json({
        success: true,
        isOpen: false,
        reason: 'Closed day',
        message: 'Office is closed today',
      });
    }

    // Check if current time is within office hours
    const isWithinHours =
      todaySchedule.openTime &&
      todaySchedule.closeTime &&
      currentTime >= todaySchedule.openTime &&
      currentTime <= todaySchedule.closeTime;

    res.status(200).json({
      success: true,
      isOpen: isWithinHours,
      reason: isWithinHours ? 'Open' : 'Outside office hours',
      message: isWithinHours
        ? 'Office is currently open'
        : 'Office is currently closed',
      officeHours: {
        openTime: todaySchedule.openTime,
        closeTime: todaySchedule.closeTime,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking office status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get office schedule for a specific date or date range
export const getOfficeSchedule = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const office = await Office.findById(req.params.id);

    if (!office) {
      return res.status(404).json({
        success: false,
        message: 'Office not found',
      });
    }

    let schedule = office.officeTimes;
    let holidays = office.holidays || [];

    // Filter holidays by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      holidays = holidays.filter((h) => h.date >= start && h.date <= end);
    }

    res.status(200).json({
      success: true,
      data: {
        officeTimes: schedule,
        holidays: holidays,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching office schedule',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
