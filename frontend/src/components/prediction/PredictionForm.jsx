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
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", formData);
      setResult(response.data);
    } catch (error) {
      setResult({ risk: "Error: backend se connect nahi ho paya", prediction: null });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">JeevanSetu - Disease Prediction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <BasicInfoSection formData={formData} onChange={handleChange} />
        <MedicalInfoSection formData={formData} onChange={handleChange} />
        <button type="submit" disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>
      <PredictionResultCard result={result} />
    </div>
  );
};

export default PredictionForm;