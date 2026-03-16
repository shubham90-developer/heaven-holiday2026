export type ModalType = "category" | "tourCard" | "departures" | null;

export type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

export type State = {
  name: string;
  cities: string[];
  region?: string;
  continent?: string;
};

export type CityDetail = {
  name: string;
  nights: number;
};

export type Departure = {
  city: string;
  date: string;
  fullPackagePrice: number;
  joiningPrice: number;
  availableSeats: number;
  totalSeats: number;
  status?: "Available" | "Filling Fast" | "Sold Out" | "Cancelled";
};

export type TourIncludes = string[];

export type ItineraryItem = {
  day: number;
  date?: string;
  title: string;
  activity: string;
};

export type Flight = {
  fromCity: string;
  toCity: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  arrivalDate: string;
  duration: string;
};

export type Accommodation = {
  city: string;
  country: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
};

export type ReportingDropping = {
  guestType: string;
  reportingPoint: string;
  droppingPoint: string;
};
