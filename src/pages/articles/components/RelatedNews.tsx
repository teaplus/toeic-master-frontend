// src/components/RelatedNews.tsx
const RelatedNews = () => {
  const news = [
    {
      id: 1,
      title: "Hồ sơ pháp lý các cơ sở Ms Hoa TOEIC",
      image: "/images/news1.jpg",
      url: "/tin-tuc/ho-so-phap-ly",
    },
    {
      id: 2,
      title: "Mẫu Answer Sheet TOEIC mới nhất Full [PDF]",
      image: "/images/answer-sheet.png",
      url: "/answer-sheet-toeic",
    },
    {
      id: 3,
      title: "Kinh nghiệm phân chia thời gian làm bài thi TOEIC",
      image: "/images/time-management.png",
      url: "/kinh-nghiem-phan-chia-thoi-gian",
    },
    {
      id: 4,
      title: "CẢNH BÁO LỪA ĐẢO MẠO DANH MS HOA TOEIC",
      image: "/images/warning.jpg",
      url: "/canh-bao-lua-dao",
    },
    {
      id: 5,
      title: "Lệ phí thi TOEIC 4 kỹ năng",
      image: "/images/fee.jpg",
      url: "/le-phi-thi-toeic",
    },
  ];

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-6">Tin tức khác</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            className="group hover:shadow-lg transition rounded-lg overflow-hidden bg-white"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <p className="p-4 text-gray-800 group-hover:text-red-500 transition line-clamp-2">
              {item.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RelatedNews;
