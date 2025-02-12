import React, { useState } from "react";
import { TestSessionReviewResponseDataType } from "../../../types/test";
import ReviewQuestion from "./components/ReviewQuestion";
import ExamHeader from "../components/ExamHeader";

interface ReviewInterfaceProps {
  test: Required<TestSessionReviewResponseDataType>;
  testSessionResponse: any;
}

export const ReviewInterface: React.FC<ReviewInterfaceProps> = ({
  test,
  testSessionResponse,
}) => {
  const [state, setState] = useState(() => {
    const firstSection = test.test.sections[0];
    const firstPart = firstSection.parts[0];

    return {
      currentSection: 0,
      currentPart: 0,
      currentQuestion: 0,
      currentGroup: 0,
      selectedPartId: firstPart.id,
      selectedSectionId: test.test.sections[0].id,
    };
  });

  const handlePartSelect = (partId: number) => {
    // Tìm section và part tương ứng với partId được chọn
    let targetSectionIndex = -1;
    let targetPartIndex = -1;

    for (let s = 0; s < test.test.sections.length; s++) {
      const pIndex = test.test.sections[s].parts.findIndex(
        (p) => p.id === partId
      );
      if (pIndex !== -1) {
        targetSectionIndex = s;
        targetPartIndex = pIndex;
        break;
      }
    }

    if (targetSectionIndex !== -1 && targetPartIndex !== -1) {
      setState((prev) => ({
        ...prev,
        currentSection: targetSectionIndex,
        currentPart: targetPartIndex,
        currentQuestion: 0,
        selectedPartId: partId,
        selectedSectionId: test.test.sections[targetSectionIndex].id,
      }));
    } else {
      console.error("Part not found");
    }
  };

  const currentSection = test.test.sections[state.currentSection];
  const currentPart = currentSection.parts[state.currentPart];
  const currentQuestion = currentPart.questions[state.currentQuestion];
  console.log("currentQuestion", currentQuestion);

  return (
    <div className="min-h-screen bg-gray-50">
      <ExamHeader testName={test.test.name} isReview={true} />

      <div className="flex max-w-7xl mx-auto px-4 py-6 gap-6">
        {/* Left side */}
        <div className="flex-1">
          {/* Navigation buttons và Part info */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    currentQuestion: Math.max(0, prev.currentQuestion - 1),
                  }))
                }
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                disabled={state.currentQuestion === 0}
              >
                Previous
              </button>
              <div className="flex flex-col items-center">
                <span className="text-lg font-medium text-blue-600">
                  Part {currentPart.partNumber}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium">Question</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                    {state.currentQuestion + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    of {currentPart.questions.length}
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    currentQuestion: Math.min(
                      currentPart.questions.length - 1,
                      prev.currentQuestion + 1
                    ),
                  }))
                }
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                disabled={
                  state.currentQuestion === currentPart.questions.length - 1
                }
              >
                Next
              </button>
            </div>
          </div>

          {/* Part Selection */}
          <div className="mb-4 flex gap-2">
            {test.test.sections.map((section, idx) =>
              section.parts.map((part) => (
                <button
                  key={`${idx}-${part.id}`}
                  onClick={() => handlePartSelect(part.id)}
                  className={`
                    px-4 py-2 rounded-lg
                    ${
                      state.selectedPartId === part.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }
                  `}
                >
                  Part {part.partNumber}
                </button>
              ))
            )}
          </div>

          {/* Questions content */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {/* Hiển thị audio cho group */}
            {currentPart.questions.find(
              (q) => q.group === currentQuestion.group
            )?.audio_url && (
              <div className="mb-4">
                <audio key={currentQuestion.group} controls className="w-full">
                  <source
                    src={
                      currentPart.questions.find(
                        (q) => q.group === currentQuestion.group
                      )?.audio_url || undefined
                    }
                    type="audio/mpeg"
                  />
                </audio>
              </div>
            )}

            {/* Hiển thị images từ câu hỏi đầu tiên trong group */}
            {currentPart.questions.find(
              (q) => q.group === currentQuestion.group
            )?.image_url && (
              <div className="mb-4">
                {currentPart.questions
                  .find(
                    (q) => q.group === currentQuestion.group && q.number === 1
                  )
                  ?.image_url?.split(",")
                  .map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Question ${idx + 1}`}
                      className="rounded-lg object-contain w-full h-auto"
                    />
                  ))}
              </div>
            )}

            {/* Hiển thị passage cho group */}
            {currentPart.questions.some(
              (q) => q.group === currentQuestion.group
            ) && (
              <div className="mb-6">
                {currentPart.questions.find(
                  (q) => q.group === currentQuestion.group
                ) && (
                  <div className="p-4 bg-gray-50 rounded-lg prose max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          currentPart.questions.find(
                            (q) => q.group === currentQuestion.group
                          )?.passage || "",
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Hiển thị passage riêng của câu hỏi nếu không thuộc group */}
            {!currentQuestion.group && currentQuestion.passage && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: currentQuestion.passage }}
                />
              </div>
            )}

            {/* Hiển thị các câu hỏi trong group */}
            {currentQuestion.group &&
              currentPart.questions
                .filter((q) => q.group === currentQuestion.group)
                .map((question, idx) => (
                  <div key={idx} className="m-4">
                    <ReviewQuestion
                      currentPart={currentPart}
                      questions={[question]}
                      responses={testSessionResponse.answers}
                    />
                  </div>
                ))}

            {/* Hiển thị câu hỏi đơn lẻ */}
            {!currentQuestion.group && (
              <div className="m-4">
                <ReviewQuestion
                  currentPart={currentPart}
                  questions={[currentQuestion]}
                  responses={testSessionResponse.answers}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right side - Navigation */}
        <div className="w-80 sticky top-4 h-[500px]">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {/* Score Summary */}
            <div className="mb-6 border-b pb-4">
              <div className="text-lg font-medium mb-4">Kết quả chi tiết</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tổng điểm:</span>
                  <span className="text-lg text-blue-600 font-semibold">
                    {testSessionResponse.total_score}
                  </span>
                </div>

                {/* Hiển thị điểm theo từng kỹ năng */}
                {testSessionResponse.listening_score !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span>Listening:</span>
                    <span className="font-medium">
                      {testSessionResponse.listening_score}
                    </span>
                  </div>
                )}

                {testSessionResponse.reading_score !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span>Reading:</span>
                    <span className="font-medium">
                      {testSessionResponse.reading_score}
                    </span>
                  </div>
                )}

                {testSessionResponse.writing_score !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span>Writing:</span>
                    <span className="font-medium">
                      {testSessionResponse.writing_score}
                    </span>
                  </div>
                )}

                {/* Thời gian làm bài */}
                <div className="pt-2 border-t mt-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Thời gian bắt đầu:</span>
                    <span>
                      {new Date(testSessionResponse.startedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Thời gian kết thúc:</span>
                    <span>
                      {new Date(
                        testSessionResponse.completedAt
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Thời gian còn lại:</span>
                    <span>
                      {Math.floor(testSessionResponse.timeRemaining / 60)} phút
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <h3 className="text-lg font-semibold mb-4">Test Navigation</h3>
            <div className="p-1 grid grid-cols-5 gap-2 overflow-y-auto h-[400px]">
              {test.test.sections.flatMap((section, sIndex) =>
                section.parts.flatMap((part, pIndex) =>
                  part.questions.map((question, qIndex) => {
                    const isCorrect = question.userResponse?.isCorrect;
                    return (
                      <button
                        key={question.id}
                        onClick={() => {
                          setState((prev) => ({
                            ...prev,
                            currentSection: sIndex,
                            currentPart: pIndex,
                            currentQuestion: qIndex,
                            selectedPartId: part.id,
                          }));
                          document
                            .getElementById(`question-${question.id}`)
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`p-2 rounded-md text-center text-sm
                          ${
                            state.currentSection === sIndex &&
                            state.currentPart === pIndex &&
                            state.currentQuestion === qIndex
                              ? "ring-2 ring-blue-500"
                              : ""
                          }
                          ${
                            isCorrect
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        `}
                      >
                        {question.number}
                      </button>
                    );
                  })
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewInterface;
