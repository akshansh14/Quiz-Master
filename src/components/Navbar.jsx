import React, { useState, useEffect } from 'react';
import { Bell, Award, ChevronDown, Check } from 'lucide-react';

const BADGE_MILESTONES = {
  BEGINNER: { streak: 5, icon: '🌱', title: 'Quiz Novice' },
  INTERMEDIATE: { streak: 10, icon: '⭐', title: 'Quiz Star' },
  ADVANCED: { streak: 25, icon: '🏆', title: 'Quiz Champion' },
  EXPERT: { streak: 50, icon: '👑', title: 'Quiz Master' },
  LEGEND: { streak: 100, icon: '🔥', title: 'Quiz Legend' }
};

export default function Navbar({ score, streak, badge }) {
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
      <nav className="bg-gray-900 bg-opacity-75 backdrop-blur-sm text-white py-3 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold">Quiz Master</div>
        <div className="flex space-x-6 items-center">
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 hover:bg-gray-800 p-2 rounded-lg transition"
            >
              <Award className="h-5 w-5 text-blue-300" />
              <span className="font-medium">Badges</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b">
                  <h3 className="font-semibold text-gray-900">Your Badges</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {badgeHistory.map((badge, index) => (
                    <div key={index} className="px-4 py-2 hover:bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {BADGE_MILESTONES[badge.type].icon}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{badge.title}</p>
                          <p className="text-sm text-gray-500">
                            Earned at {badge.streak} streak
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {badgeHistory.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No badges earned yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showNotification && (
        <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{newBadge.icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">New Badge Unlocked!</h3>
              <p className="text-sm text-gray-600">{newBadge.title}</p>
            </div>
            <button 
              onClick={claimBadge}
              className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition flex items-center space-x-1"
            >
              <span>Claim</span>
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}