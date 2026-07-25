import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 bg-card shadow-lg rounded-2xl border border-border max-w-lg">
        <h1 className="text-3xl font-bold text-primary mb-2">JeevanSetu</h1>
        <p className="text-textSecondary mb-4">
          Cloud-Based Disease Prediction System Using Machine Learning
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary font-medium rounded-full text-sm">
          System Initialized & Ready
        </div>
      </div>
    </div>
  );
}

export default App;
