/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";

import { ToeicQuestion } from "../../../types/toeic";
import { Test, Sections, Level } from "../../../types/test";
import { importCSVFile, TestType } from "./ImportCSVFile";

import { createTestAPI } from "../../../services/test.service";
import { useNotice } from "../Notice";
import { useLoading } from "../../../contexts/LoadingContext";

interface TabsFormProps {
  onSuccess?: () => void;
}

const TabsForm: React.FC<TabsFormProps> = ({ onSuccess }) => {
  const notice = useNotice();
  const { showLoading, hideLoading } = useLoading();
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
  const [selectedParts, setSelectedParts] = useState<number[]>([]);
  const [level, setLevel] = useState<Level | null>(null);
  const [totalTime, setTotalTime] = useState<number>(120); // mặc định 120 phút

  const parts = [
    { id: 1, name: "Photographs", type: "listening" },
    { id: 2, name: "Question-Response", type: "listening" },
    { id: 3, name: "Conversations", type: "listening" },
    { id: 4, name: "Short Talks", type: "listening" },
    { id: 5, name: "Incomplete Sentences", type: "reading" },
    { id: 6, name: "Text Completion", type: "reading" },
    { id: 7, name: "Reading Comprehension", type: "reading" },
  ];

  const submitTest = async (test: Test) => {
    await createTestAPI(test)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error submitting test:", error);
        notice.show("error", "Có lỗi xảy ra khi tạo test. Vui lòng thử lại!");
      });
    // alert("Test đã được tạo thành công!");
  };

  const PART_DURATIONS: { [key: number]: number } = {
    1: 5, // Part 1: 5 phút
    2: 19, // Part 2: 19 phút
    3: 30, // Part 3: 30 phút
    4: 23, // Part 4: 23 phút
    5: 14, // Part 5: 14 phút
    6: 7, // Part 6: 7 phút
    7: 25, // Part 7: 25 phút
  };

  const getDefaultTime = (type: TestType, selectedPartId?: number): number => {
    switch (type) {
      case TestType.FULL:
        return 120; // 2 giờ cho full test
      case TestType.MINI:
        return 60; // 1 giờ cho mini test
      case TestType.PART:
        return selectedPartId ? PART_DURATIONS[selectedPartId] : 0;
      default:
        return 120;
    }
  };

  useEffect(() => {
    if (testType === TestType.PART) {
      setTotalTime(getDefaultTime(testType));
    } else {
      setTotalTime(getDefaultTime(testType));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testType]);

  const createTest = async () => {
    if (testType === TestType.PART && selectedParts.length === 0) {
      notice.show("error", "Vui lòng chọn ít nhất một phần để tạo bài test!");
      return;
    }

    const partsToCheck =
      testType === TestType.PART ? selectedParts : parts.map((p) => p.id);
    const isComplete = partsToCheck.every(
      (partId) =>
        questionsByPart[partId]?.length === getRequiredQuestions(partId)
    );

    if (!isComplete) {
      notice.show(
        "error",
        "Vui lòng hoàn thành tất cả các phần đã chọn trước khi tạo bài test!"
      );
      return;
    }

    if (!level) {
      notice.show("error", "Vui lòng chọn level cho bài test!");
      return;
    }

    try {
      showLoading();
      if (testType === TestType.PART) {
        const part = await Promise.all(
          selectedParts.map((partId) => {
            const test = {
              name: `${testName || "TOEIC Test"} - Part ${partId}`,
              total_score: questionsByPart[partId]?.length * 5 || 0,
              total_questions: questionsByPart[partId]?.length || 0,
              sections: createSections([partId]),
              type: testType,
              partNumber: partId,
              level: level,
              total_time: PART_DURATIONS[partId],
            };
            return submitTest(test);
          })
        );
        if (part.length > 0) {
          notice.show("success", "Test đã được tạo thành công!");
        }
      } else {
        const test = {
          name: testName || "TOEIC Test",
          total_score: 990,
          total_questions: Object.entries(questionsByPart)
            .filter(([partId]) => partsToCheck.includes(Number(partId)))
            .reduce((total, [_, questions]) => total + questions.length, 0),
          sections: createSections(partsToCheck),
          type: testType,
          partNumber: null,
          level: level,
          total_time: totalTime,
        };
        await submitTest(test);
        // notice.show("success", "Test đã được tạo thành công!");
      }

      notice.show("success", "Test đã được tạo thành công!");
      onSuccess?.(); // Close modal after success
    } catch (error) {
      console.error("Error creating test:", error);
      notice.show("error", "Có lỗi xảy ra khi tạo test. Vui lòng thử lại!");
    } finally {
      hideLoading();
    }
  };

  const createSections = (partsToInclude: number[]): Sections[] => {
    const filteredParts = parts.filter((p) => partsToInclude.includes(p.id));
    const listeningParts = filteredParts.filter((p) => p.type === "listening");
    const readingParts = filteredParts.filter((p) => p.type === "reading");

    const sections: Sections[] = [];

    if (listeningParts.length > 0) {
      sections.push({
        name: "Listening Comprehension",
        type: "LISTENING",
        parts: createPartsForSection(listeningParts),
      });
    }

    if (readingParts.length > 0) {
      sections.push({
        name: "Reading Comprehension",
        type: "READING",
        parts: createPartsForSection(readingParts),
      });
    }

    return sections;
  };

  const createPartsForSection = (sectionParts: (typeof parts)[0][]) => {
    return sectionParts.map((part) => {
      const questions = questionsByPart[part.id] || [];
      const groupedQuestions = groupQuestionsByGroup(questions);

      // Nếu là test dạng PART, đánh lại số thứ tự câu hỏi từ 1
      if (testType === TestType.PART) {
        let questionCounter = 1;
        groupedQuestions.forEach((q) => {
          q.questionNumber = questionCounter++;
        });
      }

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
      [TestType.PART]: {
        1: 6,
        2: 25,
        3: 39,
        4: 30,
        5: 30,
        6: 16,
        7: 54,
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

  const getLevelLabel = (level: Level): string => {
    switch (level) {
      case Level.EASY:
        return "Easy";
      case Level.NORMAL:
        return "Normal";
      case Level.ADVANCE:
        return "Advance";
      default:
        return level;
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Import section */}
      <div className="mb-8 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Import Test Data
        </h2>
        <div className="space-y-6">
          {/* Test Type Selection */}
          <div className="flex items-center gap-6">
            <label className="font-semibold text-gray-700">Test Type:</label>
            <div className="flex gap-6">
              <label className="inline-flex items-center hover:text-blue-600 transition-colors cursor-pointer">
                <input
                  type="radio"
                  className="form-radio text-blue-600 w-5 h-5"
                  name="test_type"
                  value={TestType.FULL}
                  checked={testType === TestType.FULL}
                  onChange={(e) => {
                    setTestType(e.target.value as TestType);
                    setSelectedParts([]);
                  }}
                />
                <span className="ml-2 text-lg">Full Test (200 questions)</span>
              </label>
              <label className="inline-flex items-center hover:text-blue-600 transition-colors cursor-pointer">
                <input
                  type="radio"
                  className="form-radio text-blue-600 w-5 h-5"
                  name="test_type"
                  value={TestType.MINI}
                  checked={testType === TestType.MINI}
                  onChange={(e) => {
                    setTestType(e.target.value as TestType);
                    setSelectedParts([]);
                  }}
                />
                <span className="ml-2 text-lg">Mini Test (100 questions)</span>
              </label>
              <label className="inline-flex items-center hover:text-blue-600 transition-colors cursor-pointer">
                <input
                  type="radio"
                  className="form-radio text-blue-600 w-5 h-5"
                  name="test_type"
                  value={TestType.PART}
                  checked={testType === TestType.PART}
                  onChange={(e) => setTestType(e.target.value as TestType)}
                />
                <span className="ml-2 text-lg">Part Test</span>
              </label>
            </div>
          </div>

          {/* File Upload */}
          <div className="flex-1">
            <label className="block">
              <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                <span className="material-icons text-gray-400 text-4xl mb-3">
                  upload_file
                </span>
                <p className="text-gray-600 text-lg">
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
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-semibold text-gray-800 text-xl mb-4">
              {testType === TestType.FULL ? "Full Test" : "Mini Test"}{" "}
              Requirements:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {parts.map((part) => (
                <div
                  key={part.id}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="font-semibold text-gray-700 text-lg">
                    Part {part.id}
                  </div>
                  <div className="text-gray-500 mt-1">
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
        <div className="flex flex-wrap gap-4">
          {parts.map((part) => (
            <button
              key={part.id}
              onClick={() => setActivePart(part.id)}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                activePart === part.id
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md"
              }`}
            >
              Part {part.id}
            </button>
          ))}
        </div>
      </div>

      {/* Active part preview */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-24">
        {renderPartPreview(activePart)}
      </div>

      {/* Create test button */}
      <button
        onClick={createTest}
        className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all hover:scale-105 flex items-center gap-3"
      >
        Create Test
      </button>

      {testType === TestType.PART && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
          <label className="font-semibold text-gray-800 text-lg block mb-4">
            Select Parts to Create:
          </label>
          <div className="flex flex-wrap gap-4">
            {parts.map((part) => (
              <label
                key={part.id}
                className="inline-flex items-center hover:text-blue-600 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-600 w-5 h-5"
                  checked={selectedParts.includes(part.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedParts([...selectedParts, part.id]);
                    } else {
                      setSelectedParts(
                        selectedParts.filter((id) => id !== part.id)
                      );
                    }
                  }}
                />
                <span className="ml-2 text-lg">Part {part.id}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Level Selection */}
      {testType && (
        <div className="mb-6 bg-white p-6 rounded-xl shadow-md">
          <label className="font-semibold text-gray-800 text-lg block mb-4">
            Difficulty Level:
          </label>
          <div className="flex gap-6">
            {Object.values(Level).map((l) => (
              <label
                key={l}
                className="inline-flex items-center hover:text-blue-600 transition-colors cursor-pointer"
              >
                <input
                  type="radio"
                  className="form-radio text-blue-600 w-5 h-5"
                  name="level"
                  value={l}
                  checked={level === l}
                  onChange={(e) => setLevel(e.target.value as Level)}
                />
                <span className="ml-2 text-lg">{getLevelLabel(l)}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Time Selection */}
      <div className="mb-6 bg-white p-6 rounded-xl shadow-md">
        <label className="font-semibold text-gray-800 text-lg block mb-4">
          Test Duration (minutes):
        </label>
        <input
          type="number"
          className="form-input mt-1 block w-full max-w-xs rounded-lg border-gray-300 text-lg p-3"
          value={totalTime}
          onChange={(e) => setTotalTime(Number(e.target.value))}
          min="1"
        />
      </div>
    </div>
  );
};

export default TabsForm;
