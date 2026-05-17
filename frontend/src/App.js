import React, { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import AddCandidate from './pages/AddCandidate';
import Shortlist from './pages/Shortlist';
import AIShortlist from './pages/AIShortlist';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'candidates':
        return <Candidates onNavigate={setCurrentPage} />;
      case 'add-candidate':
        return <AddCandidate onNavigate={setCurrentPage} />;
      case 'shortlist':
        return <Shortlist />;
      case 'ai-shortlist':
        return <AIShortlist />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app-wrapper">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
