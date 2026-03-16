import mongoose, { Schema } from 'mongoose';
import { IItinerary } from './tourPackageInterface';
import {
  ICategory,
  ITourPackageCard,
  IState,
  ICityDetails,
  IDeparture,
  IFlight,
  IAccommodation,
  IReportingDropping,
  IPriceBreakdown,
} from './tourPackageInterface';
import { string } from 'zod';

const FlightSchema = new Schema<IFlight>(
  {
    fromCity: { type: String, required: true, trim: true },
    toCity: { type: String, required: true, trim: true },
    departureDate: { type: Date, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    airline: { type: String, required: true, trim: true },
    arrivalDate: { type: Date, required: true },
    duration: { type: String, trim: true },
  },
  { _id: false },
);

const AccommodationSchema = new Schema<IAccommodation>(
  {
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true },
    hotelName: { type: String, required: true, trim: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
  },
  { _id: false },
);

const ReportingAndDroppingSchema = new Schema<IReportingDropping>({
  guestType: { type: String, required: true },
  reportingPoint: { type: String, required: true },
  droppingPoint: { type: String, required: true },
});

const StateSchema = new Schema<IState>(
  {
    name: {
      type: String,
      required: [true, 'State/Country name is required'],
      trim: true,
    },
    cities: {
      type: [String],
      required: [true, 'Cities are required'],
    },
    region: {
      type: String,
      enum: [
        'North India',
        'South India',
        'East & North East India',
        'Rajasthan, West & Central India',
      ],
      trim: true,
    },
    continent: {
      type: String,
      enum: [
        'Africa',
        'Asia',
        'Europe',
        'North America',
        'Oceania',
        'South America',
      ],
      trim: true,
    },
  },
  { _id: false },
);

const ItinerarySchema = new Schema<IItinerary>(
  {
    day: {
      type: Number,
      required: [true, 'Day number is required'],
      min: [1, 'Day must be at least 1'],
    },
    date: {
      type: Date,
    },
    title: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      required: [true, 'Activity is required'],
      trim: true,
    },
  },
  { _id: false },
);
const CityDetailsSchema = new Schema<ICityDetails>(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
    },
    nights: {
      type: Number,
      required: [true, 'Number of nights is required'],
      min: [0, 'Nights cannot be negative'],
    },
  },
  { _id: false },
);

const PriceBreakdownSchema = new Schema<IPriceBreakdown>(
  {
    adultSingleSharing: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    adultDoubleSharing: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    adultTripleSharing: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    childWithBed: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    childWithoutBed: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    infantBasePrice: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    infantWithRoom: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
  },
  { _id: false },
);
// ============= NEW: DEPARTURE SCHEMA =============
const DepartureSchema = new Schema<IDeparture>(
  {
    city: {
      type: String,
      required: [true, 'Departure city is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Departure date is required'],
    },
    fullPackagePrice: {
      type: Number,
      required: [true, 'Full package price is required'],
      min: [0, 'Price cannot be negative'],
    },
    joiningPrice: {
      type: Number,
      required: [true, 'Joining price is required'],
      min: [0, 'Price cannot be negative'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Available seats is required'],
      min: [0, 'Available seats cannot be negative'],
      default: 0,
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Total seats must be at least 1'],
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'Filling Fast', 'Sold Out', 'Cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Available',
    },
  },
  { _id: true },
);

// ============= MAIN SCHEMAS =============

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    guests: {
      type: String,
      required: [true, 'Guests count is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    badge: {
      type: String,
      trim: true,
      maxlength: [50, 'Badge text cannot exceed 50 characters'],
    },
    categoryType: {
      type: String,
      required: [true, 'Category type is required'],
      enum: {
        values: ['world', 'india'],
        message: '{VALUE} is not a valid category type',
      },
      lowercase: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Active',
    },
  },
  {
    timestamps: true,
  },
);

