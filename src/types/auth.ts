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
    photoAttachment:  PhotoAttachment[];
    state: string;
    district: string;
    isPremiumUser: boolean;
    totalPlot: number;
}

export interface PhotoAttachment {
    fileName: string;
    filePath: string;
    type: string;
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

export interface FirebaseUser {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    isAnonymous: boolean;
    photoURL: string;
    providerData: ProviderData[];
    stsTokenManager: StsTokenManager;
    createdAt: string;
    lastLoginAt: string;
    apiKey: string;
    appName: string;
  }
  
  export interface ProviderData {
    providerId: string;
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string | null;
    photoURL: string;
  }
  
  export interface StsTokenManager {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
  }
  