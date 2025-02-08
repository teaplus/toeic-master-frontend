import React, { useState } from "react";
import AuthModal from "../../components/auth/AuthModal";

function Landing_page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="w-full bg-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          <div className="flex flex-col md:flex-row items-center">
            <img
              alt="Online Test Illustration"
              className="mx-auto md:mx-0 md:mr-8 w-64 h-64 object-cover rounded-lg"
              src="https://storage.googleapis.com/a1aa/image/RF6EHUP4vno9MB0Ex95g4HieUObjOTr0BKLM1N7ecs16acenA.jpg"
            />
            <div className="text-left mt-6 md:mt-0">
              <h1 className="text-3xl font-bold text-blue-500 mb-2">
                TOEIC MASTER Online Test
              </h1>
              <h2 className="text-xl font-semibold text-white mb-4">
                Kiểm tra và thi thử TOEIC trực tuyến
              </h2>
              <p className="text-gray-300 mb-6">
                TOEIC MASTER Online Test là bài thi nhằm kiểm tra và đánh giá
                trình độ TOEIC miễn phí theo chuẩn quốc tế.
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg
                transition-colors duration-300"
                onClick={() => setIsModalOpen(true)}
              >
                BẮT ĐẦU NGAY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-12">
          Biết được điểm TOEIC của bạn ngay lập tức sau khi hoàn thành
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Thuận tiện",
              desc: "Bạn có thể làm bài thi mọi lúc, mọi nơi",
              img: "https://storage.googleapis.com/a1aa/image/5l3gltYXT8bUFBOihpKqenDQ2wAFsBL1BSIOALs0MfW1acenA.jpg",
            },
            {
              title: "Nhanh chóng",
              desc: "Nhận kết quả thi và chứng chỉ xác nhận ngay sau khi hoàn thành",
              img: "https://storage.googleapis.com/a1aa/image/Y8Mdyy7P1cZ0O9iU5Tev1P0OSYgnCFUlaIw8XuGEeWDe148nA.jpg",
            },
            {
              title: "Chuẩn quốc tế",
              desc: "Bài kiểm tra được thiết kế dựa trên cấu trúc bài thi TOEIC thực tế",
              img: "https://storage.googleapis.com/a1aa/image/cDzYvp2pfVVTda6jGoh4sZbHvXAN1JPwYBPFvpCaVfz8acenA.jpg",
            },
            {
              title: "Phân Tích Điểm Yếu",
              desc: "Báo cáo chi tiết giúp cải thiện từng kỹ năng TOEIC",
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXTOEmZI0LZJIY3B9I-1clV3hVsaLDHteFHnznRlySX292OQ0wvnhbBKT5zxhhBS5DDs0&usqp=CAU",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 
              hover:border-blue-500 transition-colors duration-300"
            >
              <img
                alt={feature.title}
                className="mb-4 mx-auto h-24 w-24 object-cover rounded-lg"
                src={feature.img}
              />
              <h3 className="text-xl font-semibold text-blue-500 text-center mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-center">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Test Types Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-12">
          Bài Test Đa Dạng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Listening",
              desc: "Bài kiểm tra đánh giá kỹ năng nghe hiểu",
              img: "https://storage.googleapis.com/a1aa/image/IvPDgOsOOOofWS7qOSyavlCOYIpzsmHSHk49bPHypH3bNOfTA.jpg",
            },
            {
              title: "Reading",
              desc: "Bài kiểm tra đánh giá kỹ năng đọc hiểu",
              img: "https://storage.googleapis.com/a1aa/image/ngKEjBCQQzLrB9EGdlXiG3qhBskUnT0lvVPUo3AcMYGwGnfJA.jpg",
            },
            {
              title: "Mini Test",
              desc: "Bài kiểm tra cho từng phần",
              img: "https://storage.googleapis.com/a1aa/image/cDzYvp2pfVVTda6jGoh4sZbHvXAN1JPwYBPFvpCaVfz8acenA.jpg",
            },
          ].map((type, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 
              hover:border-blue-500 transition-colors duration-300"
            >
              <img
                alt={type.title}
                className="mb-4 mx-auto h-24 w-24 object-cover rounded-lg"
                src={type.img}
              />
              <h3 className="text-xl font-semibold text-blue-500 text-center mb-2">
                {type.title}
              </h3>
              <p className="text-gray-300 text-center">{type.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}

export default Landing_page;
