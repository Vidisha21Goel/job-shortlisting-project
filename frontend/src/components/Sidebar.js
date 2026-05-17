import React from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'candidates', label: 'Candidates', icon: '👤' },
  { id: 'add-candidate', label: 'Add Candidate', icon: '＋' },
  { id: 'shortlist', label: 'Shortlist', icon: '🎯' },
  { id: 'ai-shortlist', label: 'AI Matching', icon: '🤖' },
];

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">Talent<span>Sift</span></div>
        <div className="logo-sub">AI Candidate System</div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
