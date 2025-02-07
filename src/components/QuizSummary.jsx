/* eslint-disable react/prop-types */
import  { useState } from "react";

export default function QuizSummary({
	quizData,
	score,
	userAnswers,
	onRetake,
}) {
	// Compute overall results.
	const totalQuestions = quizData.questions.length;
	const maxScore =
		totalQuestions * Number.parseFloat(quizData.correct_answer_marks);
	const percentage = (score / maxScore) * 100;
	const answeredCorrectly = quizData.questions.filter(
		(q) => q.options.find((o) => o.id === userAnswers[q.id])?.is_correct
	).length;

	// Determine badge and achievement based on percentage.
	let badge;
	if (percentage >= 90) {
		badge = "Gold Medal";
	} else if (percentage >= 70) {
		badge = "Silver Medal";
	} else {
		badge = "Bronze Medal";
	}
	let achievementMessage;
	if (percentage >= 90) {
		achievementMessage = "Outstanding Performance!";
	} else if (percentage >= 70) {
		achievementMessage = "Great Job!";
	} else {
		achievementMessage = "Keep Practicing!";
	}

	// State for which question is being viewed and whether to show explanation.
	const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
	const [showExplanation, setShowExplanation] = useState(false);

	// When selecting a different question, reset the explanation view.
	const handleQuestionSelect = (index) => {
		setSelectedQuestionIndex(index);
		setShowExplanation(false);
	};

	// Get the currently selected question.
	const currentQuestion = quizData.questions[selectedQuestionIndex];

	return (
		<div className="animate-fadeIn p-4">
			<div className="h-[500px] w-[70vw] flex flex-col md:flex-row">
				{/* Left Summary Panel */}
				<div className="md:w-1/3  p-4 border-b md:border-b-0 md:border-r border-gray-300">
					<h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
					<div className="mb-4">
						<p className="text-4xl font-bold text-blue-500">
							{score.toFixed(2)} / {maxScore}
						</p>
						<p className="text-xl">
							You scored {percentage.toFixed(2)}%
						</p>
					</div>
					<p className="mb-4 text-lg">
						Correct Answers: {answeredCorrectly} out of{" "}
						{totalQuestions}
					</p>
					<div className="flex flex-col space-y-2 mb-4">
						<div className="bg-indigo-500 text-white px-4 py-2 rounded-full shadow-lg text-center">
							{badge}
						</div>
						<div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg text-center">
							{achievementMessage}
						</div>
					</div>
					<button
						onClick={
							onRetake ? onRetake : () => window.location.reload()
						}
						className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 w-full"
					>
						Restart Quiz
					</button>
				</div>

				{/* Right Question Navigator & Detail View */}
				<div className="md:w-2/3 p-4 ">
					{/* Navigation Bar */}
					<div className="mb-4">
						<h3 className="text-xl font-bold mb-2">
							Jump to Question
						</h3>
						<div className="flex flex-wrap gap-2">
							{quizData.questions.map((q, index) => (
								<button
									key={q.id}
									onClick={() => handleQuestionSelect(index)}
									className={`min-w-[40px] h-10 rounded-full flex items-center justify-center border 
                    ${
						selectedQuestionIndex === index
							? "bg-blue-500 text-white"
							: "bg-gray-200 text-gray-700"
					} hover:bg-blue-400 transition`}
								>
									{index + 1}
								</button>
							))}
						</div>
					</div>

					{/* Single Question Detail View */}
					<div className="p-4 bg-gray-100 rounded shadow max-h-96 overflow-y-auto h-full">
						<p className="font-semibold mb-2">
							Question {selectedQuestionIndex + 1}:{" "}
							{currentQuestion.description}
						</p>
						{!showExplanation ? (
							<div>
								{currentQuestion.detailed_solution && (
									<button
										onClick={() => setShowExplanation(true)}
										className="bg-blue-500 my-2 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition"
									>
										Show Explanation
									</button>
								)}
								<p className="text-sm mb-1">
									<strong>Your Answer:</strong>{" "}
									{currentQuestion.options.find(
										(o) =>
											o.id ===
											userAnswers[currentQuestion.id]
									)?.description || "Not answered"}
								</p>

								<p className="text-sm mb-2">
									<strong>Correct Answer:</strong>{" "}
									{
										currentQuestion.options.find(
											(o) => o.is_correct
										)?.description
									}
								</p>
							</div>
						) : (
							<div>
								<button
									onClick={() => setShowExplanation(false)}
									className="my-2 bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition"
								>
									Back to Question
								</button>
								<div
									className="prose"
									dangerouslySetInnerHTML={{
										__html: transformMarkdown(
											currentQuestion.detailed_solution ||
												"No explanation available."
										),
									}}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function transformMarkdown(text) {
	// Replace **text** with <strong>text</strong>
	let html = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

	// Split the text into lines to process list items and paragraphs.
	const lines = html.split("\n");
	let inList = false;
	html = lines
		.map((line) => {
			if (line.trim().startsWith("* ")) {
				if (!inList) {
					inList = true;
					return "<ul><li>" + line.trim().substring(2) + "</li>";
				} else {
					return "<li>" + line.trim().substring(2) + "</li>";
				}
			} else {
				if (inList) {
					inList = false;
					return "</ul><p>" + line + "</p>";
				}
				return "<p>" + line + "</p>";
			}
		})
		.join("");
	if (inList) {
		html += "</ul>";
	}
	return html;
}
