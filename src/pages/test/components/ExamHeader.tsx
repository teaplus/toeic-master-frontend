import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ExamHeaderProps {
  testName: string;
  isReview?: boolean;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({
  testName,
  isReview,
}) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (isReview) {
      navigate("/");
    } else {
      setShowModal(true);
    }
  };

  const handleConfirmHome = () => {
    navigate("/");
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleHomeClick}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Trang chủ
            </button>
            <h1 className="text-xl font-semibold text-gray-800 flex-1 text-center">
              {testName}
            </h1>
            <div className="w-[100px]" /> {/* Spacer để cân bằng layout */}
          </div>
        </div>
      </div>

      {/* Modal chỉ hiển thị khi không phải review mode */}
      {!isReview && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận tạm dừng
            </h3>
            <p className="text-gray-500 mb-6">
              Bạn có chắc chắn muốn tạm dừng bài kiểm tra? Tiến độ làm bài sẽ
              được lưu lại.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmHome}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamHeader;
