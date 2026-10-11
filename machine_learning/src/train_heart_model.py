import os
import sys
import json
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import joblib

def main():
    print("=" * 60)
    print("Training Heart Disease Risk Prediction Model")
    print("=" * 60)

    # 1. Locate dataset
    data_path = Path("machine_learning/data/heart_disease_risk_dataset_earlymed.csv")
    if not data_path.exists():
        data_path = Path("C:/Users/Lenovo/Downloads/heart_disease_risk_dataset_earlymed.csv")
    
    print(f"Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    print(f"Dataset shape: {df.shape}")

    # 2. Features and target
    target_col = "Heart_Risk"
    feature_cols = [c for c in df.columns if c != target_col]
    
    X = df[feature_cols]
    y = df[target_col].astype(int)

    print(f"Features ({len(feature_cols)}): {feature_cols}")
    print(f"Target distribution:\n{y.value_counts(normalize=True)}")

    # 3. Train-test split (80-20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Train samples: {len(X_train)}, Test samples: {len(X_test)}")

    # 4. Train RandomForest Classifier
    print("Training Random Forest Classifier (100 estimators, max_depth=12)...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        min_samples_split=10,
        min_samples_leaf=5,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # 5. Evaluate
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_proba)
    cm = confusion_matrix(y_test, y_pred).tolist()

    print("\n--- Model Evaluation Results ---")
    print(f"Accuracy:  {acc * 100:.2f}%")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall:    {rec * 100:.2f}%")
    print(f"F1-Score:  {f1 * 100:.2f}%")
    print(f"ROC-AUC:   {auc * 100:.2f}%")
    print(f"Confusion Matrix: {cm}")

    # Feature importances
    importances = dict(zip(feature_cols, model.feature_importances_.round(4).tolist()))
    sorted_importances = dict(sorted(importances.items(), key=lambda item: item[1], reverse=True))
    print(f"\nTop 5 Feature Importances:\n{list(sorted_importances.items())[:5]}")

    # 6. Save model to backend and machine_learning models dirs
    backend_model_dir = Path("backend/ml_engine/trained_models")
    backend_model_dir.mkdir(parents=True, exist_ok=True)
    backend_model_path = backend_model_dir / "heart_disease_model.pkl"
    
    ml_models_dir = Path("machine_learning/models")
    ml_models_dir.mkdir(parents=True, exist_ok=True)
    ml_model_path = ml_models_dir / "heart_disease_model.pkl"

    joblib.dump(model, backend_model_path)
    joblib.dump(model, ml_model_path)
    print(f"\nSaved trained model to:\n  - {backend_model_path}\n  - {ml_model_path}")

    # 7. Save metadata
    metadata = {
        "engine_version": "2.0.0",
        "supported_diseases": ["Diabetes", "Heart Disease"],
        "heart_disease_model": {
            "model_type": "RandomForestClassifier",
            "n_estimators": 100,
            "max_depth": 12,
            "training_samples": len(X_train),
            "test_samples": len(X_test),
            "features": feature_cols,
            "metrics": {
                "accuracy": round(acc, 4),
                "precision": round(prec, 4),
                "recall": round(rec, 4),
                "f1_score": round(f1, 4),
                "roc_auc": round(auc, 4),
                "confusion_matrix": cm
            },
            "feature_importances": sorted_importances
        }
    }

    metadata_path = Path("backend/ml_engine/model_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved updated metadata to: {metadata_path}")
    print("\nTraining completed successfully!")

if __name__ == "__main__":
    main()
