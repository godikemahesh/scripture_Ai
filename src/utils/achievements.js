export const achievements = {
  first_question: {
    id: 'first_question',
    icon: '🌟',
    title: 'First Steps',
    description: 'Welcome to your spiritual journey!',
    condition: (profile) => profile.totalQuestions === 1
  },
  seeker_milestone: {
    id: 'seeker_milestone',
    icon: '🏆',
    title: 'Dedicated Seeker',
    description: 'Your commitment to growth shines!',
    condition: (profile) => [10, 25, 50, 100].includes(profile.totalQuestions)
  },
  wisdom_gatherer: {
    id: 'wisdom_gatherer',
    icon: '💎',
    title: 'Wisdom Gatherer',
    description: 'You\'ve accumulated substantial spiritual insights!',
    condition: (profile) => profile.wisdomPoints >= 500
  },
  deep_thinker: {
    id: 'deep_thinker',
    icon: '🤔',
    title: 'Jnana Yogi',
    description: 'Your love for wisdom and knowledge is evident!',
    condition: (profile) => profile.preferredTopics?.jnana_yoga >= 5
  },
  devoted_heart: {
    id: 'devoted_heart',
    icon: '❤️',
    title: 'Bhakti Yogi',
    description: 'Your heart overflows with devotion!',
    condition: (profile) => profile.preferredTopics?.bhakti_yoga >= 5
  },
  karma_warrior: {
    id: 'karma_warrior',
    icon: '⚔️',
    title: 'Karma Yogi',
    description: 'You understand the path of selfless action!',
    condition: (profile) => profile.preferredTopics?.karma_yoga >= 5
  },
  peaceful_soul: {
    id: 'peaceful_soul',
    icon: '🕊️',
    title: 'Peaceful Soul',
    description: 'You radiate inner tranquility!',
    condition: (profile, currentData) => 
      currentData.sentiment === 'very_positive' && 
      currentData.topics.includes('peace')
  },
  resilient_spirit: {
    id: 'resilient_spirit',
    icon: '💪',
    title: 'Resilient Spirit',
    description: 'Your strength through challenges is inspiring!',
    condition: (profile, currentData) => 
      ['negative', 'very_negative'].includes(currentData.sentiment) && 
      profile.totalQuestions > 5
  },
  consistent_seeker: {
    id: 'consistent_seeker',
    icon: '📅',
    title: 'Consistent Seeker',
    description: 'Your daily spiritual practice is admirable!',
    condition: (profile) => {
      const lastActive = new Date(profile.lastActive);
      const now = new Date();
      const daysDiff = (now - lastActive) / (1000 * 60 * 60 * 24);
      return profile.totalQuestions > 0 && daysDiff <= 7;
    }
  },
  wisdom_sage: {
    id: 'wisdom_sage',
    icon: '🧙‍♂️',
    title: 'Wisdom Sage',
    description: 'You\'ve reached profound spiritual understanding!',
    condition: (profile) => profile.wisdomPoints >= 1000
  },
  enlightened_conversation: {
    id: 'enlightened_conversation',
    icon: '✨',
    title: 'Enlightened Conversation',
    description: 'Your questions touch the depths of spiritual wisdom!',
    condition: (profile, currentData) => 
      currentData.topics.length >= 3 && 
      currentData.topics.some(topic => ['spirituality', 'life_purpose'].includes(topic))
  }
};

export const checkAchievements = (profile, currentData = {}) => {
  const unlockedAchievements = [];
  
  Object.values(achievements).forEach(achievement => {
    if (!profile.achievements.includes(achievement.id) && 
        achievement.condition(profile, currentData)) {
      unlockedAchievements.push(achievement);
    }
  });
  
  return unlockedAchievements;
};

export const getAchievementDisplay = (achievementId) => {
  return achievements[achievementId] || {
    id: achievementId,
    icon: '🌟',
    title: achievementId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Achievement unlocked!'
  };
};
