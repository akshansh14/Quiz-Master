import { useState, useEffect } from "react";
import QuizQuestion from "./components/QuizQuestion";
import ProgressBar from "./components/ProgressBar";
import { fetchQuizData } from "./utils/api";
import QuizSummary from "./components/QuizSummary";
import QuizHeader from "./components/QuizHeader";
import Navbar from "./components/Navbar";

export default function App() {
	const [quizData, setQuizData] = useState(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState({});
	const [quizState, setQuizState] = useState("start"); // 'start', 'inProgress', 'completed'
	const [score, setScore] = useState(0);
	const [streak, setStreak] = useState(0); // Added streak for gamification
	const [timeLeft, setTimeLeft] = useState(0);

	// Fetch quiz data once on mount
	useEffect(() => {
		fetchQuizData().then(setQuizData).catch(console.error);
	}, []);

	const startQuiz = () => {
		setQuizState("inProgress");
		setTimeLeft(quizData.duration * 60); // Convert minutes to seconds
	};
	const retakeQuiz = () => {
		setCurrentQuestionIndex(0);
		setUserAnswers({});
		setScore(0);
		setStreak(0);
		setQuizState("start");
	};

	const handleAnswer = (questionId, answerId) => {
		// Save user answer
		setUserAnswers((prev) => ({ ...prev, [questionId]: answerId }));
		const currentQuestion = quizData.questions[currentQuestionIndex];
		const isCorrect = currentQuestion.options.find(
			(opt) => opt.id === answerId
		).is_correct;
		if (isCorrect) {
			setScore(
				(prev) =>
					prev + Number.parseFloat(quizData.correct_answer_marks)
			);
			setStreak((prev) => prev + 1);
		} else {
			setScore(
				(prev) => prev - Number.parseFloat(quizData.negative_marks)
			);
			setStreak(0); // Reset streak on wrong answer
		}
		nextQuestion();
	};

	const nextQuestion = () => {
		if (currentQuestionIndex < quizData.questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
		} else {
			setQuizState("completed");
		}
	};

	// Countdown timer effect
	useEffect(() => {
		if (quizState === "inProgress" && timeLeft > 0) {
			const timer = setTimeout(
				() => setTimeLeft((prev) => prev - 1),
				1000
			);
			return () => clearTimeout(timer);
		} else if (timeLeft === 0 && quizState === "inProgress") {
			setQuizState("completed");
		}
	}, [timeLeft, quizState]);

	if (!quizData)
		return (
			<div className="flex h-screen items-center justify-center p-4 text-center">
				Loading quiz...
			</div>
		);

	// Compute a badge based on score (you can further tweak these thresholds)
	const badge =
		score >= 35
			? "Gold Medal"
			: score >= 25
			? "Silver Medal"
			: "Bronze Medal";

	return (
		<div className="w-screen h-screen bg-gradient-to-br from-purple-600 to-blue-500 overflow-hidden relative">
			{/* Fixed Navbar at the top */}
			<div className="absolute top-0 w-full z-10">
				<Navbar score={score} streak={streak} badge={badge} />
			</div>

			{/* Main Quiz Container Centered */}
			<div className=" h-full mx-auto flex items-center justify-center">
				<div className="mx-auto p-4">
					<div className="bg-white shadow-2xl rounded-3xl p-8 animate-fadeIn">
						{quizState === "start" && (
							<QuizHeader
								quizData={quizData}
								onStart={startQuiz}
							/>
						)}

						{quizState === "inProgress" && (
							<>
								<ProgressBar
									current={currentQuestionIndex + 1}
									total={quizData.questions.length}
									timeLeft={timeLeft}
								/>
								<button
									onClick={() => {
										setQuizState("completed");
									}}
									className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
								>
									Finish Test
								</button>
								<QuizQuestion
									question={
										quizData.questions[currentQuestionIndex]
									}
									onAnswer={handleAnswer}
									setQuizState={setQuizState}
									nextQuestion={nextQuestion}
								/>
							</>
						)}

						{quizState === "completed" && (
							<QuizSummary
								quizData={quizData}
								score={score}
								userAnswers={userAnswers}
								onRetake={retakeQuiz}
								setQuizState={setQuizState}
								
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
