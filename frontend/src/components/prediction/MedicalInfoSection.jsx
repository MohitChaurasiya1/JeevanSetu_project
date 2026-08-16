import React from 'react';

const fields = [
  { name: "glucose", label: "Glucose Level", min: 0, max: 300 },
  { name: "blood_pressure", label: "Blood Pressure", min: 0, max: 200 },
  { name: "skin_thickness", label: "Skin Thickness", min: 0, max: 100 },
  { name: "insulin", label: "Insulin", min: 0, max: 900 },
  { name: "bmi", label: "BMI", min: 0, max: 70, step: "0.1" },
  { name: "dpf", label: "Diabetes Pedigree Function", min: 0, max: 3, step: "0.01" },
];

const MedicalInfoSection = ({ formData, onChange }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-primary mb-3">Medical Info</h3>
      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm mb-1">{f.label}</label>
            <input type="number" name={f.name} value={formData[f.name]}
              onChange={onChange} min={f.min} max={f.max} step={f.step || "any"}
              className="border rounded p-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalInfoSection;