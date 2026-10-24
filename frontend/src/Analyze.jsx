import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Analyze.css';

const Analyze = () => {
  const navigate = useNavigate();
  return (
    <div className="feature-root">
      <header className="feature-header">
        <h1 className="app-title">E-Receipt Processing Engine</h1>
        <nav className="feature-navbar">
          <button className="back-btn" onClick={() => navigate('/')}>Back to Dashboard</button>
        </nav>
      </header>
      <main className="feature-content">
        <h2>Expense Analysis</h2>
        <p>Visualize and analyze your spending patterns and categories here.</p>
        <div className="analyze-placeholder">[Expense charts and analytics coming soon]</div>
      </main>
      <footer className="feature-footer">
        <span>&copy; {new Date().getFullYear()} E-Receipt Processing Engine. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Analyze;
