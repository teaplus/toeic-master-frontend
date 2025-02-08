import React, { useState } from "react";
import { useNotice } from "../common/Notice";
import { validateEmail } from "../../utils/validation";
import { forgotPasswordAPI } from "../../services/auth.service";

interface ForgotPasswordProps {
  onClose: () => void;
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose, onBack }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const notice = useNotice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    try {
      // Gọi API gửi email reset password
      await forgotPasswordAPI(email);
      setIsSent(true);
      notice.show(
        "success",
        "Link đặt lại mật khẩu đã được gửi vào email của bạn!"
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!"
      );
      notice.show("error", "Không thể gửi email. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mr-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-white">Quên mật khẩu</h2>
      </div>

      {!isSent ? (
        <>
          <p className="text-gray-400 mb-6">
            Nhập email của bạn để nhận link đặt lại mật khẩu
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded 
                text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
                </div>
              ) : (
                "Gửi link đặt lại mật khẩu"
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Email đã được gửi!
          </h3>
          <p className="text-gray-400 mb-6">
            Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại
            mật khẩu.
          </p>
          <button
            onClick={onBack}
            className="text-blue-500 hover:text-blue-400"
          >
            Quay lại đăng nhập
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
