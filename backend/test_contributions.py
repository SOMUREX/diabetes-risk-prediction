import sys
import os
import joblib
import pandas as pd
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from preprocessing import prepare_raw_input, OutlierWinsorizer

model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model', 'champion_diabetes_model.joblib')
model = joblib.load(model_path)
preprocessor = model.named_steps['preprocessor']
classifier = model.named_steps['classifier']

# Get feature names
num_features = list(preprocessor.transformers_[0][2])
ord_features = list(preprocessor.transformers_[1][2])
nom_features = list(preprocessor.transformers_[2][2])
nom_encoder = preprocessor.transformers_[2][1].named_steps['encoder']
nom_feature_names = list(nom_encoder.get_feature_names_out(nom_features))
all_features = num_features + ord_features + nom_feature_names

df_master = pd.read_csv(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'diabetes_master_dataset.csv'))

# Pick a diabetic case (y=1)
diabetic_row = df_master[df_master['type2_diabetes'] == 1].iloc[0].to_dict()
df_prep = prepare_raw_input(diabetic_row)
prob = float(model.predict_proba(df_prep)[0, 1])

# Transform features
X_trans = preprocessor.transform(df_prep)
if hasattr(X_trans, 'to_numpy'):
    X_trans = X_trans.to_numpy()

coefs = classifier.coef_[0]
contributions = coefs * X_trans[0]

contrib_df = pd.DataFrame({
    'feature': all_features,
    'raw_contribution': contributions,
    'abs_contribution': np.abs(contributions)
}).sort_values('abs_contribution', ascending=False)

print(f"Diabetic Participant: {diabetic_row['participant_id']}, Predicted Prob: {prob:.4f}")
print("\nTop 10 Risk-Increasing Factors (positive log-odds):")
print(contrib_df[contrib_df['raw_contribution'] > 0].head(10).to_string(index=False))

print("\nTop 5 Risk-Decreasing Factors (negative log-odds):")
print(contrib_df[contrib_df['raw_contribution'] < 0].head(5).to_string(index=False))
