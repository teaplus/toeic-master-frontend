// src/pages/ToeicStructure.tsx
import React from "react";
import ContentSection from "./components/ContentSection";
import RelatedNews from "./components/RelatedNews";

const ToeicStructure = () => {
  const menuItems = [
    {
      id: "h2title_0",
      title: "CẤU TRÚC BÀI THI TOEIC MỚI NHẤT",
    },
    {
      id: "h2title_1",
      title: "CẤU TRÚC ĐỀ THI TOEIC 2 KỸ NĂNG",
    },
    {
      id: "h2title_2",
      title: "PHÂN TÍCH CẤU TRÚC ĐỀ THI TOEIC MỚI NHẤT",
    },
    {
      id: "h2title_3",
      title: "GIẢI ĐÁP THẮC MẮC VỀ CẤU TRÚC ĐỀ THI TOEIC",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Modern & Clean */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-blue-500/30 rounded-full text-sm mb-4">
              Updated 2024
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cấu Trúc Đề Thi TOEIC
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Hướng dẫn chi tiết format mới nhất của bài thi TOEIC Reading &
              Listening
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <i className="fas fa-clock text-blue-300" />
                <span>10 phút đọc</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-calendar text-blue-300" />
                <span>Cập nhật: 01/03/2024</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50" />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Tổng Quan</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-clock text-blue-600 text-xl" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Thời gian</div>
                      <div className="font-semibold">120 phút</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-tasks text-green-600 text-xl" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Số câu hỏi</div>
                      <div className="font-semibold">200 câu</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-star text-purple-600 text-xl" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Điểm tối đa</div>
                      <div className="font-semibold">990 điểm</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Mục Lục</h2>
                <nav className="space-y-1">
                  <a
                    href="#listening"
                    className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-600"
                  >
                    Listening Test
                  </a>
                  <a
                    href="#reading"
                    className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-600"
                  >
                    Reading Test
                  </a>
                  <a
                    href="#tips"
                    className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-600"
                  >
                    Mẹo Làm Bài
                  </a>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Listening Section */}
            <section
              id="listening"
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">
                  Listening Test (45 phút)
                </h2>
              </div>

              {/* Part Cards */}
              <div className="p-6 space-y-6">
                {/* Part 1 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Photographs</h3>
                      <p className="text-gray-600">6 câu hỏi • 6 phút</p>
                    </div>
                  </div>

                  <div className="ml-16 space-y-4">
                    <p className="text-gray-600">
                      Xem một bức ảnh và chọn câu mô tả chính xác nhất trong 4
                      câu được nghe.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Chủ đề thường gặp</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Văn phòng làm việc
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Nhà hàng, quán ăn
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Công viên, không gian công cộng
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Kỹ năng cần có</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Từ vựng mô tả hình ảnh
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Nghe và phân biệt chi tiết
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Phản xạ nhanh với âm thanh
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part 2 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Question - Response
                      </h3>
                      <p className="text-gray-600">25 câu hỏi • 20 phút</p>
                    </div>
                  </div>

                  <div className="ml-16 space-y-4">
                    <p className="text-gray-600">
                      Nghe một câu hỏi hoặc câu nói và chọn câu trả lời phù hợp
                      nhất trong 3 câu được nghe.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Dạng câu hỏi</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Wh-questions (What, Where, When...)
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Yes/No questions
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Tag questions
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Chủ đề thường gặp</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Công việc, cuộc hẹn
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Thời gian, địa điểm
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Yêu cầu, đề nghị
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part 3 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Short Conversations
                      </h3>
                      <p className="text-gray-600">
                        39 câu hỏi • 13 đoạn hội thoại
                      </p>
                    </div>
                  </div>

                  <div className="ml-16 space-y-4">
                    <p className="text-gray-600">
                      Nghe các đoạn hội thoại ngắn giữa 2-3 người và trả lời 3
                      câu hỏi cho mỗi đoạn.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">
                          Tình huống thường gặp
                        </h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Cuộc họp công ty
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Đặt lịch, kế hoạch
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Thảo luận dự án
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Dạng câu hỏi</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            What is the conversation about?
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            What will the speakers probably do next?
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Who is the man/woman most likely?
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part 4 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Short Talks</h3>
                      <p className="text-gray-600">30 câu hỏi • 10 bài nói</p>
                    </div>
                  </div>

                  <div className="ml-16 space-y-4">
                    <p className="text-gray-600">
                      Nghe các bài nói ngắn (thông báo, quảng cáo, tin tức...)
                      và trả lời 3 câu hỏi cho mỗi bài.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Dạng bài nói</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Thông báo công ty
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Tour du lịch, hướng dẫn
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Radio advertisements
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Kỹ năng cần có</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Note-taking (ghi chú nhanh)
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Nắm bắt thông tin chính
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Suy luận ngữ cảnh
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Reading Section */}
            <section
              id="reading"
              className="bg-white rounded-2xl shadow-sm overflow-hidden mt-8"
            >
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-green-600">
                  Reading Test (75 phút)
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Part 5 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-green-600">
                        5
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Incomplete Sentences
                      </h3>
                      <p className="text-gray-600">30 câu hỏi • 25 phút</p>
                    </div>
                  </div>

                  <div className="ml-16 space-y-4">
                    <p className="text-gray-600">
                      Chọn từ/cụm từ thích hợp để hoàn thành câu. Phần này tập
                      trung vào kiểm tra ngữ pháp và từ vựng.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Ngữ pháp trọng tâm</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Các thì và thể trong tiếng Anh
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Mệnh đề quan hệ, điều kiện
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Câu bị động, câu gián tiếp
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Sự hòa hợp chủ ngữ - động từ
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Từ vựng & Cấu trúc</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Collocations phổ biến
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Phrasal verbs trong kinh doanh
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Giới từ và liên từ
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Từ đồng nghĩa, trái nghĩa
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part 6 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-green-600">
                        6
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Text Completion</h3>
                      <p className="text-gray-600">16 câu hỏi • 4 đoạn văn</p>
                      <p className="text-gray-600">12 phút</p>
                    </div>
                  </div>

                  <div className="ml-16 space-y-4">
                    <p className="text-gray-600">
                      Điền từ thích hợp vào chỗ trống trong đoạn văn. Mỗi đoạn
                      văn có 4 chỗ trống.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Dạng văn bản</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Email công việc
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Báo cáo công ty
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Bài báo kinh doanh
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Memo nội bộ
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Kỹ năng cần có</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Đọc hiểu văn cảnh
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Nắm vững liên kết văn bản
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Hiểu cấu trúc đoạn văn
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Phân tích logic văn bản
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part 7 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-green-600">
                        7
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Reading Comprehension
                      </h3>
                      <p className="text-gray-600">
                        54 câu hỏi • Single & Double Passages
                      </p>
                    </div>
                  </div>

                  <div className="ml-16 space-y-4">
                    <p className="text-gray-600">
                      Đọc hiểu các đoạn văn đơn hoặc cặp đoạn văn liên quan và
                      trả lời câu hỏi.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Cấu trúc bài đọc</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Single Passages (29 câu)
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Double Passages (25 câu)
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            2-5 câu hỏi/bài đọc
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Dạng tài liệu</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Emails, Letters
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Articles, Reports
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Advertisements
                          </li>
                          <li className="flex items-center gap-2">
                            <i className="fas fa-check text-green-500" />
                            Forms, Schedules
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4 mt-4">
                      <h4 className="font-medium mb-2">Chiến thuật làm bài</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <i className="fas fa-lightbulb text-yellow-500 mt-1" />
                          <span>
                            Đọc câu hỏi trước khi đọc bài để định hướng thông
                            tin cần tìm
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-lightbulb text-yellow-500 mt-1" />
                          <span>
                            Sử dụng kỹ thuật skimming để nắm ý chính của bài đọc
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-lightbulb text-yellow-500 mt-1" />
                          <span>
                            Scanning để tìm thông tin chi tiết cho từng câu hỏi
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips Section */}
            <section id="tips" className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Mẹo Làm Bài Thi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-lightbulb text-blue-600 text-xl" />
                    </div>
                    <h3 className="font-semibold">Listening Tips</h3>
                  </div>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-500 mt-1" />
                      <span>Đọc trước các lựa chọn khi có thể</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-500 mt-1" />
                      <span>Tập trung vào từ khóa quan trọng</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-500 mt-1" />
                      <span>Ghi chú nhanh thông tin chính</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-book text-green-600 text-xl" />
                    </div>
                    <h3 className="font-semibold">Reading Tips</h3>
                  </div>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-500 mt-1" />
                      <span>Luyện kỹ năng đọc lướt và đọc quét</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-500 mt-1" />
                      <span>Nắm vững các dạng câu hỏi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-500 mt-1" />
                      <span>Quản lý thời gian hiệu quả</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToeicStructure;
