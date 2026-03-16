import { Document } from 'mongoose';

export interface IGeneralSettings {
  // Brand Identity
  companyName: string;
  companyLogo: string;
  favicon: string;
  paymentGateways: string;
  copyrightText: string;

  // Phone Numbers
  tollFree1: string;
  tollFree2: string;
  callUs1: string;
  callUs2: string;
  nriWithinIndia: string;
  nriOutsideIndia: string;

  // Contact & Hours
  supportEmail: string;
  businessHoursFrom: string;
  businessHoursTo: string;

  // Caution / Notice
  cautionEnabled: boolean;
  cautionText: string;

  // Travel Planner
  travelPlannerEnabled: boolean;
  travelPlannerLabel: string;
  travelPlannerLink: string;
}

export interface IGeneralSettingsDocument extends IGeneralSettings, Document {}
