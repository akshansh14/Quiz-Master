export default function QuizStart({ onStart }) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Quiz!</h1>
      <p className="mb-6">Test your knowledge and have fun!</p>
      <button
        onClick={onStart}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        Start Quiz
      </button>
    </div>
  )
}

