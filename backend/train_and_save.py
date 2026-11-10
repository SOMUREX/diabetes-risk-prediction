"""
Train and export champion model and all metadata
Ensures clean unpickling and verification
"""

import sys
import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss, precision_recall_curve

# Make sure backend folder is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from preprocessing import (
    build_preprocessor_e5, engineer_e4_features, engineer_e5_interactions,
    ALL_NUM_COLS_E5, ORDINAL_COLS, NOMINAL_COLS, SCALING_STATS
)

# Load master dataset
data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'diabetes_master_dataset.csv')
df = pd.read_csv(data_path)
print("Loaded master dataset:", df.shape)

columns_to_exclude = ['participant_id', 'age_at_diagnosis', 'diabetes_status', 'diagnosis_source', 'type2_diabetes']
X = df.drop(columns=columns_to_exclude)
y = df['type2_diabetes']

X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.30, stratify=y, random_state=42
)
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.50, stratify=y_temp, random_state=42
)

X_train_e4 = engineer_e4_features(X_train)
X_val_e4 = engineer_e4_features(X_val)
X_test_e4 = engineer_e4_features(X_test)

X_train_e5 = engineer_e5_interactions(X_train_e4)
X_val_e5 = engineer_e5_interactions(X_val_e4)
X_test_e5 = engineer_e5_interactions(X_test_e4)

preprocessor = build_preprocessor_e5()

champion_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(C=0.01, penalty='l2', random_state=42, max_iter=1000))
])

print("Fitting champion E5 Logistic Regression pipeline...")
champion_pipeline.fit(X_train_e5, y_train)

# Validation evaluation
val_probs = champion_pipeline.predict_proba(X_val_e5)[:, 1]
val_auc = float(roc_auc_score(y_val, val_probs))
val_ap = float(average_precision_score(y_val, val_probs))
val_brier = float(brier_score_loss(y_val, val_probs))

precisions, recalls, thresholds = precision_recall_curve(y_val, val_probs)
f1_scores = 2 * (precisions * recalls) / (precisions + recalls + 1e-10)
best_idx = np.argmax(f1_scores)
best_threshold = float(thresholds[best_idx] if best_idx < len(thresholds) else 0.5)

# Test evaluation
test_probs = champion_pipeline.predict_proba(X_test_e5)[:, 1]
test_auc = float(roc_auc_score(y_test, test_probs))
test_ap = float(average_precision_score(y_test, test_probs))
test_brier = float(brier_score_loss(y_test, test_probs))

print(f"Validation ROC-AUC: {val_auc:.6f}")
print(f"Validation PR-AUC:  {val_ap:.6f}")
print(f"Validation Brier:   {val_brier:.6f}")
print(f"Best Threshold:     {best_threshold:.6f}")
print(f"Test ROC-AUC:       {test_auc:.6f}")
print(f"Test PR-AUC:        {test_ap:.6f}")
print(f"Test Brier:         {test_brier:.6f}")

model_save_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model', 'champion_diabetes_model.joblib')
joblib.dump(champion_pipeline, model_save_path)
print("Model saved to:", model_save_path)

# Extract transformed feature names and coefficients
preproc_step = champion_pipeline.named_steps['preprocessor']
clf_step = champion_pipeline.named_steps['classifier']

num_features = preproc_step.transformers_[0][2]
ord_features = preproc_step.transformers_[1][2]
nom_features = preproc_step.transformers_[2][2]
nom_transformer = preproc_step.transformers_[2][1].named_steps['encoder']
nom_feature_names = list(nom_transformer.get_feature_names_out(nom_features))

all_features = list(num_features) + list(ord_features) + nom_feature_names
coefficients = clf_step.coef_[0].tolist()
intercept = float(clf_step.intercept_[0])

coef_dict = [
    {"feature": f, "coefficient": round(c, 6), "abs_coefficient": round(abs(c), 6)}
    for f, c in zip(all_features, coefficients)
]
coef_dict.sort(key=lambda x: x["abs_coefficient"], reverse=True)

# Generate config files
metrics_summary = {
    "champion_model": "Logistic Regression (E5)",
    "best_hyperparameters": {"C": 0.01, "penalty": "l2", "max_iter": 1000, "solver": "lbfgs"},
    "optimal_decision_threshold": round(best_threshold, 6),
    "validation_metrics": {
        "roc_auc": round(val_auc, 6),
        "pr_auc": round(val_ap, 6),
        "brier_score": round(val_brier, 6)
    },
    "test_metrics": {
        "roc_auc": round(test_auc, 6),
        "pr_auc": round(test_ap, 6),
        "brier_score": round(test_brier, 6)
    },
    "intercept": round(intercept, 6),
    "feature_coefficients": coef_dict
}

metrics_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config', 'model_metrics.json')
with open(metrics_path, 'w', encoding='utf-8') as f:
    json.dump(metrics_summary, f, indent=2)
print("Saved model metrics to:", metrics_path)

