"use client"

import confetti from "canvas-confetti"
import { useEffect } from "react"

export default function QuizSummary({ score, totalQuestions, onRestart }) {
  const percentage = (score / totalQuestions) * 100

  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [percentage]) // Added percentage to dependencies

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
      <p className="text-lg mb-4">
        Your score: {score} out of {totalQuestions}
      </p>
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">{percentage.toFixed(0)}% correct</p>
      </div>
      {percentage >= 70 && <p className="text-green-500 font-semibold mb-4">Congratulations! You did great!</p>}
      {percentage < 70 && <p className="text-yellow-500 font-semibold mb-4">Good effort! Keep practicing!</p>}
      <button
        onClick={onRestart}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        Restart Quiz
      </button>
    </div>
  )
}

