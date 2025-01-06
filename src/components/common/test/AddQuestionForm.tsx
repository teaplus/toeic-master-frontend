import React, { useEffect, useState } from "react";
import "./question.css";
import S3Uploader from "../S3Uploader";
import { ToeicQuestion } from "../../../types/toeic";

interface Answer {
  text: string;
  correct: boolean;
}

interface AddQuestionFormProps {
  needsAudio: boolean;
  needsImage: boolean;
  part: number;
  groupData: {
    passage?: string;
    transcript?: string;
  };
  questionNumber: number;
  onQuestionAdded: (question: ToeicQuestion) => void;
  questions: ToeicQuestion[];
  onQuestionDeleted?: (questionNumber: number) => void;
  onQuestionEdited?: (question: ToeicQuestion) => void;
}

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({
  needsAudio,
  needsImage,
  part,
  groupData,
  questionNumber,
  onQuestionAdded,
  questions,
  onQuestionDeleted,
  onQuestionEdited,
}) => {
  const [question, setQuestion] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [answers, setAnswers] = useState<Answer[]>([
    { text: "", correct: false },
  ]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    null
  );
  const imageUploaderRef = React.useRef<{
    handleFileRemove: (fieldName: string) => void;
  }>(null);
  const audioUploaderRef = React.useRef<{
    handleFileRemove: (fieldName: string) => void;
  }>(null);
  const [editingQuestion, setEditingQuestion] = useState<ToeicQuestion | null>(
    null
  );

  const addAnswer = () => {
    setAnswers([...answers, { text: "", correct: false }]);
  };

  const handleAnswerChange = (index: number, text: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].text = text;
    setAnswers(updatedAnswers);
  };

  const handleCorrectAnswerChange = (index: number) => {
    setCorrectAnswerIndex(index);
  };

  const removeAnswer = (index: number) => {
    const updatedAnswers = answers.filter((_, i) => i !== index);
    setAnswers(updatedAnswers);
    if (correctAnswerIndex === index) {
      setCorrectAnswerIndex(null);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setImageUrl([]);
    setAudioUrl("");
    setAnswers([{ text: "", correct: false }]);
    setCorrectAnswerIndex(null);

    // Reset uploaders
    imageUploaderRef.current?.handleFileRemove("imageUrl");
    audioUploaderRef.current?.handleFileRemove("audioUrl");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (part === 1 && !imageUrl) {
      alert("Part 1 requires an image!");
      return;
    }

    if ([1, 2, 3, 4].includes(part) && !audioUrl) {
      alert("This part requires audio!");
      return;
    }

    if (correctAnswerIndex === null) {
      alert("Vui lòng chọn đáp án đúng!");
      return;
    }

    if (question.trim() === "") {
      alert("Vui lòng nhập câu hỏi!");
      return;
    }

    const formattedAnswers = answers.map((answer, index) => ({
      text: answer.text,
      correct: index === correctAnswerIndex,
    }));

    const newQuestion: ToeicQuestion = {
      question,
      imageUrl,
      audioUrl,
      answers: formattedAnswers,
      part,
      questionNumber,
      group: undefined,
      passage: groupData.passage,
      transcript: groupData.transcript,
    };

    resetForm();
    onQuestionAdded(newQuestion);
  };

  useEffect(() => {}, [imageUrl, audioUrl]);

  const handleUploadSuccess = (fieldName: string, url: string) => {
    if (fieldName === "imageUrl") {
      setImageUrl([...imageUrl, url]);
    } else if (fieldName === "audioUrl") {
      setAudioUrl(url);
    }
  };

  const handleUploadError = (fieldName: string, error: string) => {
    console.error(`Error uploading ${fieldName}:`, error);
  };

  const handleFileRemove = (fieldName: string) => {
    if (fieldName === "imageUrl") {
      setImageUrl([]);
    } else if (fieldName === "audioUrl") {
      setAudioUrl("");
    }
  };

  const handleEdit = (question: ToeicQuestion) => {
    console.log("Editing question:", question); // For debugging
    setEditingQuestion(question);
    setQuestion(question.question);
    setImageUrl(question.imageUrl || []);
    setAudioUrl(question.audioUrl || "");
    setAnswers(
      question.answers.map((a) => ({
        text: a.text,
        correct: a.correct,
      }))
    );
    setCorrectAnswerIndex(question.answers.findIndex((a) => a.correct));

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    if (!validateForm()) return;

    const updatedQuestion: ToeicQuestion = {
      ...editingQuestion,
      question,
      imageUrl,
      audioUrl,
      answers: answers.map((answer, index) => ({
        text: answer.text,
        correct: index === correctAnswerIndex,
      })),
    };

    onQuestionEdited?.(updatedQuestion);
    resetForm();
    setEditingQuestion(null);
  };

  const validateForm = () => {
    if (part === 1 && !imageUrl) {
      alert("Part 1 requires an image!");
      return false;
    }

    if ([1, 2, 3, 4].includes(part) && !audioUrl) {
      alert("This part requires audio!");
      return false;
    }

    if (correctAnswerIndex === null) {
      alert("Vui lòng chọn đáp án đúng!");
      return false;
    }

    if (question.trim() === "") {
      alert("Vui lòng nhập câu hỏi!");
      return false;
    }

    return true;
  };

  return (
    <div className="bg-white w-full p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl text-center text-gray-800 mb-6">
        {editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi"}
      </h2>
      <form
        onSubmit={editingQuestion ? handleUpdate : handleSubmit}
        className="space-y-6"
      >
        <div className="flex flex-wrap items-center space-x-4">
          <div className="flex-1">
            <label
              htmlFor="question"
              className="text-sm text-gray-600 block mb-1"
            >
              Câu hỏi:
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Nhập câu hỏi"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {needsImage && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <S3Uploader
                fieldName="imageUrl"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                onFileRemove={handleFileRemove}
                ref={imageUploaderRef}
              />
            </div>
          )}

          {needsAudio && (
            <div className="flex-1">
              <label
                htmlFor="audioUrl"
                className="text-sm text-gray-600 block mb-1"
              >
                Âm thanh:
              </label>
              <S3Uploader
                fieldName="audioUrl"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                onFileRemove={handleFileRemove}
                ref={audioUploaderRef}
              />
            </div>
          )}
        </div>

        <div className="answers space-y-4">
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Nhập đáp án ${index + 1}`}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <div className="flex items-center space-x-2 radio">
                <input
                  type="radio"
                  name="correct_answer"
                  checked={correctAnswerIndex === index}
                  onChange={() => handleCorrectAnswerChange(index)}
                />
                <span className="text-sm">Đúng</span>
                <button
                  type="button"
                  onClick={() => removeAnswer(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addAnswer}
          className="bg-green-500 text-white p-2 w-full rounded hover:bg-green-600"
        >
          Thêm đáp án
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          {editingQuestion ? "Cập nhật câu hỏi" : "Lưu câu hỏi"}
        </button>

        {editingQuestion && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setEditingQuestion(null);
            }}
            className="bg-gray-500 text-white p-2 w-full rounded hover:bg-gray-600"
          >
            Hủy chỉnh sửa
          </button>
        )}

        <div className="questions-list mt-8">
          <h3 className="text-xl text-gray-800">
            Danh sách câu hỏi Part {part}:
          </h3>
          {questions.length === 0 ? (
            <p className="text-gray-600">Chưa có câu hỏi nào được thêm.</p>
          ) : (
            <ul className="space-y-4">
              {questions.map((q, index) => (
                <li
                  key={index}
                  className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-lg">
                          {index + 1}. {q.question}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(q)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <span className="material-icons">edit</span>
                          </button>
                          <button
                            onClick={() =>
                              onQuestionDeleted?.(q.questionNumber)
                            }
                            className="text-red-500 hover:text-red-600"
                          >
                            <span className="material-icons">delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-4">
                        {q.answers.map((a, i) => (
                          <div
                            key={i}
                            className={`flex-1 min-w-[200px] p-3 rounded-lg border ${
                              a.correct
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }`}
                          >
                            <span
                              className={
                                a.correct ? "text-green-600" : "text-gray-700"
                              }
                            >
                              {String.fromCharCode(97 + i)}. {a.text}
                              {a.correct && (
                                <span className="ml-2 font-medium">(Đúng)</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {(q.imageUrl || q.audioUrl) && (
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        {q.imageUrl && (
                          <img
                            src={q.imageUrl[0]}
                            alt="Question"
                            className="rounded-lg border shadow-sm max-w-[200px] h-auto"
                          />
                        )}
                        {q.audioUrl && (
                          <audio controls className="w-full">
                            <source src={q.audioUrl} type="audio/mpeg" />
                          </audio>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddQuestionForm;
