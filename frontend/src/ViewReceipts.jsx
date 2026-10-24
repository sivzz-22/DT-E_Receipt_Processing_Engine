import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewReceipts.css';

const ViewReceipts = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function fetchReceipts() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/receipts', {
          headers: { 'Authorization': localStorage.getItem('token') },
        });
        const data = await res.json();
        if (res.ok) setReceipts(data.receipts);
        else setError(data.message || 'Failed to fetch receipts');
      } catch {
        setError('Failed to fetch receipts');
      }
      setLoading(false);
    }
    fetchReceipts();
  }, []);

  const categories = ['All', ...Array.from(new Set(receipts.map(r => r.category)))];
  const filteredReceipts = filter === 'All' ? receipts : receipts.filter(r => r.category === filter);

  return (
    <div className="feature-root">
      <header className="feature-header">
        <h1 className="app-title">E-Receipt Processing Engine</h1>
        <nav className="feature-navbar">
          <button className="back-btn" onClick={() => navigate('/')}>Back to Dashboard</button>
        </nav>
      </header>
      <main className="feature-content">
        <h2>View Receipts</h2>
        <p>Here you can organize, search, and manage all your uploaded receipts.</p>
        <div style={{ margin: '10px 0' }}>
          <label htmlFor="category-filter"><strong>Filter by Category:</strong> </label>
          <select
            id="category-filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {categories.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div>Loading receipts...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : filteredReceipts.length === 0 ? (
          <div className="view-placeholder">No receipts found.</div>
        ) : (
          <div style={{ width: '100%' }}>
            {filteredReceipts.map(receipt => (
              <div key={receipt._id} style={{ background: '#23272f', color: '#fff', borderRadius: 8, margin: '10px 0', padding: 16 }}>
                <div><strong>Category:</strong> {receipt.category}</div>
                <div><strong>Date:</strong> {new Date(receipt.date).toLocaleString()}</div>
                <div><strong>File:</strong> {receipt.fileName}</div>
                {receipt.fileUrl && (
                  <div style={{ margin: '8px 0' }}>
                    <a href={`/${receipt.fileUrl.replace('backend', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#4caf50' }}>View File</a>
                  </div>
                )}
                {receipt.qrData && (
                  <div><strong>QR/Barcode:</strong> <span style={{ color: '#4caf50' }}>{receipt.qrData}</span></div>
                )}
                {receipt.extractedText && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Extracted Text:</strong>
                    <pre style={{ background: '#181818', color: '#bdbdbd', padding: 8, borderRadius: 4, whiteSpace: 'pre-wrap' }}>{receipt.extractedText}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="feature-footer">
        <span>&copy; {new Date().getFullYear()} E-Receipt Processing Engine. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default ViewReceipts;
