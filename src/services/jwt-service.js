import axios from "axios";
import Cookies from "js-cookie";
let urlApi = process.env.REACT_APP_API_URL || "http://localhost:3000";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const callAPI = axios.create({
  baseURL: urlApi, // YOUR_API_URL HERE
  timeout: 10000,
  timeoutErrorMessage: "Timeout error",
  headers: {
    "Content-Type": "application/json",
  },
});

callAPI.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response && err.response.status === 403) {
      window.location.href = "/403";
    }
    return Promise.reject(err);
  }
);

export const callAPIWithToken = axios.create({
  baseURL: urlApi,
  timeout: 10000,
  timeoutErrorMessage: "Timeout error",
});

callAPIWithToken.interceptors.request.use(
  (req) => {
    const token = Cookies.get("accessToken");
    req.headers = {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    };
    return req;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
  { synchronous: true }
);

callAPIWithToken.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    const originalConfig = err.config;
    if (err.response?.status === 401 && !originalConfig._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          // Nếu token đang được làm mới, đưa yêu cầu vào hàng đợi
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Cập nhật header Authorization với token mới
            originalConfig.headers["Authorization"] = "Bearer " + token;
            return axios(originalConfig); // Gửi lại yêu cầu ban đầu
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      const refreshToken = Cookies.get("refreshToken");
      originalConfig._retry = true;
      isRefreshing = true;

      // Gửi yêu cầu làm mới token
      return new Promise(function (resolve, reject) {
        axios
          .post(`${urlApi}/auth/refresh-token`, { refreshToken })
          .then(({ data }) => {
            const { newAccessToken, newRefreshToken } = data.data;
            Cookies.set("accessToken", newAccessToken);
            Cookies.set("refreshToken", newRefreshToken);
            originalConfig.headers["Authorization"] =
              "Bearer " + newAccessToken;
            processQueue(null, newAccessToken);
            resolve(callAPIWithToken(originalConfig));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            Cookies.remove("user");
            Cookies.remove("role");
            Cookies.remove("id");
            Cookies.remove("username");
            window.location.href = "/login";
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(err);
  }
);
