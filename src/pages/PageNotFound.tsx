import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-500 animate-pulse">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="mb-8">
          <svg
            className="h-24 w-24 text-gray-400 mx-auto animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Oops! Trang không tồn tại
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di
            chuyển.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 
              text-white rounded-lg transition duration-200 mr-4"
          >
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại
            </div>
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
              hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition duration-200"
          >
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Về trang chủ
            </div>
          </button>
        </div>

        {/* Additional Links */}
        <div className="mt-8 text-gray-400">
          <p>Bạn có thể thử:</p>
          <ul className="mt-2 space-y-2">
            <li>
              <a href="/" className="text-blue-400 hover:text-blue-300">
                • Kiểm tra lại đường dẫn
              </a>
            </li>
            <li>
              <a href="/search" className="text-blue-400 hover:text-blue-300">
                • Tìm kiếm nội dung
              </a>
            </li>
            <li>
              <a href="/contact" className="text-blue-400 hover:text-blue-300">
                • Liên hệ hỗ trợ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
