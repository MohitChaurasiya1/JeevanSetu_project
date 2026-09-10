import numpy as np
import pandas as pd
from .model_loader import ModelLoader

class DiseasePredictor:
    FEATURE_NAMES = [
        'Pregnancies',
        'Glucose',
        'BloodPressure',
        'SkinThickness',
        'Insulin',
        'BMI',
        'DiabetesPedigreeFunction',
        'Age'
    ]

    FIELD_MAPPING = {
        'pregnancies': 'Pregnancies',
        'glucose': 'Glucose',
        'blood_pressure': 'BloodPressure',
        'skin_thickness': 'SkinThickness',
        'insulin': 'Insulin',
        'bmi': 'BMI',
        'dpf': 'DiabetesPedigreeFunction',
        'diabetes_pedigree_function': 'DiabetesPedigreeFunction',
        'age': 'Age',
    }

    @classmethod
    def predict(cls, features):
        """
        Accepts a dict containing medical features, extracts them in the exact
        model order, runs the trained ML model, and returns a consistent result dictionary.
        """
        model = ModelLoader.load_model()

        # Map input keys to standard model feature names
        cleaned_features = {}
        for k, v in features.items():
            mapped_key = cls.FIELD_MAPPING.get(k.lower(), k)
            cleaned_features[mapped_key] = v

        # Construct DataFrame with exact column names and expected ordering
        row = {}
        for feature_name in cls.FEATURE_NAMES:
            if feature_name not in cleaned_features:
                raise ValueError(f"Missing required feature: '{feature_name}'")
            try:
                row[feature_name] = [float(cleaned_features[feature_name])]
            except (ValueError, TypeError):
                raise ValueError(f"Invalid numeric value for '{feature_name}': {cleaned_features[feature_name]}")

        input_df = pd.DataFrame(row)

        # Run prediction
        raw_prediction = model.predict(input_df)[0]
        prediction_val = int(raw_prediction)

        # Calculate probability if model supports it
        probability = 0.0
        if hasattr(model, 'predict_proba'):
            proba_arr = model.predict_proba(input_df)[0]
            # Index 1 corresponds to high risk (positive class), or max probability
            if len(proba_arr) > 1:
                probability = float(proba_arr[1])
            else:
                probability = float(proba_arr[0])

        is_high = (prediction_val == 1)
        risk_level = "HIGH" if is_high else "LOW"
        risk_text = "High Risk of Diabetes" if is_high else "Low Risk of Diabetes"

        return {
            "prediction": prediction_val,
            "probability": round(probability, 4),
            "risk_level": risk_level,
            "risk": risk_text,
            "disease": "Diabetes",
        }
