import React from 'react';
import { motion } from 'framer-motion';
import { useChat } from '../contexts/ChatContext';
import { useUser } from '../contexts/UserContext';
import './WelcomeScreen.css';

const WelcomeScreen = ({ setShowWelcome }) => {
  const { dispatch } = useChat();
  const { userProfile } = useUser();

  const suggestions = [
    "What is the meaning of dharma in daily life?",
    "How can I find inner peace amidst chaos?",
    "What does the Gita say about handling difficult relationships?",
    "How do I know if I'm on the right spiritual path?",
    "What is the difference between action and inaction?",
    "How can I overcome fear and anxiety according to the Gita?",
    "How can I practice selfless service in my work?",
    "What is the secret of working without attachment?",
    "How do I cultivate pure devotion?",
    "What role does surrender play in spiritual growth?"
  ];

  const features = [
    {
      icon: "🧠",
      title: "Advanced Memory",
      description: "I remember our entire journey together, building deeper understanding over time"
    },
    {
      icon: "🎭",
      title: "Personality Adaptation",
      description: "Responses tailored to your unique spiritual style and emotional patterns"
    },
    {
      icon: "💡",
      title: "Breakthrough Detection",
      description: "Recognition of your spiritual insights and growth moments"
    },
    {
      icon: "🧵",
      title: "Contextual Wisdom",
      description: "Connections across conversations for holistic spiritual guidance"
    }
  ];

  const handleSuggestionClick = (suggestion) => {
    dispatch({ type: 'CREATE_SESSION' });
    setShowWelcome(false);
    // Store the suggestion to be used in the chat input
    localStorage.setItem('pendingQuestion', suggestion);
  };

  const handleFeatureClick = (feature) => {
    dispatch({ type: 'CREATE_SESSION' });
    setShowWelcome(false);
  };

  return (
    <div className="welcome-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="welcome-content"
      >
        <h1 className="welcome-title">
          Welcome to Your Spiritual Journey
        </h1>
        
        <p className="welcome-subtitle">
          Discover ancient wisdom through advanced AI that remembers, learns, and grows with you.
          Every conversation deepens our connection and understanding.
        </p>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              onClick={() => handleFeatureClick(feature)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                y: -8,
                boxShadow: "0 20px 40px rgba(255, 107, 107, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="suggestions-section">
          <h3 className="suggestions-title">Start Your Journey</h3>
          <div className="suggestions-container">
            {suggestions.slice(0, 6).map((suggestion, index) => (
              <motion.button
                key={index}
                className="suggestion-pill"
                onClick={() => handleSuggestionClick(suggestion)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 8px 20px rgba(255, 107, 107, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>

        {userProfile.totalQuestions > 0 && (
          <motion.div
            className="welcome-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="stat-item">
              <span className="stat-number">{userProfile.totalQuestions}</span>
              <span className="stat-label">Questions Asked</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userProfile.wisdomPoints}</span>
              <span className="stat-label">Wisdom Points</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userProfile.achievements.length}</span>
              <span className="stat-label">Achievements</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
