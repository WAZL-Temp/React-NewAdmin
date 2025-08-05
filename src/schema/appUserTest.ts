import { booleanField, fileUploadField, genderField, gstField, numericField, requiredStringField, stringAlphanumeric, stringAlphanumericWithSpecialChars, stringDateFormat, stringEmail, stringMobileNumber, stringNumeric, stringOnlyAlphabets, stringPassword } from "./baseSchema";

type TransFn = (key: string, params?: Record<string, unknown>) => string;


export const appUserTestValidate = (t: TransFn) => ({
	name: stringOnlyAlphabets(t("appUserTests.columns.fields.name"), t, 2, 100),
	firstName: stringOnlyAlphabets(t("appUserTests.columns.fields.firstName"), t, 2, 100),
	lastName: stringOnlyAlphabets(t("appUserTests.columns.fields.lastName"), t, 2, 100),
	mobile: stringMobileNumber(t("appUserTests.columns.fields.mobile"), t, 10, 10),
	mobileVerified: booleanField(t("appUserTests.columns.fields.mobileVerified"), t),
	emailId: stringEmail(t("appUserTests.columns.fields.emailId"), t, 5, 100),
	emailVerified: booleanField(t("appUserTests.columns.fields.emailVerified"), t),
	shopName: stringOnlyAlphabets(t("appUserTests.columns.fields.shopName"), t, 2, 100),
	password: stringPassword(t("appUserTests.columns.fields.password"), t, 2, 100),
	pincode: numericField(t("appUserTests.columns.fields.pincode"), t, 6, 6),
	state: stringAlphanumeric(t("appUserTests.columns.fields.state"), t, 1, 100),
	district: stringAlphanumeric(t("appUserTests.columns.fields.district"), t, 1, 100),
	address: stringAlphanumericWithSpecialChars(t("appUserTests.columns.fields.address"), t, 2, 10000),
	addressLine: stringAlphanumericWithSpecialChars(t("appUserTests.columns.fields.addressLine"), t, 2, 10000),
	defaultLanguage: stringOnlyAlphabets(t("appUserTests.columns.fields.defaultLanguage"), t, 2, 10),
	verifyShop: requiredStringField(t("appUserTests.columns.fields.verifyShop"), t, 2, 100),
	gst: gstField(t("appUserTests.columns.fields.gst"), t, 15, 15),
	gstCertificate: fileUploadField(t("appUserTests.columns.fields.gstCertificate"), t, 1, 2),
	photoShopFront: fileUploadField(t("appUserTests.columns.fields.photoShopFront"), t, 1, 2),
	visitingCard: fileUploadField(t("appUserTests.columns.fields.visitingCard"), t, 2, 2),
	cheque: fileUploadField(t("appUserTests.columns.fields.cheque"), t, 1, 2),
	gstOtp: stringAlphanumeric(t("appUserTests.columns.fields.gstOtp"), t, 6, 6),
	isActive: booleanField(t("appUserTests.columns.fields.isActive"), t),
	isAdmin: booleanField(t("appUserTests.columns.fields.isAdmin"), t),
	photoAttachment: fileUploadField(t("appUserTests.columns.fields.photoAttachment"), t, 1, 2),
	role: requiredStringField(t("appUserTests.columns.fields.role"), t, 2, 100),
	publish: requiredStringField(t("appUserTests.columns.fields.publish"), t, 2, 100),
	reportedTo: requiredStringField(t("appUserTests.columns.fields.reportedTo"), t, 2, 100),
	reportedBy: requiredStringField(t("appUserTests.columns.fields.reportedBy"), t, 2, 100),
	lastLogin: stringDateFormat(t("appUserTests.columns.fields.lastLogin"), t),
	totalPlot: stringNumeric(t("appUserTests.columns.fields.totalPlot"), t, 1, 100),
	gender: genderField(t("appUserTests.columns.fields.gender"), t)
});