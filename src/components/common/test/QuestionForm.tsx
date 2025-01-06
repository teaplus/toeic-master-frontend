import React, { useState, useEffect } from "react";
import AddQuestionForm from "./AddQuestionForm";
import { TOEIC_PART_QUESTIONS, ToeicQuestion } from "../../../types/toeic";

interface QuestionFormProps {
  part: number;
  mode: "full" | "part";
  questions: ToeicQuestion[];
  onQuestionAdded: (newQuestion: ToeicQuestion) => void;
  onQuestionDeleted: (questionNumber: number) => void;
  onQuestionEdited: (editedQuestion: ToeicQuestion) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  part,
  mode,
  questions,
  onQuestionAdded,
  onQuestionDeleted,
  onQuestionEdited,
}) => {
  const [groupQuestions, setGroupQuestions] = useState<boolean>(false);
  const [passage, setPassage] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [questionCounts, setQuestionCounts] = useState<{
    [key: number]: number;
  }>({});

  const needsPassage = [6, 7].includes(part);
  const needsTranscript = [3, 4].includes(part);
  const needsAudio = [1, 2, 3, 4].includes(part);
  const needsImage = [1].includes(part);

  const maxQuestions =
    TOEIC_PART_QUESTIONS[part as keyof typeof TOEIC_PART_QUESTIONS];

  const handleQuestionAdded = (newQuestion: ToeicQuestion) => {
    setQuestionCounts((prevCounts) => ({
      ...prevCounts,
      [part]: (prevCounts[part] || 0) + 1,
    }));
    onQuestionAdded(newQuestion);
  };

  const currentQuestionCount = questions.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Part {part} Questions ({currentQuestionCount}/{maxQuestions})
        </h3>
        <div className="text-sm text-gray-600">
          {currentQuestionCount === maxQuestions ? (
            <span className="text-green-500">✓ Complete</span>
          ) : (
            <span>Remaining: {maxQuestions - currentQuestionCount}</span>
          )}
        </div>
      </div>

      {(needsPassage || needsTranscript) && (
        <div className="border-b pb-4">
          {needsPassage && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Reading Passage
              </label>
              <textarea
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
                className="w-full p-2 border rounded"
                rows={6}
                required
              />
            </div>
          )}

          {needsTranscript && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Audio Transcript
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
            </div>
          )}
        </div>
      )}

      {currentQuestionCount < maxQuestions && (
        <AddQuestionForm
          needsAudio={needsAudio}
          needsImage={needsImage}
          part={part}
          groupData={{
            passage,
            transcript,
          }}
          questionNumber={currentQuestionCount + 1}
          onQuestionAdded={handleQuestionAdded}
          onQuestionDeleted={onQuestionDeleted}
          onQuestionEdited={onQuestionEdited}
          questions={questions}
        />
      )}
    </div>
  );
};

export default QuestionForm;
