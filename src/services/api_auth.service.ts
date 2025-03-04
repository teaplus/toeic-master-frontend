const baseApi = "https://api.toeicmaster.online/";

export const callApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${baseApi}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

export const callApiWithToken = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // Lấy token từ localStorage
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // Headers mặc định
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    ...options.headers,
  };

  let response = await fetch(`${baseApi}${endpoint}`, {
    ...options,
    headers,
  });

  
  if (response.status === 401 && refreshToken) {
 
    const refreshedToken = await refreshAccessToken(refreshToken);

    if (refreshedToken) {
    
      localStorage.setItem("accessToken", refreshedToken);
      response = await fetch(`${baseApi}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${refreshedToken}`,
        },
      });
    } else {
      throw new Error("Session expired. Please login again.");
    }
  }


  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

// Hàm gọi API refreshToken
const refreshAccessToken = async (
  refreshToken: string
): Promise<string | null> => {
  try {
    const response = await fetch(`${baseApi}/auth/refreshToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return null;
  }
};
