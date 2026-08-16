import React, { useState } from 'react';
import axios from 'axios';
import BasicInfoSection from './BasicInfoSection';
import MedicalInfoSection from './MedicalInfoSection';
import PredictionResultCard from './PredictionResultCard';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    pregnancies: 0, glucose: 100, blood_pressure: 70,
    skin_thickness: 20, insulin: 80, bmi: 25, dpf: 0.5, age: 30,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post("https://jeevansetu-project.onrender.com/predict", formData);
      setResult(response.data);
    } catch (error) {
      setResult({ risk: "Backend se connect nahi ho paya. Please try again.", prediction: null });
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #0d2137 40%, #0f2d2a 100%)',
      fontFamily: "'Inter', sans-serif",
      padding: '2rem 1rem',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
          background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.3)',
          borderRadius: '50px', padding: '0.4rem 1.2rem', marginBottom: '1rem',
        }}>
          <span style={{ fontSize: '0.75rem', color: '#14B8A6', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            🧬 AI-Powered Analysis
          </span>
        </div>
        <h1 style={{
          fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #14B8A6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>JeevanSetu</h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
          Disease Risk Prediction System
        </p>
      </div>

      {/* Form Card */}
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <BasicInfoSection formData={formData} onChange={handleChange} />
          <MedicalInfoSection formData={formData} onChange={handleChange} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '1rem 2rem',
              background: loading
                ? 'rgba(15,118,110,0.4)'
                : 'linear-gradient(135deg, #0F766E, #14B8A6)',
              border: 'none', borderRadius: '14px',
              color: '#fff', fontSize: '1.05rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 8px 30px rgba(20,184,166,0.35)',
              letterSpacing: '0.02em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
          >
            {loading ? (
              <>
                <span style={{
                  display: 'inline-block', width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}/>
                Analyzing...
              </>
            ) : '🔬 Run Prediction'}
          </button>
        </form>

        {/* Result */}
        {result && <div style={{ marginTop: '1.5rem' }}><PredictionResultCard result={result} /></div>}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 1; }
        input:focus { outline: none !important; }
      `}</style>
    </div>
  );
};

export default PredictionForm;