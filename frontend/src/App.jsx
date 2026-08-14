import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NewPredictionPage from './pages/user/NewPrediction/NewPredictionPage';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 bg-card shadow-lg rounded-2xl border border-border max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-2">JeevanSetu</h1>
        <p className="text-textSecondary mb-4">
          Cloud-Based Disease Prediction System Using Machine Learning
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary font-medium rounded-full mb-4">
          System Initialized & Ready
        </div>
        <div>
          <Link to="/predict" className="bg-blue-600 text-white px-4 py-2 rounded inline-block">
            Check Your Risk
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<NewPredictionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;