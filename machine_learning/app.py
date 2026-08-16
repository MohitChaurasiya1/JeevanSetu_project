import os
from pathlib import Path

import streamlit as st
import pickle
import numpy as np

# Model load karo
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / 'models' / 'model.pkl'
model = None
try:
    with open(MODEL_PATH, 'rb') as file:
        model = pickle.load(file)
except Exception as e:
    # Defer a helpful message to the Streamlit UI instead of crashing at import time
    model = None
    # If Streamlit isn't running yet, printing helps debugging in logs
    print(f"Could not load model from {MODEL_PATH}: {e}")

st.title("JeevanSetu - Disease Prediction System")
st.write("Apni health details daal ke diabetes risk check karo")

# Input fields
pregnancies = st.number_input("Pregnancies", min_value=0, max_value=20, value=0)
glucose = st.number_input("Glucose Level", min_value=0, max_value=300, value=100)
blood_pressure = st.number_input("Blood Pressure", min_value=0, max_value=200, value=70)
skin_thickness = st.number_input("Skin Thickness", min_value=0, max_value=100, value=20)
insulin = st.number_input("Insulin", min_value=0, max_value=900, value=80)
bmi = st.number_input("BMI", min_value=0.0, max_value=70.0, value=25.0)
dpf = st.number_input("Diabetes Pedigree Function", min_value=0.0, max_value=3.0, value=0.5)
age = st.number_input("Age", min_value=1, max_value=120, value=30)

if st.button("Predict"):
    if model is None:
        st.error("Model not loaded. Please ensure 'models/model.pkl' exists and is a valid pickle file.")
    else:
        input_data = np.array([[pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, dpf, age]])
        prediction = model.predict(input_data)

        if prediction[0] == 1:
            st.error("High Risk of Diabetes")
        else:
            st.success("Low Risk of Diabetes")