import { z } from "../sharedBase/globalUtils";


const stringFieldSchema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(length ?? 1, { message: t('validators.minLength', { field: fieldName, length: length }) })
        .regex(/^[A-Za-z\s]+$/, { message: t('validators.alphabetsOnly', { field: fieldName }) });

const alphanumeric = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(length ?? 1, { message: t('validators.minLength', { field: fieldName, length: length }) })


const gstSchema = (t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string()
        .length(15, { message: t('validators.exactLength', { field: "GST number", length: 15 }) })
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, { message: t('validators.invalid', { field: 'GST Number' }) });


const numericFieldSchema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .regex(/^\d*$/, { message: t('validators.numbersOnly', { field: fieldName }) })
        .refine((val) => (length ? val.length === length : true), { message: t('validators.minDigits', { field: fieldName, length: length }) });

const mobileFieldSchema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .max(length || Infinity, { message: t('validators.maxDigits', { field: fieldName, length: length }) })
        .regex(/^\d*$/, { message: t('validators.numbersOnly', { field: fieldName }) })
        .refine((val) => (length ? val.length === length : true), { message: t('validators.minDigits', { field: fieldName, length: length }) });

const date = (t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string()
        .min(1, { message: t('validators.required', { field: 'Date' }) })
        .regex(/^\d{2}-\d{2}-\d{4}$/, { message: t('validators.dateFormat', { field: 'Date' }) });

const email = (t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string()
        .min(1, { message: t('validators.required', { field: 'Email' }) })
        .email({ message: t('validators.invalid', { field: 'Email Address' }) });

const password = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(2, { message: t('validators.minLength', { field: fieldName, length: 2 }) })
        .max(length ?? 100, { message: t('validators.maxLength', { field: fieldName, length: length ?? 100 }) });

const dropdownField  = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string({
        required_error: t('validators.required', { field: fieldName }),
    })
        .min(1, { message: t('validators.required', { field: fieldName }) })

const multiSelectField = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string({
        required_error: t('validators.required', { field: fieldName }),
    })
        .min(1, { message: t('validators.required', { field: fieldName }) });

const booleanField = (
    fieldName: string,
    t: (key: string, params?: Record<string, unknown>) => string,
    required = false
) =>
    required
        ? z.literal(true).or(z.literal(false)).refine((val) => val === true, {
            message: t('validators.required', { field: fieldName }),
        })
        : z.literal(true).or(z.literal(false));

const fileUploadField = (
    fieldName: string,
    t: (key: string, params?: Record<string, unknown>) => string
) =>
    z.string({
        required_error: t('validators.required', { field: fieldName }),
    }).min(1, { message: t('validators.required', { field: fieldName }) });


export const appUser = (t: (key: string, params?: Record<string, unknown>) => string) => ({
    name: stringFieldSchema('Name', t, 2),
    firstName: stringFieldSchema('First Name', t, 2),
    lastName: stringFieldSchema('Last Name', t, 2),
    mobile: mobileFieldSchema('Mobile number', t, 10),
    mobileVerified: booleanField('Mobile Verified', t),
    emailId: email(t),
    emailVerified: booleanField('Email Verified', t),
    shopName: stringFieldSchema('Shop Name', t, 2),
    password: password('Password', t, 100),
    pincode: numericFieldSchema('Pincode', t, 6),
    state: stringFieldSchema('State', t,2),
    district: stringFieldSchema('District', t,2),
    address: alphanumeric('Address Line 1', t, 2),
    addressLine: alphanumeric('Address Line 2', t, 2),
    defaultLanguage: stringFieldSchema('Default Language', t),
    verifyShop: dropdownField('Verify Shop', t),
    gst: gstSchema(t),
    gstCertificate: fileUploadField('GST Certificate', t),
    photoShopFront: fileUploadField('Photo of Shop Front', t),
    visitingCard: fileUploadField('Visiting Card', t),
    cheque: fileUploadField('Cancelled Cheque', t),
    isActive: booleanField('Active Status', t),
    isAdmin: booleanField('Admin Status', t),
    photoAttachment: fileUploadField('Photo Attachment', t),
    role: dropdownField("Role", t),
    publish: dropdownField('Publish', t),
    reportedTo: multiSelectField("Reported To", t),
    reportedBy: dropdownField("Reported By", t),
    lastLogin: date(t),
    totalPlot: numericFieldSchema('Total Plot', t),
});