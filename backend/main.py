"""
FastAPI Backend Application
Project: Inherited-Susceptibility–Aware Lifestyle Risk Modelling for Personalized Type-2 Diabetes Prediction
Author: Final Year Academic Research Project
"""

import os
import sys
import json
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from predict import predict_risk, simulate_what_if, get_model
from preprocessing import SCALING_STATS

app = FastAPI(
    title="Type-2 Diabetes Multi-Modal Risk Prediction API",
    description="Academic research prototype integrating polygenic risk, pedigree family history, lifestyle, and clinical factors.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CONFIG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config')


def load_config(filename: str) -> dict:
    filepath = os.path.join(CONFIG_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=500, detail=f"Configuration file {filename} not found.")
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


@app.on_event("startup")
async def startup_event():
    """Load and cache the trained champion model into memory on startup."""
    try:
        model, features = get_model()
        print(f"[API Startup] Champion model successfully loaded with {len(features)} transformed features.")
    except Exception as e:
        print(f"[API Startup ERROR] Failed to load champion model: {e}")


@app.get("/api/health")
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": "Type-2 Diabetes Multi-Modal Risk Prediction Backend",
        "model_loaded": True,
        "framework": "FastAPI + Scikit-Learn Pipeline",
        "synthetic_dataset_cohort": 7000
    }


@app.get("/api/schema")
async def get_schema():
    """Returns feature categories, ranges, and tooltips for form generation."""
    return load_config("feature_schema.json")


@app.get("/api/model-info")
async def get_model_info():
    """Returns champion model metadata, metrics, and feature coefficients."""
    return load_config("model_metrics.json")


@app.get("/api/experiments")
async def get_experiments():
    """Returns all research experiment results (E1-E6) for all 5 models."""
    return load_config("all_experiments_metrics.json")


@app.get("/api/dataset-stats")
async def get_dataset_stats():
    """Returns cohort distributions and sample profile presets for testing."""
    return load_config("dataset_stats.json")


@app.get("/api/shap")
async def get_shap_summary():
    """Returns global SHAP analysis and feature rankings."""
    return load_config("shap_summary.json")


class RiskAssessmentInput(BaseModel):
    # Demographics
    age: float = Field(..., ge=18, le=100, description="Age in years")
    sex: str = Field(..., description="Biological sex ('Male' or 'Female')")
    race_ethnicity: str = Field(..., description="Race/ethnicity")
    education_level: Optional[str] = Field("Undergraduate", description="Educational level")
    income_level: Optional[str] = Field("Middle", description="Household income tier")

    # Inherited & Family
    t2d_prs: float = Field(..., description="Synthetic Polygenic Risk Score (Z-score)")
    prs_percentile: Optional[float] = Field(50.0, description="PRS population percentile (0.1-99.9)")
    genetic_risk_category: Optional[str] = Field("Medium", description="'Low', 'Medium', or 'High'")
    mother_diabetes: int = Field(0, ge=0, le=1)
    father_diabetes: int = Field(0, ge=0, le=1)
    sibling_diabetes: int = Field(0, ge=0, le=1)
    grandparent_diabetes: int = Field(0, ge=0, le=1)
    family_diabetes_history: int = Field(0, ge=0, le=1)
    num_affected_relatives: int = Field(0, ge=0, le=6)
    family_history_score: float = Field(0.0, ge=0.0, le=6.0)

    # Lifestyle
    physical_activity_minutes_week: float = Field(..., ge=0, le=1200)
    moderate_activity_days: int = Field(3, ge=0, le=7)
    vigorous_activity_days: int = Field(1, ge=0, le=7)
    sedentary_hours_day: float = Field(..., ge=0.0, le=24.0)
    sleep_duration_hours: float = Field(..., ge=2.0, le=16.0)
    sleep_quality_score: float = Field(70.0, ge=0, le=100)
    fruit_intake: float = Field(2.0, ge=0.0, le=12.0)
    vegetable_intake: float = Field(3.0, ge=0.0, le=15.0)
    whole_grain_intake: float = Field(2.0, ge=0.0, le=12.0)
    processed_food_frequency: float = Field(2.0, ge=0.0, le=10.0)
    sugary_drink_frequency: float = Field(1.0, ge=0.0, le=10.0)
    diet_quality_score: float = Field(..., ge=0, le=100)
    smoking_status: str = Field("Never", description="'Never', 'Former', or 'Current'")
    smoking_pack_years: float = Field(0.0, ge=0.0, le=100.0)
    alcohol_use: int = Field(1, ge=0, le=1)
    alcohol_frequency: str = Field("Social", description="'None', 'Rare', 'Social', or 'Frequent'")
    stress_level: float = Field(50.0, ge=0, le=100)

    # Clinical
    bmi: float = Field(..., ge=12.0, le=65.0, description="Body Mass Index (kg/m²)")
    waist_circumference: float = Field(..., ge=45.0, le=180.0, description="Waist circumference (cm)")
    systolic_bp: float = Field(..., ge=70.0, le=250.0, description="Systolic blood pressure (mmHg)")
    diastolic_bp: float = Field(..., ge=40.0, le=150.0, description="Diastolic blood pressure (mmHg)")
    hypertension: int = Field(0, ge=0, le=1)
    cholesterol: float = Field(..., ge=80.0, le=450.0, description="Total serum cholesterol (mg/dL)")
    triglycerides: float = Field(..., ge=30.0, le=600.0, description="Serum triglycerides (mg/dL)")


