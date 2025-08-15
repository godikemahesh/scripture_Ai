import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import './ChatMessage.css';

const ChatMessage = ({ message, index, isBreakthrough }) => {
  const { role, content, timestamp, metadata } = message;
  const isAI = role === 'assistant';
  const timeStr = format(new Date(timestamp), 'HH:mm');
  
  const sentiment = metadata?.sentiment || 'neutral';
  const topics = metadata?.topics || [];
  const wisdomPoints = metadata?.wisdomPoints || 0;

  return (
    <motion.div
      className={`message-wrapper ${isBreakthrough ? 'breakthrough-moment' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className={`message-avatar ${isAI ? 'ai-avatar' : 'user-avatar'}`}>
        {isAI ? '🕉️' : '👤'}
      </div>
      
      <div className={`message-content ${isAI ? 'message-ai' : 'message-user'}`}>
        <div className="message-header">
          <div className="message-author">
            {isAI ? 'Ask Scriptures AI' : 'You'}
          </div>
          <div className="message-meta">
            <span className="message-time">{timeStr}</span>
            {sentiment !== 'neutral' && (
              <span className={`message-sentiment sentiment-${sentiment}`}>
                {sentiment.replace('_', ' ')}
              </span>
            )}
            {topics.length > 0 && (
              <span className="message-topics">
                🏷️ {topics.slice(0, 2).join(', ')}
              </span>
            )}
            {wisdomPoints > 0 && (
              <span className="wisdom-points">
                ✨ +{wisdomPoints}
              </span>
            )}
          </div>
        </div>
        
        <div className="message-text">
          {isAI ? (
            <ReactMarkdown
              components={{
                strong: ({ children }) => (
                  <strong style={{ color: '#FF6B6B' }}>{children}</strong>
                ),
                h1: ({ children }) => (
                  <h1 style={{ color: '#4ECDC4', fontSize: '1.5rem', margin: '1rem 0' }}>{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 style={{ color: '#4ECDC4', fontSize: '1.25rem', margin: '0.75rem 0' }}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ color: '#4ECDC4', fontSize: '1.1rem', margin: '0.5rem 0' }}>{children}</h3>
                ),
                ul: ({ children }) => (
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>{children}</ol>
                ),
                li: ({ children }) => (
                  <li style={{ margin: '0.25rem 0', color: '#e4e4e4' }}>{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote style={{
                    borderLeft: '4px solid #FF6B6B',
                    padding: '0.5rem 1rem',
                    margin: '1rem 0',
                    background: 'rgba(255, 107, 107, 0.1)',
                    borderRadius: '0 8px 8px 0',
                    fontStyle: 'italic'
                  }}>
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code style={{
                    background: 'rgba(78, 205, 196, 0.1)',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '4px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.9em',
                    color: '#4ECDC4'
                  }}>
                    {children}
                  </code>
                )
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <div className="user-message-text">{content}</div>
          )}
        </div>

        {isAI && metadata?.achievements?.length > 0 && (
          <div className="achievement-notification">
            🏆 Achievement Unlocked: {metadata.achievements[0].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
