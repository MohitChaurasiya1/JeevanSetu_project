from pathlib import Path
import pickle
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class PatientData(BaseModel):
    pregnancies: int
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    dpf: float
    age: int

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "ml_engine" / "trained_models" / "model.pkl"

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

app = FastAPI(title="JeevanSetu API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "JeevanSetu API is running"}

@app.post("/predict")
def predict(data: PatientData):
    input_data = np.array([[
        data.pregnancies, data.glucose, data.blood_pressure,
        data.skin_thickness, data.insulin, data.bmi,
        data.dpf, data.age
    ]])
    prediction = model.predict(input_data)
    risk = "High Risk of Diabetes" if prediction[0] == 1 else "Low Risk of Diabetes"
    return {"prediction": int(prediction[0]), "risk": risk}