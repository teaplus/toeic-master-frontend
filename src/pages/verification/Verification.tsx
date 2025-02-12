import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotice } from "../../components/common/Notice";
import { verifyAPI } from "../../services/auth.service";

const Verification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const notice = useNotice();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        setIsVerifying(false);
        setIsSuccess(false);
        notice.show("error", "Token không hợp lệ!");
        return;
      }

      try {
        const response = await verifyAPI(token);
        if (response.data.data) {
          setIsSuccess(true);
          notice.show("success", "Xác thực tài khoản thành công!");
          setTimeout(() => navigate("/"), 2000);
        } else {
          setIsSuccess(false);
          notice.show(
            "error",
            "Xác thực tài khoản thất bại. Vui lòng thử lại!"
          );
        }
      } catch (error) {
        setIsSuccess(false);
        notice.show("error", "Xác thực tài khoản thất bại. Vui lòng thử lại!");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAccount();
  }, [token, navigate, notice]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Đang xác thực tài khoản...
          </h2>
          <p className="text-gray-300">
            Vui lòng đợi trong khi chúng tôi xác thực tài khoản của bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          {isSuccess ? (
            <svg
              className="h-16 w-16 text-green-500 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
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
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          {isSuccess ? "Xác thực thành công!" : "Xác thực thất bại!"}
        </h2>

        <p className="text-gray-300 mb-6">
          {isSuccess
            ? "Tài khoản của bạn đã được xác thực thành công. Bạn sẽ được chuyển hướng về trang chủ trong giây lát."
            : "Xác thực tài khoản thất bại. Vui lòng kiểm tra lại email hoặc yêu cầu gửi lại email xác thực."}
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
