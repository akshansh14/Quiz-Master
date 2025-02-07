import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import ReadingMaterialDialog from "./ReadingMaterialDialog"
import BackgroundBeams from "./components/ui/background-beams";



function QuizQuestion({ question, onAnswer, onNext, currentQuestion, totalQuestions, isLastQuestion }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [hasAnswered, setHasAnswered] = useState(false)

  const handleAnswer = (option) => {
    if (!hasAnswered) {
      setSelectedAnswer(option)
      setHasAnswered(true)
      onAnswer(option.is_correct)
    }
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setHasAnswered(false)
    onNext()
  }

  return (
    <div>
       <BackgroundBeams />
      <div className="relative z-10">
        <h1>Your content here</h1>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-semibold text-gray-500">
          Question {currentQuestion} of {totalQuestions}
        </div>
        {question.reading_material && (
          <ReadingMaterialDialog content={question.reading_material} />
        )}
      </div>
      <h2 className="text-xl font-bold mb-4">{question.description}</h2>
      <div className="space-y-3">
        {question.options.map((option) => (
          <div key={option.id} className="relative">
            <button
              onClick={() => handleAnswer(option)}
              disabled={hasAnswered}
              className={`w-full text-left p-4 rounded-lg transition duration-300 ease-in-out ${
                !hasAnswered
                  ? "bg-gray-100 hover:bg-gray-200"
                  : selectedAnswer === option
                  ? option.is_correct
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-red-100 border-2 border-red-500"
                  : option.is_correct
                  ? "bg-green-100 border-2 border-green-500"
                  : "bg-gray-100"
              }`}
            >
              <span className="pr-20">{option.description}</span>
            </button>
            {hasAnswered && selectedAnswer === option && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {option.is_correct ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" /> Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <XCircle className="w-4 h-4 mr-1" /> Incorrect
                  </span>
                )}
              </div>
            )}
            {hasAnswered && option.is_correct && selectedAnswer !== option && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" /> Correct Answer
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {hasAnswered && (
        <div className="mt-6">
          <div className="bg-blue-50 rounded-lg overflow-hidden">
            <div className="bg-blue-500 text-white px-4 py-2 font-semibold">
              Explanation
            </div>
            <div className="p-4">
              <p>{question.detailed_solution}</p>
            </div>
          </div>
          <button
            onClick={handleNext}
            className="mt-4 w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isLastQuestion ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      )}
    </div>
  )
}
  export default QuizQuestion;