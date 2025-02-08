import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Award, ChevronDown, Check, Star, Trophy, Zap } from 'lucide-react';
import { BADGE_MILESTONES } from '../constants';

// Add streak animation variants
const streakVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
};

export default function Navbar({ score, streak, badge, quizState }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [badgeHistory, setBadgeHistory] = useState([]);

  useEffect(() => {
    // Load saved data from localStorage
    const savedBadges = localStorage.getItem('earnedBadges');
    const savedHistory = localStorage.getItem('badgeHistory');
    if (savedBadges) setEarnedBadges(JSON.parse(savedBadges));
    if (savedHistory) setBadgeHistory(JSON.parse(savedHistory));

    // Check for new badge achievements
    checkBadgeAchievements(streak);
  }, [streak]);

  const checkBadgeAchievements = (currentStreak) => {
    for (const [key, value] of Object.entries(BADGE_MILESTONES)) {
      if (currentStreak >= value.streak && !earnedBadges.includes(key)) {
        setNewBadge({ type: key, ...value });
        setShowNotification(true);
        break;
      }
    }
  };

  const claimBadge = () => {
    if (newBadge) {
      const updatedBadges = [...earnedBadges, newBadge.type];
      const updatedHistory = [...badgeHistory, {
        type: newBadge.type,
        streak: streak,
        date: new Date().toISOString(),
        title: newBadge.title
      }];

      setEarnedBadges(updatedBadges);
      setBadgeHistory(updatedHistory);
      localStorage.setItem('earnedBadges', JSON.stringify(updatedBadges));
      localStorage.setItem('badgeHistory', JSON.stringify(updatedHistory));
      
      setShowNotification(false);
      setNewBadge(null);
    }
  };

  return (
    <div className="relative">
      <nav className="bg-white bg-opacity-90 backdrop-blur-md text-[#0F172A] py-2 md:py-3 px-4 md:px-6 flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center shadow-xl">
        <motion.div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 md:h-6 md:w-6 text-[#14B8A6]" fill="currentColor" />
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#14B8A6] to-[#7C3AED] bg-clip-text text-transparent">
            QuizMaster
          </span>
        </motion.div>
        
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 md:gap-6">
          {quizState === "completed" && (
            <>
              <motion.div 
                className="flex items-center space-x-2 bg-[#14B8A6]/10 px-3 md:px-4 py-1 rounded-full text-sm md:text-base"
                variants={streakVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Star className="h-4 w-4 md:h-5 md:w-5 text-[#14B8A6]" />
                <span className="font-medium text-[#0F172A]">{score} XP</span>
              </motion.div>

              {streak > 0 && (
                <motion.div 
                  className="flex items-center space-x-2 bg-[#14B8A6]/10 px-3 md:px-4 py-1 rounded-full text-sm md:text-base"
                  variants={streakVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Trophy className="h-4 w-4 md:h-5 md:w-5 text-[#14B8A6]" />
                  <span className="font-medium text-[#0F172A]">Best: {streak}</span>
                </motion.div>
              )}
            </>
          )}

          {/* Badges Dropdown */}
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 p-2 rounded-lg transition-all text-sm md:text-base"
            >
              <Award className="h-4 w-4 md:h-5 md:w-5 text-blue-300" />
              <span className="font-medium">Badges</span>
              <ChevronDown className={`h-3 w-3 md:h-4 md:w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: showDropdown ? 1 : 0, y: showDropdown ? 0 : -10 }}
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-2 z-50"
            >
              <div className="px-4 py-2 border-b">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-500" /> Earned Badges
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 p-2">
                {badgeHistory.map((badge, index) => (
                  <motion.div
                    key={index}
                    variants={streakVariants}
                    initial="initial"
                    animate="animate"
                    className={`flex items-center p-2 rounded-lg ${BADGE_MILESTONES[badge.type].color}`}
                  >
                    <span className="text-2xl mr-3">{BADGE_MILESTONES[badge.type].icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{badge.title}</p>
                      <p className="text-xs text-gray-600">Achieved at {badge.streak} streak</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </nav>

      {/* New Badge Notification */}
      {showNotification && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-16 right-4 w-80 bg-white rounded-xl shadow-xl p-4 z-50 border-2 border-yellow-400"
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="p-2 rounded-full bg-yellow-100"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="text-3xl">{newBadge.icon}</span>
            </motion.div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">New Achievement!</h3>
              <p className="text-sm text-gray-600">{newBadge.title}</p>
            </div>
            <motion.button 
              onClick={claimBadge}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1"
            >
              <Check className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}