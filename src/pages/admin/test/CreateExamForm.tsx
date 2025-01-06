// src/components/CreateExamForm.tsx
import React, { useState } from "react";

// Định nghĩa kiểu dữ liệu cho câu hỏi
interface Question {
  content: string;
  audioUrl: string;
  imageUrl: string;
  answers: string[];
}

const CreateExamForm: React.FC = () => {
  const [examName, setExamName] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([
    { content: "", audioUrl: "", imageUrl: "", answers: [""] },
  ]);

  const handleExamNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setExamName(e.target.value);
  const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNumQuestions(Number(e.target.value));

  const handleQuestionContentChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = [...questions];
    newQuestions[index].content = e.target.value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { content: "", audioUrl: "", imageUrl: "", answers: [""] },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Tạo Đề Kiểm Tra</h1>

      {/* Nhập tên đề thi */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700">
          Tên Đề Kiểm Tra
        </label>
        <input
          type="text"
          value={examName}
          onChange={handleExamNameChange}
          className="mt-2 p-2 w-full border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập tên đề kiểm tra"
        />
      </div>

      {/* Nhập số câu hỏi */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700">
          Số Câu Hỏi
        </label>
        <input
          type="number"
          value={numQuestions}
          onChange={handleNumQuestionsChange}
          className="mt-2 p-2 w-full border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập số câu hỏi"
        />
      </div>

      {/* Danh sách câu hỏi */}
      <div>
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Danh Sách Câu Hỏi
        </h2>

        {questions.map((question, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Câu hỏi {index + 1}</h3>
              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className="text-red-500 hover:text-red-700"
              >
                Xóa
              </button>
            </div>

            {/* Nội dung câu hỏi */}
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Nội Dung Câu Hỏi
              </label>
              <input
                type="text"
                value={question.content}
                onChange={(e) => handleQuestionContentChange(index, e)}
                className="mt-2 p-2 w-full border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập nội dung câu hỏi"
              />
            </div>

            {/* Âm thanh */}
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Âm Thanh
              </label>
              <input
                type="url"
                value={question.audioUrl}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].audioUrl = e.target.value;
                  setQuestions(newQuestions);
                }}
                className="mt-2 p-2 w-full border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập URL của âm thanh"
              />
            </div>

            {/* Hình ảnh */}
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Hình Ảnh
              </label>
              <input
                type="url"
                value={question.imageUrl}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].imageUrl = e.target.value;
                  setQuestions(newQuestions);
                }}
                className="mt-2 p-2 w-full border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập URL của hình ảnh"
              />
            </div>

            {/* Các lựa chọn đáp án */}
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Lựa Chọn Đáp Án
              </label>
              {question.answers.map((answer, answerIndex) => (
                <input
                  key={answerIndex}
                  type="text"
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, answerIndex, e)}
                  className="mt-2 p-2 w-full border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder={`Đáp án ${answerIndex + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  const newQuestions = [...questions];
                  newQuestions[index].answers.push("");
                  setQuestions(newQuestions);
                }}
                className="text-blue-500 mt-2"
              >
                Thêm Đáp Án
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          className="text-blue-500 mt-4"
        >
          Thêm Câu Hỏi
        </button>
      </div>

      {/* Nút lưu */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Lưu Đề Kiểm Tra
        </button>
      </div>
    </div>
  );
};

export default CreateExamForm;
