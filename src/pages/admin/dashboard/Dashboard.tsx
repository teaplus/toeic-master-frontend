import React, { useState } from "react";
import Sidebar, { AdminTabId } from "../components/Sidebar";
import DashboardTab from "../components/Tabs/DashboardTab";
import TestManagementTab from "../components/Tabs/TestManagementTab";
import UserManagementTab from "../components/Tabs/UserManagementTab";

const TAB_COMPONENTS: Record<AdminTabId, React.ComponentType> = {
  dashboard: DashboardTab,
  tests: TestManagementTab,
  users: UserManagementTab,
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
