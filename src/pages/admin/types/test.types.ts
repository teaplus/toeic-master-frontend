// Định nghĩa các types cho bài thi
export interface ToeicQuestion {
  number?: string;
  group: string;
  image?: string;
  audio?: string;
  passage?: string;
  question_text: string;
  options: string[];
  correct: string;
  img_url?: string;
  audio_url?: string;
}

export interface Part {
  partNumber: number;
  questions: ToeicQuestion[];
}

export interface Section {
  name: string;
  type: "Listening" | "Reading";
  parts: Part[];
}

export interface Test {
  id: string;
  name: string;
  type: "Full Test" | "Mini Test" | "Part Practice";
  status: "draft" | "active" | "archived";
  sections: Section[];
}
