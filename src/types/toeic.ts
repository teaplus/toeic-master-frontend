export const TOEIC_PART_QUESTIONS = {
  1: 6, // Photographs: 6 questions
  2: 25, // Question-Response: 25 questions
  3: 39, // Conversations: 39 questions
  4: 30, // Short Talks: 30 questions
  5: 30, // Incomplete Sentences: 30 questions
  6: 16, // Text Completion: 16 questions
  7: 54, // Reading Comprehension: 54 questions
} as const;

export interface ToeicQuestion {
  question: string;
  imageUrl: string[] | null;
  audioUrl: string | null;
  answers: Answer[];
  part: number;
  group?: string;
  passage?: string;
  transcript?: string;
  questionNumber: number;
}

export interface Answer {
  text: string;
  correct: boolean;
}

export interface ToeicTest {
  id: string;
  title: string;
  description?: string;
  parts: {
    [key: number]: ToeicQuestion[];
  };
  createdAt: Date;
  totalQuestions: number;
  isCompleted: boolean;
}

export {};
