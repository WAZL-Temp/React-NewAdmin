import { UserInfo } from "../types/auth";

 
let token: string = "";
let userInfo: UserInfo = { id: 0, name: "", firstName: "", lastName: "", emailId: "", lastLogin: "", mobile: "", isAdmin: false, role: "", address: "", photoAttachment: [], state: "", district: "", isPremiumUser: false, totalPlot: 0 };


export const setToken = (newToken: string) => {
  token = newToken;
};

export const getToken = () => token;

export const setUserInfo = (info: UserInfo) => {
  userInfo = info;
};

export const getUserInfo = () => userInfo;

