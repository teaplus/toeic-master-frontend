import React, { useRef } from "react";
import Papa from "papaparse";
import { Test, Section, Part, ToeicQuestion } from "../types/test.types";

interface ImportCSVProps {
  onDataImported: (test: Test) => void;
}

function ImportCSV({ onDataImported }: ImportCSVProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCSVData = (data: any[]) => {
    const test: Test = {
      id: `TEST${Date.now()}`,
      name: "TOEIC Test",
      type: "Full Test",
      status: "draft",
      sections: [],
    };

    const questionsByPart = new Map<string, ToeicQuestion[]>();

    data.forEach((row) => {
      const partMatch = row.group?.match(/part_(\d+)/);
      if (!partMatch) return;

      const partNumber = partMatch[1];
      if (!questionsByPart.has(partNumber)) {
        questionsByPart.set(partNumber, []);
      }

      const options = [row.o1, row.o2, row.o3, row.o4].filter(Boolean);

      const question: ToeicQuestion = {
        number: row.number,
        group: row.group,
        image: row.image,
        audio: row.audio,
        passage: row.passage,
        question_text: row.question_text,
        options: options,
        correct: row.correct,
        img_url: row.img_url,
        audio_url: row.audio_url,
      };

      questionsByPart.get(partNumber)?.push(question);
    });

    // Tổ chức thành sections
    const listeningParts: Part[] = [];
    const readingParts: Part[] = [];

    questionsByPart.forEach((questions, partNumber) => {
      const part: Part = {
        partNumber: parseInt(partNumber),
        questions: questions,
      };

      if (parseInt(partNumber) <= 4) {
        listeningParts.push(part);
      } else {
        readingParts.push(part);
      }
    });

    test.sections = [
      {
        name: "Listening",
        type: "Listening",
        parts: listeningParts,
      },
      {
        name: "Reading",
        type: "Reading",
        parts: readingParts,
      },
    ];

    return test;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const test = processCSVData(results.data);
        console.log("Processed test:", test);
        onDataImported(test);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Có lỗi khi đọc file CSV");
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Import CSV
      </button>
    </div>
  );
}

export default ImportCSV;
