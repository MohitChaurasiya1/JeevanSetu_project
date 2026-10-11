import React from 'react';

const SYMPTOMS = [
  { id: 'chest_pain', label: 'Chest Pain / Pressure (Angina)', desc: 'Tightness, squeezing, or discomfort in the chest' },
  { id: 'shortness_of_breath', label: 'Shortness of Breath', desc: 'Breathing difficulty during activity or at rest' },
  { id: 'palpitations', label: 'Heart Palpitations', desc: 'Racing, fluttering, or irregular heartbeats' },
  { id: 'pain_arms_jaw_back', label: 'Radiating Pain (Arms/Jaw/Back)', desc: 'Pain spreading to shoulders, neck, jaw, or back' },
  { id: 'cold_sweats_nausea', label: 'Cold Sweats or Nausea', desc: 'Unexplained cold perspiration or sudden nausea' },
  { id: 'dizziness', label: 'Dizziness or Lightheadedness', desc: 'Feeling unsteady or sudden fainting sensation' },
  { id: 'swelling', label: 'Lower Extremity Swelling (Edema)', desc: 'Fluid retention in ankles, legs, or feet' },
  { id: 'fatigue', label: 'Profound Fatigue', desc: 'Unusual, overwhelming exhaustion without exertion' },
];

const RISK_FACTORS = [
  { id: 'high_bp', label: 'High Blood Pressure', desc: 'Diagnosed hypertension or elevated systolic BP' },
  { id: 'high_cholesterol', label: 'High Cholesterol', desc: 'Elevated LDL or triglycerides' },
  { id: 'diabetes', label: 'Diabetes Condition', desc: 'Diagnosed Type 1 or Type 2 diabetes' },
  { id: 'smoking', label: 'Smoking / Tobacco History', desc: 'Current regular smoker or history of smoking' },
  { id: 'obesity', label: 'Obesity / High BMI', desc: 'Significant excess body weight' },
  { id: 'sedentary_lifestyle', label: 'Sedentary Lifestyle', desc: 'Little to no regular physical activity' },
  { id: 'family_history', label: 'Family History of Heart Disease', desc: 'Parents or siblings had early cardiac issues' },
  { id: 'chronic_stress', label: 'High Chronic Stress', desc: 'Persistent psychological tension or anxiety' },
];

const HeartDiseaseInfoSection = ({ formData, onToggle, onValueChange }) => {
  return (
    <div className="space-y-6">
      {/* Demographics */}
      <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
        <h3 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>👤</span> Patient Demographics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Age (Years)
            </label>
            <input
              type="number"
              min="18"
              max="110"
              value={formData.age}
              onChange={(e) => onValueChange('age', Number(e.target.value))}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Biological Sex
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onValueChange('gender', 1.0)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                  formData.gender === 1.0
                    ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => onValueChange('gender', 0.0)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                  formData.gender === 0.0
                    ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                Female
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cardiovascular Symptoms */}
      <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
            <span>❤️</span> Cardiovascular Symptoms
          </h3>
          <span className="text-[11px] text-slate-400">Click to toggle present symptoms</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Select any symptoms experienced recently:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SYMPTOMS.map((item) => {
            const isChecked = formData[item.id] === 1.0;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item.id)}
                className={`p-3 rounded-xl text-left border transition flex items-start gap-3 ${
                  isChecked
                    ? 'bg-rose-950/40 border-rose-500/60 shadow-sm'
                    : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 mt-0.5 border ${
                    isChecked
                      ? 'bg-rose-600 text-white border-rose-500 font-bold'
                      : 'border-slate-600 text-transparent'
                  }`}
                >
                  ✓
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isChecked ? 'text-rose-200' : 'text-slate-200'}`}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clinical Conditions & Lifestyle Factors */}
      <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <span>📋</span> Clinical Conditions & Lifestyle Factors
          </h3>
          <span className="text-[11px] text-slate-400">Select applicable items</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Comorbidities and lifestyle factors contribute heavily to cardiovascular risk:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {RISK_FACTORS.map((item) => {
            const isChecked = formData[item.id] === 1.0;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item.id)}
                className={`p-3 rounded-xl text-left border transition flex items-start gap-3 ${
                  isChecked
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-sm'
                    : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 mt-0.5 border ${
                    isChecked
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'border-slate-600 text-transparent'
                  }`}
                >
                  ✓
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isChecked ? 'text-amber-200' : 'text-slate-200'}`}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeartDiseaseInfoSection;
