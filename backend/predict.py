"""
Prediction Engine and Explainable AI Service
Project: Inherited-Susceptibility–Aware Lifestyle Risk Modelling
"""

import sys
import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from preprocessing import (
    OutlierWinsorizer, prepare_raw_input, SCALING_STATS,
    ALL_NUM_COLS_E5, ORDINAL_COLS, NOMINAL_COLS
)

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model')
CONFIG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config')

# Load metrics and thresholds
with open(os.path.join(CONFIG_DIR, 'model_metrics.json'), 'r', encoding='utf-8') as f:
    MODEL_METRICS = json.load(f)

OPTIMAL_THRESHOLD = MODEL_METRICS.get("optimal_decision_threshold", 0.27937)

_MODEL_INSTANCE = None
_TRANSFORMED_FEATURE_NAMES = None


def get_model():
    """Singleton model loader. Loads champion pipeline into memory once."""
    global _MODEL_INSTANCE, _TRANSFORMED_FEATURE_NAMES
    if _MODEL_INSTANCE is None:
        model_path = os.path.join(MODEL_DIR, 'champion_diabetes_model.joblib')
        _MODEL_INSTANCE = joblib.load(model_path)

        # Cache transformed feature names
        preproc = _MODEL_INSTANCE.named_steps['preprocessor']
        num_f = list(preproc.transformers_[0][2])
        ord_f = list(preproc.transformers_[1][2])
        nom_f = list(preproc.transformers_[2][2])
        nom_encoder = preproc.transformers_[2][1].named_steps['encoder']
        nom_names = list(nom_encoder.get_feature_names_out(nom_f))
        _TRANSFORMED_FEATURE_NAMES = num_f + ord_f + nom_names

    return _MODEL_INSTANCE, _TRANSFORMED_FEATURE_NAMES


def map_risk_level(prob: float, threshold: float) -> Dict[str, str]:
    """
    Defensible risk categorisation:
    - Low Risk: < 15% (below synthetic population baseline prevalence of 14.5%)
    - Moderate Risk: 15% - threshold (27.9%)
    - Elevated Risk: threshold (27.9%) - 50% (exceeds validated F1-optimal threshold)
    - High / Severe Risk: > 50%
    """
    pct = prob * 100
    thresh_pct = threshold * 100

    if pct < 15.0:
        return {
            "level": "Low Risk",
            "badge_color": "emerald",
            "description": f"Model-estimated risk ({pct:.1f}%) is within or below synthetic cohort baseline prevalence (14.5%)."
        }
    elif pct < thresh_pct:
        return {
            "level": "Moderate Risk",
            "badge_color": "blue",
            "description": f"Model-estimated risk ({pct:.1f}%) is above general population baseline but below the validated classification decision boundary ({thresh_pct:.1f}%)."
        }
    elif pct < 50.0:
        return {
            "level": "Elevated Risk",
            "badge_color": "amber",
            "description": f"Model-estimated risk ({pct:.1f}%) exceeds the validated classification decision boundary ({thresh_pct:.1f}%)."
        }
    else:
        return {
            "level": "High Risk",
            "badge_color": "rose",
            "description": f"Model-estimated risk ({pct:.1f}%) is substantially elevated across genetic, clinical, and lifestyle dimensions."
        }


