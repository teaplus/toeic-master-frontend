import React, { useEffect, useRef, useState } from "react";
import GoogleLoginButton from "../common/GoogleLoginButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { callApi } from "../../services/api_auth.service";
import apiAuthen, { authenGoogle } from "../../services/jwt-axios";
import { Login } from "../../types/authen";
import { loginAPI } from "../../services/auth.service";
import Cookies from "js-cookie";
import {
  validateUsername,
  validatePassword,
  validateEmail,
  validateConfirmPassword,
} from "../../utils/validation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  username: string;
  password: string;
  email: string;
  confirmPassword: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const [formState, setFormState] = useState<FormState>({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Lấy giá trị đã được trình duyệt điền sẵn
    if (usernameRef.current) {
      setFormState({ ...formState, username: usernameRef.current.value });
    }
    if (passwordRef.current) {
      setFormState({ ...formState, password: passwordRef.current.value });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });

    // Kiểm tra validation ngay khi người dùng nhập
    const validationError = validateForm();
    setError(validationError);
  };

  const handleSubmit = (event: React.FormEvent) => {
    console.log("Tên đăng nhập:", formState.username);
    console.log("Mật khẩu:", formState.password);
    event.preventDefault();

    // Kiểm tra validation trước khi gửi
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      console.log("Validation Error:", validationError);
      return;
    }

    console.log("validationError", validationError);

    // Proceed with API call if all validations pass
    console.log("Tên đăng nhập:", formState.username);
    console.log("Mật khẩu:", formState.password);
    loginAPI({ username: formState.username, password: formState.password })
      .then((response) => {
        const { data } = response;
        console.log("response", data.data.access_token);

        const user = data.data.user;
        Cookies.set("accessToken", data.data.access_token);
        Cookies.set("refreshToken", data.data.refresh_Token);
        Cookies.set("user", JSON.stringify(user));
        Cookies.set("username", data.data.user.username);
        Cookies.set("role", data.data.user.role);
        onClose();
        window.location.reload();
      })
      .catch((response) => {
        console.log("error", response);
      });
  };

  const handleLoginSuccess = async (token: string) => {
    console.log("Google JWT Token:", token);
    // Gửi token lên server để xác thực
    // const response = await callApi()
    await authenGoogle
      .postData("/auth/oauth-google", { token: token })
      .then((Response) => {
        console.log("response", Response);
      });
  };

  const handleLoginFailure = (error: any) => {
    console.error("Google Login Error:", error);
  };

  // Hàm kiểm tra validation
  const validateForm = () => {
    let validationError: string | null;

    validationError = validateUsername(formState.username);
    if (validationError) return validationError;

    validationError = validatePassword(formState.password);
    if (validationError) return validationError;

    if (activeTab === "register") {
      validationError = validateEmail(formState.email);
      if (validationError) return validationError;

      validationError = validateConfirmPassword(
        formState.password,
        formState.confirmPassword
      );
      if (validationError) return validationError;
    }

    return null; // Không có lỗi
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-800 shadow-md rounded-lg w-[500px] h-[600px] p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          &#x2715;
        </button>

        {/* Tab Switch */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`font-semibold px-4 py-2 ${
              activeTab === "login"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`font-semibold px-4 py-2 ${
              activeTab === "register"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-center text-lg font-semibold mb-6 text-white">
            {activeTab === "login"
              ? "Đăng nhập bằng tài khoản"
              : "Đăng ký tài khoản mới"}
          </h2>
          <div className="flex justify-center mb-4">
            <GoogleOAuthProvider
              clientId={`${process.env.REACT_APP_WEB_CLIENT_ID}`}
            >
              <GoogleLoginButton
                onLoginSuccess={handleLoginSuccess}
                onLoginFailure={handleLoginFailure}
                type={activeTab === "login" ? "signin_with" : "signup_with"}
              />
            </GoogleOAuthProvider>
          </div>
          <div className="text-center text-gray-500 mb-4">HOẶC</div>
        </div>
        {activeTab === "login" ? (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formState.username}
                  onChange={handleChange}
                  placeholder="Tên tài khoản"
                  className="w-full px-4 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4 relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  id="password"
                  value={formState.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded"
              >
                Đăng nhập
              </button>
            </form>
            <div className="text-right mt-4">
              <a href="#" className="text-blue-500">
                Quên mật khẩu
              </a>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Tên tài khoản"
                  value={formState.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>

              <div className="mb-4 relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formState.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4 relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  value={formState.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex items-center mb-6">
                <input type="checkbox" id="agree" className="mr-2"></input>
                <label htmlFor="agree" className="text-gray-400 text-sm">
                  Tôi đồng ý chia sẻ thông tin và đồng ý với{" "}
                  <p className="text-blue-500">
                    Chính sách bảo mật dữ liệu cá nhân
                  </p>
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded"
              >
                Đăng ký
              </button>
            </form>
            <div className="text-left text-gray-500 text-sm ">
              <a href="#" className="text-blue-500">
                đã có tài khoản? Đăng nhập
              </a>
              .
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