@app.post("/api/predict")
async def run_prediction(payload: Dict[str, Any] = Body(...)):
    """
    Executes model prediction on submitted user assessment.
    Returns estimated probability, threshold evaluation, and factor contributions.
    """
    try:
        # Validate that required keys are provided
        required_keys = ['age', 'sex', 'race_ethnicity', 't2d_prs', 'bmi', 'waist_circumference', 'systolic_bp', 'diastolic_bp']
        missing = [k for k in required_keys if k not in payload]
        if missing:
            raise HTTPException(status_code=422, detail=f"Missing essential fields: {', '.join(missing)}")

        result = predict_risk(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


class WhatIfRequest(BaseModel):
    baseline: Dict[str, Any]
    modifications: Dict[str, Any]


@app.post("/api/what-if")
async def run_what_if(req: WhatIfRequest):
    """
    Simulates counterfactual what-if scenarios with modified lifestyle/clinical inputs.
    """
    try:
        return simulate_what_if(req.baseline, req.modifications)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"What-If simulation error: {str(e)}")


class FeatureExplorerQuery(BaseModel):
    selected_groups: List[str]
    selected_interactions: List[str]


@app.post("/api/feature-explorer")
async def query_feature_explorer(query: FeatureExplorerQuery):
    """
    Interactive Feature Explorer endpoint.
    Determines matching experiment (E1-E5) and returns configuration metadata.
    Enforces rule: Live predictions require exact model training, whereas arbitrary
    combinations are exploratory configurations.
    """
    groups = set(query.selected_groups)
    interactions = set(query.selected_interactions)

    all_groups = {"demographics", "inherited", "family_history", "lifestyle", "clinical"}
    all_interactions = {
        "prs_x_activity", "prs_x_sleep", "prs_x_diet", "prs_x_bmi"
    }

    # Match to experiments
    matched_experiment = None
    experiment_details = None

    experiments_data = load_config("all_experiments_metrics.json")["experiments"]

    # Check E1: Lifestyle, Demographic, Clinical (no genetic, no family history, no interactions)
    if groups == {"demographics", "lifestyle", "clinical"} and not interactions:
        matched_experiment = "E1"
        experiment_details = experiments_data["E1"]
    # Check E2: Inherited Susceptibility + Family History (no lifestyle, no clinical, no interactions)
    elif groups == {"inherited", "family_history"} and not interactions:
        matched_experiment = "E2"
        experiment_details = experiments_data["E2"]
    # Check E3: All 5 groups combined without interactions or engineered terms
    elif groups == all_groups and not interactions:
        matched_experiment = "E3"
        experiment_details = experiments_data["E3"]
    # Check E5: All 5 groups + all 4 interactions (Champion Model configuration)
    elif groups == all_groups and interactions == all_interactions:
        matched_experiment = "E5"
        experiment_details = experiments_data["E5"]

    is_supported_live_model = (matched_experiment == "E5")

    return {
        "selected_groups": list(groups),
        "selected_interactions": list(interactions),
        "total_groups_selected": len(groups),
        "total_interactions_selected": len(interactions),
        "matched_experiment": matched_experiment,
        "is_supported_for_live_prediction": is_supported_live_model,
        "experiment_data": experiment_details,
        "message": (
            "Exact match with Champion Research Model (E5). Live prediction fully active!"
            if is_supported_live_model else
            f"Matches research experiment {matched_experiment}. Historical benchmark metrics available for exploration."
            if matched_experiment else
            "Custom exploratory configuration. In accordance with rigorous ML methodology, predictions are only generated for models trained on the corresponding validated feature schema."
        )
    }


# =====================================================================
# Integrated Full-Stack Serving: Serve compiled React UI from FastAPI
# =====================================================================
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")

if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Let API endpoints, openapi docs pass through without intercepting
        if full_path.startswith("api/") or full_path in ["api", "docs", "redoc", "openapi.json"]:
            raise HTTPException(status_code=404, detail="API route not found")
        
        # Check if requested path is a real file inside dist (e.g. favicon, assets)
        potential_file = os.path.join(DIST_DIR, full_path)
        if full_path and os.path.isfile(potential_file):
            return FileResponse(potential_file)
            
        # Fallback to SPA root index.html
        index_file = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend build index.html not found")


