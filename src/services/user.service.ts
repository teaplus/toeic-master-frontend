import { callAPIWithToken } from "./jwt-service";
import { AxiosResponse } from "axios";
import {
  UserInfo,
  UserInfoResponse,
  UserListResponse,
  PartScoresResponse,
  UserProgressResponse,
} from "../types/user";

const getUserInfoAPI = (
  id: number
): Promise<AxiosResponse<UserInfoResponse>> => {
  return callAPIWithToken({
    url: `/user/profile/${id}`,
    method: "get",
  });
};

const updateUserInfoAPI = (
  payload: Partial<UserInfo>
): Promise<AxiosResponse<UserInfoResponse>> => {
  return callAPIWithToken({
    url: "/user/update-profile",
    method: "post",
    data: { data: payload },
  });
};

const getUserListAPI = (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<AxiosResponse<UserListResponse>> => {
  return callAPIWithToken({
    url: "/admin/users",
    method: "get",
    params: {
      page,
      limit,
      search,
    },
  });
};

const updateUserStatusAPI = (
  id: string,
  status: boolean
): Promise<AxiosResponse<any>> => {
  return callAPIWithToken({
    url: `/admin/users/${id}/status`,
    method: "patch",
    data: { isActive: status },
  });
};

const createUserAPI = (
  payload: Partial<UserInfo>
): Promise<AxiosResponse<any>> => {
  return callAPIWithToken({
    url: "/admin/create-user",
    method: "post",
    data: payload,
  });
};

const getAnalyzePartScoresAPI = (
  userId: string
): Promise<AxiosResponse<PartScoresResponse>> => {
  return callAPIWithToken({
    url: `/user/analyze-part-scores/${userId}`,
    method: "get",
  });
};

const getUserProgressAPI = (
  userId: string
): Promise<AxiosResponse<UserProgressResponse>> => {
  return callAPIWithToken({
    url: `/admin/user-progress/${userId}`,
    method: "get",
  });
};

export {
  getUserInfoAPI,
  updateUserInfoAPI,
  getUserListAPI,
  updateUserStatusAPI,
  createUserAPI,
  getAnalyzePartScoresAPI,
  getUserProgressAPI,
};
