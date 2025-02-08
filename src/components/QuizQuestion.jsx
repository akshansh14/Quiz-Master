/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, ChevronRight, Zap, Timer } from "lucide-react";

const optionVariants = {
  hover: { y: -2, scale: 1.02 },
  tap: { scale: 0.98 },
};

export default function QuizQuestion({
  question,
  onAnswer,
  nextQuestion,
  setQuizState,
  onTimeUpdate,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        onTimeUpdate(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUpdate]);

  const handleRadioChange = (e) => {
    setSelectedOption(Number(e.target.value));
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onAnswer(question.id, selectedOption);
      setSelectedOption(null);
    }
  };

  const handleClear = () => {
    setSelectedOption(null);
  };

  return (
    <motion.div className="max-w-4xl min-w-[1000px] mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="absolute top-4 right-4 text-[#0F172A] flex items-center gap-2">
        <Timer className="h-4 w-4" />
        <span>
          {Math.floor(elapsedTime / 60)}:
          {(elapsedTime % 60).toString().padStart(2, "0")}
        </span>
      </div>
      <div className="p-6 bg-gradient-to-r from-[#14B8A6] to-[#7C3AED] text-white">
        <h2 className="text-xl font-bold flex items-center">
          <Zap className="h-6 w-6 mr-2" /> {question.description}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {question.options.map((option) => (
          <motion.label
            key={option.id}
            whileHover={{ y: -2, scale: 1.02 }}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              selectedOption === option.id
                ? 'bg-[#14B8A6]/10 border-2 border-[#14B8A6]'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="question-option"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={handleRadioChange}
                className="hidden"
              />
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center ${
                  selectedOption === option.id
                    ? 'bg-[#14B8A6] text-white'
                    : 'bg-gray-200'
                }`}
              >
                {selectedOption === option.id && (
                  <CheckCircle className="h-4 w-4" />
                )}
              </div>
              <span className="font-medium text-[#0F172A]">{option.description}</span>
            </div>
          </motion.label>
        ))}
      </div>

      <div className="p-6 border-t border-gray-100 flex justify-between items-center">
        <div className="flex space-x-4">
          <motion.button
            onClick={() => setQuizState("completed")}
            className="px-6 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#F97316]/90 flex items-center"
          >
            Finish Test
          </motion.button>

          <motion.button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`px-6 py-2 rounded-lg text-white flex items-center ${
              selectedOption === null
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-[#14B8A6] hover:bg-[#14B8A6]/90'
            }`}
          >
            Submit Answer
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
