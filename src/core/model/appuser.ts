export interface AppUser {
	createDate?: Date;
	id?: number;
	name?: string;
	firstName?: string;
	lastName?: string;
	mobile?: string;
	mobileVerified?: boolean;
	emailId?: string;
	emailVerified?: boolean;
	shopName?: string;
	password?: string;
	pincode?: string;
	state?: string;
	district?: string;
	address?: string;
	addressLine?: string;
	verifyShop?: string;
	verifyShopLabel?: string;
	gst?: string;
	gstCertificate?: string | null;
	photoShopFront?: string | null;
	visitingCard?: string | null;
	cheque?: string | null;
	gstOtp?: string;
	isActive?: boolean;
	isAdmin?: boolean;
	hasImpersonateAccess?: boolean;
	photoAttachment?: string | null;
	role?: string;
	roleLabel?: string;
	publish?: string;
	publishLabel?: string;
	importDataId?: number;
	lastLogin?: Date;
	defaultLanguage?: string;
	isPremiumUser?: boolean;
	totalPlot?: number;
	updateDate?: Date;
	deleteDate?: Date;
	createById?: number;
	updateById?: number;
	deleteById?: number;
	isDelete?: boolean;
  }
  
  