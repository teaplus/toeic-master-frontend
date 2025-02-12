import React from "react";
import { Part, QuestionReviewResponseDataType } from "../../../../types/test";

interface ReviewQuestionProps {
  questions: QuestionReviewResponseDataType[];
  responses: Record<number, number>;
  currentPart: Part;
}

const ReviewQuestion: React.FC<ReviewQuestionProps> = ({
  questions,
  responses,
  currentPart,
}) => {
  const question = questions[0];
  // const userAnswer = responses?.[question.id];
  const isUserCorrect = question.userResponse?.isCorrect;
  const idUserResponseId = question.userResponse?.answer.id;

  console.log("question", question);

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex items-center space-x-4 p-1 bg-gray-100 rounded-lg">
        <div className="text-blue-600 font-semibold text-lg">{`Câu ${question.number}`}</div>
        {currentPart.partNumber !== 5 && (
          <div className="text-gray-800 font-medium text-base flex-1">
            {question.content}
          </div>
        )}
        <div
          className={`px-2 py-1 rounded text-sm ${
            isUserCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isUserCorrect ? "Đúng" : "Sai"}
        </div>
      </div>

      {/* Answers */}
      <div className="space-y-3">
        {question.answers.map((answer) => {
          const isSelected = idUserResponseId === answer.id;
          const isCorrect = answer.is_correct;
          console.log("isSelected", isSelected, "isCorrect", isCorrect);
          return (
            <div
              key={answer.id}
              className={`
                flex items-center p-4 rounded-lg border
                ${
                  isCorrect && isSelected
                    ? "bg-green-50 border-green-200"
                    : isCorrect && !isSelected
                    ? "bg-blue-50 border-blue-200"
                    : idUserResponseId === answer.id
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }
              `}
            >
              <div className="w-4 h-4 rounded-full border mr-3 flex items-center justify-center">
                {isSelected && (
                  <div className={`w-2 h-2 rounded-full bg-gray-500`} />
                )}
              </div>
              <span>{answer.content}</span>
              {isCorrect && <span className="ml-auto text-green-600">✓</span>}
              {isSelected && !isCorrect && (
                <span className="ml-auto text-red-600">✗</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewQuestion;
