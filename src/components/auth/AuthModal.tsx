import React, { useEffect, useRef, useState } from "react";
import GoogleLoginButton from "../common/GoogleLoginButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { authenGoogle } from "../../services/jwt-axios";
import { loginAPI, registerAPI } from "../../services/auth.service";
import Cookies from "js-cookie";
import {
  validateUsername,
  validatePassword,
  validateEmail,
  validateConfirmPassword,
} from "../../utils/validation";
import { useNotice } from "../common/Notice";
import ForgotPassword from "./ForgotPassword";

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

interface FormErrors {
  username?: string;
  password?: string;
  email?: string;
  confirmPassword?: string;
  server?: string; // Thêm server error
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const notice = useNotice();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const [formState, setFormState] = useState<FormState>({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

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

    // Clear errors khi user nhập lại
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }

    // Clear confirm password error khi thay đổi password
    if (name === "password" && formErrors.confirmPassword) {
      setFormErrors({ ...formErrors, confirmPassword: undefined });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormErrors({});

    if (!validateForm()) return;

    setIsSubmitting(true);

    if (activeTab === "login") {
      try {
        const response = await loginAPI({
          username: formState.username,
          password: formState.password,
        });

        const { data } = response;
        notice.show("success", "Đăng nhập thành công");

        const user = data.data.user;
        Cookies.set("accessToken", data.data.access_token);
        Cookies.set("refreshToken", data.data.refresh_Token);
        Cookies.set("user", JSON.stringify(user));
        Cookies.set("username", data.data.user.username);
        Cookies.set("role", data.data.user.role);
        Cookies.set("id", data.data.user.id);
        onClose();
        window.location.reload();
      } catch (error: any) {
        if (error.response?.status === 404) {
          setFormErrors({
            server: "Tên đăng nhập hoặc mật khẩu không chính xác",
          });
        } else {
          setFormErrors({
            server: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
    if (activeTab === "register") {
      registerAPI({
        username: formState.username,
        password: formState.password,
        email: formState.email,
      })
        .then((response) => {
          const { data } = response;
          notice.show("success", data.data.message);
          console.log("response", response);
          onClose();
          window.location.reload();
        })
        .catch((error: any) => {
          console.log("error", error);
          if (error.response?.status === 400) {
            setFormErrors({
              server: "Tên đăng nhập hoặc email đã tồn tại",
            });
          } else {
            setFormErrors({
              server: "Đã có lỗi xảy ra, vui lòng thử lại sau",
            });
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const handleLoginSuccess = async (token: string) => {
    console.log("Google JWT Token:", token);
    // Gửi token lên server để xác thực
    // const response = await callApi()
    await authenGoogle
      .postData("/auth/oauth-google", { token: token })
      .then((response) => {
        const { data } = response;
        console.log("response", data);
        notice.show("success", "Successfully authenticated");

        const user = data.data.user;
        Cookies.set("accessToken", data.data.access_token);
        Cookies.set("refreshToken", data.data.refresh_Token);
        Cookies.set("user", JSON.stringify(user));
        Cookies.set("username", data.data.user.username);
        Cookies.set("role", data.data.user.role);
        Cookies.set("id", data.data.user.id);
        onClose();
        window.location.reload();
      });
  };

  const handleLoginFailure = (error: any) => {
    console.error("Google Login Error:", error);
  };

  const handleAgreeToTerms = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeToTerms(e.target.checked);
    // Clear server error khi user check vào checkbox
    if (formErrors.server) {
      setFormErrors({ ...formErrors, server: undefined });
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    // Username validation
    const usernameError = validateUsername(formState.username);
    if (usernameError) errors.username = usernameError;

    // Password validation
    const passwordError = validatePassword(formState.password);
    if (passwordError) errors.password = passwordError;

    if (activeTab === "register") {
      // Email validation
      const emailError = validateEmail(formState.email);
      if (emailError) errors.email = emailError;

      // Password validation
      if (!formState.password) {
        errors.password = "Vui lòng nhập mật khẩu";
      } else {
        // Check độ dài tối thiểu
        if (formState.password.length < 6) {
          errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }
        // Check pattern (ít nhất 1 chữ và 1 số)
        if (
          !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(
            formState.password
          )
        ) {
          errors.password = "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số";
        }
      }

      // Confirm Password validation
      if (!formState.confirmPassword) {
        errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      } else if (formState.password !== formState.confirmPassword) {
        errors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }

      // Validate terms agreement
      if (!agreeToTerms) {
        errors.server = "Vui lòng đồng ý với điều khoản sử dụng";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  if (showForgotPassword) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-gray-800 shadow-md rounded-lg w-[500px] p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            &#x2715;
          </button>
          <ForgotPassword
            onClose={onClose}
            onBack={() => setShowForgotPassword(false)}
          />
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-800 shadow-md rounded-lg w-[500px] h-[650px] p-8 relative">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formState.username}
                  onChange={handleChange}
                  placeholder="Tên tài khoản"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 bg-gray-700 text-white
                    ${
                      formErrors.username
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-blue-500"
                    }`}
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.username}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 bg-gray-700 text-white
                    ${
                      formErrors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-blue-500"
                    }`}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {formErrors.server && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{formErrors.server}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded
                  ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>
            <div className="text-right mt-4">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-500 hover:text-blue-400 text-sm"
              >
                Quên mật khẩu?
              </button>
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
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 bg-gray-700 text-white
                    ${
                      formErrors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-blue-500"
                    }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Tên tài khoản"
                  value={formState.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 bg-gray-700 text-white
                    ${
                      formErrors.username
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-blue-500"
                    }`}
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.username}
                  </p>
                )}
              </div>

              <div className="mb-4 relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formState.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 bg-gray-700 text-white
                    ${
                      formErrors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-blue-500"
                    }`}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="mb-4 relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  value={formState.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 bg-gray-700 text-white
                    ${
                      formErrors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-blue-500"
                    }`}
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              {formErrors.server && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <span className="block sm:inline">{formErrors.server}</span>
                </div>
              )}

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeToTerms}
                  onChange={handleAgreeToTerms}
                  className={`mr-2 ${
                    !agreeToTerms && formErrors.server ? "border-red-500" : ""
                  }`}
                />
                <label htmlFor="agree" className="text-gray-400 text-sm">
                  Tôi đồng ý chia sẻ thông tin và đồng ý với{" "}
                  <span className="text-blue-500 cursor-pointer hover:underline">
                    Chính sách bảo mật dữ liệu cá nhân
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded
                  ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  "Đăng ký"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
