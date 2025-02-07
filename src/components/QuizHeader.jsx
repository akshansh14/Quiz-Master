/* eslint-disable react/prop-types */
export default function QuizHeader({ quizData, onStart }) {
	return (
		<div className="text-center mb-6 w-[70vw]">
			<h1
				className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent 
                bg-gradient-to-r from-pink-500 to-yellow-500 animate-pulse"
			>
				{quizData.title}
			</h1>
			<p className="text-lg text-gray-600 mb-4">
				{quizData.description || "No description available"}
			</p>
			<div className="text-sm text-gray-500 space-y-1">
				<p>Topic: {quizData.topic}</p>
				<p>Duration: {quizData.duration} minutes</p>
				<p>Questions: {quizData.questions_count}</p>
				<p>Correct Answer: +{quizData.correct_answer_marks} points</p>
				<p>Incorrect Answer: -{quizData.negative_marks} points</p>
				<p>Max Mistakes: {quizData.max_mistake_count}</p>
				<p>Test Type: {quizData.live_count}</p>
			</div>
			<button
				onClick={onStart}
				className="bg-blue-500 text-white px-6 py-2 my-4 rounded-full hover:bg-blue-600 transition duration-300"
			>
				Start Quiz
			</button>
		</div>
	);
}
