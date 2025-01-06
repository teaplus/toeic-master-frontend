// src/components/CourseTabs.tsx
import React, { useState } from "react";

interface TabContentProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({ id, activeTab, children }) => {
  return (
    <div className={`${id === activeTab ? "block" : "hidden"}`}>{children}</div>
  );
};

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("tab-suggestions");

  return (
    <div className="mx-auto py-8 px-4 max-w-7xl">
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center space-x-4 mb-6">
        <button
          className={`font-semibold transition-colors duration-300 ${
            activeTab === "tab-suggestions"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-600 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("tab-suggestions")}
        >
          Full Test
        </button>
        <button
          className={`font-semibold transition-colors duration-300 ${
            activeTab === "tab-in-progress"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-600 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("tab-in-progress")}
        >
          Mini Test (8)
        </button>
        <button
          className={`font-semibold transition-colors duration-300 ${
            activeTab === "tab-completed"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-600 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("tab-completed")}
        >
          Hoàn thành (1)
        </button>
      </div>

      {/* Tab Content */}
      <TabContent id="tab-suggestions" activeTab={activeTab}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
            <img
              src="https://via.placeholder.com/400x200.png?text=Scratch+for+Beginners"
              alt="Scratch for Beginners"
              className="w-full"
            />
            <div className="p-4">
              <span className="text-sm font-semibold text-purple-500">
                Khóa học
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-2">
                Scratch cho người mới bắt đầu
              </h3>
              <p className="text-sm text-gray-600">codelearn</p>

              <div className="mt-3">
                <span className="text-green-500 text-sm ml-2">Full test</span>
              </div>
            </div>
          </div>
        </div>
      </TabContent>

      <TabContent id="tab-in-progress" activeTab={activeTab}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
            <img
              src="https://via.placeholder.com/400x200.png?text=C+for+Beginners"
              alt="C for Beginners"
              className="w-full"
            />
            <div className="p-4">
              <span className="text-sm font-semibold text-blue-500"></span>
              <span className="text-xs font-semibold text-red-500 ml-2">
                Phổ biến
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-2">
                ETS 2022 Test 1
              </h3>

              <div className="mt-3">
                <span className="text-green-500 text-lg font-bold">
                  Full test
                </span>
              </div>
            </div>
          </div>
        </div>
      </TabContent>

      <TabContent id="tab-completed" activeTab={activeTab}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
            <img
              src="https://via.placeholder.com/400x200.png?text=C+++for+Beginners"
              alt="C++ for Beginners"
              className="w-full"
            />
            <div className="p-4">
              <span className="text-sm font-semibold text-blue-500">
                Khóa học
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-2">
                C++ cho người mới bắt đầu
              </h3>
              <p className="text-sm text-gray-600">tuanlq7</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500 text-lg font-bold">4.7</span>
                <span className="text-gray-500 text-sm ml-2">(★★★★★)</span>
              </div>
              <div className="mt-3">
                <span className="text-green-500 text-lg font-bold">
                  Miễn phí
                </span>
              </div>
            </div>
          </div>
        </div>
      </TabContent>
    </div>
  );
};

export default Tabs;
