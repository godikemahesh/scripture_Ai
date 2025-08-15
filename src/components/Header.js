import React from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

const Header = ({ sidebarCollapsed, onToggleSidebar }) => {
  return (
    <header className="header-bar">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
        >
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        
        <div className="logo-container">
          <div className="logo-icon">🕉️</div>
          <div className="logo-text">Ask Scriptures AI</div>
        </div>
        
        <div className="status-indicator">
          <div className="status-dot"></div>
          Advanced Intelligence Active
        </div>
      </div>
      
      <div className="header-right">
        <div className="header-actions">
          <button className="header-btn" aria-label="Settings">
            ⚙️
          </button>
          <button className="header-btn" aria-label="Help">
            ❓
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
