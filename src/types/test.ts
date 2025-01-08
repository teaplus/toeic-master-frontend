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
}

//get test by id

export interface GetTestResponseType {
  data: TestResponseType;
  message: string;
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
