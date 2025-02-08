/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

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
      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        className="px-6 py-2 bg-gradient-to-r mx-auto mt-3 from-red-500 to-orange-500 text-white rounded-lg hover:opacity-90 flex items-center"
      >
        Start Test
        <ChevronRight className="h-5 w-5 ml-2" />
      </motion.button>
    </div>
  );
}
