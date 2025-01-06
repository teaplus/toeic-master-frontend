import React, { useState } from "react";
import AuthModal from "../../components/auth/AuthModal";

function Landing_page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <body className="mt-14 w-full bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <section className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex flex-col md:flex-row items-center">
            <img
              alt="Online Test Illustration"
              className="mx-auto md:mx-0 md:mr-8"
              height="150"
              src="https://storage.googleapis.com/a1aa/image/RF6EHUP4vno9MB0Ex95g4HieUObjOTr0BKLM1N7ecs16acenA.jpg"
              width="150"
            />
            <div className="text-left mt-4 md:mt-0">
              <h1 className="text-2xl font-bold text-gray-800">
                TOEIC MASTER Online Test
              </h1>
              <h2 className="text-xl font-semibold text-gray-800 mt-2">
                Kiểm tra và thi thử TOEIC trực tuyến
              </h2>
              <p className="text-gray-600 mt-4">
                TOEIC MASTER Online Test là bài thi nhằm kiểm tra và đánh giá
                trình độ TOEIC miễn phí theo chuẩn quốc tế. Bài kiểm tra theo
                hình thức trực tuyến, người tham gia sẽ nhận được chứng chỉ
                TOEIC sau khi hoàn thành bài thi.
              </p>
              <button
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full"
                onClick={() => setIsModalOpen(true)}
              >
                BẮT ĐẦU NGAY
              </button>
            </div>
          </div>
        </section>
        <section className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Biết được điểm TOEIC của bạn ngay lập tức sau khi hoàn thành.
          </h2>
          <div className="flex justify-center mt-12 space-y-8 md:space-y-0 md:space-x-8">
            <div className="bg-white p-6 rounded shadow group transition-transform duration-300 transform hover:scale-105 hover:bg-gray-100 w-full md:w-1/3 lg:w-1/4">
              <img
                alt="Convenient Icon"
                className="mb-4 mx-auto h-24"
                height="100"
                src="https://storage.googleapis.com/a1aa/image/5l3gltYXT8bUFBOihpKqenDQ2wAFsBL1BSIOALs0MfW1acenA.jpg"
                width="100"
              />
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                Thuận tiện
              </h3>
              <p className="text-gray-600 mt-2 group-hover:text-gray-800 transition-colors duration-300">
                Bạn có thể làm bài thi mọi lúc, mọi nơi, chỉ cần một thiết bị có
                kết nối với Internet
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow group transition-transform duration-300 transform hover:scale-105 hover:bg-gray-100 w-full md:w-1/3 lg:w-1/4">
              <img
                alt="Fast Icon"
                className="mb-4 mx-auto h-24"
                height="100"
                src="https://storage.googleapis.com/a1aa/image/Y8Mdyy7P1cZ0O9iU5Tev1P0OSYgnCFUlaIw8XuGEeWDe148nA.jpg"
                width="100"
              />
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                Nhanh chóng
              </h3>
              <p className="text-gray-600 mt-2 group-hover:text-gray-800 transition-colors duration-300">
                Nhận kết quả thi và chứng chỉ xác nhận ngay sau khi hoàn thành
                bài kiểm tra
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow group transition-transform duration-300 transform hover:scale-105 hover:bg-gray-100 w-full md:w-1/3 lg:w-1/4">
              <img
                alt="Global Icon"
                className="mb-4 mx-auto h-24"
                height="100"
                src="https://storage.googleapis.com/a1aa/image/cDzYvp2pfVVTda6jGoh4sZbHvXAN1JPwYBPFvpCaVfz8acenA.jpg"
                width="100"
              />
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                Chuẩn quốc tế
              </h3>
              <p className="text-gray-600 mt-2 group-hover:text-gray-800 transition-colors duration-300">
                Bài kiểm tra được thiết kế dựa trên cấu trúc bài thi đánh giá
                năng lực TOEIC thực tế của ETS.
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow group transition-transform duration-300 transform hover:scale-105 hover:bg-gray-100 w-full md:w-1/3 lg:w-1/4">
              <img
                alt="Global Icon"
                className="mb-4 mx-auto h-24"
                height="100"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXTOEmZI0LZJIY3B9I-1clV3hVsaLDHteFHnznRlySX292OQ0wvnhbBKT5zxhhBS5DDs0&usqp=CAU"
                width="100"
              />
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                Phân Tích Điểm Yếu
              </h3>
              <p className="text-gray-600 mt-2 group-hover:text-gray-800 transition-colors duration-300">
                Báo cáo chi tiết giúp cải thiện từng kỹ năng TOEIC.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Bài Test Đa Dạng</h2>
          <div className="flex justify-center mt-12 space-y-8 md:space-y-0 md:space-x-8">
            <div className="bg-white p-6 rounded shadow group transition-transform duration-300 transform hover:scale-105 hover:bg-gray-100 w-full md:w-1/3 lg:w-1/4">
              <img
                alt="Convenient Icon"
                className="mb-4 mx-auto h-24"
                height="100"
                src="https://storage.googleapis.com/a1aa/image/IvPDgOsOOOofWS7qOSyavlCOYIpzsmHSHk49bPHypH3bNOfTA.jpg"
                width="100"
              />
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                Listening
              </h3>
              <p className="text-gray-600 mt-2 group-hover:text-gray-800 transition-colors duration-300">
                Bài kiểm tra đánh giá kỹ năng nghe hiểu
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow group transition-transform duration-300 transform hover:scale-105 hover:bg-gray-100 w-full md:w-1/3 lg:w-1/4">
              <img
                alt="Fast Icon"
                className="mb-4 mx-auto h-24"
                height="100"
                src="https://storage.googleapis.com/a1aa/image/ngKEjBCQQzLrB9EGdlXiG3qhBskUnT0lvVPUo3AcMYGwGnfJA.jpg"
                width="100"
              />
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                Reading
              </h3>
              <p className="text-gray-600 mt-2 group-hover:text-gray-800 transition-colors duration-300">
                Bài kiểm tra đánh giá kỹ năng đọc hiểu.
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow group transition-transform duration-300 transform hover:scale-105 hover:bg-gray-100 w-full md:w-1/3 lg:w-1/4">
              <img
                alt="Global Icon"
                className="mb-4 mx-auto h-24"
                height="100"
                src="https://storage.googleapis.com/a1aa/image/cDzYvp2pfVVTda6jGoh4sZbHvXAN1JPwYBPFvpCaVfz8acenA.jpg"
                width="100"
              />
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                Mini Test
              </h3>
              <p className="text-gray-600 mt-2 group-hover:text-gray-800 transition-colors duration-300">
                Bài kiểm tra cho từng phần.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 text-center"></section>
      </main>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </body>
  );
}

export default Landing_page;
