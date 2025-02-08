import React from "react";
import { Part, Question, QuestionResponseType } from "../../../types/test";

interface QuestionContentProps {
  question: QuestionResponseType;
  selectedAnswer: number;
  onAnswerSelect: (questionId: number, answer: number) => void;
  isHavePassage: boolean;
  currentPart: Part;
}

const QuestionContent: React.FC<QuestionContentProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isHavePassage,
  currentPart,
}) => {
  const imageUrls = question.image_url ? question.image_url.split(",") : [];
  // console.log('question', question, 'selectedAnswer', selectedAnswer);
  console.log('question', question, currentPart.partNumber);
  return (
    <div className="space-y-6">
      

      <div className="flex items-center space-x-4 p-1 bg-gray-100 rounded-lg">
        <div className="text-blue-600 font-semibold text-lg">{`Câu ${question.number}`}</div>
        {!isHavePassage && currentPart.partNumber !== 2 && (
          <div className="text-gray-800 font-medium text-base flex-1">
          { question.content}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {question.answers.map((answer, idx) => {
          return (
            <label
              key={idx}
              className={`
              flex items-center p-4 rounded-lg cursor-pointer
              ${
                selectedAnswer === answer.id
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-200"
              } border
            `}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={answer.content}
                checked={selectedAnswer === answer.id}
                onChange={() => onAnswerSelect(question.id, answer.id)}
                className="mr-3"
              />
              <span>{ currentPart.partNumber !== 1 && currentPart.partNumber !== 2 ? answer.content : null}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionContent;
