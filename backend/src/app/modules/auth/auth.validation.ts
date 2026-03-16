import { z } from 'zod';

/* ================= BASIC INFO ================= */

export const basicInfoSchema = z.object({
  profileImg: z.string().url().optional(),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),

  // Optional because phone auth users may not add email immediately
  email: z.string().email('Invalid email address').optional(),

  // Phone comes from Firebase — do not force in profile form
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional(),
});

/* ================= PERSONAL INFO ================= */

export const personalInfoSchema = z.object({
  gender: z.enum(['male', 'female', 'other']).optional(),
  nationality: z.string().min(2).max(50).optional(),
  dateOfBirth: z.coerce.date().optional(),
});

/* ================= ADDRESS ================= */

export const addressSchema = z.object({
  address: z.string().max(200).optional(),
});

/* ================= DOCUMENT SCHEMAS ================= */

const imageField = z.string().url('Invalid image URL').optional();

export const aadharCardSchema = z.object({
  number: z
    .string()
    .regex(/^[0-9]{12}$/, 'Aadhar number must be 12 digits')
    .optional(),
  frontImage: imageField,
  backImage: imageField,
});

export const panCardSchema = z.object({
  frontImage: imageField,
  backImage: imageField,
});

export const passportSchema = z.object({
  frontImage: imageField,
  backImage: imageField,
});

export const voterIdSchema = z.object({
  frontImage: imageField,
  backImage: imageField,
});

export const birthCertificateSchema = z.object({
  frontImage: imageField,
  backImage: imageField,
});

export const drivingLicenseSchema = z.object({
  frontImage: imageField,
  backImage: imageField,
});

export const visaSchema = z.object({
  frontImage: imageField,
  backImage: imageField,
});

export const otherDocumentSchema = z.object({
  documentName: z.string().min(2).max(100).optional(),
  frontImage: imageField,
  backImage: imageField,
});

/* ================= COMPLETE PROFILE ================= */

export const completeProfileSchema = z.object({
  profileImg: z.string().url().optional(),
  name: z.string().trim().min(2).max(100),

  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),

  gender: z.enum(['male', 'female', 'other']).optional(),
  nationality: z.string().min(2).max(50).optional(),
  dateOfBirth: z.coerce.date().optional(),

  address: addressSchema.optional(),

  aadharCard: aadharCardSchema.optional(),
  panCard: panCardSchema.optional(),
  passport: passportSchema.optional(),
  voterId: voterIdSchema.optional(),
  birthCertificate: birthCertificateSchema.optional(),
  drivingLicense: drivingLicenseSchema.optional(),
  visa: visaSchema.optional(),
  otherDocument: otherDocumentSchema.optional(),
});

/* ================= UPDATE PROFILE ================= */
/* deepPartial allows nested updates like { address: { city: "Delhi" } } */

export const updateProfileSchema = z.object({
  profileImg: z.string().url().optional(),
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),

  gender: z.enum(['male', 'female', 'other']).optional(),
  nationality: z.string().min(2).max(50).optional(),
  dateOfBirth: z.coerce.date().optional(),

  address: addressSchema.partial().optional(),

  aadharCard: aadharCardSchema.partial().optional(),
  panCard: panCardSchema.partial().optional(),
  passport: passportSchema.partial().optional(),
  voterId: voterIdSchema.partial().optional(),
  birthCertificate: birthCertificateSchema.partial().optional(),
  drivingLicense: drivingLicenseSchema.partial().optional(),
  visa: visaSchema.partial().optional(),
  otherDocument: otherDocumentSchema.partial().optional(),
});

/* ================= PHONE VERIFICATION ================= */

export const phoneVerificationSchema = z.object({
  firebaseUid: z.string().min(1, 'Firebase UID is required'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
});

/* ================= DOCUMENT UPLOAD ================= */

export const documentUploadSchema = z.object({
  documentType: z.enum([
    'aadharCard',
    'panCard',
    'passport',
    'voterId',
    'birthCertificate',
    'drivingLicense',
    'visa',
    'otherDocument',
  ]),
  side: z.enum(['front', 'back']),
  imageUrl: z.string().url('Invalid image URL'),
});

/* ================= TYPES ================= */

export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Address = z.infer<typeof addressSchema>;
export type AadharCard = z.infer<typeof aadharCardSchema>;
export type PanCard = z.infer<typeof panCardSchema>;
export type Passport = z.infer<typeof passportSchema>;
export type VoterId = z.infer<typeof voterIdSchema>;
export type BirthCertificate = z.infer<typeof birthCertificateSchema>;
export type DrivingLicense = z.infer<typeof drivingLicenseSchema>;
export type Visa = z.infer<typeof visaSchema>;
export type OtherDocument = z.infer<typeof otherDocumentSchema>;
export type CompleteProfile = z.infer<typeof completeProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type PhoneVerification = z.infer<typeof phoneVerificationSchema>;
export type DocumentUpload = z.infer<typeof documentUploadSchema>;
