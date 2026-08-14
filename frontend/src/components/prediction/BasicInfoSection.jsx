import React from 'react';

const BasicInfoSection = ({ formData, onChange }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-primary mb-3">Basic Info</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Pregnancies</label>
          <input type="number" name="pregnancies" value={formData.pregnancies}
            onChange={onChange} min="0" max="20"
            className="border rounded p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">Age</label>
          <input type="number" name="age" value={formData.age}
            onChange={onChange} min="1" max="120"
            className="border rounded p-2 w-full" />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;