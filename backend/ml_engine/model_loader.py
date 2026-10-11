from pathlib import Path
import pickle
import joblib

class ModelLoader:
    _models = {}

    @classmethod
    def load_model(cls, model_path=None):
        base_dir = Path(__file__).resolve().parent
        if model_path is None or str(model_path).lower() in ('diabetes', 'default'):
            model_path = base_dir / 'trained_models' / 'model.pkl'
        elif str(model_path).lower() in ('heart', 'heart_disease', 'heart disease'):
            model_path = base_dir / 'trained_models' / 'heart_disease_model.pkl'
        else:
            model_path = Path(model_path)

        path_str = str(model_path)
        if path_str in cls._models:
            return cls._models[path_str]

        if not model_path.exists():
            raise FileNotFoundError(f"Trained model not found at: {model_path}")

        try:
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
        except Exception:
            model = joblib.load(model_path)

        cls._models[path_str] = model
        return model

