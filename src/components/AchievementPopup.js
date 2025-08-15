import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../contexts/ChatContext';
import { getAchievementDisplay } from '../utils/achievements';
import './AchievementPopup.css';

const AchievementPopup = () => {
  const { achievementPopup, dispatch } = useChat();

  useEffect(() => {
    if (achievementPopup) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_ACHIEVEMENT_POPUP', payload: null });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [achievementPopup, dispatch]);

  if (!achievementPopup) return null;

  const achievement = getAchievementDisplay(achievementPopup.achievement);

  return (
    <AnimatePresence>
      <motion.div
        className="achievement-toast"
        initial={{ opacity: 0, x: 400, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 400, scale: 0.8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="achievement-header">
          <div className="achievement-icon">{achievement.icon}</div>
          <div className="achievement-title">{achievement.title}</div>
        </div>
        <div className="achievement-desc">{achievement.description}</div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementPopup;
