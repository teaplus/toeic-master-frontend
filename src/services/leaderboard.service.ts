import { callAPIWithToken } from "./jwt-service";
import { AxiosResponse } from "axios";
import { LeaderboardResponse } from "../types/leaderboard";

export const getLeaderboardAPI = (): Promise<
  AxiosResponse<LeaderboardResponse>
> => {
  return callAPIWithToken({
    url: "/user/leaderboard",
    method: "get",
  });
};
