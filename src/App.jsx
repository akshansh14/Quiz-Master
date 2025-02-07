import { useState, useEffect } from "react"
import QuizStart from "./components/QuizStart"
import QuizQuestion from "./components/QuizQuestion"
import QuizSummary from "./components/QuizSummary"

export default function App() {
  const [quizData, setQuizData] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    fetchQuizData()
  }, [])

  const fetchQuizData = async () => {
    try {
      const corsProxy = "https://api.allorigins.win/raw?url="
      const apiUrl = encodeURIComponent("https://api.jsonserve.com/Uw5CrX")
      const response = await fetch(corsProxy + apiUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      setQuizData(data.questions)
      console.log("Fetched Data:", data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
  }

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowSummary(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowSummary(false)
    setQuizStarted(false)
  }

  if (!quizData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        {!quizStarted && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Molecular Biology Quiz</h1>
            <p className="mb-4 text-gray-600">Test your knowledge of DNA, RNA, and molecular genetics!</p>
            <button
              onClick={startQuiz}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Start Quiz
            </button>
          </div>
        )}
        {quizStarted && !showSummary && (
          <QuizQuestion
            question={quizData[currentQuestion]}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            currentQuestion={currentQuestion + 1}
            totalQuestions={quizData.length}
            isLastQuestion={currentQuestion === quizData.length - 1}
          />
        )}
        {showSummary && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-lg mb-4">
              You scored {score} out of {quizData.length}
            </p>
            <button
              onClick={restartQuiz}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
