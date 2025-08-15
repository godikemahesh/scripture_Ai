import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../contexts/ChatContext';
import { useUser } from '../contexts/UserContext';
import { aiService } from '../utils/aiService';
import { checkAchievements } from '../utils/achievements';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ThinkingIndicator from './ThinkingIndicator';
import AchievementPopup from './AchievementPopup';
import './ChatInterface.css';

const ChatInterface = () => {
  const { chatSessions, currentSessionId, thinkingAnimation, dispatch } = useChat();
  const { userProfile, dispatch: userDispatch } = useUser();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const currentSession = chatSessions[currentSessionId];

  useEffect(() => {
    // Check for pending question from welcome screen
    const pendingQuestion = localStorage.getItem('pendingQuestion');
    if (pendingQuestion && currentSession && currentSession.messages.length === 0) {
      handleUserInput(pendingQuestion);
      localStorage.removeItem('pendingQuestion');
    }
  }, [currentSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUserInput = async (input) => {
    if (!input.trim() || !currentSessionId) return;

    const timestamp = new Date();
    
    // Add user message
    const userMessage = {
      role: 'user',
      content: input,
      timestamp,
      metadata: {
        wordCount: input.split(' ').length,
        contextual: currentSession?.messages.length > 0
      }
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: { sessionId: currentSessionId, message: userMessage }
    });

    setInputValue('');

    // Show thinking animation
    dispatch({ type: 'SET_THINKING_ANIMATION', payload: true });

    try {
      // Analyze user input
      const [sentiment, topics] = await Promise.all([
        aiService.detectSentiment(input),
        aiService.extractTopics(input)
      ]);

      // Get AI response
      const recentContext = currentSession?.messages
        .filter(msg => msg.role === 'user')
        .slice(-2)
        .map(msg => msg.content) || [];

      const personalityContext = {
        communicationStyle: userProfile.learningStyle,
        topInterests: Object.entries(userProfile.preferredTopics || {})
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([topic]) => topic),
        dominantEmotion: 'neutral' // This would be calculated from memory
      };

      const aiResponse = await aiService.getGitaAnswer(input, recentContext, personalityContext);

      // Calculate wisdom points
      const wisdomPoints = await aiService.calculateWisdomPoints(input, sentiment, topics);

      // Check for achievements
      const newAchievements = checkAchievements(userProfile, { sentiment, topics });

      // Update user profile
      userDispatch({ type: 'UPDATE_WISDOM_POINTS', payload: wisdomPoints });
      
      // Update topics
      const topicUpdates = {};
      topics.forEach(topic => {
        topicUpdates[topic] = (userProfile.preferredTopics[topic] || 0) + 1;
      });
      userDispatch({ type: 'UPDATE_TOPICS', payload: topicUpdates });

      // Add achievements
      newAchievements.forEach(achievement => {
        userDispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement.id });
      });

      // Add AI message
      const aiMessage = {
        role: 'assistant',
        content: aiResponse.answer,
        timestamp: new Date(),
        metadata: {
          sentiment,
          topics,
          contextUsed: aiResponse.context.length > 0,
          confidence: aiResponse.confidence,
          wisdomPoints,
          achievements: newAchievements.map(a => a.id)
        }
      };

      dispatch({
        type: 'ADD_MESSAGE',
        payload: { sessionId: currentSessionId, message: aiMessage }
      });

      // Show achievement popup if any
      if (newAchievements.length > 0) {
        dispatch({
          type: 'SET_ACHIEVEMENT_POPUP',
          payload: {
            achievement: newAchievements[0],
            timestamp: new Date()
          }
        });
      }

      // Update session title if it's the first message
      if (currentSession?.messages.length === 1) {
        const title = generateSessionTitle(input, topics);
        dispatch({
          type: 'UPDATE_SESSION_TITLE',
          payload: { sessionId: currentSessionId, title }
        });
      }

    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your question. Please try again.',
        timestamp: new Date(),
        metadata: { error: true }
      };

      dispatch({
        type: 'ADD_MESSAGE',
        payload: { sessionId: currentSessionId, message: errorMessage }
      });
    } finally {
      dispatch({ type: 'SET_THINKING_ANIMATION', payload: false });
    }
  };

  const generateSessionTitle = (firstQuestion, topics) => {
    const titles = {
      'karma_yoga': ['Path of Action', 'Sacred Service', 'Selfless Work'],
      'bhakti_yoga': ['Path of Devotion', 'Divine Love', 'Surrender & Faith'],
      'raja_yoga': ['Inner Journey', 'Meditation Mastery', 'Mind & Focus'],
      'jnana_yoga': ['Wisdom Seeking', 'Self-Knowledge', 'Truth Inquiry'],
      'dharma': ['Righteous Path', 'Life Purpose', 'Sacred Duty'],
      'peace': ['Inner Peace', 'Tranquility', 'Calm Mind'],
      'life_purpose': ['Life\'s Meaning', 'Soul Purpose', 'Divine Calling'],
      'relationships': ['Sacred Bonds', 'Love & Connection', 'Relationship Wisdom'],
      'suffering': ['Through Difficulty', 'Pain to Growth', 'Healing Journey'],
      'spirituality': ['Divine Connection', 'Sacred Quest', 'Spiritual Awakening']
    };

    if (topics.length > 0) {
      const primaryTopic = topics[0];
      if (titles[primaryTopic]) {
        return titles[primaryTopic][Math.floor(Math.random() * titles[primaryTopic].length)];
      }
    }

    // Fallback: use first few words of question
    const words = firstQuestion.split(' ').slice(0, 4);
    return words.join(' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!currentSession) {
    return (
      <div className="chat-interface-empty">
        <div className="empty-state">
          <div className="empty-icon">🕉️</div>
          <h3>No Active Session</h3>
          <p>Start a new conversation to begin your spiritual journey.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="chat-messages-container" ref={chatContainerRef}>
        <AnimatePresence>
          {currentSession.messages.map((message, index) => (
            <motion.div
              key={`${message.timestamp}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ChatMessage
                message={message}
                index={index}
                isBreakthrough={currentSession.breakthroughMoments?.some(
                  bm => bm.timestamp === message.timestamp
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {thinkingAnimation && <ThinkingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleUserInput}
        disabled={thinkingAnimation}
        placeholder={getPlaceholder()}
      />

      <AchievementPopup />
    </div>
  );
};

const getPlaceholder = () => {
  const placeholders = [
    "Share what's on your heart and mind...",
    "What spiritual wisdom do you seek today?",
    "How can the Gita guide you right now?",
    "What questions arise from your spiritual journey?",
    "Let's dive deeper into your spiritual exploration...",
    "What new insights have emerged for you?",
    "How has your understanding evolved?"
  ];
  
  return placeholders[Math.floor(Math.random() * placeholders.length)];
};

export default ChatInterface;
