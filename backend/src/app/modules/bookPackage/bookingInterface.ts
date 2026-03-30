// models/bookingInterface.ts

import { Document, Types } from 'mongoose';

// ========== TRAVELER INTERFACE ==========
export interface ITraveler {
  _id?: Types.ObjectId;
  type: 'Adult' | 'Child' | 'Infant';
  title: 'Mr' | 'Mrs' | 'Ms' | 'Master' | 'Miss';
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  isLeadTraveler?: boolean;
  email?: string;
  phone?: string;
  passportImage?: string;
  passportNo?: string;
  passportExpiryDate?: Date;
  documents?: {
    ticket?: { url: string; uploadedAt: Date };
    gatepass?: { url: string; uploadedAt: Date };
    other?: { url: string; label?: string; uploadedAt: Date };
  };
}

// ========== SELECTED DEPARTURE INTERFACE ==========
export interface ISelectedDeparture {
  departureId: Types.ObjectId;
  departureCity: string;
  departureDate: Date;
  packageType: 'Full Package' | 'Joining Package';
  roomConfiguration: {
    roomType: 'Single' | 'Double' | 'Triple';
    count: number;
  }[];
  childOption?: 'WithBed' | 'WithoutBed';
  infantOption?: 'Base' | 'WithRoom';
}

// ========== TRAVELER COUNT INTERFACE ==========
export interface ITravelerCount {
  adults: number;
  children: number;
  infants: number;
  total: number;
}

// ========== LEAD TRAVELER INTERFACE ==========
export interface ILeadTraveler {
  name: string;
  email?: string;
  phone?: string;
}

// ========== PRICING INTERFACE ==========
export interface IPricing {
  totalAmount: number;
  advanceAmount: number;
  paidAmount: number;
  pendingAmount: number;
  baseAmount?: number;
  gstPercentage?: number;
  gstAmount?: number;
  adultCost?: number;
  childCost?: number;
  infantCost?: number;
  tscCharge?: number;
  tscAmount?: number;
}

// ========== PAYMENT INTERFACE ==========
export interface IPayment {
  _id?: Types.ObjectId;
  paymentId: string;
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Net Banking' | 'Wallet';
  paymentStatus: 'Pending' | 'Success' | 'Failed';
  paymentDate: Date;
  transactionId?: string;
  remarks?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

// In bookingInterface.ts - ADD THIS

export interface IRefund {
  _id?: Types.ObjectId;
  refundId: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  paymentId?: string;
  razorpayRefundId?: string;
  reason: string;
  requestedBy: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  createdAt: Date;
  processedAt?: Date;
  remarks?: string;
}

// ========== MAIN BOOKING INTERFACE ==========
export interface IBooking extends Document {
  // Identification
  bookingId: string;

  // References
  user: Types.ObjectId;
  tourPackage: Types.ObjectId;

  // Departure
  selectedDeparture: ISelectedDeparture;

  // Travelers
  travelers: ITraveler[];
  travelerCount: ITravelerCount;
  leadTraveler: ILeadTraveler;

  // Pricing
  pricing: IPricing;

  // Payment
  paymentStatus: 'Pending' | 'Advance Paid' | 'Fully Paid';
  payments: IPayment[];
  refunds: IRefund[];

  // Status
  bookingStatus: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

  // Dates
  bookingDate?: Date;
  balancePaymentDueDate?: Date;

  // Timestamps (from mongoose)
  createdAt?: Date;
  updatedAt?: Date;

  // Methods
  calculateTotalPaid(): number;
  updatePaymentStatus(): void;
}
