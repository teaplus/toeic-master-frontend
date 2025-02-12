import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getTestAPI } from "../../services/test.service";
import ExamContent from "./components/ExamContent";
import { TestResponseType } from "../../types/test";

const ExamPage2: React.FC = () => {
  const { id } = useParams();
  const [test, setTest] = useState<TestResponseType | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getTestAPI(id).then((res) => {
      const { data } = res.data;
      //   console.log(data);
      setTest(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Test not found"}</p>
        </div>
      </div>
    );
  }

  return <ExamContent test={test} />;
};

export default ExamPage2;
