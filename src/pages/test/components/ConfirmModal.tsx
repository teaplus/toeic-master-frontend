import React from "react";
import { ListTestResponseDataType } from "../../../types/test";

interface ConfirmModalProps {
  test: ListTestResponseDataType;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  test,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Start Test Confirmation
        </h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Test Name:</span>
            <span className="font-medium">{test.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Type:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium 
              ${
                test.type === "mini"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {test.type === "mini" ? "Mini Test" : "Full Test"}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Questions:</span>
            <span className="font-medium">{test.total_questions}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Level:</span>
            <span className="font-medium">{test.level}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Time Limit:</span>
            <span className="font-medium">
              {test.type === "MINI_TEST" ? "1 hour" : "2 hours"}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to start this test? Make sure you have enough
          time to complete it.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
