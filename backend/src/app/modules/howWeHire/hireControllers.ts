// controllers/howWeHire.controller.ts
import { NextFunction, Request, Response } from 'express';
import { cloudinary } from '../../config/cloudinary';
import { HowWeHire } from './hireModel';
import { HowWeHireSchema, HowWeHireStepSchema } from './hireValidation';

// ================= GET DOCUMENT =================
export const getHowWeHire = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let document = await HowWeHire.findOne();

    if (!document) {
      return res.json({
        success: true,
        statusCode: 200,
        message: 'No HowWeHire document found',
        data: {
          heading: 'How we hire',
          introText:
            'We are on an incredible journey of making the world affordable for one and all.',
          subText:
            'We always look for individuals who have a passion for what they do!',
          steps: [],
        },
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'HowWeHire document retrieved successfully',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

// ================= UPDATE HEADING / TEXTS =================
export const updateHowWeHireInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { heading, introText, subText } = req.body;

    const validatedData = HowWeHireSchema.pick({
      heading: true,
      introText: true,
      subText: true,
    }).parse({ heading, introText, subText });

    let document = await HowWeHire.findOne();

    if (!document) {
      document = new HowWeHire({
        ...validatedData,
        steps: [],
      });
    } else {
      document.heading = validatedData.heading;
      document.introText = validatedData.introText;
      document.subText = validatedData.subText;
    }

    await document.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'HowWeHire info updated successfully',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADD STEP =================
export const addHowWeHireStep = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, status } = req.body;
    const imgUrl = req.file?.path || '';

    if (!imgUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image is required',
      });
    }

    const validatedStep = HowWeHireStepSchema.parse({
      title,
      description,
      img: imgUrl,
      status: status || 'active',
    });

    let document = await HowWeHire.findOne();

    if (!document) {
      document = new HowWeHire({
        heading: 'How we hire',
        introText:
          'We are on an incredible journey of making the world affordable for one and all.',
        subText:
          'We always look for individuals who have a passion for what they do!',
        steps: [validatedStep],
      });
    } else {
      document.steps.push(validatedStep);
    }

    await document.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Step added successfully',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

// ================= UPDATE STEP =================
export const updateHowWeHireStep = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { stepId, title, description, status } = req.body;
    const newImageFile = req.file;

    // Validate stepId
    if (!stepId) {
      return res.status(400).json({
        success: false,
        message: 'Step ID is required',
      });
    }

    // Find the document containing the step
    const document = await HowWeHire.findOne({ 'steps._id': stepId });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document or step not found',
      });
    }

    // ✅ OPTION 1: Use Mongoose's built-in id() method for subdocuments
    const existingStep = document.steps.id(stepId);

    // ✅ OPTION 2: Alternative using type assertion
    // const existingStep = (document.steps as any[]).find(
    //   (step: any) => step._id?.toString() === stepId
    // );

    if (!existingStep) {
      return res.status(404).json({
        success: false,
        message: 'Step not found in document',
      });
    }

    // ✅ Use new image path if uploaded, otherwise keep existing image
    const imageUrl = newImageFile?.path || existingStep.img;

    // ✅ Validate with the correct image URL (string)
    const validatedStep = HowWeHireStepSchema.parse({
      title: title || existingStep.title,
      description: description || existingStep.description,
      img: imageUrl,
      status: status || existingStep.status,
    });

    // Update the step using MongoDB's positional operator
    const updatedDocument = await HowWeHire.findOneAndUpdate(
      { 'steps._id': stepId },
      {
        $set: {
          'steps.$.title': validatedStep.title,
          'steps.$.description': validatedStep.description,
          'steps.$.img': validatedStep.img,
          'steps.$.status': validatedStep.status,
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update step',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Step updated successfully',
      data: updatedDocument,
    });
  } catch (error) {
    console.error('Update step error:', error);
    next(error);
  }
};

// ================= DELETE STEP =================
export const deleteHowWeHireStep = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { stepId } = req.body;

    if (!stepId) {
      return res.status(400).json({
        success: false,
        message: 'Step ID is required',
      });
    }

    const document = await HowWeHire.findOneAndUpdate(
      { 'steps._id': stepId },
      { $pull: { steps: { _id: stepId } } },
      { new: true },
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Step not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Step deleted successfully',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};
