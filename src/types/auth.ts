export interface UserInfo {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    emailId: string;
    lastLogin: string;
    mobile: string;
    isAdmin: boolean;
    role: string;
    address: string;
    photoAttachment: string;
    state: string;
    district: string;
    isPremiumUser: boolean;
    totalPlot: number;
}

export interface LoginResponse {
    token: string;
    userInfo: UserInfo[];
    expireDate: string;
}

export interface LoginPayload {
    emailId: string;
    pin: string;
}
