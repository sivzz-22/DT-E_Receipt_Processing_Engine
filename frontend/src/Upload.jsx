import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import QrScannerComponent from './QrScanner.jsx';
import './Upload.css';

const categoryOptions = [
  'Groceries',
  'Electronics',
  'Clothing',
  'Utilities',
  'Healthcare',
  'Travel',
  'Other',
];

const Upload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileType, setFileType] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [qrResult, setQrResult] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [saveMessage, setSaveMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setOcrResult('');
      setFileType(file.type);
    }
  };

  const handleExtractText = async () => {
    if (!selectedFile) return;
    if (fileType === 'application/pdf') {
      setOcrResult('OCR for PDF is not supported in this version.');
      return;
    }
    setIsProcessing(true);
    setOcrResult('');
    try {
      const { data: { text } } = await Tesseract.recognize(
        selectedFile,
        'eng',
        { logger: () => {} }
      );
      setOcrResult(text);
    } catch {
      setOcrResult('Error extracting text.');
    }
    setIsProcessing(false);
  };

  const handleSaveReceipt = async () => {
    if (!selectedFile || !category) return;
    setSaveMessage('');
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('extractedText', ocrResult);
    formData.append('qrData', qrResult);
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Authorization': localStorage.getItem('token') },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMessage('Receipt saved successfully!');
        setSelectedFile(null);
        setOcrResult('');
        setQrResult('');
      } else {
        setSaveMessage(data.message || 'Failed to save receipt');
      }
    } catch {
      setSaveMessage('Failed to save receipt');
    }
  };

  return (
    <div className="feature-root">
      <header className="feature-header">
        <h1 className="app-title">E-Receipt Processing Engine</h1>
        <nav className="feature-navbar">
          <button className="back-btn" onClick={() => navigate('/')}>Back to Dashboard</button>
        </nav>
      </header>
      <main className="feature-content">
        <h2>Upload Receipt</h2>
        <p>Here you can scan and upload your receipts for digital storage and analysis.</p>
        <div className="upload-form">
          <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
          <button onClick={handleExtractText} disabled={!selectedFile || isProcessing}>
            {isProcessing ? 'Extracting...' : 'Extract Text'}
          </button>
          <button onClick={() => setShowScanner(true)} style={{ marginLeft: 10 }}>
            Scan QR/Barcode
          </button>
        </div>
        <div style={{ margin: '10px 0' }}>
          <label htmlFor="category-select"><strong>Category:</strong> </label>
          <select
            id="category-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {categoryOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSaveReceipt}
          disabled={!selectedFile || !category || isProcessing}
          style={{ marginBottom: 10 }}
        >
          Save Receipt
        </button>
        {saveMessage && <div style={{ color: saveMessage.includes('success') ? 'green' : 'red', marginBottom: 10 }}>{saveMessage}</div>}
        {showScanner && (
          <div style={{ margin: '20px 0' }}>
            <QrScannerComponent
              onScan={setQrResult}
              onClose={() => setShowScanner(false)}
            />
          </div>
        )}
        {qrResult && (
          <div className="qr-result" style={{ margin: '10px 0', background: '#23272f', color: '#4caf50', padding: 10, borderRadius: 6 }}>
            <strong>Scanned QR/Barcode:</strong>
            <div style={{ wordBreak: 'break-all' }}>{qrResult}</div>
          </div>
        )}
        {selectedFile && (
          <div className="file-preview">
            <h4>File Preview:</h4>
            {fileType.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Receipt"
                style={{ maxWidth: '300px', margin: '10px 0' }}
              />
            ) : fileType === 'application/pdf' ? (
              <>
                <p>{selectedFile.name}</p>
                <embed
                  src={URL.createObjectURL(selectedFile)}
                  type="application/pdf"
                  width="300px"
                  height="400px"
                />
              </>
            ) : (
              <p>Unsupported file type.</p>
            )}
          </div>
        )}
        {ocrResult && (
          <div className="ocr-result">
            <h4>Extracted Text:</h4>
            <pre style={{ whiteSpace: 'pre-wrap', background: '#222', color: '#fff', padding: '10px', borderRadius: '5px' }}>{ocrResult}</pre>
          </div>
        )}
      </main>
      <footer className="feature-footer">
        <span>&copy; {new Date().getFullYear()} E-Receipt Processing Engine. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Upload;