def format_feature_label(f_name: str) -> str:
    """Human-readable display names for transformed features."""
    name_map = {
        'age': 'Chronological Age',
        't2d_prs': 'Polygenic Risk Score (PRS)',
        'prs_percentile': 'PRS Percentile',
        'bmi': 'Body Mass Index (BMI)',
        'waist_circumference': 'Waist Circumference',
        'systolic_bp': 'Systolic Blood Pressure',
        'diastolic_bp': 'Diastolic Blood Pressure',
        'cholesterol': 'Total Cholesterol',
        'triglycerides': 'Triglycerides',
        'cardiovascular_risk_index': 'Cardiovascular Risk Index (CVRI)',
        'sleep_to_sedentary_ratio': 'Sleep-to-Sedentary Ratio',
        'diet_activity_synergy': 'Diet-Activity Synergy (DAS)',
        'obesity_age_score': 'Obesity-Age Score (OAS)',
        'gxe_physical_activity': 'GxE: PRS × Physical Activity',
        'gxe_sleep_duration': 'GxE: PRS × Sleep Duration',
        'gxe_diet_quality': 'GxE: PRS × Diet Quality',
        'gxe_bmi': 'GxE: PRS × BMI',
        'diet_quality_score': 'Diet Quality Score',
        'physical_activity_minutes_week': 'Physical Activity (min/wk)',
        'sedentary_hours_day': 'Sedentary Hours/Day',
        'sleep_duration_hours': 'Sleep Duration (hrs)',
        'sleep_quality_score': 'Sleep Quality Score',
        'sugary_drink_frequency': 'Sugary Drink Consumption',
        'processed_food_frequency': 'Ultra-Processed Food Intake',
        'fruit_intake': 'Daily Fruit Intake',
        'vegetable_intake': 'Daily Vegetable Intake',
        'whole_grain_intake': 'Whole Grain Intake',
        'smoking_pack_years': 'Smoking Pack-Years',
        'family_history_score': 'Family History Score',
        'num_affected_relatives': 'Affected Relatives Count',
        'stress_level': 'Perceived Stress Level',
        'hypertension': 'Hypertension Status',
        'mother_diabetes': 'Mother with Diabetes',
        'father_diabetes': 'Father with Diabetes',
        'sibling_diabetes': 'Sibling with Diabetes',
        'grandparent_diabetes': 'Grandparent with Diabetes',
        'family_diabetes_history': 'Family History of Diabetes',
        'sex_Male': 'Sex: Male',
        'sex_Female': 'Sex: Female',
        'smoking_status_Current': 'Smoking Status: Current',
        'smoking_status_Former': 'Smoking Status: Former',
        'smoking_status_Never': 'Smoking Status: Never'
    }
    return name_map.get(f_name, f_name.replace('_', ' ').title())


