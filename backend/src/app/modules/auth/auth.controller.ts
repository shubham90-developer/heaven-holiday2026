import { NextFunction, Response } from 'express';
import { User } from './auth.model';
import { AuthRequest } from '../../middlewares/firebaseAuth';
import { appError } from '../../errors/appError';
import { cloudinary } from '../../config/cloudinary';
import { TourPackageCard } from '../tourPackage/tourPackageModel';
import { sendWhatsappMessage } from '../../utils/sendWhatsapp';
export const verifyPhoneAndRegister = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { phone } = req.body;

    if (!phone) {
      return next(new appError('Phone number is required', 400));
    }

    // Check if user already exists
    let user = await User.findOne({ firebaseUid });

    if (user) {
      // User already exists - LOGIN
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Login successful',
        data: {
          user,
          isNewUser: false,
          requiresProfileCompletion: !user.name || !user.email,
        },
      });
      return;
    }

    // Create new user with ONLY phone number
    user = await User.create({
      firebaseUid,
      phone,
      phoneVerified: true,
      authProvider: 'phone',
      accountStatus: 'pending',
      name: '',
      email: '',
    });

    await sendWhatsappMessage(
      user.phone,
      `A Heaven Holiday तर्फे आपले हार्दिक स्वागत!\nआपल्या आगामी प्रवासासाठी आम्हाला निवडल्याबद्दल मनःपूर्वक धन्यवाद.\nआपला Tour पूर्णपणे आरामदायी, सुरक्षित आणि आनंददायी करण्याची पूर्ण जबाबदारी आमची आहे.\nआपल्या सेवेसाठी आम्ही सदैव तयार आहोत.\nHappy Journey! ✈️🌍`,
    );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Phone verified successfully. Please complete your profile.',
      data: {
        user,
        isNewUser: true,
        requiresProfileCompletion: true,
        nextStep: 'basic-info',
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Step 2: Complete Basic Info
export const completeBasicInfo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return next(
        new appError('First name, last name, and email are required', 400),
      );
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found. Please register first.', 404));
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      {
        $set: {
          name: fullName,
          email: email.toLowerCase().trim(),
          accountStatus: 'active',
        },
      },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      statusCode: 200,
      message: 'Profile completed successfully',
      data: {
        user: updatedUser,
        profileComplete: true,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Get Profile
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user!.firebaseUid });

    if (!user) {
      return next(new appError('User not found', 404));
    }

    const requiresProfileCompletion = !user.name || !user.email;

    res.json({
      success: true,
      statusCode: 200,
      message: 'Profile retrieved successfully',
      data: {
        user,
        requiresProfileCompletion,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Update Profile
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const updateData: any = {};

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      nationality,
      dateOfBirth,
    } = req.body;

    if (firstName && lastName) {
      updateData.name = `${firstName.trim()} ${lastName.trim()}`;
    }
    if (email) updateData.email = email.toLowerCase().trim();
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (nationality) updateData.nationality = nationality;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;

    // Handle profile image upload
    if (req.file) {
      const existingUser = await User.findOne({ firebaseUid });

      if (existingUser?.profileImg) {
        const publicId = existingUser.profileImg
          .split('/')
          .pop()
          ?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`user-profiles/${publicId}`);
        }
      }

      updateData.profileImg = req.file.path;
    }

    if (Object.keys(updateData).length === 0) {
      return next(new appError('No fields to update', 400));
    }

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return next(new appError('User not found', 404));
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
    return;
  } catch (error) {
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`user-profiles/${publicId}`);
      }
    }
    next(error);
  }
};

// Update Address - FIXED to match model schema
export const updateAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { address, country } = req.body;

    const addressData: any = {};

    // Map to correct model fields
    if (address) addressData['address.address'] = address;

    if (Object.keys(addressData).length === 0) {
      return next(new appError('No address fields to update', 400));
    }

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      { $set: addressData },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return next(new appError('User not found', 404));
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Address updated successfully',
      data: updatedUser,
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Upload/Update Profile Image
export const uploadProfileImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;

    if (!req.file) {
      return next(new appError('Profile image is required', 400));
    }

    const existingUser = await User.findOne({ firebaseUid });
    if (!existingUser) {
      return next(new appError('User not found', 404));
    }

    // Delete old image from Cloudinary if exists
    if (existingUser.profileImg) {
      const publicId = existingUser.profileImg.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`user-profiles/${publicId}`);
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      { $set: { profileImg: req.file.path } },
      { new: true },
    );

    res.json({
      success: true,
      statusCode: 200,
      message: 'Profile image uploaded successfully',
      data: updatedUser,
    });
    return;
  } catch (error) {
    // Cleanup uploaded file on error
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`user-profiles/${publicId}`);
      }
    }
    next(error);
  }
};

