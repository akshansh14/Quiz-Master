import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  BarChart,
  Clock,
  Zap,
  Award,
  Book,
  FileText,
  HelpCircle,
  X,
  BookOpen,
  PenTool,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Timer,
} from "lucide-react";

const medalVariants = {
  gold: {
    rotate: [0, 25, -25, 0],
    scale: [1, 1.1, 1],
    transition: { repeat: Infinity, duration: 2 },
  },
  silver: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 1.5 } },
  bronze: {
    scale: [1, 1.05, 1],
    transition: { repeat: Infinity, duration: 1.2 },
  },
};

// Add new animation variants
const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", duration: 0.5 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

// Add this near other variants at the top
const questionItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
};

function QuestionExplanationDialog({ question, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("explanation");

  if (!isOpen || !question) return null;

  // Safely access all question properties
  const questionText = question.description || "";
  const explanation = question.explanation || question.detailed_solution || "";
  const correctAnswer =
    question.options?.find((opt) => opt.is_correct)?.text || "Not available";
  const readingMaterial = question.readingMaterial || question.reading_material;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col"
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-[#14B8A6] to-[#7C3AED] text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Question Details
          </h2>
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="p-4 flex-1 overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex space-x-1 border-b sticky top-0 bg-white z-10">
            {[
              { id: "explanation", icon: HelpCircle, label: "Explanation" },
              { id: "reading", icon: Book, label: "Reading Material" },
              { id: "practice", icon: PenTool, label: "Practice Material" },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-lg"
                      : "hover:bg-gray-100"
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            className="mt-4 flex-1 overflow-y-auto"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            key={activeTab}
          >
            {activeTab === "explanation" && (
              <div className="space-y-4">
                <motion.div
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-teal-500" />
                    Question:
                  </h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: transformMarkdown(questionText),
                    }}
                  />
                </motion.div>

                <motion.div
                  className="p-4 bg-green-50 rounded-lg border border-green-200"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-bold mb-2 text-green-700 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Correct Answer:
                  </h3>
                  <div className="text-green-700">{correctAnswer}</div>
                </motion.div>

                <motion.div
                  className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-bold mb-2 text-blue-700 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Explanation:
                  </h3>
                  <div
                    className="text-blue-700"
                    dangerouslySetInnerHTML={{
                      __html: transformMarkdown(explanation),
                    }}
                  />
                </motion.div>
              </div>
            )}

            {activeTab === "reading" && (
              <div className="space-y-4">
                {readingMaterial?.content_sections ? (
                  readingMaterial.content_sections.map((section, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: section }}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="text-center text-gray-500 py-8"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Book className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    No reading material available for this question.
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === "practice" && (
              <div className="space-y-4">
                {readingMaterial?.practice_material ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Practice Content */}
                    {readingMaterial.practice_material.content.map(
                      (content, index) => (
                        <motion.div
                          key={index}
                          className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-4"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: content }}
                          />
                        </motion.div>
                      )
                    )}

                    {/* Keywords */}
                    {readingMaterial.practice_material.keywords?.length > 0 && (
                      <motion.div
                        className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-teal-500" />
                          Keywords:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {readingMaterial.practice_material.keywords.map(
                            (keyword, idx) => (
                              <motion.span
                                key={idx}
                                className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-1"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ArrowRight className="h-3 w-3" />
                                {keyword}
                              </motion.span>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center text-gray-500 py-8"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <PenTool className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    No practice material available for this question.
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function QuizSummary({
  quizData,
  score,
  streak,
  userAnswers,
  onRetake,
  setQuizState,
  timeTaken,
  badge,
}) {
  const totalQuestions = quizData.questions.length;
  const maxScore =
    totalQuestions * Number.parseFloat(quizData.correct_answer_marks);
  const percentage = (score / maxScore) * 100;
  const answeredCorrectly = quizData.questions.filter(
    (q) => q.options.find((o) => o.id === userAnswers[q.id])?.is_correct
  ).length;

  let achievementMessage;
  if (percentage >= 90) {
    achievementMessage = "Outstanding Performance!";
  } else if (percentage >= 70) {
    achievementMessage = "Great Job!";
  } else {
    achievementMessage = "Keep Practicing!";
  }

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Add function to format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Remove local badge calculation and use the prop
  const getBadgeIcon = (badgeType) => {
    switch (badgeType) {
      case "Diamond":
        return <Trophy className="h-8 w-8 text-blue-500" />;
      case "Gold":
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case "Silver":
        return <Trophy className="h-8 w-8 text-gray-400" />;
      case "Bronze":
        return <Trophy className="h-8 w-8 text-orange-500" />;
      default:
        return <Trophy className="h-8 w-8 text-gray-300" />;
    }
  };

  const getBadgeAnimation = (badgeType) => {
    switch (badgeType) {
      case "Diamond":
      case "Gold":
        return medalVariants.gold;
      case "Silver":
        return medalVariants.silver;
      default:
        return medalVariants.bronze;
    }
  };

  // Use the passed badge prop
  const badgeIcon = getBadgeIcon(badge);
  const badgeAnimation = getBadgeAnimation(badge);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="p-6 bg-gradient-to-r from-[#14B8A6] to-[#7C3AED] text-white text-center">
        <motion.div
          animate={badgeAnimation}
          variants={medalVariants}
          className="inline-block mb-2"
        >
          {badgeIcon}
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">{achievementMessage}</h1>
        <div className="flex justify-center items-center space-x-4">
          <div className="bg-white/10 p-2 rounded-lg">
            <span className="text-xl font-bold">{score.toFixed(1)}</span>
            <p className="text-xs">Total XP</p>
          </div>
          <div className="bg-white/10 p-2 rounded-lg">
            <span className="text-xl font-bold">{percentage.toFixed(1)}%</span>
            <p className="text-xs">Accuracy</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <BarChart className="h-5 w-5 mr-2" /> Performance Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-teal-600" />
                    <span className="text-sm">Time Taken</span>
                  </div>
                  <span className="font-bold text-teal-600">
                    {formatTime(timeTaken)}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <span className="text-sm">Correct Answers</span>
                  <span className="font-bold text-green-600">
                    {answeredCorrectly}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <span className="text-sm">Total Questions</span>
                  <span className="font-bold text-teal-600">
                    {totalQuestions}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2" /> Quick Actions
              </h3>
              <motion.button
                onClick={onRetake}
                whileHover={{ scale: 1.05 }}
                className="w-full py-2 bg-[#14B8A6] text-white rounded-lg hover:bg-[#14B8A6]/90 mb-2 flex items-center justify-center text-sm"
              >
                <Zap className="h-4 w-4 mr-2" /> Retake Quiz
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#F97316]/90 flex items-center justify-center text-sm font-bold"
              >
                <Award className="h-4 w-4 mr-2" /> View Leaderboard
              </motion.button>
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-0 z-10">
              <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-b from-white to-transparent"></div>
              <div className="bg-white py-2">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#14B8A6]" />
                  Question Review
                </h3>
              </div>
              <div className="absolute inset-x-0 -bottom-4 h-4 bg-gradient-to-t from-white to-transparent"></div>
            </div>

            <div className="space-y-3 mt-4">
              {quizData.questions.map((question, index) => {
                const userAnswer = question.options.find(
                  (o) => o.id === userAnswers[question.id]
                );
                const isCorrect = userAnswer?.is_correct;
                const isUnanswered = !userAnswers.hasOwnProperty(question.id);

                return (
                  <motion.div
                    key={question.id}
                    variants={questionItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className={`relative overflow-hidden rounded-lg border ${
                      isUnanswered
                        ? "border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
                        : isCorrect
                        ? "border-green-200 bg-gradient-to-r from-green-50 to-green-100"
                        : "border-red-200 bg-gradient-to-r from-red-50 to-red-100"
                    }`}
                  >
                    {/* Status indicator line */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${
                        isUnanswered
                          ? "bg-gray-400"
                          : isCorrect
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />

                    <div className="p-3 pl-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {isUnanswered ? (
                            <AlertCircle className="h-5 w-5 text-gray-500" />
                          ) : isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <X className="h-5 w-5 text-red-600" />
                          )}
                          <h4 className="font-medium text-sm">
                            Question {index + 1}
                            {!isUnanswered && (
                              <span
                                className={`ml-2 ${
                                  isCorrect ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {isCorrect ? "Correct" : "Incorrect"}
                              </span>
                            )}
                          </h4>
                        </div>
                        <motion.button
                          onClick={() => setSelectedQuestion(question)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`px-3 py-1.5 rounded-lg flex items-center text-sm gap-1.5 transition-colors ${
                            isUnanswered
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : isCorrect
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          <BookOpen className="h-4 w-4" />
                          Show Explanation
                        </motion.button>
                      </div>
                      <div
                        className="text-sm text-gray-600 pl-7 mb-3"
                        dangerouslySetInnerHTML={{
                          __html: transformMarkdown(question.text || ""),
                        }}
                      />

                      {/* Display all options with correct/incorrect indicators */}
                      <div className="pl-7 space-y-2">
                        {question.options.map((option) => (
                          <div
                            key={option.id}
                            className={`p-2 rounded-lg flex items-center gap-2 ${
                              userAnswers[question.id] === option.id
                                ? option.is_correct
                                  ? "bg-green-100 border border-green-200"
                                  : "bg-red-100 border border-red-200"
                                : option.is_correct && !isUnanswered
                                ? "bg-green-50 border border-green-100"
                                : "bg-gray-50 border border-gray-100"
                            }`}
                          >
                            <div
                              className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                userAnswers[question.id] === option.id
                                  ? option.is_correct
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                  : option.is_correct && !isUnanswered
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            >
                              {userAnswers[question.id] === option.id && (
                                <CheckCircle className="h-3 w-3 text-white" />
                              )}
                              {option.is_correct && !isUnanswered && userAnswers[question.id] !== option.id && (
                                <CheckCircle className="h-3 w-3 text-white opacity-50" />
                              )}
                            </div>
                            <span className={`text-sm ${
                              userAnswers[question.id] === option.id
                                ? option.is_correct
                                  ? "text-green-700"
                                  : "text-red-700"
                                : option.is_correct && !isUnanswered
                                ? "text-green-700"
                                : "text-gray-600"
                            }`}>
                              {option.text || option.description}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Show Explanation button */}
                      <div className="mt-3 pl-7">
                        <motion.button
                          onClick={() => setSelectedQuestion(question)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`px-3 py-1.5 rounded-lg flex items-center text-sm gap-1.5 transition-colors ${
                            isUnanswered
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : isCorrect
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          <BookOpen className="h-4 w-4" />
                          Show Explanation
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <QuestionExplanationDialog
        question={selectedQuestion}
        isOpen={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
      />
    </motion.div>
  );
}

function transformMarkdown(text) {
  if (!text) return "";

  // Replace **text** with <strong>text</strong>
  let html = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Split the text into lines to process list items and paragraphs.
  const lines = html.split("\n");
  let inList = false;
  html = lines
    .map((line) => {
      line = line.trim();
      if (!line) return "";

      if (line.startsWith("* ")) {
        if (!inList) {
          inList = true;
          return "<ul><li>" + line.substring(2) + "</li>";
        } else {
          return "<li>" + line.substring(2) + "</li>";
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
