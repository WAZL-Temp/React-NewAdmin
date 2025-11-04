import { booleanField, fileUploadField, genderField, gstField, numericField, requiredStringField, stringAlphanumeric, stringAlphanumericWithSpecialChars, stringDateFormat, stringEmail, stringMobileNumber, stringNumeric, stringOnlyAlphabets, stringPassword } from "./baseSchema";

type TransFn = (key: string, params?: Record<string, unknown>) => string;


export const appUser = (t: TransFn) => ({
    name: stringOnlyAlphabets(t("appUsers.columns.fields.name"), t, 2, 100),
    firstName: stringOnlyAlphabets(t("appUsers.columns.fields.firstName"), t, 2, 100),
    lastName: stringOnlyAlphabets(t("appUsers.columns.fields.lastName"), t, 2, 100),
    mobile: stringMobileNumber(t("appUsers.columns.fields.mobile"), t, 10, 10),
    mobileVerified: booleanField(t("appUsers.columns.fields.mobileVerified"), t),
    emailId: stringEmail(t("appUsers.columns.fields.emailId"), t, 5, 100),
    emailVerified: booleanField(t("appUsers.columns.fields.emailVerified"), t),
    shopName: stringOnlyAlphabets(t("appUsers.columns.fields.shopName"), t, 2, 100),
    password: stringPassword(t("appUsers.columns.fields.password"), t, 2, 100),
    pincode: numericField(t("appUsers.columns.fields.pincode"), t, 6, 6),
    state: stringAlphanumeric(t("appUsers.columns.fields.state"), t, 1, 100),
    district: stringAlphanumeric(t("appUsers.columns.fields.district"), t, 1, 100),
    address: stringAlphanumericWithSpecialChars(t("appUsers.columns.fields.address"), t, 2, 10000),
    addressLine: stringAlphanumericWithSpecialChars(t("appUsers.columns.fields.addressLine"), t, 2, 10000),
    defaultLanguage: stringOnlyAlphabets(t("appUsers.columns.fields.defaultLanguage"), t, 2, 10),
    verifyShop: requiredStringField(t("appUsers.columns.fields.verifyShop"), t, 2, 100),
    gst: gstField(t("appUsers.columns.fields.gst"), t, 15, 15),
    gstCertificate: fileUploadField(t("appUsers.columns.fields.gstCertificate"), t, 1, 2),
    photoShopFront: fileUploadField(t("appUsers.columns.fields.photoShopFront"), t, 1, 2),
    visitingCard: fileUploadField(t("appUsers.columns.fields.visitingCard"), t, 2, 2),
    cheque: fileUploadField(t("appUsers.columns.fields.cheque"), t, 1, 2),
    gstOtp: stringAlphanumeric(t("appUsers.columns.fields.gstOtp"), t, 6, 6),
    isActive: booleanField(t("appUsers.columns.fields.isActive"), t),
    isAdmin: booleanField(t("appUsers.columns.fields.isAdmin"), t),
    photoAttachment: fileUploadField(t("appUsers.columns.fields.photoAttachment"), t, 1, 2),
    role: requiredStringField(t("appUsers.columns.fields.role"), t, 2, 100),
    publish: requiredStringField(t("appUsers.columns.fields.publish"), t, 2, 100),
    reportedTo: requiredStringField(t("appUsers.columns.fields.reportedTo"), t, 2, 100),
    reportedBy: requiredStringField(t("appUsers.columns.fields.reportedBy"), t, 2, 100),
    lastLogin: stringDateFormat(t("appUsers.columns.fields.lastLogin"), t),
    totalPlot: stringNumeric(t("appUsers.columns.fields.totalPlot"), t, 1, 100),
    gender: genderField(t("appUsers.columns.fields.gender"), t)
});