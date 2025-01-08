/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

import { ToeicQuestion } from "../../../types/toeic";
import { Test, Sections } from "../../../types/test";
import { importCSVFile, TestType } from "./ImportCSVFile";

import { createTestAPI } from "../../../services/test.service";

const TabsForm: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<"full" | "part">("full");
  const [activePart, setActivePart] = useState<number>(1);
  const [questionsByPart, setQuestionsByPart] = useState<{
    [key: number]: ToeicQuestion[];
  }>({});
  const [isImporting, setIsImporting] = useState(false);
  const [passages, setPassages] = useState<{
    [key: number]: { [key: string]: string };
  }>({});
  // const [transcripts, setTranscripts] = useState<{
  //   [key: number]: { [key: string]: string };
  // }>({});
  const [testName, setTestName] = useState<string>("");
  const [testType, setTestType] = useState<TestType>(TestType.FULL);

  const parts = [
    { id: 1, name: "Photographs", type: "listening" },
    { id: 2, name: "Question-Response", type: "listening" },
    { id: 3, name: "Conversations", type: "listening" },
    { id: 4, name: "Short Talks", type: "listening" },
    { id: 5, name: "Incomplete Sentences", type: "reading" },
    { id: 6, name: "Text Completion", type: "reading" },
    { id: 7, name: "Reading Comprehension", type: "reading" },
  ];

  // const handleQuestionAdded = (part: number, newQuestion: ToeicQuestion) => {
  //   setQuestionsByPart((prev) => ({
  //     ...prev,
  //     [part]: [...(prev[part] || []), newQuestion],
  //   }));
  // };

  // const handleQuestionDeleted = (part: number, questionNumber: number) => {
  //   setQuestionsByPart((prev) => ({
  //     ...prev,
  //     [part]:
  //       prev[part]?.filter((q) => q.questionNumber !== questionNumber) || [],
  //   }));
  // };

  // const handleQuestionEdited = (
  //   part: number,
  //   editedQuestion: ToeicQuestion
  // ) => {
  //   setQuestionsByPart((prev) => ({
  //     ...prev,
  //     [part]:
  //       prev[part]?.map((q) =>
  //         q.questionNumber === editedQuestion.questionNumber
  //           ? editedQuestion
  //           : q
  //       ) || [],
  //   }));
  // };

  const submitTest = async (test: Test) => {
    await createTestAPI(test)
      .then((response) => {
        console.log(response);
        alert("Test đã được tạo thành công!");
      })
      .catch((error) => {
        console.error("Error submitting test:", error);
        alert("Có lỗi xảy ra khi tạo test. Vui lòng thử lại!");
      });
  };

  const createTest = () => {
    // Kiểm tra số lượng câu hỏi cho mỗi part
    const isComplete = parts.every(
      (part) =>
        questionsByPart[part.id]?.length === getRequiredQuestions(part.id)
    );

    if (!isComplete) {
      alert("Vui lòng hoàn thành tất cả các phần trước khi tạo bài test!");
      return;
    }

    // Tạo cấu trúc test
    const test: Test = {
      name: testName || "TOEIC Test",
      total_score: 990,
      total_questions: Object.values(questionsByPart).reduce((total, questions) => total + questions.length, 0) -1 ,
      sections: createSections(),
      type: testType,
    };

    console.log(test);
    // Gửi test lên server
    // submitTest(test);
  };

  const createSections = (): Sections[] => {
    const listeningParts = parts.filter((p) => p.type === "listening");
    const readingParts = parts.filter((p) => p.type === "reading");

    return [
      {
        name: "Listening Comprehension",
        type: 'LISTENING',
        parts: createPartsForSection(listeningParts),
      },
      {
        name: "Reading Comprehension",
        type: 'READING',
        parts: createPartsForSection(readingParts),
      },
    ];
  };

  const createPartsForSection = (sectionParts: (typeof parts)[0][]) => {
    return sectionParts.map((part) => {
      const questions = questionsByPart[part.id] || [];
      // console.log("questions", questions);

      const groupedQuestions = groupQuestionsByGroup(questions);
      console.log("groupedQuestions", groupedQuestions);
      return {
        partNumber: part.id,
        partName: part.name,
        numberOfQuestions: getRequiredQuestions(part.id),
        questions: groupedQuestions.map((q) => ({
          number: q.questionNumber,
          content: q.question,
          image_url: q.imageUrl?.join(",") || null,
          audio_url: q.audioUrl || null,
          passage: q.passage,
          group: q.group,
          answers: q.answers.map((a) => ({
            content: a.text,
            is_correct: a.correct,
          })),
        })),
      };
    });
  };

  const groupQuestionsByGroup = (questions: ToeicQuestion[]) => {
    const grouped = questions.reduce((acc, question) => {
      if (question.group) {
        if (!acc[question.group]) {
          acc[question.group] = [];
        }
        acc[question.group].push(question);
      } else {
        if (!acc["ungrouped"]) {
          acc["ungrouped"] = [];
        }
        acc["ungrouped"].push(question);
      }
      return acc;
    }, {} as { [key: string]: ToeicQuestion[] });

    // Sắp xếp câu hỏi trong mỗi group
    Object.values(grouped).forEach((group) => {
      group.sort((a, b) => a.questionNumber - b.questionNumber);
    });

    // Trả về mảng câu hỏi đã được sắp xếp
    return Object.values(grouped).flat();
  };

  const getRequiredQuestions = (partId: number) => {
    const questionCounts = {
      [TestType.FULL]: {
        1: 6,
        2: 25,
        3: 39,
        4: 30,
        5: 30,
        6: 16,
        7: 54,
      },
      [TestType.MINI]: {
        1: 3,
        2: 11,
        3: 21,
        4: 15,
        5: 14,
        6: 9,
        7: 27,
      },
    };
    return questionCounts[testType][
      partId as keyof (typeof questionCounts)[typeof testType]
    ];
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const fileName = file.name.replace(".csv", "");
      setTestName(fileName);

      const {
        questions,
        passages: importedPassages,
        transcripts: importedTranscripts,
      } = await importCSVFile(file, testType);

      setQuestionsByPart(questions);
      alert("Import thành công!");
    } catch (error) {
      console.error("Error importing:", error);
      alert("Có lỗi xảy ra khi import!");
    } finally {
      setIsImporting(false);
    }
  };

  const renderPartPreview = (part: number) => {
    const partQuestions = questionsByPart[part] || [];
    const partPassages = passages[part] || {};
    // const partTranscripts = transcripts[part] || {};

    // console.log(partQuestions, partPassages, partTranscripts);
    // Nhóm câu hỏi theo group
    const groupedQuestions = partQuestions.reduce((acc, question) => {
      const key =
        question.group ||
        question.imageUrl?.join(",") ||
        question.audioUrl ||
        "other";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(question);
      return acc;
    }, {} as { [key: string]: ToeicQuestion[] });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            Part {part}{" "}
            <span className="text-blue-600">
              ({partQuestions.length} questions)
            </span>
          </h3>
          <div className="text-sm text-gray-500">
            Required: {getRequiredQuestions(part)} questions
          </div>
        </div>

        {/* Questions preview grouped by media */}
        <div className="grid gap-8">
          {Object.entries(groupedQuestions).map(([key, questions]) => {
            const firstQuestion = questions[0];
            // console.log(firstQuestion);
            return (
              <div
                key={key}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  {/* Show media if exists */}
                  {part !== 7 && firstQuestion.imageUrl && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {firstQuestion.imageUrl.map((url, index) => (
                          <div className="grid" key={index}>
                            <img
                              src={url}
                              alt={`Question ${index + 1}`}
                              className="w-full h-auto rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {firstQuestion.audioUrl && (
                    <div className="mb-6">
                      <audio controls className="w-full rounded-md shadow-sm">
                        <source
                          src={firstQuestion.audioUrl}
                          type="audio/mpeg"
                        />
                      </audio>
                    </div>
                  )}

                  {(part === 6 || part === 7) && (
                    <div className="mb-6">
                      <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
                        <div
                          className="text-gray-800"
                          dangerouslySetInnerHTML={{
                            __html: firstQuestion.passage || "",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Questions in this group */}
                  <div className="space-y-6">
                    {questions.map((q) => (
                      <div
                        key={String(q.questionNumber)}
                        className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                            {String(q.questionNumber || "")}
                          </span>
                          {part !== 6 && (
                            <p className="text-gray-800 font-medium">
                              {q.question}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.answers.map((a, i) => (
                            <div
                              key={i}
                              className={`p-4 rounded-lg border transition-all duration-200 ${
                                a.correct
                                  ? "border-green-500 bg-green-50 hover:bg-green-100"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`font-medium ${
                                    a.correct
                                      ? "text-green-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span
                                  className={
                                    a.correct
                                      ? "text-green-700"
                                      : "text-gray-700"
                                  }
                                >
                                  {a.text}
                                </span>
                                {a.correct && (
                                  <span className="ml-auto text-green-600">
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Import section với thêm lựa chọn loại test */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Import Test Data</h2>
        <div className="space-y-4">
          {/* Test Type Selection */}
          <div className="flex items-center gap-4">
            <label className="font-medium text-gray-700">Test Type:</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="test_type"
                  value={TestType.FULL}
                  checked={testType === TestType.FULL}
                  onChange={(e) => setTestType(e.target.value as TestType)}
                />
                <span className="ml-2">Full Test (200 questions)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="test_type"
                  value={TestType.MINI}
                  checked={testType === TestType.MINI}
                  onChange={(e) => setTestType(e.target.value as TestType)}
                />
                <span className="ml-2">Mini Test (100 questions)</span>
              </label>
            </div>
          </div>

          {/* File Upload */}
          <div className="flex-1">
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <span className="material-icons text-gray-400 text-3xl mb-2">
                  upload_file
                </span>
                <p className="text-gray-600">
                  Choose CSV file or drag & drop here
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {/* Test Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">
              {testType === TestType.FULL ? "Full Test" : "Mini Test"}{" "}
              Requirements:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {parts.map((part) => (
                <div
                  key={part.id}
                  className="bg-white p-3 rounded-lg shadow-sm"
                >
                  <div className="font-medium text-gray-600">
                    Part {part.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getRequiredQuestions(part.id)} questions
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Parts navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {parts.map((part) => (
            <button
              key={part.id}
              onClick={() => setActivePart(part.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activePart === part.id
                  ? "bg-blue-500 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Part {part.id}
            </button>
          ))}
        </div>
      </div>

      {/* Active part preview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-24">
        {renderPartPreview(activePart)}
      </div>

      {/* Create test button */}
      <button
        onClick={createTest}
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg transition-colors flex items-center gap-2"
      >
        <span className="material-icons">Create Test</span>
      </button>
    </div>
  );
};

export default TabsForm;
