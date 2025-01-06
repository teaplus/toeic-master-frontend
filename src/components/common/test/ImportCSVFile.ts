import Papa from "papaparse";
import { ToeicQuestion } from "../../../types/toeic";

interface CSVRow {
  number: string;
  group: string;
  image: string;
  audio: string;
  passage: string;
  question_text: string;
  o1: string;
  o2: string;
  o3: string;
  o4: string;
  correct: string;
  img_url: string;
  audio_url: string;
}

interface ImportResult {
  questions: { [key: number]: ToeicQuestion[] };
  passages: { [key: number]: string };
  transcripts: { [key: number]: string };
  groups: { [key: string]: ToeicQuestion[] };
}

export const importCSVFile = (file: File): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const result: ImportResult = {
      questions: {},
      passages: {},
      transcripts: {},
      groups: {},
    };

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const rows = results.data as CSVRow[];
          rows.forEach((row) => {
            const questionNumber = row.number ? parseInt(row.number) : 0;
            // console.log(questionNumber);
            const part = determinePartNumber(questionNumber);
            const question: ToeicQuestion = {
              questionNumber,
              part,
              group: row.group || undefined,
              question: row.question_text,
              imageUrl: row.img_url
                ? row.img_url.split(" ").map((url) => url.trim())
                : [],
              audioUrl: row.audio_url || "",
              passage: row.passage || "",
              answers: createAnswers(row),
              transcript: "",
            };

            if (!result.questions[part]) {
              result.questions[part] = [];
            }
            result.questions[part].push(question);

            if (row.group) {
              if (!result.groups[row.group]) {
                result.groups[row.group] = [];
              }
              result.groups[row.group].push(question);
            }

            handlePassageAndTranscript(result, row, part);
          });

          sortQuestions(result);

          resolve(result);
        } catch (error) {
          reject(new Error("Error parsing CSV file: " + error));
        }
      },
      error: (error) => {
        reject(new Error("Error reading CSV file: " + error));
      },
    });
  });
};

function determinePartNumber(questionNumber: number): number {
  if (questionNumber <= 6 && questionNumber >= 1) return 1;
  if (questionNumber <= 31 && questionNumber >= 7) return 2;
  if (questionNumber <= 70 && questionNumber >= 32) return 3;
  if (questionNumber <= 100 && questionNumber >= 71) return 4;
  if (questionNumber <= 130 && questionNumber >= 101) return 5;
  if (questionNumber <= 146 && questionNumber >= 131) return 6;
  if (questionNumber <= 200 && questionNumber >= 147) return 7;
  return 8;
}

function createAnswers(row: CSVRow) {
  return [
    { text: row.o1, correct: row.correct === "A" },
    { text: row.o2, correct: row.correct === "B" },
    { text: row.o3, correct: row.correct === "C" },
    { text: row.o4, correct: row.correct === "D" },
  ].filter((answer) => answer.text);
}

function handlePassageAndTranscript(
  result: ImportResult,
  row: CSVRow,
  part: number
) {
  if (row.passage && [6, 7].includes(part)) {
    result.passages[part] = row.passage;
  }

  if (row.passage && [3, 4].includes(part)) {
    result.transcripts[part] = row.passage;
  }
}

function sortQuestions(result: ImportResult) {
  Object.keys(result.questions).forEach((part) => {
    result.questions[Number(part)].sort(
      (a, b) => a.questionNumber - b.questionNumber
    );
  });

  Object.keys(result.groups).forEach((group) => {
    result.groups[group].sort((a, b) => a.questionNumber - b.questionNumber);
  });
}
