import React, { useState } from "react";
import Sidebar, { AdminTabId } from "../components/Sidebar";
import DashboardTab from "../components/Tabs/DashboardTab";
import TestManagementTab from "../components/Tabs/TestManagementTab";

const TAB_COMPONENTS: Record<AdminTabId, React.ComponentType> = {
  dashboard: DashboardTab,
  tests: TestManagementTab,
  users: () => <div className="p-6">Quản lý người dùng</div>,
  questions: () => <div className="p-6">Ngân hàng câu hỏi</div>,
  results: () => <div className="p-6">Kết quả thi</div>,
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState<AdminTabId>("dashboard");
  const TabComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="ml-64 flex-1">
        <TabComponent />
      </main>
    </div>
  );
}

export default Dashboard;
