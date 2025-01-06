import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  // Tính phần trăm
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {/* Thanh tiến độ */}
      <div className="w-full bg-gray-200 rounded-full h-1 mb-4 overflow-hidden">
        <div
          className="bg-green-500 h-6 text-center text-white text-sm leading-6"
          style={{ width: `${percentage}%` }}
        >
          {percentage}%
        </div>
      </div>

      {/* Hiển thị dữ liệu */}
    </div>
  );
};

export default ProgressBar;
