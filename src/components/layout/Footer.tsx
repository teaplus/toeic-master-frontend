import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 w-full">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Về chúng tôi</h3>
            <p className="text-gray-300">
              ToeicMaster - Nền tảng luyện thi TOEIC hàng đầu Việt Nam
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
            <p className="text-gray-300">Email: support@toeicmaster.com</p>
            <p className="text-gray-300">Hotline: 0948-105-227</p>
          </div>
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold mb-4">Theo dõi chúng tôi</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="#" className="hover:text-yellow-300 transition-colors">
                <i className="fab fa-facebook text-2xl"></i>
              </a>
              <a href="#" className="hover:text-yellow-300 transition-colors">
                <i className="fab fa-youtube text-2xl"></i>
              </a>
              <a href="#" className="hover:text-yellow-300 transition-colors">
                <i className="fab fa-instagram text-2xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            &copy; 2024 ToeicMaster. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
