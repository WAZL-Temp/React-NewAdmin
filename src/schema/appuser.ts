import { z } from "../sharedBase/globalUtils";


const stringOnlyAlphabets = (fieldName: string, t: TransFn, length?: number) =>
    z.string()
        .min(length ?? 1, { message: t('validators.minLength', { field: fieldName, length: length }) })
        .regex(/^[A-Za-z\s]+$/, { message: t('validators.alphabetsOnly', { field: fieldName }) });

const stringAlphanumeric = (fieldName: string, t: TransFn, length?: number) =>
    z.string()
        .min(length ?? 1, { message: t('validators.minLength', { field: fieldName, length: length }) })
        .regex(/^[a-zA-Z0-9\s]+$/, { message: t('validators.alphanumeric', { field: fieldName }) });

const stringAlphanumericWithSpecialChars = (fieldName: string, t: TransFn, minLength = 1) =>
    z.string()
        .min(minLength, { message: t('validators.minLength', { field: fieldName, length: minLength }) })
        .regex(/^[a-zA-Z0-9\s.,'-/()&@#]+$/, { message: t('validators.alphanumeric', { field: fieldName }) });

const stringOnlySpecialChars = (fieldName: string, t: TransFn) =>
    z.string()
        .regex(/^[^a-zA-Z0-9]+$/, { message: t('validators.specialCharsOnly', { field: fieldName }) });

const gstField = (t: TransFn) =>
    z.string()
        .length(15, { message: t('validators.exactLength', { field: "GST number", length: 15 }) })
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, { message: t('validators.invalid', { field: 'GST Number' }) });

const stringNumeric = (fieldName: string, t: TransFn, length?: number) =>
    z.string()
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .regex(/^\d*$/, { message: t('validators.numbersOnly', { field: fieldName }) })
        .refine((val) => (length ? val.length === length : true), { message: t('validators.minDigits', { field: fieldName, length: length }) });

const stringMobileNumber = (fieldName: string, t: TransFn, length?: number) =>
    z.string()
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .max(length || Infinity, { message: t('validators.maxDigits', { field: fieldName, length: length }) })
        .regex(/^\d*$/, { message: t('validators.numbersOnly', { field: fieldName }) })
        .refine((val) => (length ? val.length === length : true), { message: t('validators.minDigits', { field: fieldName, length: length }) });

const stringDateFormat = (t: TransFn) =>
    z.string()
        .min(1, { message: t('validators.required', { field: 'Date' }) })
        .regex(/^\d{2}-\d{2}-\d{4}$/, { message: t('validators.dateFormat', { field: 'Date' }) });

const stringEmail = (t: TransFn) =>
    z.string()
        .min(1, { message: t('validators.required', { field: 'Email' }) })
        .email({ message: t('validators.invalid', { field: 'Email Address' }) });

const stringPassword = (fieldName: string, t: TransFn, length?: number) =>
    z.string()
        .min(2, { message: t('validators.minLength', { field: fieldName, length: 2 }) })
        .max(length ?? 100, { message: t('validators.maxLength', { field: fieldName, length: length ?? 100 }) });

const requiredStringField = (fieldName: string, t: TransFn) =>
    z.string({ required_error: t('validators.required', { field: fieldName }) })
        .min(1, { message: t('validators.required', { field: fieldName }) });

const booleanField = (fieldName: string, t: TransFn, required = false) =>
    required
        ? z.literal(true).or(z.literal(false)).refine((val) => val === true, {
            message: t('validators.required', { field: fieldName }),
        })
        : z.literal(true).or(z.literal(false));

export const fileUploadField = (fieldName: string, t: TransFn) =>
    z.string({
        required_error: t('validators.required', { field: fieldName }),
    }).min(1, { message: t('validators.required', { field: fieldName }) });

type TransFn = (key: string, params?: Record<string, unknown>) => string;


export const appUser = (t: TransFn) => ({
    name: stringOnlyAlphabets('Name', t, 2),
    firstName: stringOnlyAlphabets('First Name', t, 2),
    lastName: stringOnlyAlphabets('Last Name', t, 2),
    mobile: stringMobileNumber('Mobile number', t, 10),
    mobileVerified: booleanField('Mobile Verified', t),
    emailId: stringEmail(t),
    emailVerified: booleanField('Email Verified', t),
    shopName: stringOnlyAlphabets('Shop Name', t, 2),
    password: stringPassword('Password', t, 100),
    pincode: stringNumeric('Pincode', t, 6),
    state: stringOnlyAlphabets('State', t, 2),
    district: stringOnlyAlphabets('District', t, 2),
    address: stringAlphanumericWithSpecialChars('Address Line 1', t, 2),
    addressLine: stringAlphanumericWithSpecialChars('Address Line 2', t, 2),
    defaultLanguage: stringOnlyAlphabets('Default Language', t,2),
    verifyShop: requiredStringField('Verify Shop', t),
    gst: gstField(t),
    gstCertificate: fileUploadField('GST Certificate', t),
    photoShopFront: fileUploadField('Photo of Shop Front', t),
    visitingCard: fileUploadField('Visiting Card', t),
    cheque: fileUploadField('Cancelled Cheque', t),
    isActive: booleanField('Active Status', t),
    isAdmin: booleanField('Admin Status', t),
    photoAttachment: fileUploadField('Photo Attachment', t),
    role: requiredStringField("Role", t),
    publish: requiredStringField('Publish', t),
    reportedTo: requiredStringField("Reported To", t),
    reportedBy: requiredStringField("Reported By", t),
    lastLogin: stringDateFormat(t),
    totalPlot: stringNumeric('Total Plot', t),
});