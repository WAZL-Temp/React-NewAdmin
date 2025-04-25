 
let token: string = "";
let userInfo: any = {};

export const setToken = (newToken: string) => {
  token = newToken;
};

export const getToken = () => token;

export const setUserInfo = (info: any) => {
  userInfo = info;
};

export const getUserInfo = () => userInfo;

