import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import {
  getDashboardStatsAPI,
  getPeriodStatsAPI,
} from "../../../../services/dashboard.service";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import { useNotice } from "../../../../components/common/Notice";
import {
  DashboardStatsResponse,
  StatsPeriod,
  PeriodStats,
  PopularTest,
} from "../../../../types/dashboard";
import { exportCsvAPI } from "../../../../services/admin.service";
import ExportButton from "../../../../components/common/ExportButton";

const DashboardTab = () => {
  const [stats, setStats] = useState<DashboardStatsResponse["data"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const notice = useNotice();
  const [periodStats, setPeriodStats] = useState<PeriodStats[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>(
    StatsPeriod.WEEK
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [periodLoading, setPeriodLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    fetchPeriodStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, selectedYear]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStatsAPI();
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        notice.show("error", "Lỗi khi tải dữ liệu thống kê");
      }
    } catch (error) {
      notice.show("error", "Lỗi khi tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriodStats = async () => {
    try {
      setPeriodLoading(true);
      const response = await getPeriodStatsAPI(selectedPeriod, selectedYear);
      if (response.data.success) {
        setPeriodStats(response.data.data);
      } else {
        notice.show("error", "Lỗi khi tải dữ liệu thống kê theo kỳ");
      }
    } catch (error) {
      notice.show("error", "Lỗi khi tải dữ liệu thống kê theo kỳ");
    } finally {
      setPeriodLoading(false);
    }
  };

  const getScoreDistributionOption = () => ({
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}% ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data:
          stats?.todayStats.scoreDistribution.map((item) => ({
            value: item.percentage,
            name: item.range,
            itemStyle: {
              color: (() => {
                // Màu sắc tương ứng với từng range điểm
                switch (item.range) {
                  case "0-250":
                    return "#EF4444"; // red
                  case "251-550":
                    return "#F59E0B"; // yellow
                  case "551-750":
                    return "#10B981"; // green
                  case "751-990":
                    return "#6366F1"; // indigo
                  default:
                    return "#6B7280"; // gray
                }
              })(),
            },
          })) || [],
      },
    ],
  });

  const getPeriodStatsOption = () => ({
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const [total, avg] = params;
        return `${total.name}<br/>
                Số bài thi: ${total.value}<br/>
                Điểm trung bình: ${avg.value}`;
      },
    },
    legend: {
      data: ["Số bài thi", "Điểm trung bình"],
      bottom: 0,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: periodStats.map((item) => item.period),
    },
    yAxis: [
      {
        type: "value",
        name: "Số bài thi",
        position: "left",
      },
      {
        type: "value",
        name: "Điểm",
        position: "right",
        max: 100,
      },
    ],
    series: [
      {
        name: "Số bài thi",
        type: "line",
        smooth: true,
        data: periodStats.map((item) => item.total),
        itemStyle: { color: "#6366F1" },
      },
      {
        name: "Điểm trung bình",
        type: "line",
        smooth: true,
        yAxisIndex: 1,
        data: periodStats.map((item) => item.averageScore),
        itemStyle: { color: "#10B981" },
      },
    ],
  });

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case "FULL_TEST":
        return "bg-blue-100 text-blue-800";
      case "MINI_TEST":
        return "bg-green-100 text-green-800";
      case "PART_TEST":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExport = async (type: "users" | "tests") => {
    try {
      await exportCsvAPI(type);
      notice.show("success", `Xuất file ${type} thành công`);
    } catch (error) {
      notice.show("error", `Lỗi khi xuất file ${type}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Không có dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Export Actions */}
      <div className="flex justify-end space-x-4 mb-6">
        <ExportButton
          onClick={() => handleExport("users")}
          label="Xuất danh sách người dùng"
        />
        <ExportButton
          onClick={() => handleExport("tests")}
          label="Xuất danh sách bài thi"
        />
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Tổng người dùng</h3>
            <span className="text-green-500 text-sm">
              {stats.todayStats?.totalUsers > stats.yesterdayStats?.totalUsers
                ? "+"
                : ""}
              {stats.todayStats?.totalUsers -
                stats.yesterdayStats?.totalUsers || "+" + 0}{" "}
              so với hôm qua
            </span>
          </div>
          <p className="text-2xl font-bold">{stats.todayStats.totalUsers}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Người dùng mới</h3>
            <span className="text-green-500 text-sm">Hôm nay</span>
          </div>
          <p className="text-2xl font-bold">{stats.todayStats.newUsers}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Bài thi hoàn thành</h3>
            <span className="text-blue-500 text-sm">
              {stats.todayStats.completedTests} hôm nay
            </span>
          </div>
          <p className="text-2xl font-bold">
            {stats.todayStats.completedTestsStats.monthly}
          </p>
          <p className="text-sm text-gray-500">Tháng này</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Điểm trung bình</h3>
            <span
              className={`text-sm ${
                stats.todayStats?.averageScore >
                stats.yesterdayStats?.averageScore
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {stats.todayStats?.averageScore >
              stats.yesterdayStats?.averageScore
                ? "↑"
                : "↓"}
              {Math.abs(
                stats.todayStats?.averageScore -
                  stats.yesterdayStats?.averageScore
              ) || 0}{" "}
              điểm
            </span>
          </div>
          <p className="text-2xl font-bold">{stats.todayStats?.averageScore}</p>
        </div>
      </div>

      {/* Top Performer */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Thành tích cao nhất</h2>
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Điểm cao nhất</p>
            <p className="text-lg font-semibold">
              {stats.todayStats.topScore || "Chưa có"}
            </p>
          </div>
          <div className="ml-8">
            <p className="text-sm text-gray-500">Người đạt</p>
            <p className="text-lg font-semibold">
              {stats.todayStats.topScorer.email || "Chưa có"}
            </p>
          </div>
        </div>
      </div>

      {/* Test Completion Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Thống kê bài thi hoàn thành</h2>
          <div className="flex space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as StatsPeriod)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value={StatsPeriod.WEEK}>Tuần</option>
              <option value={StatsPeriod.MONTH}>Tháng</option>
              <option value={StatsPeriod.QUARTER}>Quý</option>
              <option value={StatsPeriod.YEAR}>Năm</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {Array.from({ length: 5 }, (_, i) => selectedYear - 2 + i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
        <div className="relative">
          {periodLoading ? (
            <div className="flex justify-center items-center h-[300px]">
              <LoadingSpinner />
            </div>
          ) : periodStats.length > 0 ? (
            <ReactECharts
              option={getPeriodStatsOption()}
              style={{ height: "300px" }}
            />
          ) : (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-gray-500">Không có dữ liệu</p>
            </div>
          )}
        </div>
      </div>

      {/* Score Distribution Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Phân bố điểm số</h2>
        <div className="relative">
          <ReactECharts
            option={getScoreDistributionOption()}
            style={{ height: "300px" }}
          />
          {stats?.todayStats.scoreDistribution.every(
            (item) => item.percentage === 0
          ) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Chưa có dữ liệu</p>
            </div>
          )}
        </div>
      </div>

      {/* Popular Tests Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Bài thi phổ biến</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên bài thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lần thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm TB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm cao nhất
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ lệ hoàn thành
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.todayStats.popularTests?.map((test: PopularTest) => (
                <tr key={test.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {test.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTestTypeColor(
                        test.type
                      )}`}
                    >
                      {test.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {test.totalAttempts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">
                        {test.averageScore}
                      </span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{
                            width: `${
                              (test.averageScore / test.maxScore) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">
                        {test.highestScore}
                      </span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 rounded-full h-2"
                          style={{
                            width: `${
                              (test.highestScore / test.maxScore) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">
                        {((test.averageScore / test.maxScore) * 100).toFixed(1)}
                        %
                      </span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 rounded-full h-2"
                          style={{
                            width: `${
                              (test.averageScore / test.maxScore) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.todayStats.popularTests?.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">Chưa có bài thi phổ biến</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
