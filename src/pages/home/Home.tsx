/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./home.css";
import { useAuth } from "../../hooks/useAuth";
import Landing_page from "../landing_page/Landing_Page";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Cookies from "js-cookie";
import { useNotice } from "../../components/common/Notice";
import { verifyEmailAPI } from "../../services/auth.service";
import {
  getListTestRecommendAPI,
  startTestAPI,
} from "../../services/test.service";
import {
  ListTestResponseDataType,
  TestRecommendResponseType,
} from "../../types/test";
import ConfirmModal from "../test/components/ConfirmModal";
import ReactECharts from "echarts-for-react";
import SkillRadarChart from "../../components/charts/SkillRadarChart";
import { useLoading } from "../../contexts/LoadingContext";

function Home() {
  const { isAuthenticated, isLoading, user, testStats } = useAuth();
  const notice = useNotice();
  const navigate = useNavigate();
  const [fullTest, setFullTest] = useState<TestRecommendResponseType>();
  const [miniTest, setMiniTest] = useState<TestRecommendResponseType>();
  const id = Cookies.get("id");
  const [selectedTest, setSelectedTest] =
    useState<ListTestResponseDataType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (id) {
        try {
          console.log("id", user?.is_activated);
          notice.show("success", "Đã tải thông tin người dùng thành công!");
        } catch (error) {
          notice.show(
            "error",
            "Không thể tải thông tin người dùng. Vui lòng thử lại!"
          );
        }
      }
    };

    fetchUserInfo();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await Promise.all([fetchFullTest(), fetchMiniTest()]);
      }
    };

    fetchData();
  }, [id]);

  const fetchFullTest = useCallback(async () => {
    const response = await getListTestRecommendAPI(
      {
        page: 1,
        limit: 10,
        test_type: "FULL_TEST",
      },
      Number(id)
    );
    if (response.data.statusCode === 200) {
      console.log("response", response.data.data);

      setFullTest(response.data.data);
    }
  }, [id]);

  const fetchMiniTest = useCallback(async () => {
    const response = await getListTestRecommendAPI(
      {
        page: 1,
        limit: 10,
        test_type: "MINI_TEST",
      },
      Number(id)
    );
    if (response.data.statusCode === 200) {
      setMiniTest(response.data.data);
    }
  }, [id]);

  const handleVerifyEmail = async () => {
    await verifyEmailAPI(`${user?.email}`);
    notice.show("success", "Email xác thực đã được gửi lại!");
  };

  const handleTestClick = (test: ListTestResponseDataType) => {
    setSelectedTest(test);
    setShowConfirmModal(true);
  };

  const handleConfirmTest = () => {
    showLoading();
    if (selectedTest) {
      startTestAPI({
        test_id: Number(selectedTest.id),
        user_id: Number(user?.id),
        timeRemaining: selectedTest.total_time,
      })
        .then((res) => {
          // console.log("res", res.data.data.id);
          if (res.data.statusCode === 201) {
            setTimeout(() => {
              navigate(`/test/${selectedTest.id}/${res.data.data.id}`);
            }, 2000);
            return;
          } else {
            notice.show("error", res.data.message);
          }
        })
        .finally(() => {
          hideLoading();
        });
    }
  };

  const getChartOptions = useMemo(() => {
    const testData = user?.testHistory?.recent || [];
    const sortedTestData = testData
      .filter(
        (test) => test.status === "completed" && test.type !== "PART_TEST"
      )
      .sort(
        (a, b) =>
          new Date(a.completedAt!).getTime() -
          new Date(b.completedAt!).getTime()
      );

    const dates = sortedTestData.map((test) =>
      new Date(test.completedAt!).toLocaleDateString("vi-VN")
    );
    const scores = sortedTestData.map((test) => test.score || 0);

    return {
      tooltip: {
        trigger: "axis",
        formatter: "{b}: {c} điểm",
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: {
          color: "#9CA3AF",
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 990,
        axisLabel: {
          color: "#9CA3AF",
        },
      },
      series: [
        {
          data: scores,
          type: "line",
          smooth: true,
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: "#3B82F6",
          },
          itemStyle: {
            color: "#3B82F6",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(59, 130, 246, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(59, 130, 246, 0)",
                },
              ],
            },
          },
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "3%",
        containLabel: true,
      },
      backgroundColor: "transparent",
    };
  }, [user?.testHistory?.recent]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // eslint-disable-next-line react/jsx-pascal-case
    return <Landing_page />;
  }
  console.log("fullTest", fullTest);

  return (
    <main className="mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-lg mb-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.avatar || "default-avatar.jpg"}
                alt="User Avatar"
                className="w-16 h-16 rounded-full border-2 border-blue-400"
              />
              {user?.is_activated ? (
                <div className="absolute -top-1 -right-1 bg-green-500 p-1 rounded-full">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
              ) : (
                <div className="absolute -top-1 -right-1 bg-yellow-500 p-1 rounded-full">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <div className="flex items-center gap-2">
                <p className="text-gray-400">Học viên</p>
                {!user?.is_activated && (
                  <span className="text-yellow-500 text-sm">
                    (Chưa xác thực)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            {!user?.is_activated && (
              <button
                onClick={handleVerifyEmail}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg 
                  transition duration-200 flex items-center gap-2"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Kích hoạt tài khoản
              </button>
            )}
            <button
              onClick={() => navigate("/profile")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg 
                transition duration-200 flex items-center gap-2"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Cập nhật hồ sơ
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-gray-400 mb-1">Full Test</p>
              <p className="text-3xl font-bold text-blue-400">
                {user?.testStats.totalFullTests}/
                {testStats.find((stat) => stat.type === "FULL_TEST")?.count}
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-400 h-2 rounded-full"
                  style={{
                    width: `${
                      ((user?.testStats?.totalFullTests || 0) /
                        (testStats.find((stat) => stat.type === "FULL_TEST")
                          ?.count || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-gray-400 mb-1">Mini test</p>
              <p className="text-3xl font-bold text-green-400">
                {user?.testStats.totalMiniTests}/
                {testStats.find((stat) => stat.type === "MINI_TEST")?.count}
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-green-400 h-2 rounded-full"
                  style={{
                    width: `${
                      ((user?.testStats?.totalMiniTests || 0) /
                        (testStats.find((stat) => stat.type === "MINI_TEST")
                          ?.count || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-gray-400 mb-1">Skill test</p>
              <p className="text-3xl font-bold text-yellow-400">
                {user?.testStats.totalPracticeTests}/
                {testStats.find((stat) => stat.type === "PART_TEST")?.count}
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: `${
                      ((user?.testStats.totalPracticeTests || 0) /
                        (testStats.find((stat) => stat.type === "PART_TEST")
                          ?.count || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-gray-400 mb-1">Điểm cao nhất</p>
              <p className="text-3xl font-bold text-purple-400">
                {user?.testHistory.stats.highestScore}/990
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-400 h-2 rounded-full"
                  style={{
                    width: `${
                      ((user?.testHistory.stats.highestScore || 0) / 990) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-6 text-center md:text-left">
          <p className="text-lg">
            Chào mừng bạn đến với ToeicMaster! Hãy{" "}
            <span className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 cursor-pointer transition duration-200">
              thử
            </span>{" "}
            các bài thi của chúng tôi nhé!
          </p>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Full Test */}
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Full Test</h3>
          <p className="text-gray-300 mb-4">Làm bài thi TOEIC đầy đủ</p>
          <div className="space-y-2">
            {fullTest?.recommendedTests?.map((test, idx) => (
              <div
                key={idx}
                onClick={() => handleTestClick(test)}
                className="bg-gray-700 p-2 rounded hover:bg-gray-600 cursor-pointer"
              >
                <p className="font-medium">{test?.name}</p>
                <p className="text-sm text-gray-400">Thời gian: 120 phút</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/tests")}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
          >
            Xem thêm
          </button>
        </div>

        {/* Mini Test */}
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Mini Test</h3>
          <p className="text-gray-300 mb-4">Làm bài thi TOEIC rút gọn</p>
          <div className="space-y-2">
            {miniTest?.recommendedTests?.map((test, idx) => (
              <div
                key={idx}
                onClick={() => handleTestClick(test)}
                className="bg-gray-700 p-2 rounded hover:bg-gray-600 cursor-pointer"
              >
                <p className="font-medium">{test?.name}</p>
                <p className="text-sm text-gray-400">Thời gian: 60 phút</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/tests")}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
          >
            Xem thêm
          </button>
        </div>

        {/* Recent Tests */}
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Bài thi gần đây</h3>
              <p className="text-gray-300 text-sm">
                Tiếp tục hoặc xem lại bài thi
              </p>
            </div>
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="space-y-4">
            {user?.testHistory.recent.map((test) => (
              <div
                key={test.id}
                className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white">
                      {test.testName}
                    </h4>
                    <span className="text-xs text-gray-400">#{test.id}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {test.score ? (
                        <span className="text-green-400">
                          {test.score} điểm
                        </span>
                      ) : (
                        <span className="text-yellow-400">Đang làm</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {test.completedAt || "Chưa hoàn thành"}
                    </p>
                  </div>
                </div>

                {test.completedAt ? (
                  <button
                    onClick={() =>
                      navigate(`/test/review/${test.testId}/${test.id}`)
                    }
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md transition duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
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
                    Xem lại bài thi
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/test/${test.testId}/${test.id}`)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md transition duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
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
                    Tiếp tục làm bài
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Tiến độ học tập</h3>
          {(user?.testHistory?.recent?.length ?? 0) > 0 ? (
            <ReactECharts
              option={getChartOptions}
              style={{ height: "300px", width: "100%" }}
              theme="dark"
            />
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-400">Chưa có dữ liệu bài thi</p>
            </div>
          )}
        </div>

        {/* Recent Activities */}

        {/* Skill Analysis */}
        <div className="bg-gray-800 text-white p-4 rounded-lg min-h-[300px]">
          <h3 className="text-xl font-bold mb-4">Tổng Quát Kỹ Năng</h3>
          <SkillRadarChart testHistory={user?.testHistory} />
        </div>
      </div>

      {/* Confirm Modal */}
      {selectedTest && (
        <ConfirmModal
          test={selectedTest}
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmTest}
        />
      )}
    </main>
  );
}

export default Home;
