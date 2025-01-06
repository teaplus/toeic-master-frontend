import { AxiosResponse } from "axios";
import { callAPIWithToken } from "./jwt-service";
import { CreateTestResponseType, Test } from "../types/test";

const createTestAPI = (
  data: Test
): Promise<AxiosResponse<CreateTestResponseType>> => {
  return callAPIWithToken({
    url: "/test/create",
    method: "post",
    data: { data: data },
  });
};

const getListTestAPI = (): Promise<AxiosResponse<Test[]>> => {
  return callAPIWithToken({
    url: "/test/list",
    method: "get",
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

export { createTestAPI, getListTestAPI, getTestAPI, startTestAPI, submitTestAPI };
