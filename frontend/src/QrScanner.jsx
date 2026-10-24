// QrScanner.jsx
// React component for QR/Barcode scanning using react-qr-barcode-scanner
// To use: npm install react-qr-barcode-scanner

import React, { useState } from 'react';
import QrScanner from 'react-qr-barcode-scanner';

const QrScannerComponent = ({ onScan, onClose }) => {
  const [error, setError] = useState('');

  const handleScan = (result) => {
    if (result) {
      onScan(result.text || result);
      onClose();
    }
  };

  const handleError = (err) => {
    setError('Camera error: ' + err.message);
  };

  return (
    <div style={{ background: '#181818', padding: 20, borderRadius: 8, color: '#fff' }}>
      <h3>Scan QR/Barcode</h3>
      <button onClick={onClose} style={{ marginBottom: 10 }}>Close</button>
      <QrScanner
        onUpdate={(err, result) => {
          if (result) handleScan(result);
          if (err) handleError(err);
        }}
        style={{ width: '100%' }}
      />
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
};

export default QrScannerComponent;
