/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  QuestionResponseType,
  TestResponseType,
  TestSessionResponseDataType,
} from "../../types/test";
import QuestionContent from "./components/QuestionContent";
import ExamHeader from "./components/ExamHeader";
import { saveAnswerAPI, submitTestAPI } from "../../services/test.service";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNotice } from "../../components/common/Notice";

interface ExamState {
  currentSection: number;
  currentPart: number;
  currentQuestion: number;
  currentGroup: number;
  answers: { [key: string]: number };
  parts: {
    part_id: number;
    partNumber: number;
    answers: { question_id: number; answer_id: number }[];
  }[];
  selectedPartId: number;
  markedQuestions: Set<number>;
}

interface ExamInterfaceProps {
  test: Required<TestResponseType>;
  testSessionResponse: Required<TestSessionResponseDataType>;
}

export const ExamInterface: React.FC<ExamInterfaceProps> = ({
  test,
  testSessionResponse,
}) => {
  // console.log('test',test)
  const [timeLeft, setTimeLeft] = useState(
    testSessionResponse?.timeRemaining || 120 * 60
  );
  if (
    !test?.sections?.length ||
    !test.sections.every(
      (s) => s.parts?.length && s.parts.every((p) => p.questions?.length)
    )
  ) {
    throw new Error("Invalid test data structure");
  }
  const { id: testId, test_id: testSessionId } = useParams<{
    id: string;
    test_id: string;
  }>();

  const notice = useNotice();

  const [state, setState] = useState<ExamState>(() => {
    const firstSection = test.sections[0];
    const firstPart = firstSection.parts[0];

    return {
      currentSection: 0,
      currentPart: 0,
      currentQuestion: 0,
      answers: {},
      currentGroup: 0,
      parts: [
        {
          part_id: firstPart.id,
          partNumber: firstPart.partNumber,
          answers: [],
        },
      ],
      selectedPartId: firstPart.id,
      markedQuestions: new Set(),
    };
  });

  const currentSection = test.sections[state.currentSection];
  const currentPart = currentSection.parts[state.currentPart];
  const currentQuestion = currentPart.questions[state.currentQuestion];
  const currentGroup = currentPart.questions[state.currentQuestion]?.group;
  const groupedQuestions = currentPart.questions.reduce((groups, question) => {
    const { group } = question;
    if (group) {
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(question);
    }
    return groups;
  }, {} as Record<string, typeof currentPart.questions>);
  const flattenQuestions = (test: Required<TestResponseType>) => {
    const result: {
      questionNumber: number;
      sIndex: number;
      pIndex: number;
      qIndex: number;
      question: QuestionResponseType;
      partId: number;
    }[] = [];
    let questionNumber = 1;

    test.sections.forEach((section, sIndex) => {
      section.parts.forEach((part, pIndex) => {
        part.questions.forEach((question, qIndex) => {
          result.push({
            questionNumber: questionNumber++,
            sIndex,
            pIndex,
            qIndex,
            question,
            partId: part.id,
          });
        });
      });
    });

    return result;
  };

  useEffect(() => {}, [currentQuestion, state.selectedPartId]);

  useEffect(() => {
    const loadTestSessionResponses = async () => {
      try {
        // Kiểm tra nếu có testSessionResponse và có responses
        if (testSessionResponse?.responses?.length) {
          setState((prev) => {
            // Tạo object answers mới từ responses
            const newAnswers = testSessionResponse.responses.reduce(
              (acc: { [key: string]: number }, response: any) => {
                acc[response.question_id] = response.answer_id;
                return acc;
              },
              {}
            );

            return {
              ...prev,
              answers: newAnswers,
            };
          });
        }
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error loading test session responses:", error);

        // Nếu lỗi 401 (Unauthorized), callAPIWithToken sẽ tự động xử lý refresh token
        // Nếu refresh token thất bại, người dùng sẽ được chuyển hướng đến trang login

        // Các lỗi khác có thể được xử lý tại đây
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            // Xử lý lỗi forbidden
            window.location.href = "/403";
          }
          // Có thể thêm xử lý cho các mã lỗi khác
        }
      }
    };

    loadTestSessionResponses();
  }, [testSessionResponse.responses]); // Dependencies

  if (!currentSection || !currentPart || !currentQuestion) {
    throw new Error("Invalid current question state");
  }

  useEffect(() => {
    initState();
    setTimeLeft(testSessionResponse?.timeRemaining || 120 * 60);
  }, [testSessionResponse, test]);

  const initState = () => {
    try {
      console.log("testSessionResponse", testSessionResponse);
      if (testSessionResponse && testSessionResponse.responses) {
        test.sections.forEach((section) => {
          section.parts.forEach((part) => {
            part.questions.forEach((question) => {
              testSessionResponse.responses.forEach((response) => {
                if (response.question.id === question.id) {
                  setState((prev) => ({
                    ...prev,
                    answers: {
                      ...prev.answers,
                      [question.id]: response.answer.id,
                    },
                  }));
                }
              });
            });
          });
        });
      } else {
        console.log("No test session responses available");
      }
    } catch (error) {
      console.error("Error processing test responses:", error);
    }
  };

  const handleSubmitAnswer = async (questionId: number, answer: number) => {
    const res = await saveAnswerAPI({
      testId: Number(testId),
      testSessionId: Number(testSessionId),
      questionId: questionId,
      answerId: answer,
      timeRemaining: timeLeft,
    });
    if (res.data.statusCode === 200) {
      console.log("res", res);
    }
  };

  const handleAnswerSelect = async (questionId: number, answer: number) => {
    console.log("questionId", questionId, "answer", answer);

    try {
      await handleSubmitAnswer(questionId, answer);
    } catch (error) {
      console.error("Error submitting answer:", error);
      notice.show(
        "error",
        "Có lỗi xảy ra khi lưu câu trả lời. Vui lòng thử lại."
      );
    }

    setState((prev) => {
      // Kiểm tra xem part đã tồn tại trong state chưa
      const existingPartIndex = prev.parts.findIndex(
        (p) => p.part_id === currentPart.id
      );

      if (existingPartIndex === -1) {
        // Nếu part chưa tồn tại, thêm mới
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: answer,
          },
          parts: [
            ...prev.parts,
            {
              part_id: currentPart.id,
              partNumber: currentPart.partNumber,
              answers: [{ question_id: questionId, answer_id: answer }],
            },
          ],
        };
      }

      // Nếu part đã tồn tại, cập nhật answers của part đó
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: answer,
        },
        parts: prev.parts.map((part, index) =>
          index === existingPartIndex
            ? {
                ...part,
                answers: [
                  ...part.answers,
                  { question_id: questionId, answer_id: answer },
                ],
              }
            : part
        ),
      };
    });

    console.log("state.answers", state.answers);
  };

  const handleSubmitExam = async () => {
    console.log("state.answers", state.parts);
    try {
      const response = await submitTestAPI(Number(testSessionId));
      if (response.data.statusCode === 201) {
        // Redirect to results page
        console.log("response.data.data.resultId", response.data.data.resultId);
        window.location.href = `/test/review/${testId}/${testSessionId}`;
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!");
    }
  };

  const handleQuestionClick = (
    sIndex: number,
    pIndex: number,
    qIndex: number,
    partId: number
  ) => {
    setState((prev) => ({
      ...prev,
      currentSection: sIndex,
      currentPart: pIndex,
      currentQuestion: qIndex,
      selectedPartId: partId,
    }));
  };

  const totalQuestion = test.sections.reduce((total, section) => {
    return (
      total +
      section.parts.reduce((total, part) => {
        return total + part.questions.length;
      }, 0)
    );
  }, 0);

  // console.log("totalQuestion", totalQuestion, state.currentQuestion);
  // Thêm các hooks và helpers cho Timer
  // 120 phút mặc định
  const isTimeWarning = timeLeft <= 300; // cảnh báo khi còn 5 phút
  // Helper function để format thời gian
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNextQuestion = () => {
    setState((prev) => {
      const isLastQuestion =
        prev.currentQuestion === currentPart.questions.length - 1;
      const isLastPart = prev.currentPart === currentSection.parts.length - 1;
      const isLastSection = prev.currentSection === test.sections.length - 1;
      console.log("isLastQuestion", isLastQuestion, isLastPart, isLastSection);

      // Nếu là câu hỏi cuối cùng trong phần
      if (isLastQuestion) {
        // Kiểm tra nếu cũng là phần cuối cùng
        if (isLastPart) {
          // Đã đến phần cuối cùng, không thay đổi gì thêm

          return prev;
        }

        // Chuyển sang phần tiếp theo
        return {
          ...prev,
          currentPart: prev.currentPart + 1,
          selectedPartId: currentSection.parts[prev.currentPart + 1].id,
          currentQuestion: 0, // Bắt đầu từ câu hỏi đầu tiên của phần tiếp theo
        };
      }

      // Nếu chưa phải câu hỏi cuối cùng
      return {
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      };
    });
  };
  // // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          if (window.confirm("Hết giờ làm bài! Bài thi sẽ được nộp tự động.")) {
            handleSubmitExam();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  console.log("state", state);
  const handlePartSelect = (partId: number) => {
    // Tìm section và part tương ứng với partId được chọn
    let targetSectionIndex = -1;
    let targetPartIndex = -1;

    for (let s = 0; s < test.sections.length; s++) {
      const pIndex = test.sections[s].parts.findIndex((p) => p.id === partId);
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
        currentQuestion: 0, // Reset về câu hỏi đầu tiên của part mới
        selectedPartId: partId,
        selectedSectionId: test.sections[targetSectionIndex].id, // Nếu bạn có sử dụng selectedSectionId
      }));
    } else {
      console.error("Part not found");
    }
  };

  const handleMarkQuestion = (questionId: number) => {
    setState((prev) => {
      const newMarked = new Set(prev.markedQuestions);
      if (newMarked.has(questionId)) {
        newMarked.delete(questionId);
      } else {
        newMarked.add(questionId);
      }
      return {
        ...prev,
        markedQuestions: newMarked,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ExamHeader testName={test.name} />

      <div className="flex max-w-7xl mx-auto px-4 py-6 gap-6">
        {/* Left side */}
        <div className="flex-1 space-y-6">
          {/* Navigation */}
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
              <div>
                {currentQuestion.number === totalQuestion ? (
                  <button
                    onClick={() => {
                      if (window.confirm("Bạn có chắc chắn muốn nộp bài?")) {
                        handleSubmitExam();
                      }
                    }}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Part Selection */}
          <div className="mb-4 flex gap-2">
            {test.sections.map((section, idx) =>
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

          {/* Question Content */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {/* Hiển thị passage cho group */}

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

            {/* Display images from first question in group */}
            {currentPart.questions.find(
              (q) => q.group === currentQuestion.group
            )?.image_url &&
              currentPart.partNumber !== 2 &&
              currentPart.partNumber !== 3 &&
              currentPart.partNumber !== 4 && (
                <div className="mb-4">
                  {(() => {
                    const imageUrls = currentPart.questions
                      .find((q, idx) => q.group === currentQuestion.group)
                      ?.image_url?.split(",");

                    return imageUrls?.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Question ${idx + 1}`}
                        className="rounded-lg object-contain w-full h-auto"
                      />
                    ));
                  })()}
                </div>
              )}

            {currentPart.questions.some(
              (q) => q.group === currentQuestion.group
            ) && (
              <div className="mb-6">
                {currentPart.questions.find(
                  (q) => q.group === currentQuestion.group
                ) &&
                  currentPart.partNumber !== 4 &&
                  currentPart.partNumber !== 3 &&
                  currentPart.partNumber !== 2 &&
                  !currentPart.questions.find(
                    (q) => q.group === currentQuestion.group
                  )?.image_url && (
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
            {/* {!currentQuestion.group && currentQuestion.passage && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: currentQuestion.passage }}
                />
              </div>
            )} */}

            {currentGroup &&
              groupedQuestions[currentGroup].map((item, idx) => {
                return (
                  <div key={idx} className="m-4">
                    <QuestionContent
                      question={item as QuestionResponseType}
                      selectedAnswer={state.answers[item.id]}
                      onAnswerSelect={handleAnswerSelect}
                      currentPart={currentPart}
                      isHavePassage={
                        item.passage?.length &&
                        (currentPart.partNumber === 5 ||
                          currentPart.partNumber === 6)
                          ? true
                          : false
                      }
                    />
                  </div>
                );
              })}

            <div className="flex justify-between mt-4">
              <div>
                {state.currentQuestion > 0 && (
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        currentQuestion: Math.max(0, prev.currentQuestion - 1),
                      }))
                    }
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div>
                {currentQuestion.number === totalQuestion ? (
                  <button
                    onClick={() => {
                      if (window.confirm("Bạn có chắc chắn muốn nộp bài?")) {
                        handleSubmitExam();
                      }
                    }}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Navigation */}
        <div className="w-80 sticky top-4 h-[500px] ">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {/* Timer và Submit Section */}
            <div className="mb-6 border-b pb-4">
              <div
                className={`text-lg font-medium mb-4 flex items-center justify-center ${
                  isTimeWarning ? "text-red-600 animate-pulse" : "text-gray-600"
                }`}
              >
                <span>{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={() => {
                  if (window.confirm("Bạn có chắc chắn muốn nộp bài?")) {
                    handleSubmitExam();
                  }
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Submit Test
              </button>
            </div>

            {/* Navigation hiện tại */}
            <h3 className="text-lg font-semibold mb-4">Test Navigation</h3>

            {/* Questions grid */}

            {/* <div className="p-1 grid grid-cols-5 gap-2 overflow-y-auto h-[400px]">
              {test.sections.map((section, sIndex) =>
                section.parts.map((part, pIndex) =>
                  part.questions.map((question, qIndex) => {
                    // Calculate absolute question number
                    let questionNumber = 1;
                    // Add questions from previous sections
                    for (let i = 0; i < sIndex; i++) {
                      questionNumber += test.sections[i].parts.reduce(
                        (sum, p) => sum + p.questions.length,
                        0
                      );
                    }
                    // Add questions from previous parts in current section
                    for (let i = 0; i < pIndex; i++) {
                      questionNumber += section.parts[i].questions.length;
                    }
                    // Add current question index
                    questionNumber += qIndex;

                    return (
                      <button
                        key={`${sIndex}-${pIndex}-${qIndex}`}
                        onClick={() =>
                          handleQuestionClick(sIndex, pIndex, qIndex)
                        }
                        className={`
                          p-2 rounded-md text-center text-sm
                          ${
                            state.currentSection === sIndex &&
                            state.currentPart === pIndex &&
                            state.currentQuestion === qIndex
                              ? "ring-2 ring-blue-500"
                              : ""
                          }
                          ${
                            state.answers[question.id]
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }
                        `}
                      >
                        {questionNumber}
                      </button>
                    );
                  })
                )
              )}
            </div> */}

            <div className="p-1 grid grid-cols-5 gap-2 overflow-y-auto h-[400px]">
              {flattenQuestions(test).map(
                ({
                  questionNumber,
                  sIndex,
                  pIndex,
                  qIndex,
                  question,
                  partId,
                }) => (
                  <button
                    key={`${sIndex}-${pIndex}-${qIndex}`}
                    onClick={() =>
                      handleQuestionClick(sIndex, pIndex, qIndex, partId)
                    }
                    className={`p-2 rounded-md text-center text-sm relative
                      ${
                        state.currentSection === sIndex &&
                        state.currentPart === pIndex &&
                        state.currentQuestion === qIndex
                          ? "ring-2 ring-blue-500"
                          : ""
                      }
                      ${
                        state.answers[question.id]
                          ? "bg-blue-100"
                          : currentQuestion.group &&
                            question.group === currentGroup
                          ? "bg-green-100"
                          : "bg-gray-100"
                      } `}
                  >
                    {questionNumber}
                    <span
                      onClick={(e) => {
                        e.stopPropagation(); // Chặn sự kiện click để không diễn ra navigation
                        handleMarkQuestion(question.id);
                      }}
                      className={`absolute top-1 right-1 text-sm cursor-pointer
                        ${
                          state.markedQuestions.has(question.id)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      `}
                    >
                      ★
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
