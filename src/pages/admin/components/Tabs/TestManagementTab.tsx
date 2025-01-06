import React, { useState } from "react";
import ImportCSV from "../ImportCSV";
import { Test } from "../../types/test.types";
import { useNavigate } from "react-router-dom";

function TestManagementTab() {
  const [tests, setTests] = useState<Test[]>([]);

  const handleImportData = (test: Test) => {
    setTests((prev) => [...prev, test]);
    console.log("Imported test:", test);
  };

  const navigate = useNavigate();
const handleAddTest = (path: string) => {
  navigate(path);
};

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quản lý bài thi</h1>
          <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleAddTest('/admin/tests/create')}>
              Thêm bài thi
            </button>
            <ImportCSV onDataImported={handleImportData} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Tên bài thi</th>
                <th className="px-4 py-2">Loại</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td className="border px-4 py-2">{test.id}</td>
                  <td className="border px-4 py-2">{test.name}</td>
                  <td className="border px-4 py-2">{test.type}</td>
                  <td className="border px-4 py-2">{test.status}</td>
                  <td className="border px-4 py-2">
                    <button className="text-blue-500 mr-2">Sửa</button>
                    <button className="text-red-500">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TestManagementTab;
