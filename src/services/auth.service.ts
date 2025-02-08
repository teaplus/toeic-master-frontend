import { AxiosResponse } from "axios";
import { callAPI, callAPIWithToken } from "../services/jwt-service";
import {
  Login,
  LoginResponseType,
  Register,
  RegisterResponseType,
  ResetPassword,
  VerifyResponseType,
} from "../types/authen";

const registerAPI = (
  data: Register
): Promise<AxiosResponse<RegisterResponseType>> => {
  return callAPI({
    url: "/auth/register",
    method: "post",
    data: data,
  });
};

const loginAPI = (data: Login): Promise<AxiosResponse<LoginResponseType>> => {
  return callAPI({
    url: "/auth/login",
    method: "post",
    data: data,
  });
};

const logoutAPI = (): Promise<AxiosResponse<LoginResponseType>> => {
  return callAPIWithToken({
    url: "/auth/logout/",
    method: "post",
  });
};

const verifyEmailAPI = (email: string): Promise<AxiosResponse<any>> => {
  return callAPI({
    url: `/auth/resend-verification/${email}`,
    method: "post",
  });
};
const verifyAPI = (
  token: string
): Promise<AxiosResponse<VerifyResponseType>> => {
  return callAPI({
    url: `/auth/verify-email`,
    method: "post",
    params: {
      token: token,
    },
  });
};

const forgotPasswordAPI = (email: string): Promise<AxiosResponse<any>> => {
  return callAPI({
    url: `/auth/forgot-password`,
    method: "post",
    data: { email },
  });
};

const resetPasswordAPI = (data: ResetPassword): Promise<AxiosResponse<any>> => {
  return callAPI({
    url: `/auth/reset-password`,
    method: "post",
    data: data,
  });
};

interface ChangePasswordResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export const changePasswordAPI = (
  data: ChangePasswordRequest
): Promise<AxiosResponse<ChangePasswordResponse>> => {
  return callAPIWithToken({
    url: "/auth/change-password",
    method: "post",
    data,
  });
};

export {
  loginAPI,
  logoutAPI,
  verifyEmailAPI,
  verifyAPI,
  registerAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
};
