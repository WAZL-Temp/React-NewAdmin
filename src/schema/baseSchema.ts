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

const gstField = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    z.string({
        required_error: t('validators.required', { field: fieldName }),
        invalid_type_error: t('validators.required', { field: fieldName }),
    })
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .min(minLength, { message: t('validators.minDigits', { field: fieldName, length: minLength }), })
        .max(maxLength, { message: t('validators.maxDigits', { field: fieldName, length: maxLength }), })
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[A-Z0-9]{1}[A-Z0-9]{1}$/, { message: t('validators.invalid', { field: fieldName }), });

const numericField = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .regex(/^\d+$/, { message: t('validators.numbersOnly', { field: fieldName }), })
        .min(minLength, { message: t('validators.minDigits', { field: fieldName, length: minLength }), })
        .max(maxLength, { message: t('validators.maxDigits', { field: fieldName, length: maxLength }), });

const stringNumeric = (fieldName: string, t: TransFn, minValue: number, maxValue: number) =>
    baseStringField(fieldName, t)
        .refine((val) => /^\d+$/.test(val), { message: t('validators.numbersOnly', { field: fieldName }), })
        .refine((val) => parseInt(val, 10) >= minValue, { message: t('validators.minDigits', { field: fieldName, length: minValue }), })
        .refine((val) => parseInt(val, 10) <= maxValue, { message: t('validators.maxDigits', { field: fieldName, length: maxValue }), });

const stringMobileNumber = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .regex(/^\d+$/, { message: t('validators.numbersOnly', { field: fieldName }), })
        .min(minLength, { message: t('validators.minDigits', { field: fieldName, length: minLength }), })
        .max(maxLength, { message: t('validators.maxDigits', { field: fieldName, length: maxLength }), });

const stringDateFormat = (fieldName: string, t: TransFn) =>
    z.string({
        required_error: t('validators.required', { field: fieldName }),
        invalid_type_error: t('validators.required', { field: fieldName }),
    }).min(1, { message: t('validators.required', { field: fieldName }) })
        .regex(/^\d{2}-\d{2}-\d{4}$/, { message: t('validators.dateFormat', { field: fieldName }) });

const stringEmail = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    z.string({
        required_error: t('validators.required', { field: fieldName }),
        invalid_type_error: t('validators.required', { field: fieldName }),
    }).min(1, { message: t('validators.required', { field: fieldName }) })
        .min(minLength, { message: t('validators.minLength', { field: fieldName, length: minLength }), })
        .max(maxLength, { message: t('validators.maxLength', { field: fieldName, length: maxLength }), })
        .email({ message: t('validators.invalid', { field: fieldName }), });

const stringPassword = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .min(minLength, { message: t('validators.minLength', { field: fieldName, length: minLength }) })
        .max(maxLength, { message: t('validators.maxLength', { field: fieldName, length: maxLength }) });

const requiredStringField = (fieldName: string, t: TransFn, minLength: number, maxLength: number) =>
    baseStringField(fieldName, t)
        .min(1, { message: t('validators.required', { field: fieldName }) })
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

const genderField = (fieldName: string, t: TransFn) =>
    z.string({ required_error: t('validators.required', { field: fieldName }) })
        .min(1, { message: t('validators.required', { field: fieldName }) });

const booleanRadioField = (fieldName: string, t: TransFn, required = false) =>
    required
        ? z.boolean({
            required_error: t("validators.required", { field: fieldName }),
            invalid_type_error: t("validators.invalid", { field: fieldName }),
        })
        : z.boolean().optional();

const numberOrDoubleField = (fieldName: string, t: TransFn) =>
    z.number({
        required_error: t('validators.required', { field: fieldName }),
        invalid_type_error: t('validators.invalid', { field: fieldName }),
    }).refine((val) => !isNaN(val), {
        message: t('validators.invalid', { field: fieldName }),
    });


export {
    stringOnlyAlphabets, stringAlphanumeric, stringAlphanumericWithSpecialChars,
    stringOnlySpecialChars, gstField, numericField, stringNumeric,
    stringMobileNumber, stringDateFormat, stringEmail, stringPassword, requiredStringField,
    booleanField, fileUploadField, genderField, booleanRadioField, numberOrDoubleField
};