import React from 'react';
import { motion } from 'framer-motion';
import './ThinkingIndicator.css';

const ThinkingIndicator = () => {
  return (
    <motion.div
      className="thinking-indicator"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="thinking-avatar">
        🕉️
      </div>
      
      <div className="thinking-content">
        <div className="thinking-dots">
          <motion.div
            className="thinking-dot"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="thinking-dot"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="thinking-dot"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
        
        <div className="thinking-text">
          Contemplating the depths of wisdom...
        </div>
      </div>
    </motion.div>
  );
};

export default ThinkingIndicator;
