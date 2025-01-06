import React from "react";

interface ExamHeaderProps {
  testName: string;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({ testName }) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">{testName}</h1>
        </div>
      </div>
    </div>
  );
};

export default ExamHeader;
