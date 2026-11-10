"""
Preprocessing and Feature Engineering Pipeline
Project: Inherited-Susceptibility–Aware Lifestyle Risk Modelling for Personalized Type-2 Diabetes Prediction
Author: Final Year Academic Research Project
"""

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin, OneToOneFeatureMixin
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer

# Exact feature definitions from research notebook
NUMERICAL_COLS = [
    'age', 't2d_prs', 'prs_percentile', 'physical_activity_minutes_week',
    'moderate_activity_days', 'vigorous_activity_days', 'sedentary_hours_day',
    'sleep_duration_hours', 'sleep_quality_score', 'fruit_intake', 'vegetable_intake',
    'whole_grain_intake', 'processed_food_frequency', 'sugary_drink_frequency',
    'diet_quality_score', 'smoking_pack_years', 'stress_level', 'bmi',
    'waist_circumference', 'systolic_bp', 'diastolic_bp', 'cholesterol', 'triglycerides'
]

FAMILY_COLS = [
    'mother_diabetes', 'father_diabetes', 'sibling_diabetes', 'grandparent_diabetes',
    'family_diabetes_history', 'num_affected_relatives', 'family_history_score',
    'alcohol_use', 'hypertension'
]

ALL_RAW_NUM_COLS = NUMERICAL_COLS + FAMILY_COLS

ORDINAL_COLS = ['education_level', 'income_level', 'alcohol_frequency']
NOMINAL_COLS = ['sex', 'race_ethnicity', 'genetic_risk_category', 'smoking_status']

EDU_ORDER = ['Primary or below', 'Secondary', 'Undergraduate', 'Postgraduate']
INC_ORDER = ['Low', 'Middle', 'High']
ALC_ORDER = ['None', 'Rare', 'Social', 'Frequent']

ENGINEERED_E4_COLS = [
    'cardiovascular_risk_index', 'sleep_to_sedentary_ratio',
    'diet_activity_synergy', 'obesity_age_score'
]

GXE_INTERACTION_COLS = [
    'gxe_physical_activity', 'gxe_sleep_duration',
    'gxe_diet_quality', 'gxe_bmi'
]

ALL_NUM_COLS_E5 = ALL_RAW_NUM_COLS + ENGINEERED_E4_COLS + GXE_INTERACTION_COLS

# Pre-computed scaling constants calculated exclusively on the training split (N=4,900)
# to strictly prevent any data leakage
SCALING_STATS = {
    't2d_prs_mean': 0.007621836734693876,
    't2d_prs_std': 1.0028881261173662,
    'activity_mean': 149.33673469387756,
    'activity_std': 95.83656360492823,
    'sleep_mean': 7.009387755102041,
    'sleep_std': 1.2188611843231145,
    'diet_mean': 54.76734693877551,
    'diet_std': 16.29413233827532,
    'bmi_mean': 27.295285714285714,
    'bmi_std': 5.253018241270428,
    'activity_median': 150.0,
    'sleep_median': 7.0,
    'diet_median': 55.0,
    'bmi_median': 26.8
}


class OutlierWinsorizer(OneToOneFeatureMixin, BaseEstimator, TransformerMixin):
    """
    Robust Winsorizer that clips values outside defined quantiles.
    Fitted on training set (lower 0.5%, upper 99.5%).
    """
    def __init__(self, lower_quantile=0.005, upper_quantile=0.995):
        self.lower_quantile = lower_quantile
        self.upper_quantile = upper_quantile
        self.lower_bounds_ = {}
        self.upper_bounds_ = {}
        self._transform_output = None

    def fit(self, X, y=None):
        if hasattr(X, 'columns'):
            cols = X.columns
            self.feature_names_in_ = np.array(cols, dtype=object)
        else:
            cols = range(X.shape[1])
            self.feature_names_in_ = np.array([f'x{i}' for i in cols], dtype=object)

        X_df = pd.DataFrame(X, columns=cols)
        for col in cols:
            self.lower_bounds_[col] = float(X_df[col].quantile(self.lower_quantile))
            self.upper_bounds_[col] = float(X_df[col].quantile(self.upper_quantile))
        return self

    def transform(self, X):
        if hasattr(X, 'columns'):
            cols = X.columns
        else:
            cols = list(self.lower_bounds_.keys())

        X_df = pd.DataFrame(X, columns=cols).copy()
        for col in cols:
            if col in self.lower_bounds_:
                X_df[col] = X_df[col].clip(lower=self.lower_bounds_[col], upper=self.upper_bounds_[col])

        if self._transform_output == 'pandas' or (hasattr(self, '_get_output_config') and self._get_output_config().get('transform') == 'pandas'):
            return X_df
        return X_df.to_numpy()

    def set_output(self, transform=None):
        self._transform_output = transform
        return self


