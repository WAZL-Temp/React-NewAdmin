import { booleanField, stringDateFormat, stringNumeric, stringOnlyAlphabets } from "./baseSchema";

type TransFn = (key: string, params?: Record<string, unknown>) => string;

export const seoValidate = (t: TransFn) => ({
	id: stringNumeric(t('seos.columns.fields.id'), t, 0, 0),
	name: stringOnlyAlphabets(t('seos.columns.fields.name'), t, 0, 1000),
	title: stringOnlyAlphabets(t('seos.columns.fields.title'), t, 0, 1000),
	description: stringOnlyAlphabets(t('seos.columns.fields.description'), t, 0, 1000),
	keyWords: stringOnlyAlphabets(t('seos.columns.fields.keyWords'), t, 0, 1000),
	imageUrl: stringOnlyAlphabets(t('seos.columns.fields.imageUrl'), t, 0, 1000),
	url: stringOnlyAlphabets(t('seos.columns.fields.url'), t, 0, 1000),
	mainUrl: stringOnlyAlphabets(t('seos.columns.fields.mainUrl'), t, 0, 1000),
	createDate: stringDateFormat(t('seos.columns.fields.createDate'), t),
	updateDate: stringDateFormat(t('seos.columns.fields.updateDate'), t),
	deleteDate: stringDateFormat(t('seos.columns.fields.deleteDate'), t),
	createById: stringNumeric(t('seos.columns.fields.createById'), t, 0, 0),
	updateById: stringNumeric(t('seos.columns.fields.updateById'), t, 0, 0),
	deleteById: stringNumeric(t('seos.columns.fields.deleteById'), t, 0, 0),
	isDelete: booleanField(t('seos.columns.fields.isDelete'), t),

	// <!--validate-Data-->
});