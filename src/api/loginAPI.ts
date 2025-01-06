import { AxiosResponse } from "axios";
import { callAPI, callAPIWithToken } from "../services/jwt-service";
import { Login, LoginResponseType } from "../types/authen";

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

export { loginAPI, logoutAPI };
