import React from "react";
import "./home.css";
import Tabs from "./Tabs";

function Home() {
  return (
    <main className="mx-auto px-4 py-6 mt-14">
      <div className="profile text-white p-4 rounded-lg mb-6 bg-gray-800">
        <div className="flex flex-wrap text-lg items-center justify-center sm:justify-start">
          <p>Xin chào </p>
          <p className="text-red-500">&nbsp;nanyak.&nbsp;</p>
          <p>Chào mừng bạn đến với ToeicMaster. Hãy&nbsp;</p>
          <div className="flex-initial w-12 bg-red-600 rounded-md hover:bg-slate-600 hover:text-red-600 cursor-pointer text-center">
            <p>thử</p>
          </div>
          &nbsp;nhé!
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mt-4">
          <div className="flex-1 flex items-center user">
            <img
              alt="User Avatar"
              className="h-12 w-12 rounded-full"
              src="https://storage.googleapis.com/a1aa/image/pJ7NoD9o6A5fJyhpbfNohJzD4eU1DfcSZNdoj8eM74clEr3fE.jpg"
            />
            <div className="ml-4">
              <p className="text-lg font-bold">nanyak</p>
              <div className="bg-green-500 h-2 rounded-full w-40 mt-1"></div>
            </div>
          </div>

          {/* Phần thông tin bên phải */}
          <div className="agree flex-1 flex flex-col sm:flex-row justify-around mt-6 lg:mt-0 lg:ml-6 text-lg">
            <div className="text-center mb-4 sm:mb-0">
              <p>Full test</p>
              <p className="text-2xl font-bold">9/31</p>
            </div>
            <div className="text-center mb-4 sm:mb-0">
              <p>Mini test</p>
              <p className="text-2xl font-bold">0/1445</p>
            </div>
            <div className="text-center">
              <p>Điểm tốt nhất</p>
              <p className="text-2xl font-bold">850/990</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Full Test */}
        <div className="bg-gray-800 text-white p-4 rounded-lg cursor-pointer hover:bg-gray-700">
          <h3 className="text-xl font-bold mb-2">Bài thi mô phỏng</h3>
          <p className="text-gray-300">Làm bài thi TOEIC đầy đủ</p>
        </div>

        {/* Listening Practice */}
        <div className="bg-gray-800 text-white p-4 rounded-lg cursor-pointer hover:bg-gray-700">
          <h3 className="text-xl font-bold mb-2">Luyện Listening</h3>
          <p className="text-gray-300">Các bài tập listening theo chủ đề</p>
        </div>

        {/* Reading Practice */}
        <div className="bg-gray-800 text-white p-4 rounded-lg cursor-pointer hover:bg-gray-700">
          <h3 className="text-xl font-bold mb-2">Luyện Reading</h3>
          <p className="text-gray-300">Các bài tập reading theo dạng</p>
        </div>

        {/* Recent Tests */}
        <div className="bg-gray-800 text-white p-4 rounded-lg cursor-pointer hover:bg-gray-700">
          <h3 className="text-xl font-bold mb-2">Bài thi gần đây</h3>
          <p className="text-gray-300">Tiếp tục hoặc xem lại bài thi</p>
        </div>
      </div>

      {/* Learning Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="bg-gray-800 text-white p-4 rounded-lg min-h-[300px]">
          <h3 className="text-xl font-bold mb-4">Tiến độ học tập</h3>
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">
              Biểu đồ tiến độ sẽ được hiển thị tại đây
            </p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-gray-800 text-white p-4 rounded-lg min-h-[300px]">
          <h3 className="text-xl font-bold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            <div className="border-b border-gray-700 pb-2">
              <p className="font-medium">Mini test #123</p>
              <p className="text-sm text-gray-400">Hoàn thành 2 giờ trước</p>
            </div>
            <div className="border-b border-gray-700 pb-2">
              <p className="font-medium">Luyện nghe Part 3</p>
              <p className="text-sm text-gray-400">Hoàn thành 5 giờ trước</p>
            </div>
          </div>
        </div>

        {/* Skill Analysis */}
        <div className="bg-gray-800 text-white p-4 rounded-lg min-h-[300px]">
          <h3 className="text-xl font-bold mb-4">Phân tích kỹ năng</h3>
          <div className="space-y-4">
            <div>
              <p className="mb-2">Listening</p>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
            <div>
              <p className="mb-2">Reading</p>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
