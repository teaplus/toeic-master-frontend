import React, { useEffect, useState } from "react";
import { getLeaderboardAPI } from "../../services/leaderboard.service";
import { LeaderboardData } from "../../types/leaderboard";
import { formatDateTime } from "../../utils/dateFormat";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useNotice } from "../../components/common/Notice";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const notice = useNotice();

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await getLeaderboardAPI();
      if (response.data.success) {
        setLeaderboardData(response.data.data);
      } else {
        notice.show("error", "Không thể tải dữ liệu bảng xếp hạng");
      }
    } catch (error) {
      notice.show("error", "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "from-yellow-300 to-yellow-500"; // Gold
      case 1:
        return "from-gray-300 to-gray-400"; // Silver
      case 2:
        return "from-amber-600 to-amber-700"; // Bronze
      default:
        return "from-gray-600 to-gray-700"; // Others
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Scorers Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <h2 className="text-xl font-bold">Bảng Xếp Hạng Điểm Cao</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {leaderboardData?.topScorers.map((scorer, index) => (
                <div
                  key={`${scorer.userId}-${index}`}
                  className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={scorer.avatar || "/default-avatar.png"}
                      alt={scorer.fullName || "User"}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                    />
                    <div
                      className={`absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r ${getMedalColor(
                        index
                      )} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg`}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">
                      {scorer.fullName || "Người dùng ẩn danh"}
                    </h3>
                    <p className="text-sm text-gray-400">{scorer.testName}</p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(scorer.achievedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {scorer.highestScore}
                    </div>
                    <div className="text-sm text-gray-400">điểm</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Active Users Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-bold">Người Dùng Tích Cực</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {leaderboardData?.mostActive.map((user, index) => (
                <div
                  key={user.userId}
                  className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.fullName || "User"}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                    />
                    <div
                      className={`absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg`}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">
                      {user.fullName || "Người dùng ẩn danh"}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                      <span>Số bài: {user.totalTests}</span>
                      <span>TB: {user.averageScore}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                      {user.highestScore}
                    </div>
                    <div className="text-sm text-gray-400">cao nhất</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medal Icons for Rankings */}
        <div className="hidden">
          {/* Gold Medal */}
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="7.25"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M14.25 8.75L11.75 13.75L9.75 11.75L7.75 14.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.25 9.75L14.25 8.75L15.25 6.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Silver Medal */}
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="7.25"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M9.75 10.75C9.75 9.64543 10.6454 8.75 11.75 8.75H12.25C13.3546 8.75 14.25 9.64543 14.25 10.75V10.75C14.25 11.8546 13.3546 12.75 12.25 12.75H11.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.75 12.75V15.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Bronze Medal */}
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="7.25"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M9.75 9.75C9.75 8.64543 10.6454 7.75 11.75 7.75H12.25C13.3546 7.75 14.25 8.64543 14.25 9.75V9.75C14.25 10.8546 13.3546 11.75 12.25 11.75H11.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.75 13.75C9.75 12.6454 10.6454 11.75 11.75 11.75H12.25C13.3546 11.75 14.25 12.6454 14.25 13.75V13.75C14.25 14.8546 13.3546 15.75 12.25 15.75H11.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
