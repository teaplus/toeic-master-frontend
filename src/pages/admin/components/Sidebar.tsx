import React from "react";

interface SidebarProps {
  activeTab: AdminTabId;
  onTabChange: (tab: AdminTabId) => void;
}

export const ADMIN_MENU_ITEMS = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "tests", icon: "📝", label: "Quản lý bài thi" },
  { id: "users", icon: "👥", label: "Quản lý người dùng" },
  { id: "questions", icon: "❓", label: "Ngân hàng câu hỏi" },
  { id: "results", icon: "📈", label: "Kết quả thi" },
] as const;

export type AdminTabId = (typeof ADMIN_MENU_ITEMS)[number]["id"];

function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen fixed left-0 top-0">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">TOEIC Admin</h2>
        <nav className="space-y-2">
          {ADMIN_MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors ${
                activeTab === item.id ? "bg-gray-700" : ""
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
