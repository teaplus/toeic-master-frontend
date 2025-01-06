import React, { useState } from "react";
import { ButtonCustom } from "./Button";
import { TestResponseType } from "../../../types/test";
import QuestionContent from "../../test/components/QuestionContent";

interface ExamState {
  currentSection: number;
  currentPart: number;
  currentQuestion: number;
  answers: { [key: string]: string };
  currentGroup: number;
}

interface currentGroup {
  id: string;
  passage: string;
  questions: number[];
}

function ExamContent({ test }: { test: TestResponseType }) {
  if (
    !test?.sections?.length ||
    !test.sections.every(
      (s) => s.parts?.length && s.parts.every((p) => p.questions?.length)
    )
  ) {
    throw new Error("Invalid test data structure");
  }

  const [stateTest, setStateTest] = useState<ExamState>(() => {
    const firstSection = test.sections[0];
    const firstPart = firstSection.parts[0];

    return {
      currentSection: 0,
      currentPart: 0,
      currentQuestion: 0,
      answers: {},
      currentGroup: 0,
    };
  });

  const currentSection = test.sections[stateTest.currentSection];
  const currentPart = currentSection.parts[stateTest.currentPart];
  const currentQuestion = currentPart.questions[stateTest.currentQuestion];
  const currentGroup = currentPart.questions[stateTest.currentQuestion]?.group;
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
  console.log(groupedQuestions);
  if (!currentSection || !currentPart || !currentQuestion) {
    throw new Error("Invalid current question state");
  }
  if (currentGroup) {
    console.log('CurentgroupedQuestions', groupedQuestions[currentGroup]);
  }

  const getQuestionKey = () => {
    return `${stateTest.currentSection}-${stateTest.currentPart}-${stateTest.currentQuestion}`;
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setStateTest((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [getQuestionKey()]: answer,
      },
    }));
  };

  const handleQuestionClick = (
    sIndex: number,
    pIndex: number,
    qIndex: number
  ) => {
    setStateTest((prev) => ({
      ...prev,
      currentSection: sIndex,
      currentPart: pIndex,
      currentQuestion: qIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex max-w-7xl mx-auto px-4 py-6 gap-6">
        <div className="flex-1 space-y-6">
          {/* header navigation */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <ButtonCustom onClick={() => {}} disabled={false}>
                Previous
              </ButtonCustom>
              <ButtonCustom onClick={() => {}} disabled={false}>
                Next
              </ButtonCustom>
            </div>
          </div>

          {/* question content */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {/* <QuestionContent /> */}
          </div>

          {/* Right side - Navigation */}
          <div className="w-80 sticky top-4 h-[500px]">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="mb-6 border-b pb-4">
                <div className="text-lg font-medium mb-4 flex items-center justify-center">
                  {/* <span>{formatTime(timeLeft)}</span> */}
                </div>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamContent;
