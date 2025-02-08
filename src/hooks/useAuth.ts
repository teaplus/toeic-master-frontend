import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { UserInfo } from "../types/user";
import { getUserInfoAPI } from "../services/user.service";
import { useNavigate } from "react-router-dom";
import { useNotice } from "../components/common/Notice";
import { getTestStatsAPI } from "../services/test.service";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [testStats, setTestStats] = useState<{ type: string; count: number }[]>(
    []
  );
  const navigate = useNavigate();
  const notice = useNotice();

  const getUserInfo = async () => {
    const id = Cookies.get("id");
    if (!id) {
      setIsAuthenticated(false);
      setIsLoading(false);
      notice.show("error", "Please login to continue");
      navigate("/");
      return null;
    }
    const response = await getUserInfoAPI(Number(id));
    if (response.data.statusCode === 200) {
      setUser(response.data.data);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
    return null;
  };

  const getTestStats = async () => {
    const response = await getTestStatsAPI();
    if (response.data.statusCode === 200) {
      setTestStats(response.data.data);
    }
  };

  useEffect(() => {
    const token = Cookies.get("id");
    getUserInfo();
    setIsAuthenticated(!!token);
    setIsLoading(false);
    const role = Cookies.get("role");
    if (role) {
      setRole(role);
    }
    getTestStats();
  }, []);

  return { isAuthenticated, isLoading, user, role, testStats };
};
