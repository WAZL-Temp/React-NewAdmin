import { z } from "../sharedBase/globalUtils";
type TransFn = (key: string, params?: Record<string, unknown>) => string;

const baseStringField = (fieldName: string, t: TransFn) =>
    z.string({
        required_error: t('validators.required', { field: fieldName }),
        invalid_type_error: t('validators.required', { field: fieldName }),
    }).min(1, { message: t('validators.required', { field: fieldName }) });


const stringOnlyAlphabets = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .regex(/^[A-Za-z\s]+$/, { message: t('validators.alphabetsOnly', { field: fieldName }) })
        .min(minLength, { message: t('validators.minLength', { field: fieldName, length: minLength }) })
        .max(maxLength, { message: t('validators.maxLength', { field: fieldName, length: maxLength }) });

const stringAlphanumeric = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .min(minLength, { message: t('validators.minLength', { field: fieldName, length: minLength }) })
        .max(maxLength, { message: t('validators.maxLength', { field: fieldName, length: maxLength }) })
        .regex(/^[a-zA-Z0-9\s]+$/, { message: t('validators.alphanumeric', { field: fieldName }) });

const stringAlphanumericWithSpecialChars = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .min(minLength, { message: t('validators.minLength', { field: fieldName, length: minLength }) })
        .max(maxLength, { message: t('validators.maxLength', { field: fieldName, length: maxLength }) })
        .regex(/^[a-zA-Z0-9\s.,'-/()&@#]+$/, { message: t('validators.alphanumeric', { field: fieldName }) });

const stringOnlySpecialChars = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .min(minLength, { message: t('validators.minLength', { field: fieldName, length: minLength }) })
        .max(maxLength, { message: t('validators.maxLength', { field: fieldName, length: maxLength }) })
        .regex(/^[^a-zA-Z0-9]+$/, { message: t('validators.specialCharsOnly', { field: fieldName }) });

const gstField = (t: TransFn, minLength: number, maxLength: number) =>
    z.string({
        required_error: t('validators.required', { field: 'GST number' }),
        invalid_type_error: t('validators.required', { field: 'GST number' }),
    }).min(1, { message: t('validators.required', { field: 'GST number' }) })
        .min(minLength, { message: t('validators.minDigits', { field: 'GST number', length: minLength }), })
        .max(maxLength, { message: t('validators.maxDigits', { field: 'GST number', length: maxLength }), })
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, {
            message: t('validators.invalid', { field: 'GST number' }),
        });

const stringNumeric = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .regex(/^\d+$/, { message: t('validators.numbersOnly', { field: fieldName }), })
        .min(minLength, { message: t('validators.minDigits', { field: fieldName, length: minLength }), })
        .max(maxLength, { message: t('validators.maxDigits', { field: fieldName, length: maxLength }), });


const stringMobileNumber = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .regex(/^\d+$/, { message: t('validators.numbersOnly', { field: fieldName }), })
        .min(minLength, { message: t('validators.minDigits', { field: fieldName, length: minLength }), })
        .max(maxLength, { message: t('validators.maxDigits', { field: fieldName, length: maxLength }), });

const stringDateFormat = (t: TransFn) =>
    z.string({
        required_error: t('validators.required', { field: 'Date' }),
        invalid_type_error: t('validators.required', { field: 'Date' }),
    }).min(1, { message: t('validators.required', { field: 'Date' }) })
        .regex(/^\d{2}-\d{2}-\d{4}$/, { message: t('validators.dateFormat', { field: 'Date' }) });

const stringEmail = (t: TransFn, minLength: number, maxLength: number) =>
    z.string({
        required_error: t('validators.required', { field: 'Email' }),
        invalid_type_error: t('validators.required', { field: 'Email' }),
    }).min(1, { message: t('validators.required', { field: 'Email' }) })
        .min(minLength, { message: t('validators.minLength', { field: 'Email', length: minLength }), })
        .max(maxLength, { message: t('validators.maxLength', { field: 'Email', length: maxLength }), })
        .email({ message: t('validators.invalid', { field: 'Email Address' }), });

const stringPassword = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .min(minLength, { message: t('validators.minLength', { field: fieldName, length: minLength }) })
        .max(maxLength, { message: t('validators.maxLength', { field: fieldName, length: maxLength }) });

const requiredStringField = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .min(minLength, { message: t('validators.minLength', { field: fieldName, length: minLength }) })
        .max(maxLength, { message: t('validators.maxLength', { field: fieldName, length: maxLength }) });

const booleanField = (fieldName: string, t: TransFn, required = false) =>
    required
        ? z.literal(true).or(z.literal(false)).refine((val) => val === true, {
            message: t('validators.required', { field: fieldName }),
        })
        : z.literal(true).or(z.literal(false));

const fileUploadField = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    z.array(
        z.object({
            fileName: z.string(),
            filePath: z.string(),
            type: z.string()
        })
    ).min(minLength, {
        message: minLength === 1
            ? t('validators.required', { field: fieldName })
            : t('validators.minFiles', { count: minLength, field: fieldName }),
    })
        .max(maxLength, { message: t('validators.maxFiles', { field: fieldName, max: maxLength }) });


export const appUser = (t: TransFn) => ({
    name: stringOnlyAlphabets('Name', t, 2, 100),
    firstName: stringOnlyAlphabets('First Name', t, 2, 100),
    lastName: stringOnlyAlphabets('Last Name', t, 2, 100),
    mobile: stringMobileNumber('Mobile number', t, 10, 10),
    mobileVerified: booleanField('Mobile Verified', t),
    emailId: stringEmail(t, 5, 100),
    emailVerified: booleanField('Email Verified', t),
    shopName: stringOnlyAlphabets('Shop Name', t, 2, 100),
    password: stringPassword('Password', t, 2, 100),
    pincode: stringNumeric('Pincode', t, 6, 6),
    state: stringAlphanumeric('State', t, 0, 100),
    district: stringAlphanumeric('District', t, 0, 100),
    address: stringAlphanumericWithSpecialChars('Address Line 1', t, 2, 10000),
    addressLine: stringAlphanumericWithSpecialChars('Address Line 2', t, 2, 10000),
    defaultLanguage: stringOnlyAlphabets('Default Language', t, 2, 10),
    verifyShop: requiredStringField('Verify Shop', t, 2, 100),
    gst: gstField(t, 15, 15),
    gstCertificate: fileUploadField('GST Certificate', t, 1, 2),
    photoShopFront: fileUploadField('Photo of Shop Front', t, 1, 2),
    visitingCard: fileUploadField('Visiting Card', t, 1, 2),
    cheque: fileUploadField('Cancelled Cheque', t, 1, 2),
    gstOtp: stringOnlyAlphabets('GST OTP', t, 0, 100),
    isActive: booleanField('Active Status', t),
    isAdmin: booleanField('Admin Status', t),
    photoAttachment: fileUploadField('Photo Attachment', t, 1, 2),
    role: requiredStringField("Role", t, 2, 100),
    publish: requiredStringField('Publish', t, 2, 100),
    reportedTo: requiredStringField("Reported To", t, 2, 100),
    reportedBy: requiredStringField("Reported By", t, 2, 100),
    lastLogin: stringDateFormat(t),
    totalPlot: stringNumeric('Total Plot', t, 1, 100),
});