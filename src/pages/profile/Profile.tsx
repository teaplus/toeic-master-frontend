import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts"; // Import ECharts
import "./profile.css";

const Profile = () => {
  const [name, setName] = useState("nanyak");
  const [email, setEmail] = useState("nanyak@example.com");
  const [phone, setPhone] = useState("0948-105-227");
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");
  const [isEditing, setIsEditing] = useState(false);
  const [testHistory, setTestHistory] = useState([
    { testName: "Bài thi mô phỏng 1", score: 750, date: "2024-01-01" },
    { testName: "Bài thi mô phỏng 2", score: 800, date: "2024-01-15" },
  ]);
  const [suggestions, setSuggestions] = useState([
    "Bài thi mô phỏng 3",
    "Bài tập Listening nâng cao",
  ]);

  const scoreChartRef = useRef<HTMLDivElement | null>(null);
  const radarChartRef = useRef<HTMLDivElement | null>(null); // Tham chiếu cho biểu đồ radar

  // Dữ liệu cho biểu đồ điểm theo thời gian
  const scoreData = {
    xAxis: {
      type: "category",
      data: ["2024-01-01", "2024-01-15", "2024-01-30"], // Ngày thi
    },
    series: [
      {
        name: "Điểm",
        type: "line",
        data: [750, 800, 850], // Điểm số
        smooth: true,
        itemStyle: {
          color: "rgba(75,192,192,1)",
        },
      },
    ],
  };

  // Dữ liệu cho biểu đồ phân tích kỹ năng
  const skillData = {
    xAxis: {
      type: "category",
      data: [
        "Listening",
        "Reading",
        "Speaking",
        "Writing",
        "Grammar",
        "Vocabulary",
        "Comprehension",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Kỹ năng",
        type: "bar",
        data: [75, 80, 70, 65, 85, 90, 60], // Điểm cho từng kỹ năng
        itemStyle: {
          color: "rgba(255, 206, 86, 1)",
        },
      },
    ],
  };

  // Dữ liệu cho biểu đồ radar
  const radarData = {
    indicators: [
      { name: "Listening", max: 100 },
      { name: "Reading", max: 100 },
      { name: "Speaking", max: 100 },
      { name: "Writing", max: 100 },
      { name: "Grammar", max: 100 },
      { name: "Vocabulary", max: 100 },
      { name: "Comprehension", max: 100 },
    ],
    values: [75, 80, 70, 65, 85, 90, 60], // Điểm cho từng kỹ năng
  };

  const handleSave = () => {
    console.log("Saved:", { name, email, phone, avatar });
    alert("Thông tin đã được lưu!");
    setIsEditing(false);
  };

  // Hàm khởi tạo biểu đồ điểm theo thời gian
  const initScoreChart = () => {
    const chartInstance = echarts.init(scoreChartRef.current!);
    chartInstance.setOption({
      title: {
        text: "Điểm theo thời gian",
      },
      tooltip: {},
      xAxis: scoreData.xAxis,
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Điểm",
          type: "line",
          data: scoreData.series[0].data,
          smooth: true,
          itemStyle: {
            color: "rgba(75,192,192,1)",
          },
        },
      ],
    });
  };

  // Hàm khởi tạo biểu đồ radar
  const initRadarChart = () => {
    const chartInstance = echarts.init(radarChartRef.current!);
    chartInstance.setOption({
      title: {
        text: "Phân tích kỹ năng",
      },
      tooltip: {},
      radar: {
        indicator: radarData.indicators,
      },
      series: [
        {
          name: "Kỹ năng",
          type: "radar",
          data: [
            {
              value: radarData.values,
              name: "Kỹ năng",
            },
          ],
          areaStyle: {
            color: "rgba(255, 206, 86, 0.5)",
          },
        },
      ],
    });
  };

  useEffect(() => {
    initScoreChart();
    initRadarChart(); // Khởi tạo biểu đồ radar
  }, []);

  return (
    <main className="mx-auto px-4 py-6 mt-14">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Quản lý thông tin cá nhân</h2>

        {/* Hiển thị avatar */}
        <div className="flex flex-col md:flex-row items-center mb-6 bg-gray-700 p-4 rounded-lg">
          <div className="relative group mb-4 md:mb-0">
            <img
              src={avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-yellow-500 shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm">Thay đổi ảnh</span>
              </div>
            )}
          </div>
          <div className="md:ml-6 flex-1">
            {isEditing ? (
              <div className="relative">
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-600 text-white border-2 border-yellow-500 focus:border-yellow-600 focus:outline-none transition-all duration-300 shadow-md"
                  placeholder="Nhập URL của avatar mới"
                />
                <small className="text-gray-400 mt-1 block">
                  Nhập đường dẫn URL hợp lệ cho ảnh đại diện của bạn
                </small>
              </div>
            ) : isEditing ? (
              <div className="text-gray-300 bg-gray-600 p-3 rounded-lg">
                <span className="font-medium text-yellow-500">URL Avatar:</span>
                <p className="mt-1 break-all">{avatar}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tên:</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
            />
          ) : (
            <p className="text-gray-300">{name}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email:</label>
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
            />
          ) : (
            <p className="text-gray-300">{email}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Số điện thoại:
          </label>
          {isEditing ? (
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
            />
          ) : (
            <p className="text-gray-300">{phone}</p>
          )}
        </div>
        <div className="flex justify-between">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
            >
              Lưu thay đổi
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Chỉnh sửa
            </button>
          )}
          <button
            onClick={() => alert("Đã đăng xuất!")} // Thay thế bằng logic đăng xuất thực tế
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Lịch sử bài thi */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Lịch sử bài thi</h2>
        <ul>
          {testHistory.map((test, index) => (
            <li key={index} className="mb-2">
              <span className="font-semibold">{test.testName}</span> - Điểm:{" "}
              {test.score} - Ngày: {test.date}
            </li>
          ))}
        </ul>
      </div>

      {/* Gợi ý bài thi */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold border-b-2 border-yellow-500 pb-2">Gợi ý bài thi</h2>
          <span className="text-sm text-gray-400">Dựa trên kết quả gần đây của bạn</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold group-hover:text-yellow-500">{suggestion}</h3>
                  <p className="text-sm text-gray-400 mt-1">Độ khó: Trung bình</p>
                </div>
                <button className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm hover:bg-yellow-600 transition">
                  Bắt đầu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biểu đồ điểm theo thời gian */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Điểm theo thời gian</h2>
        <div ref={scoreChartRef} style={{ height: "400px", width: "100%" }} />
      </div>

      {/* Biểu đồ radar cho phân tích kỹ năng */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Phân tích kỹ năng (Radar)</h2>
        <div ref={radarChartRef} style={{ height: "400px", width: "100%" }} />
      </div>
    </main>
  );
};

export default Profile;
