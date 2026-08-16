import { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const SEVERITY_STYLE = {
  Critical: { bg: '#fff1f2', border: '#fda4af', badge: '#e11d48', text: '#9f1239' },
  High:     { bg: '#fff7ed', border: '#fdba74', badge: '#ea580c', text: '#9a3412' },
  Moderate: { bg: '#fefce8', border: '#fde047', badge: '#ca8a04', text: '#854d0e' },
  Low:      { bg: '#f0fdf4', border: '#86efac', badge: '#16a34a', text: '#14532d' },
};

export default function App() {
  const [image, setImage]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    if (!['image/jpeg','image/jpg','image/png'].includes(file.type)) {
      setError('Please upload a JPG or PNG image only.'); return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.'); return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!image || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const fd = new FormData();
    fd.append('file', image);
    try {
      const res = await axios.post(`${API_URL}/predict`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      setResult(res.data);
    } catch (err) {
      if (err.response)        setError(err.response.data?.detail || 'Server error. Please try again.');
      else if (err.code === 'ECONNABORTED') setError('Request timed out. Server may be starting up — wait 30s and retry.');
      else                     setError('Cannot connect to server. Make sure backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null); setPreview(null);
    setResult(null); setError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const sty = result ? (SEVERITY_STYLE[result.severity] || SEVERITY_STYLE.Low) : null;

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🔬</span>
            <div>
              <div className="logo-title">SkinAI</div>
              <div className="logo-sub">Skin Disease Detection System</div>
            </div>
          </div>
          <div className="header-badge">Final Year Project · B.Tech IT · KKWIEER</div>
        </div>
      </header>

      <main className="main">
        {/* ── Disclaimer ── */}
        <div className="disclaimer-banner">
          ⚠️ <strong>Educational Use Only:</strong> This AI tool does not replace professional
          medical advice. Always consult a certified dermatologist for diagnosis and treatment.
        </div>

        {/* ── Upload Card (hidden after result) ── */}
        {!result && (
          <div className="card upload-card">
            <h2 className="card-title">Upload Skin Image</h2>
            <p className="card-subtitle">
              Upload a clear, close-up photo of the skin lesion for AI analysis across 7 disease types.
            </p>

            {/* Drop zone */}
            <div
              className={`dropzone ${dragOver ? 'dragover' : ''} ${preview ? 'has-preview' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="preview-img" />
              ) : (
                <div className="dropzone-placeholder">
                  <div className="dropzone-icon">📁</div>
                  <div className="dropzone-text">Click to upload or drag & drop</div>
                  <div className="dropzone-hint">JPG or PNG — max 10MB</div>
                </div>
              )}
            </div>

            <input
              ref={fileRef} type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => handleFile(e.target.files[0])}
              style={{ display: 'none' }}
            />

            {/* Tips */}
            <div className="tips-box">
              <strong>📷 Tips for best accuracy:</strong> Use a well-lit, in-focus, close-up
              photo of the lesion. Avoid blurry or very dark images.
            </div>

            {/* Error */}
            {error && <div className="error-box">❌ {error}</div>}

            {/* Buttons */}
            <div className="btn-row">
              <button
                className={`btn btn-primary ${(!image || loading) ? 'disabled' : ''}`}
                onClick={handleAnalyze}
                disabled={!image || loading}
              >
                {loading ? <><span className="spinner" /> Analyzing...</> : '🔬 Analyze Image'}
              </button>
              {image && (
                <button className="btn btn-secondary" onClick={handleReset}>✕ Clear</button>
              )}
            </div>

            {/* Loading message */}
            {loading && (
              <div className="loading-msg">
                Running AI analysis — this may take 15–30 seconds on first run...
              </div>
            )}
          </div>
        )}

        {/* ── Results ── */}
        {result && (
          <div className="results">
            {/* Disease header card */}
            <div className="card result-header" style={{ background: sty.bg, borderColor: sty.border }}>
              <div className="result-top">
                <div>
                  <h2 className="disease-name">{result.predicted_disease}</h2>
                  <span className="severity-badge" style={{ background: sty.badge }}>
                    {result.severity} Severity
                  </span>
                </div>
                <div className="confidence-box">
                  <div className="confidence-pct" style={{ color: sty.badge }}>
                    {result.confidence}%
                  </div>
                  <div className="confidence-label">Confidence</div>
                </div>
              </div>

              {/* Low confidence warning */}
              {result.confidence_note && (
                <div className="confidence-warning">⚡ {result.confidence_note}</div>
              )}

              <p className="disease-desc">{result.description}</p>

              <div className="urgency-box" style={{ borderColor: sty.border, color: sty.text }}>
                🚨 <strong>Action Required:</strong> {result.urgency}
              </div>
            </div>

            {/* Do's and Don'ts */}
            <div className="card-row">
              <div className="card dos-card">
                <h3 className="dos-title">✅ Do's</h3>
                <ul className="advice-list">
                  {result.dos.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
              <div className="card donts-card">
                <h3 className="donts-title">❌ Don'ts</h3>
                <ul className="advice-list">
                  {result.donts.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            </div>

            {/* Specialist + OTC */}
            <div className="card-row">
              <div className="card info-card">
                <div className="info-label">👨‍⚕️ Recommended Specialist</div>
                <div className="info-value">{result.specialist}</div>
              </div>
              <div className="card info-card">
                <div className="info-label">💊 OTC / Self-care</div>
                <div className="info-value">{result.otc_note}</div>
              </div>
            </div>

            {/* Top 3 predictions */}
            <div className="card">
              <h3 className="section-title">Top 3 Predictions</h3>
              <div className="top3-list">
                {result.top3_predictions.map((p, i) => (
                  <div key={i} className="top3-row">
                    <span className="top3-rank">{i + 1}</span>
                    <span className="top3-name">{p.disease}</span>
                    <div className="top3-bar-wrap">
                      <div
                        className="top3-bar"
                        style={{
                          width: `${Math.min(p.confidence, 100)}%`,
                          background: i === 0 ? sty.badge : '#94a3b8'
                        }}
                      />
                    </div>
                    <span className="top3-pct">{p.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image + Analyze again */}
            <div className="card result-footer">
              {preview && (
                <img src={preview} alt="Uploaded" className="result-thumb" />
              )}
              <div className="result-footer-info">
                <div className="result-filename">{image?.name}</div>
                <div className="disclaimer-text">⚠️ {result.disclaimer}</div>
              </div>
              <button className="btn btn-primary" onClick={handleReset}>
                + Analyze Another
              </button>
            </div>
          </div>
        )}

        {/* ── How it works ── */}
        {!result && !loading && (
          <div className="card how-it-works">
            <h3 className="section-title">How It Works</h3>
            <div className="steps-row">
              {[
                { icon: '📤', step: '1', title: 'Upload Image', desc: 'Upload a clear photo of the skin lesion (JPG or PNG)' },
                { icon: '🤖', step: '2', title: 'AI Analysis',  desc: 'MobileNetV2 model trained on 10,015 HAM10000 images analyzes it' },
                { icon: '📋', step: '3', title: 'Get Results',  desc: 'Receive disease prediction, confidence score, and recommendations' },
              ].map((s) => (
                <div key={s.step} className="step-item">
                  <div className="step-icon">{s.icon}</div>
                  <div className="step-num">Step {s.step}</div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="disease-tags">
              <div className="disease-tags-label">Detects 7 skin conditions:</div>
              {['Melanoma','Nevus','Basal Cell Carcinoma','Actinic Keratosis',
                'Benign Keratosis','Dermatofibroma','Vascular Lesion'].map(d => (
                <span key={d} className="disease-tag">{d}</span>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        Final Year Project — B.Tech Information Technology · KKWIEER, Nashik · 2025–26
      </footer>
    </div>
  );
}
