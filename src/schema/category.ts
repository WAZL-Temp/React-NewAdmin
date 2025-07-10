import { booleanField, fileUploadField, genderField, gstField, numericField, requiredStringField, stringAlphanumeric, stringAlphanumericWithSpecialChars, stringDateFormat, stringEmail, stringMobileNumber, stringNumeric, stringOnlyAlphabets, stringPassword } from "./baseSchema";

type TransFn = (key: string, params?: Record<string, unknown>) => string;

export const categoryValidate = (t: TransFn) => ({
	id:stringNumeric(t('categories.columns.fields.id'),t,0,0),
	name:stringOnlyAlphabets(t('categories.columns.fields.name'),t,1,200),
	slug:stringOnlyAlphabets(t('categories.columns.fields.slug'),t,0,200),
	icon:stringOnlyAlphabets(t('categories.columns.fields.icon'),t,0,0),
	importDataId:stringNumeric(t('categories.columns.fields.importDataId'),t,0,0),
	createDate:stringDateFormat(t('categories.columns.fields.createDate'),t),
	updateDate:stringDateFormat(t('categories.columns.fields.updateDate'),t),
	deleteDate:stringDateFormat(t('categories.columns.fields.deleteDate'),t),
	createById:stringNumeric(t('categories.columns.fields.createById'),t,0,0),
	updateById:stringNumeric(t('categories.columns.fields.updateById'),t,0,0),
	deleteById:stringNumeric(t('categories.columns.fields.deleteById'),t,0,0),
	isDelete:booleanField(t('categories.columns.fields.isDelete'),t),

// <!--validate-Data-->
});