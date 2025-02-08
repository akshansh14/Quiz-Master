// ProgressBar.jsx
import { motion } from 'framer-motion';
import { Clock, Zap, Trophy } from 'lucide-react';

const progressVariants = {
  initial: { width: 0 },
  animate: { width: '100%', transition: { duration: 0.5 } }
};

export default function ProgressBar({ current, total, timeLeft, answeredCount  }) {
  const progress = (current / total) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="mb-6 space-y-4">
      <div className="flex justify-between items-center">
        <motion.div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-orange-500" />
          <span className="font-medium">
            Answered {answeredCount} <span className="text-gray-500">/ {total}</span>
          </span>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-2 bg-red-100 px-3 py-1 rounded-full"
          animate={{ scale: timeLeft < 60 ? [1, 1.1, 1] : 1 }}
          transition={{ repeat: timeLeft < 60 ? Infinity : 0, duration: 1 }}
        >
          <Clock className="h-4 w-4 text-red-500" />
          <span className="font-medium text-red-600">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </motion.div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#14B8A6] to-[#7C3AED] rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <motion.div
            className="absolute right-0 top-0.5"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Trophy className="h-4 w-4 text-white" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}