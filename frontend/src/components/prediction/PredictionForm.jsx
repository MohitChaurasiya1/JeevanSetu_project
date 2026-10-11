import React, { useState } from 'react';
import MedicalInfoSection from './MedicalInfoSection';
import HeartDiseaseInfoSection from './HeartDiseaseInfoSection';
import PredictionResultCard from './PredictionResultCard';
import predictionApi from '../../api/predictionApi';

const DEFAULT_DIABETES = {
  pregnancies: 0,
  glucose: 100,
  blood_pressure: 70,
  skin_thickness: 20,
  insulin: 80,
  bmi: 25,
  dpf: 0.5,
  age: 30,
};

const DEFAULT_HEART = {
  age: 50,
  gender: 1.0,
  chest_pain: 0.0,
  shortness_of_breath: 0.0,
  fatigue: 0.0,
  palpitations: 0.0,
  dizziness: 0.0,
  swelling: 0.0,
  pain_arms_jaw_back: 0.0,
  cold_sweats_nausea: 0.0,
  high_bp: 0.0,
  high_cholesterol: 0.0,
  diabetes: 0.0,
  smoking: 0.0,
  obesity: 0.0,
  sedentary_lifestyle: 0.0,
  family_history: 0.0,
  chronic_stress: 0.0,
};

const PredictionForm = () => {
  const [selectedDisease, setSelectedDisease] = useState('heart'); // 'heart' | 'diabetes'
  const [diabetesData, setDiabetesData] = useState(DEFAULT_DIABETES);
  const [heartData, setHeartData] = useState(DEFAULT_HEART);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Diabetes input change
  const handleDiabetesChange = (e) => {
    setDiabetesData({ ...diabetesData, [e.target.name]: Number(e.target.value) });
  };

  // Heart input toggle
  const handleHeartToggle = (field) => {
    setHeartData((prev) => ({
      ...prev,
      [field]: prev[field] === 1.0 ? 0.0 : 1.0,
    }));
  };

  // Heart input numeric change
  const handleHeartValueChange = (field, val) => {
    setHeartData((prev) => ({ ...prev, [field]: val }));
  };

  const handleDiseaseTabChange = (disease) => {
    setSelectedDisease(disease);
    setResult(null);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMessage('');

    try {
      let payload;
      if (selectedDisease === 'heart') {
        payload = {
          disease: 'Heart Disease',
          ...heartData,
        };
      } else {
        payload = {
          disease: 'Diabetes',
          ...diabetesData,
        };
      }

      const data = await predictionApi.predict(payload);
      setResult(data);
    } catch (error) {
      console.error('Prediction request failed:', error);
      const serverMsg =
        error.response?.data?.error ||
        (typeof error.response?.data === 'object'
          ? Object.values(error.response.data).flat()[0]
          : null);

      setErrorMessage(
        serverMsg || 'Unable to connect to the prediction service. Please ensure the backend is running and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #090e17 0%, #0d1e2b 40%, #0c2622 100%)',
        fontFamily: "'Inter', sans-serif",
        padding: '2.5rem 1rem',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(20,184,166,0.12)',
            border: '1px solid rgba(20,184,166,0.3)',
            borderRadius: '50px',
            padding: '0.4rem 1.2rem',
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: '#14B8A6',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            🧬 AI Clinical Assessment Engine
          </span>
        </div>
        <h1
          style={{
            fontSize: '2.6rem',
            fontWeight: 800,
            margin: '0 0 0.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #2dd4bf 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          JeevanSetu
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: 0 }}>
          Multimodal Disease Risk Prediction & Clinical Stratification
        </p>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Disease Mode Selection Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg">
          <button
            type="button"
            onClick={() => handleDiseaseTabChange('heart')}
            className={`py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
              selectedDisease === 'heart'
                ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-base">❤️</span>
            <span>Heart Disease Risk</span>
            <span className="text-[10px] uppercase tracking-wider bg-rose-950/60 text-rose-200 px-1.5 py-0.5 rounded border border-rose-400/30">
              99.1% Acc
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDiseaseTabChange('diabetes')}
            className={`py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
              selectedDisease === 'diabetes'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-base">🩸</span>
            <span>Diabetes Risk</span>
          </button>
        </div>

        {/* Prediction Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {selectedDisease === 'heart' ? (
            <HeartDiseaseInfoSection
              formData={heartData}
              onToggle={handleHeartToggle}
              onValueChange={handleHeartValueChange}
            />
          ) : (
            <MedicalInfoSection formData={diabetesData} onChange={handleDiabetesChange} />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1.1rem 2rem',
              background: loading
                ? 'rgba(15,118,110,0.4)'
                : selectedDisease === 'heart'
                ? 'linear-gradient(135deg, #e11d48, #be123c)'
                : 'linear-gradient(135deg, #0F766E, #14B8A6)',
              border: 'none',
              borderRadius: '16px',
              color: '#fff',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow:
                loading
                  ? 'none'
                  : selectedDisease === 'heart'
                  ? '0 8px 30px rgba(225,29,72,0.35)'
                  : '0 8px 30px rgba(20,184,166,0.35)',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    display: 'inline-block',
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Evaluating Clinical Risk...
              </>
            ) : selectedDisease === 'heart' ? (
              '❤️ Assess Heart Disease Risk'
            ) : (
              '🔬 Assess Diabetes Risk'
            )}
          </button>
        </form>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-sm text-center">
            {errorMessage}
          </div>
        )}

        {/* Result Card */}
        {result && <PredictionResultCard result={result} />}
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