def predict_risk(user_input: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes full pipeline risk prediction and generates individual explainability metrics.
    """
    model, feature_names = get_model()

    # 1. Transform raw user input dictionary into processed dataframe
    df_prepared = prepare_raw_input(user_input)

    # 2. Predict probability
    probs = model.predict_proba(df_prepared)[0]
    prob_diabetic = float(probs[1])

    # 3. Risk level mapping
    risk_info = map_risk_level(prob_diabetic, OPTIMAL_THRESHOLD)

    # 4. Extract transformed feature values and calculate exact log-odds contributions
    preproc = model.named_steps['preprocessor']
    clf = model.named_steps['classifier']

    X_trans = preproc.transform(df_prepared)
    if hasattr(X_trans, 'to_numpy'):
        X_trans = X_trans.to_numpy()

    coefs = clf.coef_[0]
    intercept = float(clf.intercept_[0])
    raw_contributions = coefs * X_trans[0]

    # Organize factor attributions
    contributions_list = []
    for f_name, raw_c, coef in zip(feature_names, raw_contributions, coefs):
        contributions_list.append({
            "feature": f_name,
            "label": format_feature_label(f_name),
            "contribution": round(float(raw_c), 4),
            "abs_contribution": round(float(abs(raw_c)), 4),
            "is_risk_increasing": bool(raw_c > 0)
        })

    contributions_list.sort(key=lambda x: x["abs_contribution"], reverse=True)

    risk_factors = [c for c in contributions_list if c["is_risk_increasing"]][:6]
    protective_factors = [c for c in contributions_list if not c["is_risk_increasing"]][:6]

    # Extract engineered feature values for display
    engineered_values = {
        "cardiovascular_risk_index": round(float(df_prepared['cardiovascular_risk_index'].iloc[0]), 2),
        "sleep_to_sedentary_ratio": round(float(df_prepared['sleep_to_sedentary_ratio'].iloc[0]), 3),
        "diet_activity_synergy": round(float(df_prepared['diet_activity_synergy'].iloc[0]), 1),
        "obesity_age_score": round(float(df_prepared['obesity_age_score'].iloc[0]), 2),
        "gxe_physical_activity": round(float(df_prepared['gxe_physical_activity'].iloc[0]), 4),
        "gxe_sleep_duration": round(float(df_prepared['gxe_sleep_duration'].iloc[0]), 4),
        "gxe_diet_quality": round(float(df_prepared['gxe_diet_quality'].iloc[0]), 4),
        "gxe_bmi": round(float(df_prepared['gxe_bmi'].iloc[0]), 4)
    }

    # Actionable lifestyle feedback based on modifiable factors
    lifestyle_recommendations = []
    bmi_val = float(user_input.get('bmi', 25))
    act_val = float(user_input.get('physical_activity_minutes_week', 150))
    diet_val = float(user_input.get('diet_quality_score', 60))
    sleep_val = float(user_input.get('sleep_duration_hours', 7))

    if bmi_val >= 25.0:
        lifestyle_recommendations.append({
            "factor": "Weight & Visceral Adiposity",
            "priority": "High" if bmi_val >= 30.0 else "Medium",
            "advice": f"Current BMI is {bmi_val:.1f} kg/m². Adiposity strongly drives insulin resistance and amplifies genetic susceptibility (GxE BMI term: {engineered_values['gxe_bmi']}). A 5-7% weight reduction substantially lowers metabolic risk."
        })

    if act_val < 150:
        lifestyle_recommendations.append({
            "factor": "Physical Activity",
            "priority": "High",
            "advice": f"Reported physical activity ({int(act_val)} min/week) is below the WHO recommended 150 min/week. Aerobic exercise stimulates non-insulin-mediated glucose uptake in skeletal muscle."
        })

    if diet_val < 65:
        lifestyle_recommendations.append({
            "factor": "Nutritional Quality",
            "priority": "Medium",
            "advice": f"Diet Quality Score is {int(diet_val)}/100. High dietary quality directly counteracts elevated PRS susceptibility in our GxE interaction model (negative interaction coefficient = -0.1549)."
        })

    if sleep_val < 7.0 or sleep_val > 9.0:
        lifestyle_recommendations.append({
            "factor": "Sleep Optimization",
            "priority": "Low",
            "advice": f"Reported sleep duration is {sleep_val:.1f} hours/night. Optimal metabolic homeostasis occurs between 7 to 8 hours of restful sleep."
        })

    return {
        "status": "success",
        "model_name": "E5 Logistic Regression Champion",
        "model_pipeline": "ColumnTransformer (Imputation + Outlier Winsorization + Standardization + Ordinal/OneHot Encoding) -> L2-Regularized Logistic Regression (C=0.01)",
        "probability": round(prob_diabetic, 4),
        "probability_percentage": round(prob_diabetic * 100, 2),
        "decision_threshold": round(OPTIMAL_THRESHOLD, 4),
        "decision_threshold_percentage": round(OPTIMAL_THRESHOLD * 100, 2),
        "is_elevated_risk": bool(prob_diabetic >= OPTIMAL_THRESHOLD),
        "risk_classification": risk_info,
        "intercept": round(intercept, 4),
        "engineered_features": engineered_values,
        "top_risk_increasing_factors": risk_factors,
        "top_protective_factors": protective_factors,
        "all_contributions": contributions_list,
        "actionable_recommendations": lifestyle_recommendations,
        "disclaimer": "This is an academic machine learning research prototype. Its output is an experimental model estimate and is not a medical diagnosis or a substitute for professional medical advice."
    }


def simulate_what_if(baseline_input: Dict[str, Any], modifications: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes a controlled what-if counterfactual simulation.
    Recalculates non-interaction and GxE interaction features with modified parameters.
    """
    # Baseline
    base_result = predict_risk(baseline_input)

    # Modified scenario
    scenario_input = baseline_input.copy()
    scenario_input.update(modifications)

    scenario_result = predict_risk(scenario_input)

    prob_diff = round(scenario_result['probability'] - base_result['probability'], 4)
    pct_diff = round(scenario_result['probability_percentage'] - base_result['probability_percentage'], 2)

    return {
        "baseline_probability": base_result['probability'],
        "baseline_percentage": base_result['probability_percentage'],
        "baseline_risk_level": base_result['risk_classification']['level'],
        "modified_probability": scenario_result['probability'],
        "modified_percentage": scenario_result['probability_percentage'],
        "modified_risk_level": scenario_result['risk_classification']['level'],
        "probability_change": prob_diff,
        "percentage_point_change": pct_diff,
        "relative_change_percentage": round((prob_diff / max(base_result['probability'], 1e-6)) * 100, 2),
        "modifications_applied": modifications,
        "baseline_engineered": base_result['engineered_features'],
        "modified_engineered": scenario_result['engineered_features'],
        "scientific_note": "This simulation evaluates hypothetical marginal risk trajectory according to the fitted statistical model. It does not establish causal proof of risk reduction for any individual."
    }

