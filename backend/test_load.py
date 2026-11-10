import sys
import os
import joblib
import pandas as pd

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from preprocessing import OutlierWinsorizer, prepare_raw_input

model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model', 'champion_diabetes_model.joblib')
model = joblib.load(model_path)
print("Successfully loaded model artifact!")

# Test single sample
df_master = pd.read_csv(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'diabetes_master_dataset.csv'))
sample = df_master.iloc[0].to_dict()

sample_prepared = prepare_raw_input(sample)
prob = float(model.predict_proba(sample_prepared)[0, 1])
print(f"Sample 0: True Label={sample['type2_diabetes']}, Predicted Probability={prob:.4f}")

