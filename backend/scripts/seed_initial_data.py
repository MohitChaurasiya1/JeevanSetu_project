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
    diseases_data = [
        {
            'name': 'Diabetes',
            'recommended_specialist': 'Endocrinologist / Diabetologist',
            'description': (
                'Diabetes is a chronic metabolic condition characterized by high blood glucose levels over a prolonged period. '
                'It occurs when the pancreas produces little or no insulin, or when the body cannot effectively utilize the insulin it produces.'
            ),
            'detailed_description': (
                'Diabetes mellitus is a chronic metabolic disorder marked by elevated levels of glucose in the blood. '
                'Type 1 diabetes is an autoimmune condition where the pancreas ceases to produce insulin. '
                'Type 2 diabetes, the most common form, develops when body cells become resistant to insulin and the pancreas cannot produce enough insulin to compensate. '
                'Without effective management, sustained high blood sugar damages blood vessels, nerves, kidneys, and eyes.'
            ),
            'symptoms': [
                'Frequent urination, especially during the night (Polyuria)',
                'Excessive, unquenchable thirst (Polydipsia)',
                'Extreme hunger despite regular meals (Polyphagia)',
                'Unexplained or unintentional weight loss',
                'Persistent fatigue, exhaustion, and generalized weakness',
                'Blurred or fluctuating vision',
                'Slow-healing cuts, bruises, or infections',
                'Tingling, burning sensation, or numbness in the hands and feet'
            ],
            'risk_factors': [
                'Overweight or obesity, particularly abdominal adiposity',
                'Physical inactivity and sedentary lifestyle',
                'Family history of diabetes in parents or siblings',
                'Age 45 or older (though increasingly diagnosed in younger populations)',
                'History of gestational diabetes during pregnancy',
                'High blood pressure (140/90 mmHg or higher)',
                'Abnormal lipid panel: Low HDL cholesterol or high triglycerides',
                'Polycystic ovary syndrome (PCOS)'
            ],
            'causes': [
                'Autoimmune destruction of insulin-producing pancreatic beta cells (Type 1)',
                'Insulin resistance combined with progressive pancreatic beta-cell dysfunction (Type 2)',
                'Genetic predisposition combined with lifestyle and environmental triggers',
                'Placental hormone interference during pregnancy (Gestational Diabetes)'
            ],
            'prevention': [
                'Eat a balanced diet high in dietary fiber, whole grains, vegetables, and lean proteins',
                'Limit foods high in refined sugars, simple carbohydrates, and saturated fats',
                'Achieve and maintain a healthy body weight (losing 5-7% of excess weight reduces Type 2 risk)',
                'Perform at least 30 minutes of moderate aerobic exercise 5 days a week',
                'Stay well hydrated with water instead of sweetened beverages',
                'Undergo regular routine screening if you have risk factors'
            ],
            'treatment': [
                'Regular blood glucose self-monitoring and periodic HbA1c tests',
                'Individualized medical nutrition therapy and structured exercise regimens',
                'Oral antidiabetic medications (e.g., Metformin, SGLT-2 inhibitors, GLP-1 receptor agonists)',
                'Insulin therapy (basal and prandial injections or insulin pumps)',
                'Routine annual screening for complications (retinal exams, kidney function, diabetic foot checks)'
            ],
            'when_to_see_doctor': (
                'Consult your healthcare provider if you experience persistent excessive thirst, frequent urination, '
                'unexplained weight loss, or lingering sores. Seek urgent medical attention if you experience severe confusion, '
                'deep rapid breathing, nausea, or dizziness indicative of severe hypoglycemia or diabetic ketoacidosis.'
            ),
            'additional_info': (
                'Early diagnosis and comprehensive lifestyle management drastically reduce long-term cardiovascular, '
                'neurological, and renal complications associated with diabetes.'
            ),
            'precautions': (
                '1. Maintain a balanced, low-glycemic diet rich in whole grains and vegetables.\n'
                '2. Engage in at least 30 minutes of moderate aerobic exercise daily.\n'
                '3. Monitor blood glucose levels regularly.\n'
                '4. Stay hydrated and avoid sugary drinks and ultra-processed foods.\n'
                '5. Undergo routine medical checkups and foot/eye exams.'
            ),
            'risk_message': (
                'Clinical validation advised: An elevated risk score indicates significant metabolic indicators of diabetes. '
                'Please consult a licensed physician or endocrinologist for confirmation and individualized clinical guidance.'
            ),
            'is_active': True,
        },
        {
            'name': 'Heart Disease',
            'recommended_specialist': 'Cardiologist',
            'description': (
                'Cardiovascular conditions affecting the heart and blood vessels, including coronary artery disease, arrhythmias, and heart failure.'
            ),
            'detailed_description': (
                'Heart disease encompasses a broad spectrum of cardiovascular disorders affecting the structure and function of the heart. '
                'The most prevalent form is Coronary Artery Disease (CAD), characterized by narrowing or blockage of the coronary arteries due to plaque accumulation (atherosclerosis). '
                'Other major conditions include heart rhythm irregularities (arrhythmias), heart valve disease, heart failure, and congenital heart defects. '
                'Heart disease remains one of the leading health concerns worldwide, but timely lifestyle interventions and medical therapies can dramatically decrease mortality and complications.'
            ),
            'symptoms': [
                'Chest discomfort, pressure, fullness, or squeezing pain (Angina)',
                'Shortness of breath (Dyspnea) during exertion or while resting flat',
                'Pain or discomfort radiating to the neck, jaw, shoulders, arms, or upper back',
                'Fluttering, racing, or pounding heart palpitations',
                'Lightheadedness, unexpected dizziness, or fainting episodes (Syncope)',
                'Swelling (Edema) in the lower legs, ankles, feet, or abdomen',
                'Unusual and profound fatigue or reduced exercise stamina',
                'Coldness, weakness, or cramping pain in the extremities'
            ],
            'risk_factors': [
                'High blood pressure (Hypertension) putting undue strain on vascular walls',
                'Elevated LDL (bad) cholesterol and high serum triglyceride levels',
                'Smoking, tobacco consumption, and secondhand smoke exposure',
                'Diabetes and insulin resistance accelerating atherosclerotic plaque formation',
                'Obesity and lack of consistent aerobic physical activity',
                'Family history of premature cardiovascular disease',
                'Chronic psychological stress and persistent sleep apnea',
                'Advanced age and diets high in sodium, trans fats, and refined carbs'
            ],
            'causes': [
                'Atherosclerosis: Plaque buildup that hardens and constricts coronary arteries',
                'Hypertension causing thickening and weakening of heart muscle walls',
                'Structural or functional heart valve anomalies',
                'Cardiomyopathy: Genetic or acquired diseases of the cardiac muscle tissue',
                'Infections or inflammatory responses affecting pericardium or myocardium'
            ],
            'prevention': [
                'Adopt a heart-healthy dietary pattern (e.g., Mediterranean diet rich in whole foods, nuts, and healthy fats)',
                'Accumulate at least 150 minutes of moderate aerobic exercise or 75 minutes of vigorous exercise weekly',
                'Completely avoid smoking and all tobacco products',
                'Maintain blood pressure below 120/80 mmHg and manage healthy cholesterol levels',
                'Limit dietary sodium to under 2,000 mg per day and avoid artificial trans fats',
                'Practice stress-reduction practices like meditation, quality sleep hygiene, and deep breathing',
                'Maintain an optimal body weight and waist-to-hip ratio'
            ],
            'treatment': [
                'Comprehensive lifestyle modifications: cardiac diet, exercise routines, smoking cessation',
                'Medications: Statins (cholesterol reduction), Beta-blockers, ACE inhibitors/ARBs, and Antiplatelet agents (aspirin)',
                'Percutaneous Coronary Intervention (PCI): Balloon angioplasty and stent placement',
                'Surgical procedures: Coronary Artery Bypass Graft (CABG), valve replacement, or pacemaker insertion',
                'Supervised Cardiac Rehabilitation: Multidisciplinary exercise, nutritional, and emotional support'
            ],
            'when_to_see_doctor': (
                'Call emergency services immediately (911 / 112) if you experience acute crushing chest pain, '
                'shortness of breath with sweating, pain radiating down the left arm or jaw, or sudden collapse. '
                'Consult a cardiologist promptly if you experience recurrent shortness of breath, unexplained ankle swelling, or palpitations.'
            ),
            'additional_info': (
                'Clinical parameters such as blood pressure, resting heart rate, and cholesterol levels are critical indicators of cardiovascular health.'
            ),
            'precautions': (
                '1. Monitor blood pressure and resting heart rate on a regular basis.\n'
                '2. Restrict sodium and saturated fats in your daily meals.\n'
                '3. Avoid strenuous unaccustomed physical exertion without prior medical evaluation.\n'
                '4. Take prescribed heart medications consistently and never stop abruptly.\n'
                '5. Always keep emergency medical contacts readily accessible.'
            ),
            'risk_message': (
                'Clinical evaluation advised: High risk indicators detected for cardiovascular conditions. '
                'Prompt evaluation and diagnostic tests (ECG, Echocardiogram, Lipid Panel) by a cardiologist are strongly recommended.'
            ),
            'is_active': True,
        }
    ]

    for d in diseases_data:
        disease, created = Disease.objects.update_or_create(
            name=d['name'],
            defaults=d
        )
        if created:
            print(f"  Created Disease record: {d['name']}")
        else:
            print(f"  Updated Disease record: {d['name']}")

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
        {"name": "Chest Pain / Tightness (Angina)", "category": "Cardiovascular", "description": "Pressure, fullness or squeezing pain in the center of the chest."},
        {"name": "Shortness of Breath (Dyspnea)", "category": "Cardiovascular", "description": "Difficulty breathing or feeling suffocated during minimal activity or rest."},
        {"name": "Heart Palpitations", "category": "Cardiovascular", "description": "Sensations of a fast-beating, fluttering, or pounding heart."},
        {"name": "Swelling in Legs/Ankles (Edema)", "category": "Cardiovascular", "description": "Fluid buildup in the lower limbs often linked to poor circulation or heart failure."},
        {"name": "Dizziness or Lightheadedness", "category": "Cardiovascular", "description": "Feeling faint or unsteady, often caused by inadequate blood supply to the brain."},
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

