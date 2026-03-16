import mongoose from 'mongoose';
import { IContactDetails } from './contactUsInterface';

const contactDetailsSchema = new mongoose.Schema(
  {
    offices: {
      title: { type: String, default: 'Our Offices' },
      description: String,
      mapLink: String,
    },

    callUs: {
      title: { type: String, default: 'Call Us' },
      phoneNumbers: [String],
    },

    writeToUs: {
      title: { type: String, default: 'Write to Us' },
      emails: [String],
    },

    socialLinks: {
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
  },
  { timestamps: true },
);

export const ContactUs = mongoose.model<IContactDetails>(
  'ContactDetails',
  contactDetailsSchema,
);
