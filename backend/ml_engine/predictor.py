import numpy as np
import pandas as pd
from .model_loader import ModelLoader

class DiseasePredictor:
    # ---------------- Diabetes Definitions ----------------
    DIABETES_FEATURE_NAMES = [
        'Pregnancies',
        'Glucose',
        'BloodPressure',
        'SkinThickness',
        'Insulin',
        'BMI',
        'DiabetesPedigreeFunction',
        'Age'
    ]

    DIABETES_FIELD_MAPPING = {
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

    # ---------------- Heart Disease Definitions ----------------
    HEART_FEATURE_NAMES = [
        'Chest_Pain',
        'Shortness_of_Breath',
        'Fatigue',
        'Palpitations',
        'Dizziness',
        'Swelling',
        'Pain_Arms_Jaw_Back',
        'Cold_Sweats_Nausea',
        'High_BP',
        'High_Cholesterol',
        'Diabetes',
        'Smoking',
        'Obesity',
        'Sedentary_Lifestyle',
        'Family_History',
        'Chronic_Stress',
        'Gender',
        'Age'
    ]

    HEART_FIELD_MAPPING = {
        'chest_pain': 'Chest_Pain',
        'shortness_of_breath': 'Shortness_of_Breath',
        'fatigue': 'Fatigue',
        'palpitations': 'Palpitations',
        'dizziness': 'Dizziness',
        'swelling': 'Swelling',
        'pain_arms_jaw_back': 'Pain_Arms_Jaw_Back',
        'cold_sweats_nausea': 'Cold_Sweats_Nausea',
        'high_bp': 'High_BP',
        'high_cholesterol': 'High_Cholesterol',
        'diabetes': 'Diabetes',
        'smoking': 'Smoking',
        'obesity': 'Obesity',
        'sedentary_lifestyle': 'Sedentary_Lifestyle',
        'family_history': 'Family_History',
        'chronic_stress': 'Chronic_Stress',
        'gender': 'Gender',
        'age': 'Age',
    }

    @classmethod
    def predict(cls, features, disease=None):
        """
        Dispatches to appropriate predictor based on disease argument
        or autodetects based on supplied feature keys.
        """
        target_disease = (disease or features.get('disease') or '').lower()

        # Check explicit disease flag
        if 'heart' in target_disease:
            return cls.predict_heart_disease(features)
        elif 'diabet' in target_disease:
            return cls.predict_diabetes(features)

        # Autodetect: if heart-specific keys present, run heart predictor
        heart_keys = {'chest_pain', 'shortness_of_breath', 'palpitations', 'high_bp', 'high_cholesterol'}
        feature_keys = {str(k).lower() for k in features.keys()}
        if feature_keys.intersection(heart_keys):
            return cls.predict_heart_disease(features)

        # Default fallback: Diabetes predictor
        return cls.predict_diabetes(features)

    @classmethod
    def predict_diabetes(cls, features):
        model = ModelLoader.load_model('diabetes')

        cleaned_features = {}
        for k, v in features.items():
            mapped_key = cls.DIABETES_FIELD_MAPPING.get(k.lower(), k)
            cleaned_features[mapped_key] = v

        row = {}
        for feature_name in cls.DIABETES_FEATURE_NAMES:
            if feature_name not in cleaned_features:
                raise ValueError(f"Missing required feature for Diabetes: '{feature_name}'")
            try:
                row[feature_name] = [float(cleaned_features[feature_name])]
            except (ValueError, TypeError):
                raise ValueError(f"Invalid numeric value for '{feature_name}': {cleaned_features[feature_name]}")

        input_df = pd.DataFrame(row)
        raw_prediction = model.predict(input_df)[0]
        prediction_val = int(raw_prediction)

        probability = 0.0
        if hasattr(model, 'predict_proba'):
            proba_arr = model.predict_proba(input_df)[0]
            probability = float(proba_arr[1]) if len(proba_arr) > 1 else float(proba_arr[0])

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

    @classmethod
    def predict_heart_disease(cls, features):
        model = ModelLoader.load_model('heart')

        cleaned_features = {}
        for k, v in features.items():
            mapped_key = cls.HEART_FIELD_MAPPING.get(k.lower(), k)
            cleaned_features[mapped_key] = v

        row = {}
        contributing_factors = []
        for feature_name in cls.HEART_FEATURE_NAMES:
            if feature_name not in cleaned_features:
                # Default binary indicators to 0.0 if omitted, except age
                if feature_name == 'Age':
                    val = 45.0
                elif feature_name == 'Gender':
                    val = 1.0
                else:
                    val = 0.0
            else:
                try:
                    val = float(cleaned_features[feature_name])
                except (ValueError, TypeError):
                    raise ValueError(f"Invalid numeric value for '{feature_name}': {cleaned_features[feature_name]}")

            row[feature_name] = [val]
            if val == 1.0 and feature_name not in ('Gender', 'Age'):
                contributing_factors.append(feature_name.replace('_', ' '))

        input_df = pd.DataFrame(row)
        raw_prediction = model.predict(input_df)[0]
        prediction_val = int(raw_prediction)

        probability = 0.0
        if hasattr(model, 'predict_proba'):
            proba_arr = model.predict_proba(input_df)[0]
            probability = float(proba_arr[1]) if len(proba_arr) > 1 else float(proba_arr[0])

        # Granular clinical risk categorization
        if probability >= 0.65 or prediction_val == 1:
            risk_level = "HIGH"
            risk_text = "High Risk of Heart Disease"
        elif probability >= 0.35:
            risk_level = "MODERATE"
            risk_text = "Moderate Risk of Heart Disease"
        else:
            risk_level = "LOW"
            risk_text = "Low Risk of Heart Disease"

        # Tailored clinical guidance
        recommendations = []
        if 'High BP' in contributing_factors:
            recommendations.append("Monitor blood pressure daily and maintain sodium intake below 2,000 mg/day.")
        if 'High Cholesterol' in contributing_factors:
            recommendations.append("Undergo a comprehensive fasting lipid panel test; reduce saturated and trans fats.")
        if 'Chest Pain' in contributing_factors or 'Shortness of Breath' in contributing_factors:
            recommendations.append("Schedule an urgent clinical evaluation with a cardiologist (ECG and Echocardiogram recommended).")
        if 'Smoking' in contributing_factors:
            recommendations.append("Enroll in a tobacco cessation program to immediately improve arterial elasticity.")
        if not recommendations:
            recommendations.append("Maintain an active lifestyle, balanced heart-healthy nutrition, and schedule annual wellness screenings.")

        return {
            "prediction": prediction_val,
            "probability": round(probability, 4),
            "risk_level": risk_level,
            "risk": risk_text,
            "disease": "Heart Disease",
            "contributing_factors": contributing_factors,
            "recommendations": recommendations,
        }