def engineer_e4_features(df_in: pd.DataFrame) -> pd.DataFrame:
    """
    Construct non-interaction domain engineered features as defined in Notebook Cell 32/35:
    1. Cardiovascular Risk Index (CVRI) = systolic_bp * diastolic_bp / 100
    2. Sleep-to-Sedentary Ratio (SSR)   = sleep_duration_hours / (sedentary_hours_day + 0.1)
    3. Diet-Activity Synergy (DAS)       = diet_quality_score * physical_activity_minutes_week
    4. Obesity-Age Score (OAS)          = bmi * age
    """
    df_out = df_in.copy()
    df_out['cardiovascular_risk_index'] = (
        pd.to_numeric(df_out['systolic_bp'], errors='coerce') *
        pd.to_numeric(df_out['diastolic_bp'], errors='coerce') / 100.0
    )
    df_out['sleep_to_sedentary_ratio'] = (
        pd.to_numeric(df_out['sleep_duration_hours'], errors='coerce') /
        (pd.to_numeric(df_out['sedentary_hours_day'], errors='coerce') + 0.1)
    )
    df_out['diet_activity_synergy'] = (
        pd.to_numeric(df_out['diet_quality_score'], errors='coerce') *
        pd.to_numeric(df_out['physical_activity_minutes_week'], errors='coerce')
    )
    df_out['obesity_age_score'] = (
        pd.to_numeric(df_out['bmi'], errors='coerce') *
        pd.to_numeric(df_out['age'], errors='coerce')
    )
    return df_out


def engineer_e5_interactions(df_in: pd.DataFrame) -> pd.DataFrame:
    """
    Construct the four standardized Gene-Environment (GxE) interaction terms
    as defined in Notebook Cell 44:
    - GxE1: t2d_prs_std * physical_activity_std
    - GxE2: t2d_prs_std * sleep_duration_std
    - GxE3: t2d_prs_std * diet_quality_std
    - GxE4: t2d_prs_std * bmi_std
    """
    df_out = df_in.copy()

    prs_val = pd.to_numeric(df_out['t2d_prs'], errors='coerce')
    act_val = pd.to_numeric(df_out['physical_activity_minutes_week'], errors='coerce').fillna(SCALING_STATS['activity_median'])
    slp_val = pd.to_numeric(df_out['sleep_duration_hours'], errors='coerce').fillna(SCALING_STATS['sleep_median'])
    diet_val = pd.to_numeric(df_out['diet_quality_score'], errors='coerce').fillna(SCALING_STATS['diet_median'])
    bmi_val = pd.to_numeric(df_out['bmi'], errors='coerce').fillna(SCALING_STATS['bmi_median'])

    prs_std = (prs_val - SCALING_STATS['t2d_prs_mean']) / (SCALING_STATS['t2d_prs_std'] + 1e-10)
    act_std = (act_val - SCALING_STATS['activity_mean']) / (SCALING_STATS['activity_std'] + 1e-10)
    slp_std = (slp_val - SCALING_STATS['sleep_mean']) / (SCALING_STATS['sleep_std'] + 1e-10)
    diet_std = (diet_val - SCALING_STATS['diet_mean']) / (SCALING_STATS['diet_std'] + 1e-10)
    bmi_std = (bmi_val - SCALING_STATS['bmi_mean']) / (SCALING_STATS['bmi_std'] + 1e-10)

    df_out['gxe_physical_activity'] = prs_std * act_std
    df_out['gxe_sleep_duration'] = prs_std * slp_std
    df_out['gxe_diet_quality'] = prs_std * diet_std
    df_out['gxe_bmi'] = prs_std * bmi_std

    return df_out


def build_preprocessor_e5() -> ColumnTransformer:
    """
    Constructs the exact ColumnTransformer pipeline matching the notebook.
    """
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('winsorizer', OutlierWinsorizer(lower_quantile=0.005, upper_quantile=0.995)),
        ('scaler', StandardScaler())
    ])

    ord_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OrdinalEncoder(categories=[EDU_ORDER, INC_ORDER, ALC_ORDER], handle_unknown='use_encoded_value', unknown_value=-1))
    ])

    nom_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(transformers=[
        ('num', num_pipeline, ALL_NUM_COLS_E5),
        ('ord', ord_pipeline, ORDINAL_COLS),
        ('nom', nom_pipeline, NOMINAL_COLS)
    ])

    return preprocessor


def prepare_raw_input(raw_dict: dict) -> pd.DataFrame:
    """
    Takes user input dictionary from API, ensures all expected columns exist,
    applies type casting, and returns a 1-row DataFrame.
    """
    # Expected raw predictor columns (39 in total)
    expected_cols = [
        'age', 'sex', 'race_ethnicity', 'education_level', 'income_level',
        't2d_prs', 'prs_percentile', 'genetic_risk_category',
        'mother_diabetes', 'father_diabetes', 'sibling_diabetes', 'grandparent_diabetes',
        'family_diabetes_history', 'num_affected_relatives', 'family_history_score',
        'physical_activity_minutes_week', 'moderate_activity_days', 'vigorous_activity_days',
        'sedentary_hours_day', 'sleep_duration_hours', 'sleep_quality_score',
        'fruit_intake', 'vegetable_intake', 'whole_grain_intake',
        'processed_food_frequency', 'sugary_drink_frequency', 'diet_quality_score',
        'smoking_status', 'smoking_pack_years', 'alcohol_use', 'alcohol_frequency',
        'stress_level', 'bmi', 'waist_circumference', 'systolic_bp', 'diastolic_bp',
        'cholesterol', 'triglycerides', 'hypertension'
    ]

    row = {}
    for col in expected_cols:
        val = raw_dict.get(col, None)
        row[col] = val

    df = pd.DataFrame([row])

    # Convert numeric fields
    for col in ALL_RAW_NUM_COLS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    # Apply E4 engineered features
    df_e4 = engineer_e4_features(df)

    # Apply E5 interaction features
    df_e5 = engineer_e5_interactions(df_e4)

    return df_e5

