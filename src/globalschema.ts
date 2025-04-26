import { z } from "./sharedBase/globalUtils";


const stringFieldSchema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(length ?? 1, { message: t('validators.requiredMinLength', { field: fieldName, length: length }) })
        .regex(/^[A-Za-z\s]+$/, { message: t('validators.alphabetsOnly', { field: fieldName }) });


const alphanumeric = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(length ?? 1, { message: t('validators.requiredMinLength', { field: fieldName, length: length }) })


const gstSchema = (t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string()
        .length(15, { message: t('validators.characterLength', { field: "GST number", length: 15 }) })
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, { message: t('validators.invalid', { field: 'GST Number' }) });


const numericFieldSchema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .regex(/^\d*$/, { message: t('validators.numbersOnly', { field: fieldName }) })
        .refine((val) => (length ? val.length === length : true), { message: t('validators.minlength', { field: fieldName, length: length }) });

const mobileFieldSchema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .max(length || Infinity, { message: t('validators.maxLength', { field: fieldName, length: length }) })
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

const password = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string()
        .min(6, { message: t('validators.requiredMinLength', { field: fieldName, length: 6 }) })
        .max(20, { message: t('validators.requiredMaxLength', { field: fieldName, length: 20 }) });

const stringField2Schema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string) =>
    z.string({
        required_error: t('validators.required', { field: fieldName }),
        invalid_type_error: t('validators.stringRequired', { field: fieldName }),
    })
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .regex(/^[A-Za-z\s]+$/, { message: t('validators.alphabetsOnly', { field: fieldName }) });

// const stringField3Schema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string) =>
//     z.string()
//         .min(1, { message: t('validators.required', { field: fieldName }) })
//         .regex(/^[A-Za-z\s]+$/, { message: t('validators.alphabetsOnly', { field: fieldName }) });

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


export const getGlobalSchema = (t: (key: string, params?: Record<string, unknown>) => string) => ({
    firstName: stringFieldSchema('First Name', t, 2),
    lastName: stringFieldSchema('Last Name', t, 2),
    name: stringFieldSchema('Name', t, 2),
    shopName: stringFieldSchema('Shop Name', t, 2),
    password: password('Password', t),
    // state: stringField3Schema('State', t),
    // district: stringField3Schema('District', t),
    mobile: mobileFieldSchema('Mobile number', t, 10),
    emailId: email(t),
    pincode: numericFieldSchema('Pincode', t, 6),
    role: stringField2Schema("Role", t),
    publish: stringField2Schema('Publish', t),
    gst: gstSchema(t),
    address: alphanumeric('Address', t, 2),
    addressLine: alphanumeric('Address Line', t, 2),
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