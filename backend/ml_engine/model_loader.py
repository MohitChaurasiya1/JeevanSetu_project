from pathlib import Path
import pickle
import joblib

class ModelLoader:
    _cached_model = None
    _cached_path = None

    @classmethod
    def load_model(cls, model_path=None):
        if model_path is None:
            base_dir = Path(__file__).resolve().parent
            model_path = base_dir / 'trained_models' / 'model.pkl'
        else:
            model_path = Path(model_path)

        # Return cached model if already loaded
        if cls._cached_model is not None and cls._cached_path == str(model_path):
            return cls._cached_model

        if not model_path.exists():
            raise FileNotFoundError(f"Trained model not found at: {model_path}")

        try:
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
        except Exception:
            # Fallback to joblib if pickle fails
            model = joblib.load(model_path)

        cls._cached_model = model
        cls._cached_path = str(model_path)
        return model
