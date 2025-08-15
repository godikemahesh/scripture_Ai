import React from 'react';
import { useChat } from '../contexts/ChatContext';
import { useUser } from '../contexts/UserContext';
import { formatDistanceToNow } from 'date-fns';
import './Sidebar.css';

const Sidebar = ({ collapsed, showWelcome, setShowWelcome }) => {
  const { chatSessions, currentSessionId, dispatch } = useChat();
  const { userProfile, memoryBank } = useUser();

  const createNewSession = () => {
    dispatch({ type: 'CREATE_SESSION' });
    setShowWelcome(false);
  };

  const selectSession = (sessionId) => {
    dispatch({ type: 'SET_CURRENT_SESSION', payload: sessionId });
    setShowWelcome(false);
  };

  const deleteSession = (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      dispatch({ type: 'DELETE_SESSION', payload: { sessionId } });
    }
  };

  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  const getDominantSentiment = (sentiments) => {
    if (!sentiments || sentiments.length === 0) return 'neutral';
    const counts = {};
    sentiments.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const wisdomLevel = Math.min(10, Math.floor(userProfile.wisdomPoints / 100) + 1);
  const levelProgress = userProfile.wisdomPoints % 100;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">📚 Your Spiritual Journey</div>
      </div>

      <div className="sidebar-content">
        <button 
          className="new-chat-btn"
          onClick={createNewSession}
        >
          ✨ New Sacred Conversation
        </button>

        <div className="chat-history-list">
          {Object.entries(chatSessions)
            .sort(([, a], [, b]) => new Date(b.lastActive) - new Date(a.lastActive))
            .map(([sessionId, session]) => {
              const isActive = sessionId === currentSessionId;
              const timeAgo = getTimeAgo(session.lastActive);
              const dominantSentiment = getDominantSentiment(session.sentimentHistory);
              const hasBreakthroughs = session.breakthroughMoments?.length > 0;

              return (
                <div
                  key={sessionId}
                  className={`chat-history-item ${isActive ? 'active' : ''}`}
                  onClick={() => selectSession(sessionId)}
                >
                  <div className="chat-history-title">{session.title}</div>
                  <div className="chat-history-meta">
                    <span>🕐 {timeAgo} • {session.messages.length} msgs</span>
                    <span className={`chat-sentiment sentiment-${dominantSentiment}`}>
                      {dominantSentiment}
                    </span>
                  </div>
                  {hasBreakthroughs && (
                    <div className="memory-indicator">🧠</div>
                  )}
                  <button
                    className="delete-session-btn"
                    onClick={(e) => deleteSession(sessionId, e)}
                    aria-label="Delete session"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              🧘‍♂️
              <div className="memory-indicator">
                {Object.keys(memoryBank.keyLearnings || {}).length}
              </div>
            </div>
            <div className="profile-info">
              <div className="profile-name">Spiritual Seeker</div>
              <div className="profile-level">Wisdom Level {wisdomLevel}</div>
              <div className="level-progress">
                <div 
                  className="level-progress-fill" 
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{userProfile.totalQuestions}</div>
              <div className="stat-label">Questions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userProfile.wisdomPoints}</div>
              <div className="stat-label">Wisdom Pts</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{Object.keys(chatSessions).length}</div>
              <div className="stat-label">Sessions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userProfile.achievements.length}</div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>
        </div>

        {userProfile.achievements.length > 0 && (
          <div className="achievements-section">
            <div className="achievements-title">🏆 Recent Achievements</div>
            <div className="achievement-badges">
              {userProfile.achievements.slice(-6).map((achievement, index) => (
                <div key={index} className="achievement-badge">
                  🏆 {achievement.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
