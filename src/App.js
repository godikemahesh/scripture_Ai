import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import WelcomeScreen from './components/WelcomeScreen';
import { ChatProvider } from './contexts/ChatContext';
import { UserProvider } from './contexts/UserContext';
import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user has existing sessions
    const existingSessions = localStorage.getItem('chatSessions');
    if (existingSessions) {
      const sessions = JSON.parse(existingSessions);
      if (Object.keys(sessions).length > 0) {
        setShowWelcome(false);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <UserProvider>
      <ChatProvider>
        <Router>
          <div className="app">
            <Header 
              sidebarCollapsed={sidebarCollapsed} 
              onToggleSidebar={toggleSidebar} 
            />
            <div className="main-container">
              <Sidebar 
                collapsed={sidebarCollapsed}
                showWelcome={showWelcome}
                setShowWelcome={setShowWelcome}
              />
              <main className="main-content">
                {showWelcome ? (
                  <WelcomeScreen setShowWelcome={setShowWelcome} />
                ) : (
                  <ChatInterface />
                )}
              </main>
            </div>
          </div>
        </Router>
      </ChatProvider>
    </UserProvider>
  );
}

export default App;
