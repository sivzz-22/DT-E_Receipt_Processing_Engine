import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
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
        <h2>Notifications</h2>
        <p>Get reminders for warranty, returns, bill dues, and offers here.</p>
        <div className="notifications-placeholder">[Notifications and reminders coming soon]</div>
      </main>
      <footer className="feature-footer">
        <span>&copy; {new Date().getFullYear()} E-Receipt Processing Engine. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Notifications;