// Single Unified Controller for Document Upload - FIXED to match model
export const uploadDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { documentType, side, documentNumber, documentName } = req.body;

    if (!documentType) {
      return next(new appError('Document type is required', 400));
    }

    if (!side || (side !== 'front' && side !== 'back')) {
      return next(new appError('Side must be "front" or "back"', 400));
    }

    const validDocTypes = [
      'aadharCard',
      'panCard',
      'passport',
      'voterId',
      'birthCertificate',
      'drivingLicense',
      'visa',
      'otherDocument',
    ];

    if (!validDocTypes.includes(documentType)) {
      return next(new appError('Invalid document type', 400));
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found', 404));
    }

    const updateData: any = {};

    // Handle image upload if present
    if (req.file) {
      // Get old image path to delete from Cloudinary
      const oldImagePath = (user as any)[documentType]?.[`${side}Image`];

      if (oldImagePath) {
        const publicId = oldImagePath.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`user-documents/${publicId}`);
        }
      }

      // Save new image - matches model schema (frontImage/backImage)
      updateData[`${documentType}.${side}Image`] = req.file.path;
    }

    // Handle document name for otherDocument type - matches model schema
    if (documentType === 'otherDocument' && documentName) {
      updateData[`${documentType}.documentName`] = documentName.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return next(new appError('No document data provided to update', 400));
    }

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      { $set: updateData },
      { new: true },
    );

    res.json({
      success: true,
      statusCode: 200,
      message: `${documentType} ${req.file ? side + ' image' : 'details'} uploaded successfully`,
      data: {
        user: updatedUser,
        updatedDocument: documentType,
        updatedSide: req.file ? side : null,
      },
    });
    return;
  } catch (error) {
    // Cleanup uploaded file on error
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`user-documents/${publicId}`);
      }
    }
    next(error);
  }
};

export const addPackageToWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { packageId } = req.body;
    const firebaseUid = req.user?.firebaseUid;

    if (!firebaseUid) {
      return next(new appError('User not authenticated', 401));
    }

    if (!packageId) {
      return next(new appError('packageId is required', 400));
    }

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return next(new appError('User not found', 404));
    }

    const tourPackage = await TourPackageCard.findById(packageId);
    if (!tourPackage) {
      return next(new appError('Please select a valid tour package', 404));
    }

    // Check if package already exists in wishlist
    const alreadyAdded = user.wishlist.some(
      (id) => id.toString() === packageId.toString(),
    );

    if (alreadyAdded) {
      return next(new appError('Package already in wishlist', 400));
    }

    user.wishlist.push(packageId);

    await user.save();

    // Populate wishlist after saving
    const updatedUser = await User.findOne({ firebaseUid }).populate({
      path: 'wishlist',
      select:
        'title category badge tourType days nights cityDetails baseFullPackagePrice departures tourIncludes',
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Package added to wishlist successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const removePackageFromWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { packageId } = req.params;
    const firebaseUid = req.user?.firebaseUid;

    if (!firebaseUid) {
      return next(new appError('User not authenticated', 401));
    }

    if (!packageId) {
      return next(new appError('packageId is required', 400));
    }

    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return next(new appError('User not found', 404));
    }

    // Check if package exists in wishlist
    const packageIndex = user.wishlist.findIndex(
      (id) => id.toString() === packageId.toString(),
    );

    if (packageIndex === -1) {
      return next(new appError('Package not found in wishlist', 404));
    }

    // Remove package from wishlist
    user.wishlist.splice(packageIndex, 1);

    await user.save();

    // Populate wishlist after removing
    const updatedUser = await User.findOne({ firebaseUid }).populate({
      path: 'wishlist',
      select:
        'title category badge tourType days nights cityDetails baseFullPackagePrice departures tourIncludes',
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Package removed from wishlist successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Users fetched successfully',
      data: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};
