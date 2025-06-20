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
    }).min(1, { message: t('validators.required', { field: fieldName }) })
        .min(minLength, { message: t('validators.minDigits', { field: fieldName, length: minLength }), })
        .max(maxLength, { message: t('validators.maxDigits', { field: fieldName, length: maxLength }), })
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, {
            message: t('validators.invalid', { field: fieldName }),
        });

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


const numberOrDoubleField = (fieldName: string, t: TransFn) =>
    z.number({
        required_error: t('validators.required', { field: fieldName }),
        invalid_type_error: t('validators.invalid', { field: fieldName }),
    }).refine((val) => !isNaN(val), {
        message: t('validators.invalid', { field: fieldName }),
    });

export const appUserTestValidate = (t: TransFn) => ({
	id:stringNumeric(t('appUserTest.columns.fields.id'),t,0,0),
	name:stringOnlyAlphabets(t('appUserTest.columns.fields.name'),t,2,100),
	firstName:stringOnlyAlphabets(t('appUserTest.columns.fields.firstName'),t,2,100),
	lastName:stringOnlyAlphabets(t('appUserTest.columns.fields.lastName'),t,2,100),
	mobile:stringOnlyAlphabets(t('appUserTest.columns.fields.mobile'),t,2,100),
	mobileVerified:booleanField(t('appUserTest.columns.fields.mobileVerified'),t),
	emailId:stringOnlyAlphabets(t('appUserTest.columns.fields.emailId'),t,0,100),
	emailVerified:booleanField(t('appUserTest.columns.fields.emailVerified'),t),
	shopName:stringOnlyAlphabets(t('appUserTest.columns.fields.shopName'),t,2,200),
	password:stringOnlyAlphabets(t('appUserTest.columns.fields.password'),t,2,100),
	pincode:stringOnlyAlphabets(t('appUserTest.columns.fields.pincode'),t,0,6),
	state:stringOnlyAlphabets(t('appUserTest.columns.fields.state'),t,0,100),
	district:stringOnlyAlphabets(t('appUserTest.columns.fields.district'),t,0,100),
	address:stringOnlyAlphabets(t('appUserTest.columns.fields.address'),t,2,10000),
	addressLine:stringOnlyAlphabets(t('appUserTest.columns.fields.addressLine'),t,2,10000),
	verifyShop:stringOnlyAlphabets(t('appUserTest.columns.fields.verifyShop'),t,2,100),
	verifyShopLabel:stringOnlyAlphabets(t('appUserTest.columns.fields.verifyShopLabel'),t,2,100),
	gst:stringOnlyAlphabets(t('appUserTest.columns.fields.gst'),t,2,100),
	gstCertificate:stringOnlyAlphabets(t('appUserTest.columns.fields.gstCertificate'),t,0,0),
	photoShopFront:stringOnlyAlphabets(t('appUserTest.columns.fields.photoShopFront'),t,0,0),
	visitingCard:stringOnlyAlphabets(t('appUserTest.columns.fields.visitingCard'),t,0,0),
	cheque:stringOnlyAlphabets(t('appUserTest.columns.fields.cheque'),t,0,0),
	gstOtp:stringOnlyAlphabets(t('appUserTest.columns.fields.gstOtp'),t,0,100),
	isActive:booleanField(t('appUserTest.columns.fields.isActive'),t),
	isAdmin:booleanField(t('appUserTest.columns.fields.isAdmin'),t),
	hasImpersonateAccess:booleanField(t('appUserTest.columns.fields.hasImpersonateAccess'),t),
	photoAttachment:stringOnlyAlphabets(t('appUserTest.columns.fields.photoAttachment'),t,0,0),
	role:stringOnlyAlphabets(t('appUserTest.columns.fields.role'),t,2,100),
	roleLabel:stringOnlyAlphabets(t('appUserTest.columns.fields.roleLabel'),t,2,100),
	publish:stringOnlyAlphabets(t('appUserTest.columns.fields.publish'),t,2,100),
	publishLabel:stringOnlyAlphabets(t('appUserTest.columns.fields.publishLabel'),t,2,100),
	importDataId:stringNumeric(t('appUserTest.columns.fields.importDataId'),t,0,0),
	lastLogin:stringDateFormat(t('appUserTest.columns.fields.lastLogin'),t),
	defaultLanguage:stringOnlyAlphabets(t('appUserTest.columns.fields.defaultLanguage'),t,0,10),
	isPremiumUser:booleanField(t('appUserTest.columns.fields.isPremiumUser'),t),
	totalPlot:stringNumeric(t('appUserTest.columns.fields.totalPlot'),t,0,0),
	reportedTo:stringOnlyAlphabets(t('appUserTest.columns.fields.reportedTo'),t,0,100),
	reportedBy:stringOnlyAlphabets(t('appUserTest.columns.fields.reportedBy'),t,0,100),
	appUserName:stringOnlyAlphabets(t('appUserTest.columns.fields.appUserName'),t,0,0),
	gender:stringOnlyAlphabets(t('appUserTest.columns.fields.gender'),t,0,100),
	genderLabel:stringOnlyAlphabets(t('appUserTest.columns.fields.genderLabel'),t,0,100),
	createDate:stringDateFormat(t('appUserTest.columns.fields.createDate'),t),
	updateDate:stringDateFormat(t('appUserTest.columns.fields.updateDate'),t),
	deleteDate:stringDateFormat(t('appUserTest.columns.fields.deleteDate'),t),
	createById:stringNumeric(t('appUserTest.columns.fields.createById'),t,0,0),
	updateById:stringNumeric(t('appUserTest.columns.fields.updateById'),t,0,0),
	deleteById:stringNumeric(t('appUserTest.columns.fields.deleteById'),t,0,0),
	isDelete:booleanField(t('appUserTest.columns.fields.isDelete'),t),

// <!--validate-Data-->
});