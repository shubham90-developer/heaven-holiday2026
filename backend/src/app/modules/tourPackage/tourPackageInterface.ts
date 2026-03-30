import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

// ============= SUB-DOCUMENT INTERFACES =============

export interface IFlight {
  fromCity: string;
  toCity: string;
  departureDate: Date;
  departureTime: string;
  arrivalDate: Date;
  arrivalTime: string;
  airline: string;
  duration?: string;
}
export interface IAccommodation {
  city: string;
  country: string;
  hotelName: string;
  checkInDate?: Date;
  checkOutDate?: Date;
}
export interface IReportingDropping {
  guestType: string;
  reportingPoint: string;
  droppingPoint: string;
}
export interface IState {
  name: string;
  cities: string[];
  region?: string;
  continent?: string;
}

export interface ICityDetails {
  name: string;
  nights: number;
}

export interface IItinerary {
  day: number;
  date?: Date;
  title: string;
  activity: string;
}

export interface IPriceBreakdown {
  adultSingleSharing: number;
  adultDoubleSharing: number;
  adultTripleSharing: number;
  childWithBed: number;
  childWithoutBed: number;
  infantBasePrice: number;
  infantWithRoom: number;
}
// ============= NEW: DEPARTURE INTERFACE =============
export interface IDeparture {
  _id: Types.ObjectId;
  city: string;
  date: Date;
  fullPackagePrice: number;
  joiningPrice: number;
  availableSeats: number;
  totalSeats: number;
  status: 'Available' | 'Filling Fast' | 'Sold Out' | 'Cancelled';
}

// ============= MAIN DOCUMENT INTERFACES =============

export interface ICategory extends Document {
  name: string;
  title: string;
  description?: string;
  guests: string;
  image: string;
  badge?: string;
  categoryType: 'world' | 'india';
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ITourPackageCard extends Document {
  title: string;
  subtitle: string;
  category: mongoose.Types.ObjectId;
  galleryImages: string[];
  badge?: string;
  metaDescription?: string;
  featured: boolean;
  status: 'Active' | 'Inactive';
  tourType: string;
  days: number;
  nights: number;
  states: IState[];
  route: string;
  cityDetails: ICityDetails[];

  // UPDATED: Base prices for display only
  baseFullPackagePrice: number;
  baseJoiningPrice: number;
  priceNote?: string;
  priceBreakdown: IPriceBreakdown;
  tscCharge?: number;
  // NEW: Departures array
  departures: IDeparture[];

  tourManagerIncluded: boolean;
  tourManagerNote?: string;
  whyTravel: string[];
  tourIncludes: Types.ObjectId[];
  itinerary?: IItinerary[];
  flights: IFlight[];
  accommodations: IAccommodation[];
  reportingDropping: IReportingDropping[];
  tourInclusions: string;
  tourExclusions: string;
  tourPrepartion: string;
  needToKnow: string;
  cancellationPolicy: string;
  createdAt: Date;
  updatedAt: Date;
}
