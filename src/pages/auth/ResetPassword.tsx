import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotice } from "../../components/common/Notice";
import {
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validation";
import { resetPasswordAPI } from "../../services/auth.service";

const ResetPassword = () => {
  const { email, token } = useParams();
  const navigate = useNavigate();
  const notice = useNotice();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidParams, setIsValidParams] = useState(true);

  useEffect(() => {
    const decodedEmail = decodeURIComponent(email || "");

    if (!token || !decodedEmail) {
      setIsValidParams(false);
      notice.show("error", "Link không hợp lệ hoặc đã hết hạn!");
    }
  }, [token, email, notice]);

  console.log("email", email);
  console.log("token", token);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = () => {
    const newPasswordError = validatePassword(formData.newPassword);
    if (newPasswordError) return newPasswordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.newPassword,
      formData.confirmPassword
    );
    if (confirmPasswordError) return confirmPasswordError;

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const decodedEmail = decodeURIComponent(email || "");
      await resetPasswordAPI({
        token: token!,
        email: decodedEmail,
        newPass: formData.newPassword,
      });

      notice.show("success", "Đặt lại mật khẩu thành công!");
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
      setError(errorMessage);
      notice.show("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidParams) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <svg
              className="h-16 w-16 text-red-500 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Link đã hết hạn hoặc không hợp lệ!
          </h2>
          <p className="text-gray-300 mb-6">
            Vui lòng yêu cầu gửi lại email đặt lại mật khẩu.
          </p>
          <button
            onClick={() => navigate("/auth/forgot-password")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Quay lại trang quên mật khẩu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Đặt lại mật khẩu
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded 
                text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded 
                text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="text-sm text-gray-400">
            <p>Yêu cầu mật khẩu:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Ít nhất 8 ký tự</li>
              <li>Bao gồm chữ hoa, chữ thường và số</li>
              <li>Có thể chứa ký tự đặc biệt</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded font-semibold text-white transition duration-200 
              ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span className="ml-2">Đang xử lý...</span>
              </div>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
