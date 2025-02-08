import { callAPIWithToken } from "./jwt-service";
import { AxiosResponse } from "axios";
import {
  DashboardStatsResponse,
  PeriodStatsResponse,
  StatsPeriod,
} from "../types/dashboard";

const getDashboardStatsAPI = (): Promise<
  AxiosResponse<DashboardStatsResponse>
> => {
  return callAPIWithToken({
    url: "/admin/dashboard/stats",
    method: "get",
  });
};

const getPeriodStatsAPI = (
  period: StatsPeriod,
  year: number
): Promise<AxiosResponse<PeriodStatsResponse>> => {
  return callAPIWithToken({
    url: `/admin/stats/${period}`,
    method: "get",
    params: { year },
  });
};

export { getDashboardStatsAPI, getPeriodStatsAPI };
