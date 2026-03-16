// controllers/bookingController.ts

import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../middlewares/firebaseAuth';
import { appError } from '../../errors/appError';
import { Types } from 'mongoose';
import { Booking } from './bookingModel';
import { TourPackageCard } from '../tourPackage/tourPackageModel';
import { User } from '../auth/auth.model';
import {
  createBookingSchema,
  addPaymentSchema,
  updateBookingTravelersSchema,
  updateRefundStatusSchema,
  uploadBookingDocumentSchema,
} from './bookingValidation';
import { sendWhatsappDocument } from '../../utils/sendWhatsappDocument';
import { sendWhatsappMessage } from '../../utils/sendWhatsapp';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  razorpayInstance,
} from '../../config/razorpay';

import { IRefund } from './bookingInterface';
// Generate unique booking ID
const generateBookingId = async (): Promise<string> => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Get count of bookings today
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const todayBookingsCount = await Booking.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const sequence = String(todayBookingsCount + 1).padStart(4, '0');
  return `BK${year}${month}${day}${sequence}`;
};

// Create Booking
export const createBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    if (typeof req.body.selectedDeparture === 'string') {
      req.body.selectedDeparture = JSON.parse(req.body.selectedDeparture);
    }
    if (typeof req.body.travelers === 'string') {
      req.body.travelers = JSON.parse(req.body.travelers);
    }
    if (typeof req.body.travelerCount === 'string') {
      req.body.travelerCount = JSON.parse(req.body.travelerCount);
    }
    if (typeof req.body.pricing === 'string') {
      req.body.pricing = JSON.parse(req.body.pricing);
    }

    const validatedData = createBookingSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found. Please login.', 404));
    }

    // Find tour package
    const tourPackage = await TourPackageCard.findById(
      validatedData.tourPackage,
    );
    if (!tourPackage) {
      return next(new appError('Tour package not found', 404));
    }

    // Find the specific departure
    const departure = tourPackage.departures.find(
      (dep) =>
        dep._id?.toString() === validatedData.selectedDeparture.departureId,
    );

    if (!departure) {
      return next(new appError('Selected departure not found', 404));
    }

    // Check if departure date has passed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(departure.date) < today) {
      return next(new appError('Cannot book past departure dates', 400));
    }

    const departureDate = new Date(departure.date);
    departureDate.setHours(0, 0, 0, 0);

    const daysUntilDeparture = Math.ceil(
      (departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilDeparture < 15) {
      return next(
        new appError(
          `Cannot create booking within 15 days of departure. This departure is in ${daysUntilDeparture} days.`,
          400,
        ),
      );
    }

    // Check seat availability
    const totalTravelers = validatedData.travelerCount.total;
    if (departure.availableSeats < totalTravelers) {
      return next(
        new appError(
          `Only ${departure.availableSeats} seats available. You requested ${totalTravelers} seats.`,
          400,
        ),
      );
    }

    // Check departure status
    if (departure.status === 'Sold Out' || departure.status === 'Cancelled') {
      return next(new appError(`This departure is ${departure.status}`, 400));
    }

    const existingBooking = await Booking.findOne({
      user: user._id,
      tourPackage: validatedData.tourPackage,
      'selectedDeparture.departureId':
        validatedData.selectedDeparture.departureId,
      bookingStatus: { $ne: 'Cancelled' },
    });

    // Generate booking ID
    const bookingId = await generateBookingId();

    // Set balance payment due date (15 days before departure)
    const balancePaymentDueDate = new Date(departure.date);
    balancePaymentDueDate.setDate(balancePaymentDueDate.getDate() - 15);

    const pb = tourPackage.priceBreakdown;
    const { roomConfiguration, childOption, infantOption } =
      validatedData.selectedDeparture;

    // Base price per person from selected departure
    const departurePrice =
      validatedData.selectedDeparture.packageType === 'Full Package'
        ? departure.fullPackagePrice
        : departure.joiningPrice;

    // Step 1 - Adult Cost
    // Base: adults × departurePrice
    // Surcharge: room type extra per person
    const adultBaseCost = validatedData.travelerCount.adults * departurePrice;

    const roomSurchargeMap = {
      Single: pb.adultSingleSharing,
      Double: pb.adultDoubleSharing,
      Triple: pb.adultTripleSharing,
    };
    const roomCapacity = { Single: 1, Double: 2, Triple: 3 };

    const roomSurchargeCost = roomConfiguration.reduce((sum, room) => {
      return (
        sum +
        roomSurchargeMap[room.roomType] *
          roomCapacity[room.roomType] *
          room.count
      );
    }, 0);

    const adultCost = adultBaseCost + roomSurchargeCost;

    // Step 2 - Child Cost
    // Base: children × departurePrice
    // Surcharge: childWithBed or childWithoutBed
    const childBaseCost = validatedData.travelerCount.children * departurePrice;

    const childSurcharge =
      validatedData.travelerCount.children > 0
        ? validatedData.travelerCount.children *
          (childOption === 'WithBed' ? pb.childWithBed : pb.childWithoutBed)
        : 0;

    const childCost = childBaseCost + childSurcharge;

    // Step 3 - Infant Cost (flat only, no departure base price)
    const infantCost =
      validatedData.travelerCount.infants > 0
        ? validatedData.travelerCount.infants *
          (infantOption === 'WithRoom' ? pb.infantWithRoom : pb.infantBasePrice)
        : 0;

    // Step 4 - Final
    const baseAmount = adultCost + childCost + infantCost;
    const gstPercentage = 5;
    const gstAmount = Math.round(baseAmount * 0.05);
    const totalWithGst = baseAmount + gstAmount;
    const advanceWithGst =
      Math.round(baseAmount * 0.5) + Math.round(baseAmount * 0.025);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const travelersWithPassport = validatedData.travelers.map(
      (traveler, index) => {
        const file = files?.[`passportImage_${index}`]?.[0];
        return {
          ...traveler,
          passportImage: file ? file.path : undefined,
        };
      },
    );

    const booking = await Booking.create({
      bookingId,
      user: user._id,
      tourPackage: tourPackage._id,
      selectedDeparture: validatedData.selectedDeparture,
      travelers: travelersWithPassport,
      travelerCount: validatedData.travelerCount,
      pricing: {
        baseAmount,
        gstPercentage,
        gstAmount,
        totalAmount: totalWithGst,
        advanceAmount: advanceWithGst,
        pendingAmount: totalWithGst,
        adultCost,
        childCost,
        infantCost,
        paidAmount: 0,
      },
      balancePaymentDueDate,
      bookingStatus: 'Pending',
      paymentStatus: 'Pending',
    });

    // Update available seats
    departure.availableSeats -= totalTravelers;

    // Update departure status based on remaining seats
    const occupancyPercentage =
      ((departure.totalSeats - departure.availableSeats) /
        departure.totalSeats) *
      100;

    if (departure.availableSeats === 0) {
      departure.status = 'Sold Out';
    } else if (occupancyPercentage >= 70) {
      departure.status = 'Filling Fast';
    } else {
      departure.status = 'Available';
    }

    await tourPackage.save();

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate(
        'tourPackage',
        'title subtitle days nights route cityDetails departures',
      );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Booking created successfully',
      data: {
        booking: populatedBooking,
        nextStep: 'payment',
        pricingBreakdown: {
          baseAmount,
          gstPercentage,
          gstAmount,
          totalAmount: totalWithGst,
          advanceAmount: advanceWithGst,
        },
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Get User's Bookings
export const getUserBookings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found', 404));
    }
    const { status } = req.query;

    const query: any = { user: user._id };

    if (status) {
      query.bookingStatus = status;
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'tourPackage',
        select:
          '_id title badge tourType days baseFullPackagePrice tourManagerIncluded category tourIncludes  states metadata departures priceBreakdown',
        populate: [
          {
            path: 'category',
            select: 'image',
          },
          {
            path: 'tourIncludes',
            select: '_id title image status',
          },
          {
            path: 'states',
            select: 'cities',
          },
          {
            path: 'galleryImages',
            select: '... galleryImages',
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      statusCode: 200,
      message: 'Bookings retrieved successfully',
      data: {
        bookings,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Get Booking Details by ID
export const getBookingById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { bookingId } = req.params;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found', 404));
    }

    const booking = await Booking.findOne({
      bookingId,
      user: user._id,
    })
      .populate('user', 'name email phone')
      .populate(
        'tourPackage',
        'title subtitle days nights route cityDetails galleryImages departures itinerary',
      );

    if (!booking) {
      return next(new appError('Booking not found', 404));
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Booking details retrieved successfully',
      data: booking,
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Add Payment to Booking
export const addPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { bookingId } = req.params;

    // Validate payment data
    const validatedPayment = addPaymentSchema.parse(req.body);

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found', 404));
    }

    const booking = await Booking.findOne({
      bookingId,
      user: user._id,
    });

    if (!booking) {
      return next(new appError('Booking not found', 404));
    }

    // Check if booking is cancelled
    if (booking.bookingStatus === 'Cancelled') {
      return next(new appError('Cannot add payment to cancelled booking', 400));
    }

    // Check if already fully paid
    if (booking.paymentStatus === 'Fully Paid') {
      return next(new appError('Booking is already fully paid', 400));
    }

    // Check if payment amount exceeds pending amount
    if (validatedPayment.amount > booking.pricing.pendingAmount) {
      return next(
        new appError(
          `Payment amount (₹${validatedPayment.amount}) exceeds pending amount (₹${booking.pricing.pendingAmount})`,
          400,
        ),
      );
    }

    // Add payment to payments array
    booking.payments.push(validatedPayment);

    // Update payment status
    booking.updatePaymentStatus();

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('tourPackage', 'title subtitle days nights');

    res.json({
      success: true,
      statusCode: 200,
      message: 'Payment added successfully',
      data: {
        booking: updatedBooking,
        paymentStatus: booking.paymentStatus,
        remainingAmount: booking.pricing.pendingAmount,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Get Booking Summary (for confirmation page)
export const getBookingSummary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { bookingId } = req.params;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found', 404));
    }

    const booking = await Booking.findOne({
      bookingId,
      user: user._id,
    })
      .populate(
        'tourPackage',
        'title subtitle days nights route cityDetails galleryImages',
      )
      .select(
        'bookingId selectedDeparture travelers travelerCount leadTraveler pricing paymentStatus bookingStatus payments createdAt balancePaymentDueDate',
      );

    if (!booking) {
      return next(new appError('Booking not found', 404));
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Booking summary retrieved successfully',
      data: booking,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { bookingId } = req.params;

    // Find user
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found', 404));
    }

    // Find booking
    const booking = await Booking.findOne({
      bookingId,
      user: user._id,
    }).populate('tourPackage');

    if (!booking) {
      return next(new appError('Booking not found', 404));
    }

    // Check if already cancelled
    if (booking.bookingStatus === 'Cancelled') {
      return next(new appError('Booking is already cancelled', 400));
    }

    // Check if already completed
    if (booking.bookingStatus === 'Completed') {
      return next(new appError('Cannot cancel completed booking', 400));
    }

    // Check if departure date has passed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const departureDate = new Date(booking.selectedDeparture.departureDate);
    departureDate.setHours(0, 0, 0, 0);

    if (departureDate < today) {
      return next(
        new appError('Cannot cancel booking for past departures', 400),
      );
    }

    // Optional: Check cancellation deadline (e.g., 7 days before departure)
    const cancellationDeadline = new Date(departureDate);
    cancellationDeadline.setDate(cancellationDeadline.getDate() - 15);

    if (today > cancellationDeadline) {
      return next(
        new appError(
          'Cancellation deadline has passed (15 days before departure). Please contact support for assistance.',
          400,
        ),
      );
    }

    const hasPayment = booking.pricing.paidAmount > 0;
    const refundAmount = booking.pricing.paidAmount;

    const alreadyRefunded = booking.refunds
      .filter((r) => r.status !== 'Rejected')
      .reduce((sum, r) => sum + r.amount, 0);

    const remainingRefund = refundAmount - alreadyRefunded;

    if (hasPayment) {
      // Only create refund if there's amount remaining
      if (remainingRefund > 0) {
        const successfulPayment = booking.payments.find(
          (p) => p.paymentStatus === 'Success',
        );

        const refundRequest: Partial<IRefund> = {
          refundId: `REF${Date.now()}`,
          amount: remainingRefund,
          status: 'Pending',
          paymentId: successfulPayment?.razorpayPaymentId || 'N/A',
          reason: 'Full booking cancellation by user',
          requestedBy: user._id as Types.ObjectId,
          createdAt: new Date(),
        };

        booking.refunds.push(refundRequest as IRefund);
      }
    }

    // Update booking status to Cancelled
    booking.bookingStatus = 'Cancelled';
    await booking.save();

    // Restore seats to tour package
    const tourPackage = await TourPackageCard.findById(booking.tourPackage);
    if (tourPackage) {
      const departure = tourPackage.departures.find(
        (dep) =>
          dep._id?.toString() ===
          booking.selectedDeparture.departureId.toString(),
      );

      if (departure) {
        // Restore seats
        departure.availableSeats += booking.travelerCount.total;

        // Update departure status based on new availability
        const occupancyPercentage =
          ((departure.totalSeats - departure.availableSeats) /
            departure.totalSeats) *
          100;

        if (departure.availableSeats === 0) {
          departure.status = 'Sold Out';
        } else if (occupancyPercentage >= 70) {
          departure.status = 'Filling Fast';
        } else {
          departure.status = 'Available';
        }

        await tourPackage.save();
      }
    }

    // Prepare response
    // Prepare response
    const responseData = {
      bookingId: booking.bookingId,
      status: booking.bookingStatus,
      seatsRestored: booking.travelerCount.total,
      refundInfo:
        hasPayment && remainingRefund > 0
          ? {
              refundId: booking.refunds[booking.refunds.length - 1]?.refundId,
              refundAmount: remainingRefund,
              refundStatus: 'Pending',
              message:
                'Refund request created. Admin will process it within 7-10 business days.',
            }
          : hasPayment && remainingRefund === 0
            ? {
                message: 'All payments already refunded.',
              }
            : null,
    };

    res.json({
      success: true,
      statusCode: 200,
      message: 'Booking cancelled successfully',
      data: responseData,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateBookingTravelers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { bookingId } = req.params;
    if (typeof req.body.travelers === 'string') {
      req.body.travelers = JSON.parse(req.body.travelers);
    }
    if (typeof req.body.selectedDeparture === 'string') {
      req.body.selectedDeparture = JSON.parse(req.body.selectedDeparture);
    }

    // Validate request body
    const validatedData = updateBookingTravelersSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found', 404));
    }

    // Find booking with tour package populated
    const booking = await Booking.findOne({
      bookingId,
      user: user._id,
    }).populate('tourPackage');

    if (!booking) {
      return next(new appError('Booking not found', 404));
    }

    // Check if booking is cancelled
    if (booking.bookingStatus === 'Cancelled') {
      return next(
        new appError('Cannot update travelers for cancelled booking', 400),
      );
    }

    // Check if booking is completed
    if (booking.bookingStatus === 'Completed') {
      return next(
        new appError('Cannot update travelers for completed booking', 400),
      );
    }

    // Check if departure date has passed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const departureDate = new Date(booking.selectedDeparture.departureDate);
    departureDate.setHours(0, 0, 0, 0);

    if (departureDate < today) {
      return next(
        new appError('Cannot update travelers for past departures', 400),
      );
    }

    // Optional: Check update deadline (e.g., 3 days before departure)
    const updateDeadline = new Date(departureDate);
    updateDeadline.setDate(updateDeadline.getDate() - 15);

    if (today > updateDeadline) {
      return next(
        new appError(
          'Update deadline has passed (15 days before departure). Please contact support for assistance.',
          400,
        ),
      );
    }

    // ========== CALCULATE TRAVELER COUNT CHANGES ==========
    const oldTotal = booking.travelerCount.total;
    const newTotal = validatedData.travelers.length;
    const seatDifference = newTotal - oldTotal;

    // Detect room/child/infant option change
    const newRoomConfig = req.body.selectedDeparture?.roomConfiguration;
    const oldRoomConfig = booking.selectedDeparture.roomConfiguration;

    const roomChanged = newRoomConfig
      ? JSON.stringify(newRoomConfig) !== JSON.stringify(oldRoomConfig)
      : false;

    const newChildOption =
      req.body.selectedDeparture?.childOption ||
      booking.selectedDeparture.childOption;

    const newInfantOption =
      req.body.selectedDeparture?.infantOption ||
      booking.selectedDeparture.infantOption;

    const childOptionChanged =
      newChildOption !== booking.selectedDeparture.childOption;

    const infantOptionChanged =
      newInfantOption !== booking.selectedDeparture.infantOption;

    const anyRoomRelatedChange =
      roomChanged || childOptionChanged || infantOptionChanged;

    // Count travelers by type in the new data
    const newCounts = {
      adults: validatedData.travelers.filter((t) => t.type === 'Adult').length,
      children: validatedData.travelers.filter((t) => t.type === 'Child')
        .length,
      infants: validatedData.travelers.filter((t) => t.type === 'Infant')
        .length,
    };

    // ========== HANDLE SEAT CHANGES ==========
    const tourPackage = await TourPackageCard.findById(booking.tourPackage);
    if (!tourPackage) {
      return next(new appError('Tour package not found', 404));
    }

    // Find the specific departure
    const departure = tourPackage.departures.find(
      (dep) =>
        dep._id?.toString() ===
        booking.selectedDeparture.departureId.toString(),
    );

    if (!departure) {
      return next(new appError('Departure not found', 404));
    }

    // If ADDING travelers (need more seats)
    if (seatDifference > 0) {
      // Check if enough seats are available
      if (departure.availableSeats < seatDifference) {
        return next(
          new appError(
            `Only ${departure.availableSeats} seats available. You need ${seatDifference} more seats.`,
            400,
          ),
        );
      }

      // Deduct seats from available seats
      departure.availableSeats -= seatDifference;
    }

    // If REMOVING travelers (free up seats)
    if (seatDifference < 0) {
      // Add seats back to available seats
      departure.availableSeats += Math.abs(seatDifference);
    }

    // Update departure status based on new availability
    if (seatDifference !== 0) {
      const occupancyPercentage =
        ((departure.totalSeats - departure.availableSeats) /
          departure.totalSeats) *
        100;

      if (departure.availableSeats === 0) {
        departure.status = 'Sold Out';
      } else if (occupancyPercentage >= 70) {
        departure.status = 'Filling Fast';
      } else {
        departure.status = 'Available';
      }
    }

    // ========== RECALCULATE PRICING ==========
    let pricingChanged = false;
    let oldTotalAmount = booking.pricing.totalAmount;
    let newTotalAmount = oldTotalAmount;

    // Only recalculate if total traveler count changed
    if (newTotal !== oldTotal || anyRoomRelatedChange) {
      const tourPackageWithPricing = await TourPackageCard.findById(
        booking.tourPackage,
      );

      if (!tourPackageWithPricing) {
        return next(new appError('Tour package not found', 404));
      }

      const pb = tourPackageWithPricing.priceBreakdown;
      const roomConfiguration =
        newRoomConfig?.filter((r: any) => r.count > 0) ||
        booking.selectedDeparture.roomConfiguration;

      const childOption = newChildOption;
      const infantOption = newInfantOption;

      if (!pb) {
        return next(
          new appError('Price breakdown not found for this package', 400),
        );
      }

      // Base price per person from selected departure
      const departurePrice =
        booking.selectedDeparture.packageType === 'Full Package'
          ? departure.fullPackagePrice
          : departure.joiningPrice;

      // Adult Cost
      const adultBaseCost = newCounts.adults * departurePrice;

      const roomSurchargeMap: Record<string, number> = {
        Single: pb.adultSingleSharing,
        Double: pb.adultDoubleSharing,
        Triple: pb.adultTripleSharing,
      };
      const roomCapacityMap: Record<string, number> = {
        Single: 1,
        Double: 2,
        Triple: 3,
      };

      const roomSurchargeCost = roomConfiguration.reduce(
        (sum: number, room: any) => {
          return (
            sum +
            roomSurchargeMap[room.roomType] *
              roomCapacityMap[room.roomType] *
              room.count
          );
        },
        0,
      );

      const newAdultCost = adultBaseCost + roomSurchargeCost;

      // Child Cost
      const childBaseCost = newCounts.children * departurePrice;

      const childSurcharge =
        newCounts.children > 0
          ? newCounts.children *
            (newChildOption === 'WithBed'
              ? pb.childWithBed
              : pb.childWithoutBed)
          : 0;

      const newChildCost = childBaseCost + childSurcharge;

      // Infant Cost (flat only, no departure base price)
      const newInfantCost =
        newCounts.infants > 0
          ? newCounts.infants *
            (newInfantOption === 'WithRoom'
              ? pb.infantWithRoom
              : pb.infantBasePrice)
          : 0;

      const newBaseAmount = newAdultCost + newChildCost + newInfantCost;
      const newGstAmount = Math.round(newBaseAmount * 0.05);
      newTotalAmount = newBaseAmount + newGstAmount;

      // Update cost breakdown in pricing
      booking.pricing.adultCost = newAdultCost;
      booking.pricing.childCost = newChildCost;
      booking.pricing.infantCost = newInfantCost;

      pricingChanged = true;
    }

    // ========== VALIDATE LEAD TRAVELER ==========
    const leadTravelerCount = validatedData.travelers.filter(
      (t) => t.isLeadTraveler,
    ).length;

    if (leadTravelerCount === 0) {
      return next(
        new appError(
          'At least one traveler must be marked as lead traveler',
          400,
        ),
      );
    }

    if (leadTravelerCount > 1) {
      return next(
        new appError('Only one traveler can be marked as lead traveler', 400),
      );
    }

    // ========== UPDATE BOOKING ==========

    // Convert date strings to Date objects
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const processedTravelers = validatedData.travelers.map(
      (traveler, index) => {
        const file = files?.[`passportImage_${index}`]?.[0];
        return {
          ...traveler,
          dateOfBirth:
            typeof traveler.dateOfBirth === 'string'
              ? new Date(traveler.dateOfBirth)
              : traveler.dateOfBirth,
          passportImage: file ? file.path : traveler.passportImage,
        };
      },
    );
    // Update room config if changed
    if (anyRoomRelatedChange) {
      if (newRoomConfig) {
        booking.selectedDeparture.roomConfiguration = newRoomConfig.filter(
          (r: any) => r.count > 0,
        );
      }
      if (newChildOption !== undefined) {
        booking.selectedDeparture.childOption = newChildOption;
      }
      if (newInfantOption !== undefined) {
        booking.selectedDeparture.infantOption = newInfantOption;
      }
    }
    // Update travelers
    booking.travelers = processedTravelers;

    // Update traveler counts
    booking.travelerCount = {
      adults: newCounts.adults,
      children: newCounts.children,
      infants: newCounts.infants,
      total: newTotal,
    };

    // Update pricing if changed
    if (pricingChanged) {
      booking.pricing.totalAmount = newTotalAmount;

      booking.updatePaymentStatus();
      // ========== CREATE PARTIAL REFUND ==========
      if (newTotalAmount < oldTotalAmount && booking.pricing.paidAmount > 0) {
        const hasPendingRefund = booking.refunds.some(
          (r) => r.status === 'Pending',
        );
        if (hasPendingRefund) {
          return next(
            new appError(
              'You already have a pending refund. Please wait until it is processed before making further changes.',
              400,
            ),
          );
        }
        const refundAmount = oldTotalAmount - newTotalAmount;
        const removedTravelers = oldTotal - newTotal;

        const successfulPayment = booking.payments.find(
          (p) => p.paymentStatus === 'Success',
        );

        const refundRequest: Partial<IRefund> = {
          refundId: `REF${Date.now()}`,
          amount: refundAmount,
          status: 'Pending',
          paymentId: successfulPayment?.razorpayPaymentId || 'N/A',
          reason:
            anyRoomRelatedChange && newTotal === oldTotal
              ? `Partial refund: Room configuration changed`
              : anyRoomRelatedChange && newTotal !== oldTotal
                ? `Partial refund: Room configuration changed and ${oldTotal - newTotal} traveler(s) removed`
                : `Partial refund: ${oldTotal - newTotal} traveler(s) removed (${oldTotal} → ${newTotal})`,
          requestedBy: user._id as Types.ObjectId,
          createdAt: new Date(),
        };

        booking.refunds.push(refundRequest as IRefund);
      }

      // If pending amount is negative (user overpaid), handle it
      if (booking.pricing.pendingAmount < 0) {
        booking.pricing.pendingAmount = 0;
      }
    }
    await booking.save();

    // Save tour package with updated seats
    await tourPackage.save();

    // Populate and return updated booking
    const updatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('tourPackage', 'title subtitle days nights');

    // Prepare response with detailed information
    // Prepare response with detailed information
    const responseData = {
      booking: updatedBooking,
      changes: {
        travelers: {
          old: oldTotal,
          new: newTotal,
          difference: seatDifference,
        },
        seats:
          seatDifference !== 0
            ? {
                adjusted: Math.abs(seatDifference),
                action: seatDifference > 0 ? 'added' : 'removed',
                availableNow: departure.availableSeats,
              }
            : null,
        pricing: pricingChanged
          ? {
              oldTotal: oldTotalAmount,
              newTotal: newTotalAmount,
              difference: newTotalAmount - oldTotalAmount,
              pendingAmount: booking.pricing.pendingAmount,
              reason:
                anyRoomRelatedChange && newTotal === oldTotal
                  ? 'Room configuration changed'
                  : anyRoomRelatedChange && newTotal !== oldTotal
                    ? 'Room configuration and traveler count changed'
                    : 'Traveler count changed',
            }
          : null,
        roomChanged: anyRoomRelatedChange,
        refundInfo:
          pricingChanged && newTotalAmount < oldTotalAmount
            ? {
                refundId: booking.refunds[booking.refunds.length - 1]?.refundId,
                refundAmount: oldTotalAmount - newTotalAmount,
                refundStatus: 'Pending',
                message: 'Refund request created for removed travelers.',
              }
            : null,
        leadTraveler: booking.leadTraveler,
      },
    };

    res.json({
      success: true,
      statusCode: 200,
      message: pricingChanged
        ? 'Traveler information updated successfully. Pricing has been recalculated.'
        : 'Traveler information updated successfully',
      data: responseData,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookingId } = req.params; // This is the MongoDB _id

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(new appError('Booking not found', 404));
    }

    // Restore seats if booking is not already cancelled
    if (booking.bookingStatus !== 'Cancelled') {
      const tourPackage = await TourPackageCard.findById(booking.tourPackage);

      if (tourPackage) {
        const departure = tourPackage.departures.find(
          (dep) =>
            dep._id?.toString() ===
            booking.selectedDeparture.departureId.toString(),
        );

        if (departure) {
          // Restore seats
          departure.availableSeats += booking.travelerCount.total;

          // Update departure status
          const occupancyPercentage =
            ((departure.totalSeats - departure.availableSeats) /
              departure.totalSeats) *
            100;

          if (departure.availableSeats === 0) {
            departure.status = 'Sold Out';
          } else if (occupancyPercentage >= 70) {
            departure.status = 'Filling Fast';
          } else {
            departure.status = 'Available';
          }

          await tourPackage.save();
        }
      }
    }

    // Delete the booking
    await Booking.findByIdAndDelete(bookingId);

    res.json({
      success: true,
      statusCode: 200,
      message: 'Booking deleted successfully',
      data: {
        deletedBookingId: bookingId,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const query: any = {};

    if (status) {
      query.bookingStatus = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(query)
      .populate({
        path: 'tourPackage',
        select: '_id title badge tourType days category',
        populate: [
          {
            path: 'category',
            select: 'image',
          },
          {
            path: 'galleryImages',
            select: '...galleryImages',
          },
        ],
      })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      statusCode: 200,
      message: 'All bookings retrieved successfully',
      data: {
        bookings,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Create Razorpay Payment Order
export const createPaymentOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { bookingId } = req.params;
    const { amount } = req.body;

    // Find user
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found', 404));
    }

    // Find booking
    const booking = await Booking.findOne({
      bookingId,
      user: user._id,
    });

    if (!booking) {
      return next(new appError('Booking not found', 404));
    }

    // Validate booking status
    if (booking.bookingStatus === 'Cancelled') {
      return next(
        new appError('Cannot process payment for cancelled booking', 400),
      );
    }

    if (booking.paymentStatus === 'Fully Paid') {
      return next(new appError('Booking is already fully paid', 400));
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return next(new appError('Invalid payment amount', 400));
    }
    const isFirstPayment =
      booking.payments.filter((p) => p.paymentStatus === 'Success').length ===
      0;

    if (isFirstPayment) {
      const minimumRequired = booking.pricing.totalAmount * 0.5; // 50%
      if (amount < minimumRequired) {
        return next(
          new appError(
            `First payment must be at least 50% (₹${minimumRequired.toLocaleString('en-IN')})`,
            400,
          ),
        );
      }
    }

    if (amount > booking.pricing.pendingAmount) {
      return next(
        new appError(
          `Payment amount ₹${amount} exceeds pending amount ₹${booking.pricing.pendingAmount}`,
          400,
        ),
      );
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(amount, booking.bookingId);

    // Send response
    res.json({
      success: true,
      statusCode: 200,
      message: 'Payment order created successfully',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        bookingId: booking.bookingId,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Verify Razorpay Payment
export const verifyPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { bookingId } = req.params;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, amount } =
      req.body;

    // Find user
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found', 404));
    }

    // Find booking
    const booking = await Booking.findOne({
      bookingId,
      user: user._id,
    });

    if (!booking) {
      return next(new appError('Booking not found', 404));
    }

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    if (!isValid) {
      return next(
        new appError('Payment verification failed. Invalid signature.', 400),
      );
    }
    const paymentDetails =
      await razorpayInstance.payments.fetch(razorpayPaymentId);
    const paymentMethod = paymentDetails.method;
    const upiId = (paymentDetails as any).vpa ?? null;
    const bankName = (paymentDetails as any).bank ?? null;
    const walletName = (paymentDetails as any).wallet ?? null;

    // Payment verified! Save it
    const paymentData = {
      paymentId: razorpayPaymentId,
      amount: amount / 100, // Convert paise to rupees
      paymentMethod: 'UPI' as const, // or get from frontend
      paymentStatus: 'Success' as const,
      paymentDate: new Date(),
      transactionId: razorpayPaymentId,
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId,
      razorpaySignature: razorpaySignature,
      remarks: 'Online payment via Razorpay',
    };

    // Add payment
    booking.payments.push(paymentData);

    // Update payment status
    booking.updatePaymentStatus();

    await booking.save();

    // Get updated booking
    const updatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate(
        'tourPackage',
        'title subtitle days nights accommodations itinerary',
      );
    const leadName =
      booking.leadTraveler?.name ?? (updatedBooking?.user as any)?.name;
    const leadPhone =
      booking.leadTraveler?.phone ?? (updatedBooking?.user as any)?.phone;
    const tourTitle = (updatedBooking?.tourPackage as any)?.title;
    const departureDate = new Date(
      booking.selectedDeparture.departureDate,
    ).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const packageType = booking.selectedDeparture.packageType;

    const paidAmount = booking.pricing.paidAmount;
    const pendingAmount = booking.pricing.pendingAmount;
    const paymentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const accommodations =
      (updatedBooking?.tourPackage as any)?.accommodations ?? [];

    const hotelList = accommodations
      .map((hotel: any, index: number) => {
        const checkIn = new Date(hotel.checkInDate).toLocaleDateString(
          'en-IN',
          {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
        );
        const checkOut = new Date(hotel.checkOutDate).toLocaleDateString(
          'en-IN',
          {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
        );
        return `${index + 1}. 🏨 ${hotel.hotelName}\n   📍 City: ${hotel.city}, ${hotel.country}\n   Check-in: ${checkIn}\n   Check-out: ${checkOut}`;
      })
      .join('\n\n');

    const itinerary = (updatedBooking?.tourPackage as any)?.itinerary ?? [];

    const itineraryList = itinerary
      .map((item: any) => {
        return `Day ${item.day}: ${item.title}\n   ${item.activity}`;
      })
      .join('\n\n');

    if (leadPhone) {
      // ─── 50% Advance Paid → 2 messages ───
      if (booking.paymentStatus === 'Advance Paid') {
        const balanceDueDate = new Date(
          booking.balancePaymentDueDate!,
        ).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

        // Message 1 - booking confirmation
        await sendWhatsappMessage(
          leadPhone,
          `A Heaven Holiday\nYour Booking is Confirmed! 🎉\n📌 Passenger Name: ${leadName}\n📌 Destination: ${tourTitle}\n📌 Travel Date: ${departureDate}\n📌 Package: ${packageType}\nआपले बुकिंग यशस्वीरीत्या नोंदवले गेले आहे.\nकृपया पुढील अपडेट्ससाठी आमच्यासोबत जोडलेले रहा.\nThank you for booking with us!`,
        );

        // Message 2 - remaining payment reminder
        await sendWhatsappMessage(
          leadPhone,
          `Dear Sir/Madam,\nआपला Tour बुकिंग पुढे प्रोसेस करण्यासाठी कृपया उर्वरित Payment Transfer करा.\n💳 Amount: ₹${pendingAmount.toLocaleString('en-IN')}\n📅 Due Date: ${balanceDueDate}\nPayment received झाल्यावर लगेच Invoice पाठवण्यात येईल.\nA Heaven Holiday – Thank You!`,
        );
      }

      // ─── 100% Fully Paid → 1 message ───
      if (booking.paymentStatus === 'Fully Paid') {
        await sendWhatsappMessage(
          leadPhone,
          `Dear Guest,\nआपला Payment यशस्वीरीत्या प्राप्त झाला आहे.\n💳 Amount Received: ₹${paidAmount.toLocaleString('en-IN')}\n📅 Date: ${paymentDate}\n💳 Payment Method: ${paymentMethod}\n🏦 UPI / Bank Details: ${bankName ?? upiId ?? walletName ?? 'N/A'}\nआपला Invoice खाली जोडला आहे.\nThanks for your prompt payment!\nA Heaven Holiday`,
        );
        await sendWhatsappMessage(
          leadPhone,
          `Dear Guest,\nआपल्या Tour चे संपूर्ण Trip Details खाली दिले आहेत:\n\n✈️ Air Ticket: Attached\n\n🏨 Hotel Details:\n${hotelList}\n\n📍 Destination: ${tourTitle}\n\n🗓️ Day-wise Itinerary:\n${itineraryList}\n\nकृपया सर्व माहिती तपासा. काही शंका असल्यास त्वरित संपर्क करा.\nA Heaven Holiday – We care for your comfort!`,
        );
      }
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Payment verified and recorded successfully',
      data: {
        booking: updatedBooking,
        paymentStatus: booking.paymentStatus,
        bookingStatus: booking.bookingStatus,
        remainingAmount: booking.pricing.pendingAmount,
        paymentDetails: {
          method: paymentMethod,
          upiId: upiId,
          bankName: bankName,
          walletName: walletName,
          transactionId: razorpayPaymentId,
        },
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Handle Payment Failure
export const handlePaymentFailure = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req.user!;
    const { bookingId } = req.params;
    const { razorpayOrderId, error } = req.body;

    // Find user
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return next(new appError('User not found', 404));
    }

    // Find booking
    const booking = await Booking.findOne({
      bookingId,
      user: user._id,
    });

    if (!booking) {
      return next(new appError('Booking not found', 404));
    }

    // Log failed payment
    const failedPayment = {
      paymentId: `FAILED_${Date.now()}`,
      amount: 0,
      paymentMethod: 'UPI' as const,
      paymentStatus: 'Failed' as const,
      paymentDate: new Date(),
      razorpayOrderId: razorpayOrderId,
      remarks: `Payment failed: ${error?.description || 'Unknown error'}`,
    };

    booking.payments.push(failedPayment);
    await booking.save();

    res.json({
      success: false,
      statusCode: 400,
      message: 'Payment failed',
      data: {
        bookingId: booking.bookingId,
        error: error?.description || 'Payment was not successful',
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

// ========== ADMIN: GET ALL PENDING REFUNDS ==========
export const getAllPendingRefunds = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    // Build query
    const query: any = {};

    if (status) {
      query['refunds.status'] = status;
    } else {
      query['refunds.status'] = 'Pending';
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Find bookings with refunds
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('tourPackage', 'title')
      .select('bookingId user tourPackage refunds pricing createdAt')
      .sort({ 'refunds.createdAt': -1 })
      .skip(skip)
      .limit(Number(limit));

    // Format response
    // Format response
    const refundRequests = bookings.flatMap((booking) =>
      booking.refunds
        .filter((refund) => !status || refund.status === status)
        .map((refund) => ({
          bookingId: booking.bookingId,
          refundId: refund.refundId,
          user: {
            name: (booking.user as any).name,
            email: (booking.user as any).email,
            phone: (booking.user as any).phone,
          },
          tourName: (booking.tourPackage as any).title,
          amount: refund.amount,
          status: refund.status,
          reason: refund.reason,
          paymentId: refund.paymentId,
          requestedDate: refund.createdAt,
          processedDate: refund.processedAt,
          remarks: refund.remarks,
        })),
    );

    const total = refundRequests.length;

    res.json({
      success: true,
      statusCode: 200,
      message: 'Refund requests retrieved successfully',
      data: {
        refunds: refundRequests,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateRefundStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookingId, refundId } = req.params;

    const validatedData = updateRefundStatusSchema.parse(req.body);
    const { status, remarks, transactionId } = validatedData;
    // Validate status
    const validStatuses: Array<IRefund['status']> = [
      'Approved',
      'Rejected',
      'Completed',
    ];
    if (!validStatuses.includes(status)) {
      return next(
        new appError(
          'Invalid status. Must be Approved, Rejected, or Completed',
          400,
        ),
      );
    }

    // Find booking
    const booking = await Booking.findOne({ bookingId })
      .populate('user', 'name email phone')
      .populate('tourPackage', 'title');

    if (!booking) {
      return next(new appError('Booking not found', 404));
    }

    // Find specific refund
    const refund = booking.refunds.find((r) => r.refundId === refundId);

    if (!refund) {
      return next(new appError('Refund not found', 404));
    }

    // Check if already processed
    if (refund.status !== 'Pending') {
      return next(
        new appError(
          `Refund already processed with status: ${refund.status}`,
          400,
        ),
      );
    }

    // Update refund
    refund.status = status;
    refund.processedAt = new Date();
    refund.remarks = remarks || `Refund ${status.toLowerCase()} by admin`;

    if (transactionId) {
      refund.razorpayRefundId = transactionId;
    }

    await booking.save();

    res.json({
      success: true,
      statusCode: 200,
      message: `Refund ${status.toLowerCase()} successfully`,
      data: {
        bookingId: booking.bookingId,
        refundId: refund.refundId,
        status: refund.status,
        amount: refund.amount,
        processedAt: refund.processedAt,
        user: booking.user,
        tourName: (booking.tourPackage as any).title,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const uploadBookingDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // ========== VALIDATE FILE ==========
    if (!req.file) {
      return next(new appError('File is required', 400));
    }

    // ========== VALIDATE BODY ==========
    const validatedData = uploadBookingDocumentSchema.parse(req.body);
    const { bookingId, documentType, travelerIndex, label } = validatedData;

    // ========== FIND BOOKING ==========
    const booking = await Booking.findOne({ bookingId }).populate(
      'tourPackage',
      'title',
    );

    if (!booking) {
      return next(new appError('Booking not found', 404));
    }

    // ========== VALIDATE TRAVELER INDEX ==========
    const traveler = booking.travelers[travelerIndex];
    if (!traveler) {
      return next(
        new appError(
          `Traveler at index ${travelerIndex} not found in this booking`,
          400,
        ),
      );
    }

    // ========== GET TRAVELER INFO ==========
    const travelerName = `${traveler.title} ${traveler.firstName} ${traveler.lastName}`;

    // Use traveler's own phone first
    // If non-lead traveler has no phone, fallback to lead traveler phone
    const travelerPhone = traveler.phone || booking.leadTraveler?.phone;

    // ========== GET CLOUDINARY URL + MIMETYPE ==========

    const fileUrl = (req.file as any).path;
    const mimetype = req.file.mimetype;

    // ========== SAVE DOCUMENT INSIDE TRAVELER OBJECT ==========

    const docPath = `travelers.${travelerIndex}.documents.${documentType}`;

    const updateData: Record<string, any> = {
      [`${docPath}.url`]: fileUrl,
      [`${docPath}.uploadedAt`]: new Date(),
    };

    if (documentType === 'other') {
      updateData[`${docPath}.label`] = label;
    }

    await Booking.updateOne({ bookingId }, { $set: updateData });

    // ========== SEND ACTUAL FILE ON WHATSAPP ==========
    const tourTitle = (booking.tourPackage as any)?.title || 'Your Tour';

    const documentLabel =
      documentType === 'ticket'
        ? 'Air Ticket'
        : documentType === 'gatepass'
          ? 'Gate Pass'
          : label || 'Document';

    // File name shown in WhatsApp chat
    const fileName = `${documentLabel}_${booking.bookingId}_${travelerName.replace(/\s+/g, '_')}`;

    // Caption shown below the file in WhatsApp
    const caption =
      `Dear ${travelerName},\n\n` +
      `Your *${documentLabel}* for booking *${booking.bookingId}* is attached.\n` +
      `📌 Tour: ${tourTitle}\n\n` +
      `A Heaven Holiday – Thank you! 🙏`;

    if (travelerPhone) {
      // Pass mimetype so sendWhatsappDocument knows
      // whether to send as "document" (PDF) or "image"
      await sendWhatsappDocument(
        travelerPhone,
        fileUrl,
        fileName,
        caption,
        mimetype,
      );
    }

    // ========== RESPONSE ==========
    res.json({
      success: true,
      statusCode: 200,
      message: `${documentLabel} uploaded successfully${travelerPhone ? ` and sent to ${travelerPhone} on WhatsApp` : ''}`,
      data: {
        bookingId: booking.bookingId,
        documentType,
        travelerIndex,
        travelerName,
        fileUrl,
        label: label || null,
        uploadedAt: new Date(),
        whatsappSentTo: travelerPhone || null,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};
