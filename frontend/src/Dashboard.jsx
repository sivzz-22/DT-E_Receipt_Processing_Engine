import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Refs for scrolling to sections
  const uploadRef = useRef(null);
  const viewRef = useRef(null);
  const analysisRef = useRef(null);
  const notificationsRef = useRef(null);

  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      return;
    }
    fetch('/api/auth/dashboard', {
      headers: { 'Authorization': localStorage.getItem('token') }
    })
      .then(res => {
        if (res.status === 401) {
          setUser(null);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.user) setUser(data.user);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.body.style.minHeight = '100vh';
    document.body.style.width = '100vw';
    document.body.style.overflowX = 'hidden';
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfileOpen(false);
    navigate('/');
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(e) {
      const dropdown = document.querySelector('.profile-dropdown');
      const avatar = document.querySelector('.profile-avatar-navbar');
      if (dropdown && !dropdown.contains(e.target) && avatar && !avatar.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  return (
    <div className="dashboard-root">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="app-title">E-Receipt Processing Engine</h1>
        <nav className="dashboard-navbar-full">
          <div className="navbar-center">
            <span className="navbar-link" onClick={() => scrollToSection(uploadRef)}>Upload</span>
            <span className="navbar-link" onClick={() => scrollToSection(viewRef)}>View</span>
            <span className="navbar-link" onClick={() => scrollToSection(analysisRef)}>Analysis</span>
            <span className="navbar-link" onClick={() => scrollToSection(notificationsRef)}>Notifications</span>
            {!isAuthenticated && (
              <span className="navbar-link" onClick={() => navigate('/login')}>Login/Register</span>
            )}
          </div>
          {isAuthenticated && user && (
            <div className="navbar-right">
              <span
                className="profile-avatar-navbar"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {user.username[0].toUpperCase()}
              </span>
              {profileOpen && (
                <div className="profile-dropdown">
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                  <button onClick={() => alert('Settings feature coming soon!')}>Settings</button>
                  <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                  </button>
                  <button onClick={() => alert('About: E-Receipt Processing Engine v1.0')}>
                    About
                  </button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>
      {/* Main Content */}
      <main className="dashboard-content-full">
        <h2>Welcome{user ? `, ${user.username}` : ''}!</h2>
        <div ref={uploadRef} className="dashboard-card-full">
          <h3>Upload Receipt</h3>
          <p>Scan and upload your receipts for digital storage and analysis.</p>
          <button disabled={!isAuthenticated} onClick={() => isAuthenticated ? navigate('/upload') : navigate('/login')}>
            Upload
          </button>
        </div>
        <div ref={viewRef} className="dashboard-card-full">
          <h3>View Receipts</h3>
          <p>Organize, search, and manage all your uploaded receipts.</p>
          <button disabled={!isAuthenticated} onClick={() => isAuthenticated ? navigate('/view') : navigate('/login')}>
            View
          </button>
        </div>
        <div ref={analysisRef} className="dashboard-card-full">
          <h3>Expense Analysis</h3>
          <p>Visualize and analyze your spending patterns and categories.</p>
          <button disabled={!isAuthenticated} onClick={() => isAuthenticated ? navigate('/analyze') : navigate('/login')}>
            Analyze
          </button>
        </div>
        <div ref={notificationsRef} className="dashboard-card-full">
          <h3>Notifications</h3>
          <p>Get reminders for warranty, returns, bill dues, and offers.</p>
          <button disabled={!isAuthenticated} onClick={() => isAuthenticated ? navigate('/notifications') : navigate('/login')}>
            View
          </button>
        </div>
      </main>
      {/* Footer */}
      <footer className="dashboard-footer">
        <span>&copy; {new Date().getFullYear()} E-Receipt Processing Engine. All rights reserved.</span>
        <div className="social-icons">
          <a href="https://twitter.com" target="_blank" rel="noreferrer">🐦</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">💼</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">💻</a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
