import { AxiosResponse } from "axios";
import { callAPIWithToken } from "./jwt-service";
import {
  CreateTestResponseType,
  SaveAnswerResponseType,
  Test,
} from "../types/test";

const createTestAPI = (
  data: Test
): Promise<AxiosResponse<CreateTestResponseType>> => {
  return callAPIWithToken({
    url: "/test/create",
    method: "post",
    data: { data: data },
  });
};

interface GetListTestParams {
  page: number;
  limit: number;
  search?: string;
  test_type?: string;
  partsNumber?: number;
}

const getListTestAPI = (params: GetListTestParams) => {
  return callAPIWithToken({
    url: "/test/list",
    method: "get",
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || "",
      type: params.test_type || "",
      partNumber: params.partsNumber || 0,
    },
  });
};

const getListTestRecommendAPI = (params: GetListTestParams, userId: number) => {
  return callAPIWithToken({
    url: `/test/recommended-level/${userId}`,
    method: "get",
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || "",
      type: params.test_type || "",
      partNumber: params.partsNumber || 0,
    },
  });
};

const deleteTestAPI = (testId: string): Promise<AxiosResponse<any>> => {
  return callAPIWithToken({
    url: `/test/delete/${testId}`,
    method: "delete",
  });
};

const getTestAPI = (testId: string): Promise<AxiosResponse<any>> => {
  return callAPIWithToken({
    url: `/test/${testId}`,
    method: "get",
  });
};

const getTestWithCorrectAnswerAPI = (
  testId: number
): Promise<AxiosResponse<any>> => {
  return callAPIWithToken({
    url: `/test/test-review/${testId}`,
    method: "get",
  });
};

const startTestAPI = (data: {
  test_id: number;
  user_id: number;
  timeRemaining: number;
}): Promise<AxiosResponse<any>> => {
  return callAPIWithToken({
    url: `/test/start/`,
    method: "post",
    data: data,
  });
};

const submitTestAPI = (testSessionId: number): Promise<AxiosResponse<any>> => {
  return callAPIWithToken({
    url: `/test/submit/${testSessionId}`,
    method: "post",
  });
};

const getTestResponseAPI = (
  testSessionId: string
): Promise<AxiosResponse<any>> => {
  return callAPIWithToken({
    url: `/test/test-session-responses/${testSessionId}`,
    method: "get",
  });
};

const saveAnswerAPI = (data: {
  testId: number;
  testSessionId: number;
  questionId: number;
  answerId: number;
  timeRemaining: number;
}): Promise<AxiosResponse<SaveAnswerResponseType>> => {
  return callAPIWithToken({
    url: `/test/save-answer`,
    method: "post",
    data: data,
  });
};

const getTestStatsAPI = (): Promise<AxiosResponse<any>> => {
  return callAPIWithToken({
    url: `test/statistics`,
    method: "get",
  });
};

export {
  createTestAPI,
  getListTestAPI,
  getTestAPI,
  startTestAPI,
  submitTestAPI,
  deleteTestAPI,
  saveAnswerAPI,
  getTestResponseAPI,
  getTestWithCorrectAnswerAPI,
  getTestStatsAPI,
  getListTestRecommendAPI,
};
