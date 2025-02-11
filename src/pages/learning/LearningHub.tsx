import React, { useState, useMemo } from "react";
import { useNotice } from "../../components/common/Notice";
import vocabularyData from "../../assets/vocabulary.json";
import grammarData from "../../assets/grammar.json";

// Types
interface VocabularyItem {
  word: string;
  type: string;
  pronunciation: string;
  meaning: string;
}

interface GrammarItem {
  tense?: string;
  structure?: string;
  usage?: string[] | string;
  signalWords?: string[];
  type?: string;
  description?: string;
  example?: string;
}

interface GrammarType {
  type: string;
  example?: string;
  examples?: string[];
  usage?: string;
}

interface GrammarCategory {
  category: string;
  description: string;
  items?: GrammarItem[];
  types?: GrammarType[];
  transformations?: {
    tense: string;
    active: string;
    passive: string;
  }[];
  specialCases?: {
    description: string;
    example: string;
  }[];
  changes?: {
    original: string;
    reported: string;
  }[];
  structures?: {
    form: string;
    usage: string;
    example: string;
  }[];
  verbPatterns?: {
    verb: string;
    followedBy: string;
  }[];
}

interface GrammarData {
  grammar: GrammarCategory[];
}

const LearningHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"vocabulary" | "grammar">(
    "vocabulary"
  );
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedGrammarCategory, setSelectedGrammarCategory] = useState(0);
  const notice = useNotice();

  const filteredVocabulary = useMemo(() => {
    return vocabularyData.filter(
      (word: VocabularyItem) =>
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleNextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % vocabularyData.length);
  };

  const handlePrevWord = () => {
    setCurrentWordIndex(
      (prev) => (prev - 1 + vocabularyData.length) % vocabularyData.length
    );
  };

  const renderGrammarItem = (item: GrammarItem) => (
    <div className="border-b border-gray-700 pb-4">
      <h3 className="text-lg font-medium text-white mb-2">
        {item.tense || item.type || item.structure}
      </h3>
      {item.description && (
        <p className="text-gray-300 mb-2">{item.description}</p>
      )}
      {item.structure && (
        <p className="text-blue-400 mb-2">Structure: {item.structure}</p>
      )}
      {item.usage &&
        (Array.isArray(item.usage) ? (
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {item.usage.map((use, idx) => (
              <li key={idx}>{use}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">{item.usage}</p>
        ))}
      {item.example && (
        <p className="text-gray-400 mt-2 italic">Example: {item.example}</p>
      )}
      {item.signalWords && (
        <div className="mt-2">
          <span className="text-gray-400">Signal words: </span>
          <span className="text-gray-300">{item.signalWords.join(", ")}</span>
        </div>
      )}
    </div>
  );

  const renderGrammarContent = (category: GrammarCategory) => {
    if (category.items) {
      return category.items.map((item, index) => (
        <div key={index}>{renderGrammarItem(item)}</div>
      ));
    }

    if (category.types) {
      return category.types.map((type, index) => (
        <div key={index} className="border-b border-gray-700 pb-4">
          <h3 className="text-lg font-medium text-white mb-2">{type.type}</h3>
          {type.usage && <p className="text-gray-300">{type.usage}</p>}
          {type.example && (
            <p className="text-gray-400 mt-2 italic">Example: {type.example}</p>
          )}
          {type.examples?.map((ex, idx) => (
            <p key={idx} className="text-gray-400 mt-2 italic">
              Example: {ex}
            </p>
          ))}
        </div>
      ));
    }

    if (category.transformations) {
      return category.transformations.map((transform, index) => (
        <div key={index} className="border-b border-gray-700 pb-4">
          <h3 className="text-lg font-medium text-white mb-2">
            {transform.tense}
          </h3>
          <p className="text-gray-300">Active: {transform.active}</p>
          <p className="text-gray-300">Passive: {transform.passive}</p>
        </div>
      ));
    }

    if (category.verbPatterns) {
      return category.verbPatterns.map((pattern, index) => (
        <div key={index} className="border-b border-gray-700 pb-4">
          <h3 className="text-lg font-medium text-white mb-2">
            {pattern.verb}
          </h3>
          <p className="text-gray-300">Followed by: {pattern.followedBy}</p>
        </div>
      ));
    }

    return null;
  };

  const selectedCategory = grammarData.grammar[selectedGrammarCategory];

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Learning Hub</h1>
          <p className="mt-2 text-gray-400">
            Improve your English skills with vocabulary and grammar
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("vocabulary")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "vocabulary"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Vocabulary
          </button>
          <button
            onClick={() => setActiveTab("grammar")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "grammar"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Grammar
          </button>
        </div>

        {activeTab === "vocabulary" && (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search for words or meanings..."
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Vocabulary Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Word Study Card */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Word Study
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePrevWord}
                      className="p-2 rounded-lg hover:bg-gray-700 text-gray-300"
                    >
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={handleNextWord}
                      className="p-2 rounded-lg hover:bg-gray-700 text-gray-300"
                    >
                      <span>Next</span>
                    </button>
                  </div>
                </div>

                {vocabularyData[currentWordIndex] && (
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-white">
                      {vocabularyData[currentWordIndex].word}
                    </div>
                    <div className="text-gray-400 italic">
                      {vocabularyData[currentWordIndex].pronunciation}
                    </div>
                    <div className="inline-block px-2 py-1 bg-blue-900 text-blue-200 rounded">
                      {vocabularyData[currentWordIndex].type}
                    </div>
                    <div className="text-gray-300">
                      {vocabularyData[currentWordIndex].meaning}
                    </div>
                  </div>
                )}
              </div>

              {/* Word List */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Word List
                </h2>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredVocabulary.map((word: VocabularyItem, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
                      onClick={() => setCurrentWordIndex(index)}
                    >
                      <div className="flex justify-between">
                        <span className="text-white font-medium">
                          {word.word}
                        </span>
                        <span className="text-gray-400">{word.type}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        {word.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "grammar" && selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Grammar Categories */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Grammar Topics
              </h2>
              <div className="space-y-2">
                {grammarData.grammar.map((category, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-3 rounded-lg ${
                      selectedGrammarCategory === index
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedGrammarCategory(index)}
                  >
                    {category.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Grammar Content */}
            <div className="md:col-span-2 bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                {selectedCategory.category}
              </h2>
              <p className="text-gray-400 mb-6">
                {selectedCategory.description}
              </p>
              <div className="space-y-6">
                {renderGrammarContent(selectedCategory)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningHub;
