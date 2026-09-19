import os
import sys
from pathlib import Path

# Add backend directory to sys.path so config is importable
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', os.getenv('DJANGO_SETTINGS_MODULE', 'config.settings.development'))
django.setup()

from diseases.models import Disease, Symptom

def seed_diseases():
    diabetes_defaults = {
        'description': (
            'Diabetes is a chronic metabolic condition characterized by high blood glucose levels over a prolonged period. '
            'It occurs when the pancreas produces little or no insulin, or when the body cannot effectively utilize the insulin it produces.'
        ),
        'precautions': (
            '1. Maintain a balanced, low-glycemic diet rich in whole grains and vegetables.\n'
            '2. Engage in at least 30 minutes of moderate aerobic exercise daily.\n'
            '3. Monitor blood glucose levels regularly.\n'
            '4. Stay hydrated and avoid sugary drinks and ultra-processed foods.\n'
            '5. Undergo routine medical checkups and foot/eye exams.'
        ),
        'recommended_specialist': 'Endocrinologist / Diabetologist',
        'risk_message': (
            'Clinical validation advised: An elevated risk score indicates significant metabolic indicators of diabetes. '
            'Please consult a licensed physician or endocrinologist for confirmation and individualized clinical guidance.'
        ),
        'is_active': True,
    }

    disease, created = Disease.objects.get_or_create(
        name='Diabetes',
        defaults=diabetes_defaults
    )
    if created:
        print("  Created default Disease record: Diabetes")
    else:
        print("  Disease record 'Diabetes' already exists.")

def seed_symptoms():
    symptoms = [
        {"name": "Frequent Urination (Polyuria)", "category": "Urinary", "description": "Need to urinate more often than usual, especially at night."},
        {"name": "Excessive Thirst (Polydipsia)", "category": "Systemic", "description": "Constant feeling of dryness and thirst that is not easily quenched."},
        {"name": "Extreme Hunger (Polyphagia)", "category": "Digestive", "description": "Feeling starved even after eating adequate meals."},
        {"name": "Unexplained Weight Loss", "category": "Systemic", "description": "Losing weight without dieting or increased physical exertion."},
        {"name": "Fatigue and Weakness", "category": "Systemic", "description": "Persistent tiredness and lack of energy."},
        {"name": "Blurred Vision", "category": "Ocular", "description": "Difficulty focusing clearly, caused by rapid fluid shifts in eye lenses."},
        {"name": "Slow-Healing Sores or Cuts", "category": "Dermatological", "description": "Wounds take noticeably longer to heal due to impaired circulation."},
        {"name": "Tingling or Numbness in Hands/Feet", "category": "Neurological", "description": "Nerve irritation and peripheral neuropathy symptoms."},
    ]

    for s in symptoms:
        obj, created = Symptom.objects.get_or_create(
            name=s["name"],
            defaults={"category": s["category"], "description": s["description"], "is_active": True}
        )
        if created:
            print(f"  Created Symptom: {s['name']}")

if __name__ == '__main__':
    print("Seeding initial data...")
    seed_diseases()
    seed_symptoms()
    print("Initial data seeding finished successfully.")
