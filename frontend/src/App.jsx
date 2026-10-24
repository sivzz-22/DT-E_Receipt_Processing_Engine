import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Auth.jsx';
import Dashboard from './Dashboard.jsx';
import Upload from './Upload.jsx';
import ViewReceipts from './ViewReceipts.jsx';
import Analyze from './Analyze.jsx';
import Notifications from './Notifications.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/view" element={<ViewReceipts />} />0.
        +
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
