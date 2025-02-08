export enum Level {
  EASY = "EASY",
  NORMAL = "NORMAL",
  ADVANCE = "ADVANCE",
}

export interface Test {
  name: string;
  total_score: number;
  total_questions: number; // tổng số câu hỏi, sẽ luôn là 200
  sections: Sections[];
  type: string;
  partNumber?: number | null;
  level?: Level | null;
  total_time?: number | null;
}

export interface Sections {
  name: string;
  type: string;
  parts: Part[];
}

export interface Part {
  partNumber: number; // Số hiệu phần (Part 1, Part 2, ...)
  partName: string; // Tên phần (ví dụ: Listening, Reading)
  numberOfQuestions: number; // Số câu hỏi trong phần
  questions: Question[];
}

export interface Passage {
  id: number;
  content: string;
}

export interface Question {
  content: string; // Nội dung câu hỏi
  image_url: string | null; // Đường dẫn tới hình ảnh (nếu có)
  audio_url: string | null; // Đường dẫn tới âm thanh (nếu có)
  answers: Answer[];
  group?: string;
  passage?: string;
}

export interface Answer {
  content: string;
  is_correct: boolean;
}

export interface CreateTestResponseType {
  data: any;
  message: string;
}

//list test
export interface ListTestResponseType {
  tests: ListTestResponseDataType[];
  message: string;
  statusCode: number;
}

export interface ListTestResponseDataType {
  id: string;
  name: string;
  total_score: number;
  total_questions: number;
  created_at: string;
  updated_at: string;
  type: string;
  level: string;
  partNumber: number;
  total_time: number;
}

//get test by id

export interface GetTestResponseType {
  data: TestResponseType;
  message: string;
  statusCode: number;
}

export interface TestResponseType {
  id: number;
  name: string;
  total_score: number;
  totalQuestions: number; // tổng số câu hỏi, sẽ luôn là 200
  sections: SectionResponseType[];
}

export interface SectionResponseType {
  id: number;
  name: string;
  type: string;
  parts: PartResponseType[];
}

export interface PartResponseType {
  id: number;
  partNumber: number; // Số hiệu phần (Part 1, Part 2, ...)
  partName: string; // Tên phần (ví dụ: Listening, Reading)
  numberOfQuestions: number; // Số câu hỏi trong phần
  questions: QuestionResponseType[];
}

export interface QuestionResponseType {
  id: number;
  number: number;
  content: string; // Nội dung câu hỏi
  image_url: string | null; // Đường dẫn tới hình ảnh (nếu có)
  audio_url: string | null; // Đường dẫn tới âm thanh (nếu có)
  answers: AnswerResponseType[];
  group?: string;
  passage?: string;
}

export interface AnswerResponseType {
  id: number;
  content: string;
  is_correct: boolean;
}

export interface SaveAnswerResponseType {
  data: any;
  message: string;
  statusCode: number;
}

export interface TestSessionResponseType {
  statusCode: number;
  message: string;
  data: TestSessionResponseDataType;
}

export interface TestSessionResponseDataType {
  id: number;
  timeRemaining: number;
  status: string;
  responses: responseDataType[];
}

export interface responseDataType {
  id: number;
  question: {
    id: number;
    content: string;
  };
  answer: {
    id: number;
    content: string;
    is_correct: boolean;
  };
}


//Test review
export interface TestReviewResponseType {
  data: TestSessionReviewResponseDataType;
  message: string;
  statusCode: number;
}

export interface TestSessionReviewResponseDataType {
  id: number;
  timeRemaining: number;
  startedAt: string;
  completedAt: string;
  listening_score: number;
  reading_score: number;
  writing_score: number;
  total_score: number;
  test: TestReviewResponseDataType;
}

export interface TestReviewResponseDataType {
  id: number;
  name: string; 
  total_score: number;
  total_questions: number;
  partNumber: number;
  sections: SectionReviewResponseDataType[];
}

export interface SectionReviewResponseDataType {
  id: number;
  name: string;
  type: string;
  parts: PartReviewResponseDataType[];
}

export interface PartReviewResponseDataType {
  id: number;
  partNumber: number;
  partName: string;
  numberOfQuestions: number;
  questions: QuestionReviewResponseDataType[];
}
export interface QuestionReviewResponseDataType {
  id: number;
  number: number;
  passage: string;
  content: string;
  group: string;
  type: string | null;
  audio_url: string | null;
  image_url: string | null;
  answers: AnswerReviewResponseDataType[];
  userResponse: UserResponseReviewDataType | null;
}

export interface AnswerReviewResponseDataType {
  id: number;
  content: string;
  is_correct: boolean;
}

export interface UserResponseReviewDataType {
  id: number;
  isCorrect: boolean;
  answer: {
    id: number;
    content: string;
    is_correct: boolean;
  };
  question: {
    id: number;
    number: number;
    passage: string;
    content: string;
    group: string;
    type: string | null;
    audio_url: string | null;
    image_url: string | null;
  };
}


export interface TestRecommendResponseType {
  recommendedTests: ListTestResponseDataType[];
  highestScore: number;
  message: string;
  recommendedLevel: string;
  statusCode: number;
}

