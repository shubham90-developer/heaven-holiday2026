export interface IOfficeTime {
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
  isOpen: boolean;
  openTime?: string; // Format: "09:00"
  closeTime?: string; // Format: "18:00"
}

export interface IHoliday {
  date: Date;
  description: string;
}

export interface IOffice {
  city: string;
  status?: 'active' | 'inactive';
  forex?: boolean;
  address: string;
  phone: string;
  email: string;
  mapUrl?: string;
  officeTimes: IOfficeTime[];
  holidays?: IHoliday[];
  createdAt?: Date;
  updatedAt?: Date;
}
