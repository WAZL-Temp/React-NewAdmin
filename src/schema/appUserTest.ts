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
export const appUserTestValidate = (t: TransFn) => ({
	id:stringNumeric(t('appUserTests.columns.fields.id'),t,0,0),
	name:stringOnlyAlphabets(t('appUserTests.columns.fields.name'),t,2,100),
	firstName:stringOnlyAlphabets(t('appUserTests.columns.fields.firstName'),t,2,100),
	lastName:stringOnlyAlphabets(t('appUserTests.columns.fields.lastName'),t,2,100),
	mobile:stringMobileNumber(t('appUserTests.columns.fields.mobile'),t,2,100),
	mobileVerified:booleanField(t('appUserTests.columns.fields.mobileVerified'),t),
	emailId:stringEmail(t('appUserTests.columns.fields.emailId'),t,0,100),
	emailVerified:booleanField(t('appUserTests.columns.fields.emailVerified'),t),
	shopName:stringOnlyAlphabets(t('appUserTests.columns.fields.shopName'),t,2,200),
	password:stringPassword(t('appUserTests.columns.fields.password'),t,2,100),
	pincode:numericField(t('appUserTests.columns.fields.pincode'),t,0,6),
	state:stringAlphanumeric(t('appUserTests.columns.fields.state'),t,1,100),
	district:stringAlphanumeric(t('appUserTests.columns.fields.district'),t,1,100),
	address:stringAlphanumericWithSpecialChars(t('appUserTests.columns.fields.address'),t,2,10000),
	addressLine:stringAlphanumericWithSpecialChars(t('appUserTests.columns.fields.addressLine'),t,2,10000),
	verifyShop:requiredStringField(t('appUserTests.columns.fields.verifyShop'),t,2,100),
	verifyShopLabel:requiredStringField(t('appUserTests.columns.fields.verifyShopLabel'),t,2,100),
	gst:gstField(t('appUserTests.columns.fields.gst'),t,2,100),
	gstCertificate:fileUploadField(t('appUserTests.columns.fields.gstCertificate'),t,0,0),
	photoShopFront:fileUploadField(t('appUserTests.columns.fields.photoShopFront'),t,0,0),
	visitingCard:fileUploadField(t('appUserTests.columns.fields.visitingCard'),t,0,0),
	cheque:fileUploadField(t('appUserTests.columns.fields.cheque'),t,0,0),
	gstOtp:stringAlphanumeric(t('appUserTests.columns.fields.gstOtp'),t,0,100),
	isActive:booleanField(t('appUserTests.columns.fields.isActive'),t),
	isAdmin:booleanField(t('appUserTests.columns.fields.isAdmin'),t),
	hasImpersonateAccess:booleanField(t('appUserTests.columns.fields.hasImpersonateAccess'),t),
	photoAttachment:fileUploadField(t('appUserTests.columns.fields.photoAttachment'),t,0,0),
	role:requiredStringField(t('appUserTests.columns.fields.role'),t,2,100),
	roleLabel:requiredStringField(t('appUserTests.columns.fields.roleLabel'),t,2,100),
	publish:requiredStringField(t('appUserTests.columns.fields.publish'),t,2,100),
	publishLabel:requiredStringField(t('appUserTests.columns.fields.publishLabel'),t,2,100),
	importDataId:stringNumeric(t('appUserTests.columns.fields.importDataId'),t,0,0),
	lastLogin:stringDateFormat(t('appUserTests.columns.fields.lastLogin'),t),
	defaultLanguage:stringOnlyAlphabets(t('appUserTests.columns.fields.defaultLanguage'),t,0,10),
	isPremiumUser:booleanField(t('appUserTests.columns.fields.isPremiumUser'),t),
	totalPlot:stringNumeric(t('appUserTests.columns.fields.totalPlot'),t,0,0),
	reportedTo:requiredStringField(t('appUserTests.columns.fields.reportedTo'),t,0,100),
	reportedBy:requiredStringField(t('appUserTests.columns.fields.reportedBy'),t,0,100),
	appUserName:stringOnlyAlphabets(t('appUserTests.columns.fields.appUserName'),t,0,0),
	gender:genderField(t('appUserTests.columns.fields.gender'),t),
	genderLabel:genderField(t('appUserTests.columns.fields.genderLabel'),t),
	createDate:stringDateFormat(t('appUserTests.columns.fields.createDate'),t),
	updateDate:stringDateFormat(t('appUserTests.columns.fields.updateDate'),t),
	deleteDate:stringDateFormat(t('appUserTests.columns.fields.deleteDate'),t),
	createById:stringNumeric(t('appUserTests.columns.fields.createById'),t,0,0),
	updateById:stringNumeric(t('appUserTests.columns.fields.updateById'),t,0,0),
	deleteById:stringNumeric(t('appUserTests.columns.fields.deleteById'),t,0,0),
	isDelete:booleanField(t('appUserTests.columns.fields.isDelete'),t),

// <!--validate-Data-->
});