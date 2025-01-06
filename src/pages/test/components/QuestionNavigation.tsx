interface QuestionNavigationProps {
    totalQuestions: number;
    currentQuestion: number;
    answeredQuestions: number[];
    flaggedQuestions: number[];
    onQuestionClick: (questionId: number) => void;
    onFlagQuestion: (questionId: number) => void;
  }
  
export  const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
    totalQuestions,
    currentQuestion,
    answeredQuestions,
    flaggedQuestions,
    onQuestionClick,
    onFlagQuestion,
  }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Quiz Navigation</h3>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(index)}
              className={`
                p-2 rounded-md text-center
                ${currentQuestion === index ? 'ring-2 ring-blue-500' : ''}
                ${answeredQuestions.includes(index) ? 'bg-green-100' : 'bg-gray-100'}
                ${flaggedQuestions.includes(index) ? 'border-2 border-yellow-400' : ''}
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span>Not answered</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 border-2 border-yellow-400 rounded"></div>
            <span>Flagged</span>
          </div>
        </div>
      </div>
    );
  };