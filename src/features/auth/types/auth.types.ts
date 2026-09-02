export type UserRole =
  | "reader"
  | "admin";


export interface User {

  id:string;

  name:string;

  phone:string;

  email:string;

  role:UserRole;

  profileImage:string;

}



export interface RequestOtpResponse {

  message:string;

  data:{
    isRegister:boolean;

    otp?:string;
  };

}



export interface VerifyOtpResponse {

  message:string;

  data:{

    isRegister:boolean;

    accessToken:string;

    refreshToken:string;

    user:User;

  };

}



export interface RefreshTokenResponse {

  message:string;

  data:{

    accessToken:string;

    refreshToken:string;

  };

}



export interface MeResponse {

  message:string;

  data:{

    user:User;

  };

}