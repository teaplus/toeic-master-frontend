/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TestSessionReviewResponseDataType } from "../../../types/test";
import { ReviewInterface } from "./ReviewInterface";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import {
  getTestResponseAPI,
  getTestWithCorrectAnswerAPI,
} from "../../../services/test.service";

const ReviewPage: React.FC = () => {
  const { id: testId, test_id: testSessionId } = useParams<{
    id: string;
    test_id: string;
  }>();
  const [test, setTest] = useState<TestSessionReviewResponseDataType | null>(
    null
  );
  const [testSessionResponse, setTestSessionResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!testSessionId) return;
    getTestWithCorrectAnswerAPI(Number(testSessionId)).then((res) => {
      const { data } = res.data;
      console.log("dataReview", data);
      setTest(data);
      setLoading(false);
    });
    if (testSessionId) {
      getTestResponseAPI(testSessionId).then((res) => {
        const { data } = res.data;
        console.log("testSessionResponse", data);
        setTestSessionResponse(data);
      });
    }
  }, [testSessionId, testId]);

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

  return (
    <ReviewInterface test={test} testSessionResponse={testSessionResponse} />
  );
};

export default ReviewPage;
