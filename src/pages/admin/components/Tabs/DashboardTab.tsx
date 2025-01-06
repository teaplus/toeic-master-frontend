import React from "react";

function DashboardTab() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Tổng số người dùng</h3>
          <p className="text-2xl font-bold">1,234</p>
          <span className="text-green-500 text-sm">+12% tuần này</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Bài thi hoàn thành</h3>
          <p className="text-2xl font-bold">5,678</p>
          <span className="text-green-500 text-sm">+8% tuần này</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Người dùng mới</h3>
          <p className="text-2xl font-bold">256</p>
          <span className="text-green-500 text-sm">+15% tuần này</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Điểm trung bình</h3>
          <p className="text-2xl font-bold">685</p>
          <span className="text-blue-500 text-sm">+25 điểm</span>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Biểu đồ thống kê</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          [Chart Area]
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
