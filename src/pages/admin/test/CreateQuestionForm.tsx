import React, { useState } from "react";

// Kiểu dữ liệu cho câu hỏi và đáp án
interface Answer {
  content: string;
  is_correct: boolean;
}

interface Question {
  content: string;
  image_url?: string;
  audio_url?: string;
  answers: Answer[];
}

const CreateQuestionForm: React.FC = () => {
  const [questionContent, setQuestionContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [answers, setAnswers] = useState<Answer[]>([
    { content: "", is_correct: false },
  ]);

  const handleAnswerChange = (index: number, content: string) => {
    const newAnswers = [...answers];
    newAnswers[index].content = content;
    setAnswers(newAnswers);
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newAnswers = [...answers];
    newAnswers.forEach((answer, idx) => {
      answer.is_correct = idx === index;
    });
    setAnswers(newAnswers);
  };

  const addAnswer = () => {
    setAnswers([...answers, { content: "", is_correct: false }]);
  };

  const removeAnswer = (index: number) => {
    const newAnswers = answers.filter((_, idx) => idx !== index);
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const question: Question = {
      content: questionContent,
      image_url: imageUrl,
      audio_url: audioUrl,
      answers: answers,
    };
    console.log(question); // Có thể gửi dữ liệu này lên server hoặc lưu vào state
  };

  return (
    <div className="form-container">
      <input
        type="text"
        placeholder="Enter question content"
        value={questionContent}
        onChange={(e) => setQuestionContent(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter audio URL"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
      />

      {/* Hiển thị các đáp án */}
      <div>
        {answers.map((answer, index) => (
          <div key={index} className="answer-container">
            <input
              type="text"
              placeholder={`Answer ${index + 1}`}
              value={answer.content}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
            <input
              type="radio"
              checked={answer.is_correct}
              onChange={() => handleCorrectAnswerChange(index)}
            />
            <label>Correct Answer</label>

            {/* Nút xóa đáp án */}
            {answers.length > 1 && (
              <button onClick={() => removeAnswer(index)}>Remove</button>
            )}
          </div>
        ))}
      </div>

      {/* Nút thêm đáp án mới */}
      <button onClick={addAnswer}>Add Answer</button>

      <button onClick={handleSubmit}>Submit Question</button>
    </div>
  );
};

export default CreateQuestionForm;
