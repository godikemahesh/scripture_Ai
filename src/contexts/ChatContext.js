import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ChatContext = createContext();

const initialState = {
  chatSessions: {},
  currentSessionId: null,
  thinkingAnimation: false,
  achievementPopup: null
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_SESSION':
      const newSessionId = uuidv4();
      const newSession = {
        id: newSessionId,
        title: action.payload.title || generateSessionTitle(),
        createdAt: new Date(),
        lastActive: new Date(),
        messages: [],
        contextMemory: [],
        topics: new Set(),
        sentimentHistory: [],
        verseReferences: [],
        breakthroughMoments: [],
        wisdomLevel: 1,
        sessionInsights: [],
        emotionalJourney: [],
        personalGrowthMarkers: []
      };
      
      return {
        ...state,
        chatSessions: {
          ...state.chatSessions,
          [newSessionId]: newSession
        },
        currentSessionId: newSessionId
      };

    case 'SET_CURRENT_SESSION':
      return {
        ...state,
        currentSessionId: action.payload
      };

    case 'ADD_MESSAGE':
      const { sessionId, message } = action.payload;
      const session = state.chatSessions[sessionId];
      
      if (!session) return state;

      const updatedSession = {
        ...session,
        messages: [...session.messages, message],
        lastActive: new Date()
      };

      // Update topics if provided
      if (message.metadata?.topics) {
        message.metadata.topics.forEach(topic => {
          updatedSession.topics.add(topic);
        });
      }

      // Update sentiment history if provided
      if (message.metadata?.sentiment) {
        updatedSession.sentimentHistory.push(message.metadata.sentiment);
      }

      return {
        ...state,
        chatSessions: {
          ...state.chatSessions,
          [sessionId]: updatedSession
        }
      };

    case 'UPDATE_SESSION_TITLE':
      const { sessionId: titleSessionId, title } = action.payload;
      return {
        ...state,
        chatSessions: {
          ...state.chatSessions,
          [titleSessionId]: {
            ...state.chatSessions[titleSessionId],
            title
          }
        }
      };

    case 'ADD_BREAKTHROUGH_MOMENT':
      const { sessionId: breakthroughSessionId, breakthrough } = action.payload;
      const breakthroughSession = state.chatSessions[breakthroughSessionId];
      
      if (!breakthroughSession) return state;

      return {
        ...state,
        chatSessions: {
          ...state.chatSessions,
          [breakthroughSessionId]: {
            ...breakthroughSession,
            breakthroughMoments: [...breakthroughSession.breakthroughMoments, breakthrough]
          }
        }
      };

    case 'SET_THINKING_ANIMATION':
      return {
        ...state,
        thinkingAnimation: action.payload
      };

    case 'SET_ACHIEVEMENT_POPUP':
      return {
        ...state,
        achievementPopup: action.payload
      };

    case 'DELETE_SESSION':
      const { sessionId: deleteSessionId } = action.payload;
      const newSessions = { ...state.chatSessions };
      delete newSessions[deleteSessionId];
      
      return {
        ...state,
        chatSessions: newSessions,
        currentSessionId: state.currentSessionId === deleteSessionId ? null : state.currentSessionId
      };

    case 'LOAD_SESSIONS':
      return {
        ...state,
        chatSessions: action.payload.sessions || {},
        currentSessionId: action.payload.currentSessionId || null
      };

    default:
      return state;
  }
};

const generateSessionTitle = () => {
  const hour = new Date().getHour();
  const date = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
  
  if (5 <= hour && hour < 12) {
    return `Morning Contemplation ${date}`;
  } else if (12 <= hour && hour < 17) {
    return `Afternoon Reflection ${date}`;
  } else if (17 <= hour && hour < 21) {
    return `Evening Wisdom ${date}`;
  } else {
    return `Night Meditation ${date}`;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    const savedCurrentSession = localStorage.getItem('currentSessionId');
    
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        // Convert topics back to Set objects
        Object.keys(sessions).forEach(sessionId => {
          if (sessions[sessionId].topics && Array.isArray(sessions[sessionId].topics)) {
            sessions[sessionId].topics = new Set(sessions[sessionId].topics);
          }
        });
        
        dispatch({
          type: 'LOAD_SESSIONS',
          payload: {
            sessions,
            currentSessionId: savedCurrentSession
          }
        });
      } catch (error) {
        console.error('Error loading chat sessions:', error);
      }
    }
  }, []);

  // Save sessions to localStorage whenever state changes
  useEffect(() => {
    const sessionsToSave = { ...state.chatSessions };
    // Convert Set objects to arrays for JSON serialization
    Object.keys(sessionsToSave).forEach(sessionId => {
      if (sessionsToSave[sessionId].topics instanceof Set) {
        sessionsToSave[sessionId].topics = Array.from(sessionsToSave[sessionId].topics);
      }
    });
    
    localStorage.setItem('chatSessions', JSON.stringify(sessionsToSave));
    if (state.currentSessionId) {
      localStorage.setItem('currentSessionId', state.currentSessionId);
    }
  }, [state.chatSessions, state.currentSessionId]);

  const value = {
    ...state,
    dispatch
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
