import React from "react";
import { Question, QuestionResponseType } from "../../../types/test";

interface QuestionContentProps {
  question: QuestionResponseType;
  selectedAnswer: number;
  onAnswerSelect: (questionId: number, answer: number) => void;
  isHavePassage: boolean;
}

const QuestionContent: React.FC<QuestionContentProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isHavePassage,
}) => {
  const imageUrls = question.image_url ? question.image_url.split(",") : [];
  // console.log('question', question, 'selectedAnswer', selectedAnswer);
  return (
    <div className="space-y-6">
      {/* Question Media */}
      {question.audio_url && (
        <div className="mb-4">
          <audio controls className="w-full">
            <source src={question.audio_url} type="audio/mpeg" />
          </audio>
        </div>
      )}

      {!isHavePassage &&
        imageUrls &&
        Array.isArray(imageUrls) &&
        imageUrls.length > 0 && (
              // Start of Selection
              <div className="grid grid-cols-2 gap-4 mb-4">
                {imageUrls.map((url: string, idx: number) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Question ${idx + 1}`}
                    className="rounded-lg object-contain w-full h-auto"
                  />
                ))}
              </div>
        )}

      <div className="flex items-center space-x-4 p-1 bg-gray-100 rounded-lg">
        <div className="text-blue-600 font-semibold text-lg">{`Câu ${question.number}`}</div>
        <div className="text-gray-800 font-medium text-base flex-1">
          {question.content}
        </div>
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
              <span>{answer.content}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionContent;
