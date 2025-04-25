import { z } from "./sharedBase/globalImports";


const stringFieldSchema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string()
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .regex(/^[A-Za-z\s]+$/, { message: t('validators.alphabetsOnly', { field: fieldName }) });


const alphanumeric = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string()
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .regex(/^[A-Za-z0-9\s,.-]+$/, { message: t('validators.alphanumeric', { field: fieldName }) });


const gstSchema = (t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string()
        .length(15, { message: t('validators.characterLength', { field: "GST number" ,length:15}) })
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, { message: t('validators.invalid', { field: 'GST Number' }) });


const numericFieldSchema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .regex(/^\d*$/, { message: t('validators.numbersOnly', { field: fieldName }) })
        .refine((val) => (length ? val.length === length : true), { message: t('validators.minlength', { field: fieldName, length: length }) });

const mobileFieldSchema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .max(length || Infinity, { message: t('validators.maxLength', { field: fieldName, length :length}) })
        .regex(/^\d*$/, { message: t('validators.numbersOnly', { field: fieldName }) })
        .refine((val) => (length ? val.length === length : true), { message: t('validators.minlength', { field: fieldName, length: length }) });

const date = (t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string()
        .min(1, { message: t('validators.required', { field: 'Date' }) })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: t('validators.dateFormat', { field: 'Date' }) });

const email = (t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string()
        .min(1, { message: t('validators.required', { field: 'Email' }) })
        .email({ message: t('validators.invalid', { field: 'Email Address' }) });

const stringField2Schema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string({
        required_error: t('validators.required', { field: fieldName }),
        invalid_type_error: t('validators.stringRequired', { field: fieldName }),
    })
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .regex(/^[A-Za-z\s]+$/, { message: t('validators.alphabetsOnly', { field: fieldName }) });

// const booleanField = (fieldName: string, t: (key: string, params?: any) => string) =>
//     z.boolean().refine(val => val === true, { message: t('validators.required', { field: fieldName }) });

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
  
// const stringField3Schema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string) =>
//     z.string()
//         .min(1, { message: t('validators.required', { field: fieldName }) })
//         .regex(/^[A-Za-z\s]+$/, { message: t('validators.alphabetsOnly', { field: fieldName }) });

export const getGlobalSchema = (t: (key: string, params?: Record<string, unknown>) => string) => ({
    firstName: stringFieldSchema('First Name', t),
    lastName: stringFieldSchema('Last Name', t),
    name: stringFieldSchema('Name', t),
    shopName: stringFieldSchema('Shop Name', t),
    password: stringFieldSchema('Password', t),
    // state: stringFieldSchema('State', t),
    // district: stringFieldSchema('District', t),
    mobile: mobileFieldSchema('Mobile number', t, 10),
    emailId: email(t),
    pincode: numericFieldSchema('Pincode', t, 6),
    role: stringField2Schema("Role", t),
    publish: stringFieldSchema('Publish', t),
    gst: gstSchema(t),
    address: alphanumeric('Address', t),
    addressLine: alphanumeric('Address Line', t),
    defaultLanguage: stringFieldSchema('Default Language', t),
    // totalPlot: numericFieldSchema('Total Plot', t),
    lastLogin: date(t),
    mobileVerified: booleanField('Mobile Verified', t),
    emailVerified: booleanField('Email Verified', t),
    // isAdmin: z.boolean(),
    // isActive: z.boolean(),
    isAdmin: booleanField('Admin Status', t),
    isActive: booleanField('Active Status', t),
});