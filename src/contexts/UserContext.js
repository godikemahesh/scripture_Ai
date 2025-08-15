import React, { createContext, useContext, useReducer, useEffect } from 'react';

const UserContext = createContext();

const initialState = {
  userProfile: {
    spiritualLevel: "beginner",
    interests: [],
    favoriteVerses: [],
    meditationStreak: 0,
    totalQuestions: 0,
    wisdomPoints: 0,
    lastActive: new Date(),
    achievements: [],
    personalityTraits: { seeker: 70, devotional: 50, intellectual: 60 },
    preferredTopics: {},
    learningStyle: "balanced"
  },
  memoryBank: {
    keyLearnings: [],
    personalInsights: [],
    recurringThemes: {},
    emotionalPatterns: {},
    contextThreads: {},
    deepQuestions: [],
    breakthroughMoments: [],
    wisdomEvolution: []
  },
  aiPersonality: {
    empathyLevel: 0.8,
    wisdomDepth: 0.9,
    personalConnection: 0.7,
    adaptiveStyle: true
  },
  conversationFlow: {
    currentTheme: null,
    depthLevel: 1,
    emotionalState: "neutral",
    breakthroughPotential: 0.5
  }
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload }
      };
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          achievements: [...state.userProfile.achievements, action.payload]
        }
      };
    case 'UPDATE_WISDOM_POINTS':
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          wisdomPoints: state.userProfile.wisdomPoints + action.payload,
          totalQuestions: state.userProfile.totalQuestions + 1
        }
      };
    case 'UPDATE_TOPICS':
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          preferredTopics: {
            ...state.userProfile.preferredTopics,
            ...action.payload
          }
        }
      };
    case 'ADD_MEMORY':
      return {
        ...state,
        memoryBank: {
          ...state.memoryBank,
          [action.category]: [...state.memoryBank[action.category], action.payload]
        }
      };
    case 'UPDATE_CONVERSATION_FLOW':
      return {
        ...state,
        conversationFlow: { ...state.conversationFlow, ...action.payload }
      };
    case 'LOAD_USER_DATA':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        dispatch({ type: 'LOAD_USER_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  // Save user data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(state));
  }, [state]);

  const value = {
    ...state,
    dispatch
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
