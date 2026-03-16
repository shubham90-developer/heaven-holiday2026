import mongoose from 'mongoose';
import { IOffice, IOfficeTime, IHoliday } from './contactOffice.interface';

const officeTimeSchema = new mongoose.Schema<IOfficeTime>(
  {
    day: {
      type: String,
      enum: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ],
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
      default: true,
    },
    openTime: {
      type: String,
      required: function () {
        return this.isOpen;
      },
      validate: {
        validator: function (v: string) {
          return !this.isOpen || /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Open time must be in HH:mm format (e.g., 09:00)',
      },
    },
    closeTime: {
      type: String,
      required: function () {
        return this.isOpen;
      },
      validate: {
        validator: function (v: string) {
          return !this.isOpen || /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Close time must be in HH:mm format (e.g., 18:00)',
      },
    },
  },
  { _id: false },
);

const holidaySchema = new mongoose.Schema<IHoliday>(
  {
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const officeSchema = new mongoose.Schema<IOffice>(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    forex: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mapUrl: {
      type: String,
      trim: true,
    },
    officeTimes: {
      type: [officeTimeSchema],
      required: true,
      validate: {
        validator: function (v: IOfficeTime[]) {
          const days = v.map((ot) => ot.day);
          return days.length === 7 && new Set(days).size === 7;
        },
        message: 'Office times must include all 7 days of the week',
      },
    },
    holidays: {
      type: [holidaySchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const Office = mongoose.model<IOffice>('Office', officeSchema);
