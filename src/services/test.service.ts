import { AxiosResponse } from "axios";
import { callAPIWithToken } from "./jwt-service";
import {
  CreateTestResponseType,
  ListTestResponseType,
  Test,
} from "../types/test";
import axios from "axios";

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
}

const getListTestAPI = (params: GetListTestParams) => {
  return callAPIWithToken({
    url: "/test/list",
    method: "get",
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search,
      type: params.test_type,
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

const startTestAPI = (testId: string): Promise<AxiosResponse<any>> => {
  return callAPIWithToken({
    url: `/test/start/${testId}`,
    method: "post",
  });
};

const submitTestAPI = (data: Test): Promise<AxiosResponse<any>> => {
  return callAPIWithToken({
    url: `/test/submit`,
    method: "post",
    data: { data: data },
  });
};

export {
  createTestAPI,
  getListTestAPI,
  getTestAPI,
  startTestAPI,
  submitTestAPI,
  deleteTestAPI,
};
