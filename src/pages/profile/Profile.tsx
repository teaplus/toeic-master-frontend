/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts"; // Import ECharts
import "./profile.css";
import { useNotice } from "../../components/common/Notice";
import { useAuth } from "../../hooks/useAuth";
import {
  updateUserInfoAPI,
  getAnalyzePartScoresAPI,
} from "../../services/user.service";
import S3Uploader from "../../components/common/S3Uploader";
import { useNavigate } from "react-router-dom";
import { PartScores } from "../../types/user";
import { changePasswordAPI } from "../../services/auth.service";
import { formatDateTime, getRelativeTime } from "../../utils/dateFormat";

const Profile = () => {
  const [name, setName] = useState("nanyak");
  const [email, setEmail] = useState("nanyak@example.com");
  const [phone, setPhone] = useState("0948-105-227");
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");
  const [isEditing, setIsEditing] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const { user } = useAuth();
  const notice = useNotice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const radarChartRef = useRef<HTMLDivElement | null>(null);
  const [partScores, setPartScores] = useState<PartScores | null>(null);

  const handleUploadSuccess = (fieldName: string, url: string) => {
    setAvatar(url);
    notice.show("success", "Tải ảnh lên thành công!");
  };

  const handleUploadError = (fieldName: string, error: string) => {
    notice.show("error", error);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const response = await updateUserInfoAPI({
        username: name,
        email: email,
        phoneNumber: phone,
        avatar: avatar,
        address: address,
      });

      if (response.data.statusCode === 201) {
        notice.show("success", "Cập nhật thông tin thành công!");
        setIsEditing(false);
      } else {
        notice.show("error", response.data.message || "Cập nhật thất bại!");
      }
    } catch (error: any) {
      notice.show("error", error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const initRadarChart = () => {
    if (!radarChartRef.current || !partScores) return;

    const chartInstance = echarts.init(radarChartRef.current);
    const partNames = {
      part1: "Photographs",
      part2: "Question-Response",
      part3: "Conversations",
      part4: "Short Talks",
      part5: "Incomplete Sentences",
      part6: "Text Completion",
      part7: "Reading Comprehension",
    };

    chartInstance.setOption({
      title: {
        text: `Phân tích kỹ năng`,
        textStyle: {
          color: "#fff",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: function (params: any) {
          return `${params.name}<br/>
                 Điểm: ${params.value}%<br/>
                 Số bài: ${partScores.totalTests}`;
        },
      },
      radar: {
        indicator: Object.entries(partNames).map(([key, name]) => ({
          name: name,
          max: 100,
          color: "#fff",
        })),
        shape: "circle",
        splitNumber: 4,
        axisName: {
          color: "#fff",
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)",
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.1)"],
          },
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)",
          },
        },
      },
      series: [
        {
          name: "Kỹ năng",
          type: "radar",
          data: [
            {
              value: Object.values(partScores.partAverages),
              name: "Kỹ năng",
              symbol: "circle",
              symbolSize: 6,
              lineStyle: {
                width: 2,
              },
              areaStyle: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                  {
                    offset: 0,
                    color: "rgba(255, 206, 86, 0.5)",
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 206, 86, 0.1)",
                  },
                ]),
              },
              itemStyle: {
                color: "#FFCE56",
              },
            },
          ],
        },
      ],
    });

    // Xử lý responsive
    window.addEventListener("resize", () => {
      chartInstance.resize();
    });

    return () => {
      chartInstance.dispose();
      window.removeEventListener("resize", () => {
        chartInstance.resize();
      });
    };
  };

  useEffect(() => {
    if (partScores) {
      initRadarChart();
    }
  }, [partScores]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      notice.show("error", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmPassword) {
      notice.show("error", "Mật khẩu mới không khớp!");
      return;
    }

    try {
      const response = await changePasswordAPI({
        email: user?.email || "",
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        notice.show("success", "Đổi mật khẩu thành công!");
        setShowChangePassword(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        notice.show("error", response.data.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error: any) {
      notice.show(
        "error",
        error.response?.data?.message ||
          "Đổi mật khẩu thất bại. Vui lòng thử lại!"
      );
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.username);
      setEmail(user.email);
      setPhone(user.phoneNumber || "");
      setAvatar(user.avatar || "");
      setAddress(user.address || "");
      fetchPartScores();
    }
  }, [user]);

  const fetchPartScores = async () => {
    console.log("user", user);
    try {
      const response = await getAnalyzePartScoresAPI(user?.id.toString() || "");
      if (response.data.success) {
        setPartScores(response.data.data);
      } else {
        notice.show("error", "Lỗi khi tải dữ liệu phân tích");
      }
    } catch (error) {
      notice.show("error", "Lỗi khi tải dữ liệu phân tích");
      console.error("Error fetching part scores:", error);
    }
  };

  return (
    <main className="mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
          <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
          <div className="flex items-center gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-200 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Chỉnh sửa
              </button>
            )}
            <button
              onClick={() => alert("Đã đăng xuất!")}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
                <img
                  src={avatar || "https://via.placeholder.com/150"}
                  alt="Avatar"
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex items-center justify-center">
                <S3Uploader
                  fieldName="avatar"
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                />
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="flex-1 grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  UserName
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-800 rounded-lg">{name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-800 rounded-lg">{email}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-800 rounded-lg">{phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Địa chỉ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={address || ""}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-800 rounded-lg">
                    {user?.address}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-lg mt-6">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
          <h2 className="text-2xl font-bold">Đổi mật khẩu</h2>
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="text-blue-500 hover:text-blue-400 flex items-center gap-2"
          >
            {showChangePassword ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Đóng
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                  ss
                </svg>
                Thay đổi
              </>
            )}
          </button>
        </div>

        {showChangePassword && (
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowChangePassword(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200 
                flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Lịch sử bài thi */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Lịch sử bài thi</h2>
        <div className="space-y-4">
          {user?.testHistory.recent.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-lg">
                  {test.testName} #{test.id}
                </span>
                <div className="text-gray-300 text-sm mt-1">
                  <span className="mr-4">
                    Điểm:{" "}
                    <span className="text-blue-400 font-medium">
                      {test.score}
                    </span>
                  </span>
                  <span>
                    Ngày:{" "}
                    <span className="text-blue-400 font-medium group relative">
                      {formatDateTime(test.completedAt)}
                      <span className="invisible group-hover:visible absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                        {getRelativeTime(test.completedAt)}
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              <div>
                {test.status === "completed" ? (
                  <button
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition duration-200 flex items-center gap-2"
                    onClick={() =>
                      navigate(`/test/review/${test.testId}/${test.id}`)
                    }
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Xem lại
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200 flex items-center gap-2"
                    onClick={() => navigate(`/test/${test.id}`)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Làm tiếp
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biểu đồ radar cho phân tích kỹ năng */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Phân tích kỹ năng</h2>
        <div className="h-96" ref={radarChartRef}>
          {!partScores && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;