const TourPackageCardSchema = new Schema<ITourPackageCard>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'CategoryV4',
      required: [true, 'Category is required'],
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Active',
    },
    tourType: {
      type: String,
      required: [true, 'Tour type is required'],
      trim: true,
    },
    days: {
      type: Number,
      required: [true, 'Number of days is required'],
      min: [1, 'Days must be at least 1'],
    },
    nights: {
      type: Number,
      required: [true, 'Number of nights is required'],
      min: [0, 'Nights cannot be negative'],
    },
    states: {
      type: [StateSchema],
      required: [true, 'States are required'],
      validate: {
        validator: function (states: IState[]) {
          return states.length > 0;
        },
        message: 'At least one state is required',
      },
    },
    route: {
      type: String,
      required: [true, 'Route is required'],
      trim: true,
    },
    cityDetails: {
      type: [CityDetailsSchema],
      required: [true, 'City details are required'],
      validate: {
        validator: function (cityDetails: ICityDetails[]) {
          return cityDetails.length > 0;
        },
        message: 'At least one city detail is required',
      },
    },

    // UPDATED: Renamed to base prices
    baseFullPackagePrice: {
      type: Number,
      required: [true, 'Base full package price is required'],
      min: [0, 'Price cannot be negative'],
    },
    baseJoiningPrice: {
      type: Number,
      required: [true, 'Base joining price is required'],
      min: [0, 'Price cannot be negative'],
    },
    priceNote: {
      type: String,
      trim: true,
    },
    priceBreakdown: {
      type: PriceBreakdownSchema,
      required: [true, 'Price breakdown is required'],
      default: () => ({
        adultSingleSharing: 0,
        adultDoubleSharing: 0,
        adultTripleSharing: 0,
        childWithBed: 0,
        childWithoutBed: 0,
        infantBasePrice: 0,
        infantWithRoom: 0,
      }),
    },

    // NEW: Departures array
    departures: {
      type: [DepartureSchema],
      default: [],
      validate: {
        validator: function (departures: IDeparture[]) {
          return departures.length > 0;
        },
        message: 'At least one departure is required',
      },
    },

    tourManagerIncluded: {
      type: Boolean,
      default: false,
    },
    tourManagerNote: {
      type: String,
      trim: true,
    },
    whyTravel: {
      type: [String],
      default: [],
    },
    tourIncludes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Includes',
      default: [],
    },
    itinerary: {
      type: [ItinerarySchema],
      default: [],
      validate: {
        validator: function (itinerary: IItinerary[]) {
          return itinerary.length > 0;
        },
        message: 'At least one itinerary item is required',
      },
    },
    flights: {
      type: [FlightSchema],
      default: [],
    },

    accommodations: {
      type: [AccommodationSchema],
      default: [],
    },

    reportingDropping: {
      type: [ReportingAndDroppingSchema],
    },
    tourInclusions: {
      type: String,
      required: true,
    },
    tourExclusions: {
      type: String,
      required: true,
    },
    tourPrepartion: {
      type: String,
      required: true,
    },
    needToKnow: {
      type: String,
      required: true,
    },
    cancellationPolicy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    _id: true,
  },
);

// Category indexes
CategorySchema.index({ name: 1 });
CategorySchema.index({ categoryType: 1 });
CategorySchema.index({ status: 1 });

// TourPackageCard indexes
TourPackageCardSchema.index({ category: 1 });
TourPackageCardSchema.index({ tourType: 1 });
TourPackageCardSchema.index({ status: 1 });
TourPackageCardSchema.index({ featured: 1 });
TourPackageCardSchema.index({ rating: -1 });

// NEW: Departure-related indexes
TourPackageCardSchema.index({ 'departures.city': 1 });
TourPackageCardSchema.index({ 'departures.date': 1 });
TourPackageCardSchema.index({ 'departures.status': 1 });

// Compound indexes for common queries
TourPackageCardSchema.index({ category: 1, status: 1 });
TourPackageCardSchema.index({ category: 1, featured: 1 });
TourPackageCardSchema.index({ 'departures.city': 1, 'departures.date': 1 });

// ============= MODELS =============

export const Category = mongoose.model<ICategory>('CategoryV4', CategorySchema);
export const TourPackageCard = mongoose.model<ITourPackageCard>(
  'TourPackageCard',
  TourPackageCardSchema,
);
