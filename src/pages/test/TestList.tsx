import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getListTestAPI } from "../../services/test.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ListTestResponseDataType } from "../../types/test";
import ConfirmModal from "./components/ConfirmModal";

const ITEMS_PER_PAGE = 10;

const TestList: React.FC = () => {
  const [tests, setTests] = useState<ListTestResponseDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedTest, setSelectedTest] =
    useState<ListTestResponseDataType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    fetchTests(currentPage, debouncedSearch, filter);
  }, [currentPage, debouncedSearch, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filter]);

  const fetchTests = async (page: number, search: string, testType: string) => {
    try {
      setLoading(true);
      const response = await getListTestAPI({
        page,
        limit: ITEMS_PER_PAGE,
        search,
        test_type: testType === "all" ? undefined : testType,
      });

      console.log("API Response:", response);

      if (response?.data?.data) {
        console.log("API Response:", response.data.data.tests);
        setTests(response.data.data.tests);
        setTotalItems(response.data.data.total);
      } else {
        console.error("Invalid data format:", response);
        setTests([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      setTests([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };
  console.log("Total items:", tests);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleTestClick = (test: ListTestResponseDataType) => {
    setSelectedTest(test);
  };

  const handleConfirmTest = () => {
    if (selectedTest) {
      navigate(`/test/${selectedTest.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Tests
          </h1>
          <p className="text-gray-600">
            Choose a test to practice and improve your skills
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tests..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Tests</option>
              <option value="MINI_TEST">Mini Tests</option>
              <option value="FULL_TEST">Full Tests</option>
            </select>
          </div>
        </div>

        {/* Content Section with Loading Indicator */}
        <div className="relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <LoadingSpinner />
            </div>
          )}

          {/* Tests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(tests) &&
              tests.map((test) => (
                <div
                  key={test.id}
                  onClick={() => handleTestClick(test)}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                        {test.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          test.type === "MINI_TEST"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {test.type === "MINI_TEST" ? "MINI TEST" : "FULL TEST"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span className="text-sm">
                          {test.total_questions} questions
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span className="text-sm">Level: {test.level}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          Created:{" "}
                          {new Date(test.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
                          Start Test
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State */}
          {!loading && (!Array.isArray(tests) || tests.length === 0) && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                No tests found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {Array.isArray(tests) && tests.length > 0 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {selectedTest && (
        <ConfirmModal
          test={selectedTest}
          isOpen={!!selectedTest}
          onClose={() => setSelectedTest(null)}
          onConfirm={handleConfirmTest}
        />
      )}
    </div>
  );
};

export default TestList;
