import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  getUserProgressAPI,
  getAnalyzePartScoresAPI,
} from "../../../../services/user.service";
import { useNotice } from "../../../../components/common/Notice";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface UserProgress {
  overview: {
    averageScore: number;
    highestScore: number;
    averageListening: number;
    averageReading: number;
    totalSessions: number;
    inProgressSessions: number;
    completedSessions: number;
  };
  stats: {
    analysisScores: {
      listening: number;
      reading: number;
      grammar: number;
      comprehension: number;
    };
  };
  testSessions: TestSession[];
}

interface PartScores {
  partAverages: {
    part1: number;
    part2: number;
    part3: number;
    part4: number;
    part5: number;
    part6: number;
    part7: number;
  };
  totalTests: number;
}

interface TestSession {
  test_session_id: number;
  test_session_listening_score: number;
  test_session_reading_score: number;
  test_session_total_score: number;
  test_id: number;
  test_name: string;
  test_type: string;
  completed_at: string;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [partScores, setPartScores] = useState<PartScores | null>(null);
  const notice = useNotice();

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData();
    }
  }, [isOpen, userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [progressRes, scoresRes] = await Promise.all([
        getUserProgressAPI(userId),
        getAnalyzePartScoresAPI(userId),
      ]);

      if (progressRes.data.success && scoresRes.data.success) {
        setUserProgress(progressRes.data.data);
        setPartScores(scoresRes.data.data);
      } else {
        notice.show("error", "Lỗi khi tải dữ liệu người dùng");
      }
    } catch (error) {
      notice.show("error", "Lỗi khi tải dữ liệu người dùng");
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSkillsChartOption = () => ({
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}%",
    },
    radar: {
      indicator: [
        { name: "Listening", max: 100 },
        { name: "Reading", max: 100 },
        { name: "Grammar", max: 100 },
        { name: "Comprehension", max: 100 },
      ],
      radius: "65%",
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: userProgress
              ? [
                  (userProgress.stats.analysisScores.listening / 495) * 100,
                  (userProgress.stats.analysisScores.reading / 495) * 100,
                  (userProgress.stats.analysisScores.grammar / 495) * 100,
                  (userProgress.stats.analysisScores.comprehension / 495) * 100,
                ]
              : [],
            name: "Điểm kỹ năng",
            areaStyle: {
              color: "rgba(54, 162, 235, 0.2)",
            },
            lineStyle: {
              color: "rgba(54, 162, 235, 1)",
            },
            itemStyle: {
              color: "rgba(54, 162, 235, 1)",
            },
          },
        ],
      },
    ],
  });

  const getPartsChartOption = () => ({
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}%",
    },
    radar: {
      indicator: [
        { name: "Part 1", max: 100 },
        { name: "Part 2", max: 100 },
        { name: "Part 3", max: 100 },
        { name: "Part 4", max: 100 },
        { name: "Part 5", max: 100 },
        { name: "Part 6", max: 100 },
        { name: "Part 7", max: 100 },
      ],
      radius: "65%",
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: partScores
              ? [
                  partScores.partAverages.part1,
                  partScores.partAverages.part2,
                  partScores.partAverages.part3,
                  partScores.partAverages.part4,
                  partScores.partAverages.part5,
                  partScores.partAverages.part6,
                  partScores.partAverages.part7,
                ]
              : [],
            name: "Điểm trung bình theo phần",
            areaStyle: {
              color: "rgba(75, 192, 192, 0.2)",
            },
            lineStyle: {
              color: "rgba(75, 192, 192, 1)",
            },
            itemStyle: {
              color: "rgba(75, 192, 192, 1)",
            },
          },
        ],
      },
    ],
  });

  const getLearningProgressOption = () => {
    if (!userProgress?.testSessions?.length) return {};

    const sortedSessions = [...userProgress.testSessions].sort(
      (a, b) =>
        new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
    );

    return {
      tooltip: {
        trigger: "axis",
        formatter: function (params: any[]) {
          if (!params?.length) return "";

          const date = new Date(params[0].data[0]).toLocaleDateString("vi-VN");
          const total = params[0].data[1] || 0;
          const listening = params[1]?.data[1] || 0;
          const reading = params[2]?.data[1] || 0;

          return `${date}<br/>
                  Tổng điểm: ${total}<br/>
                  Listening: ${listening}<br/>
                  Reading: ${reading}`;
        },
      },
      legend: {
        data: ["Tổng điểm", "Listening", "Reading"],
        bottom: 0,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
        axisLabel: {
          formatter: (value: string) => {
            return new Date(value).toLocaleDateString("vi-VN");
          },
        },
      },
      yAxis: {
        type: "value",
        name: "Điểm",
        max: 100,
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
      },
      series: [
        {
          name: "Tổng điểm",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          data: sortedSessions.map((session) => [
            session.completed_at,
            session.test_session_total_score || 0,
          ]),
          itemStyle: { color: "#6366F1" },
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
                  color: "rgba(99, 102, 241, 0.2)",
                },
                {
                  offset: 1,
                  color: "rgba(99, 102, 241, 0)",
                },
              ],
            },
          },
        },
        {
          name: "Listening",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          data: sortedSessions.map((session) => [
            session.completed_at,
            session.test_session_listening_score || 0,
          ]),
          itemStyle: { color: "#10B981" },
        },
        {
          name: "Reading",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          data: sortedSessions.map((session) => [
            session.completed_at,
            session.test_session_reading_score || 0,
          ]),
          itemStyle: { color: "#F59E0B" },
        },
      ],
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    Tổng quan kết quả học tập
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h4 className="text-base font-medium text-gray-900 mb-4">
                        Thống kê chung
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Điểm trung bình:
                          </span>
                          <span className="font-medium">
                            {userProgress?.overview.averageScore}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Điểm cao nhất:</span>
                          <span className="font-medium">
                            {userProgress?.overview.highestScore}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">TB Listening:</span>
                          <span className="font-medium">
                            {userProgress?.overview.averageListening}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">TB Reading:</span>
                          <span className="font-medium">
                            {userProgress?.overview.averageReading}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h4 className="text-base font-medium text-gray-900 mb-4">
                        Tiến độ học tập
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tổng số bài:</span>
                          <span className="font-medium">
                            {userProgress?.overview.totalSessions}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Đang làm:</span>
                          <span className="font-medium">
                            {userProgress?.overview.inProgressSessions}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hoàn thành:</span>
                          <span className="font-medium">
                            {userProgress?.overview.completedSessions}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h4 className="text-base font-medium text-gray-900 mb-4">
                      Phân tích kỹ năng
                    </h4>
                    <div className="h-64">
                      <ReactECharts
                        option={getSkillsChartOption()}
                        style={{ height: "100%" }}
                      />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h4 className="text-base font-medium text-gray-900 mb-4">
                      Phân tích theo phần thi
                    </h4>
                    <div className="h-64">
                      <ReactECharts
                        option={getPartsChartOption()}
                        style={{ height: "100%" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    Tiến độ học tập
                  </h4>
                  <div className="h-64">
                    {userProgress?.testSessions &&
                    userProgress.testSessions.length > 0 ? (
                      <ReactECharts
                        option={getLearningProgressOption()}
                        style={{ height: "100%" }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Chưa có dữ liệu bài thi</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
