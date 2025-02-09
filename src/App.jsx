import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [finalMaxStreak, setFinalMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    fetchQuizData().then(setQuizData).catch(console.error);
  }, []);

  const startQuiz = () => {
    setQuizState("inProgress");
    setTimeLeft(quizData.duration * 60);
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizState("start");
    setTimeTaken(0);
    setTimeLeft(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    
    const savedBadges = localStorage.getItem('earnedBadges');
    const savedHistory = localStorage.getItem('badgeHistory');
    if (savedBadges) {
      localStorage.setItem('earnedBadges', savedBadges);
    }
    if (savedHistory) {
      localStorage.setItem('badgeHistory', savedHistory);
    }
  };

  const finishQuiz = () => {
    setFinalScore(score);
    setFinalMaxStreak(maxStreak);
    setQuizState("completed");
  };

  const handleAnswer = (questionId, answerId) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const isCorrect = currentQuestion.options.find(
      (opt) => opt.id === answerId
    ).is_correct;

    if (isCorrect) {
      setScore((prev) => {
        const newScore = prev + Number.parseFloat(quizData.correct_answer_marks);
        if (currentQuestionIndex === quizData.questions.length - 1) {
          setFinalScore(newScore);
        }
        return newScore;
      });
      setStreak((prev) => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setScore((prev) => {
        const newScore = prev - Number.parseFloat(quizData.negative_marks);
        if (currentQuestionIndex === quizData.questions.length - 1) {
          setFinalScore(newScore);
        }
        return newScore;
      });
      setStreak(0);
    }
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  useEffect(() => {
    if (quizState === "inProgress" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizState === "inProgress") {
      setQuizState("completed");
    }
  }, [timeLeft, quizState]);

  const handleTimeUpdate = (newTime) => {
    setTimeTaken(newTime);
  };

  if (!quizData)
    return (
      <motion.div
        className="flex h-screen items-center text-2xl  text-white justify-center text-center bg-gradient-to-br from-teal-600 to-orange-500 overflow-hidden"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        Loading quiz...
      </motion.div>
    );

  const getBadge = (score) => {
    if (score >= 90) return "Diamond";
    if (score >= 75) return "Gold";
    if (score >= 60) return "Silver";
    if (score >= 45) return "Bronze";
    return "Beginner";
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#14B8A6]/10 overflow-x-hidden">
      <motion.div
        className="sticky top-0 w-full z-10"
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: -20, opacity: 0 }}
      >
        <Navbar 
          score={quizState === "completed" ? finalScore : score}
          streak={quizState === "completed" ? finalMaxStreak : maxStreak}
          badge={getBadge(quizState === "completed" ? finalScore : score)}
          quizState={quizState}
        />
      </motion.div>

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[url('/bg.jpg')] bg-cover bg-center p-4">
        <motion.div
          className="w-full max-w-4xl"
          animate={{ scale: 1 }}
          initial={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-4 md:p-8">
            {quizState === "start" && (
              <QuizHeader quizData={quizData} onStart={startQuiz} />
            )}

            {quizState === "inProgress" && (
              <>
                <ProgressBar
                  current={currentQuestionIndex + 1}
                  total={quizData.questions.length}
                  timeLeft={timeLeft}
                  answeredCount={Object.keys(userAnswers).length}
                />{" "}

                <QuizQuestion
                  question={quizData.questions[currentQuestionIndex]}
                  onAnswer={handleAnswer}
                  setQuizState={finishQuiz}
                  nextQuestion={nextQuestion}
                  onTimeUpdate={handleTimeUpdate}
                />
              </>
            )}
            {quizState === "completed" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <QuizSummary
                  quizData={quizData}
                  score={finalScore}
                  streak={finalMaxStreak}
                  userAnswers={userAnswers}
                  onRetake={retakeQuiz}
                  setQuizState={setQuizState}
                  timeTaken={timeTaken}
                  badge={getBadge(finalScore)}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
