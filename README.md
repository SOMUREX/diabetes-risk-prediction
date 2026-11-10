# DiabeteRisk.AI — Multi-Modal Type-2 Diabetes Risk Prediction Platform

> **Academic Final-Year Capstone Project — Review III Demonstration**  
> **Project Title:** *Inherited-Susceptibility–Aware Lifestyle Risk Modelling for Personalized Type-2 Diabetes Prediction Using Machine Learning and Deep Learning*  
> **GitHub Repository:** [https://github.com/SOMUREX/diabetes-risk-prediction](https://github.com/SOMUREX/diabetes-risk-prediction)

---

## 🌐 Live Application & Access Links

| Service | Access Link | Description |
| :--- | :--- | :--- |
| **Integrated Web Application** | [http://localhost:8000](http://localhost:8000) | Complete unified UI (React + FastAPI) running on a single port |
| **React Development Server** | [http://localhost:3000](http://localhost:3000) | Vite frontend with hot-module reload & API proxying |
| **Interactive API Documentation** | [http://localhost:8000/docs](http://localhost:8000/docs) | Live Swagger UI for testing all prediction endpoints |
| **System Health Check** | [http://localhost:8000/api/health](http://localhost:8000/api/health) | Live JSON health & pipeline verification endpoint |
| **GitHub Source Code** | [https://github.com/SOMUREX/diabetes-risk-prediction](https://github.com/SOMUREX/diabetes-risk-prediction) | Public source code, datasets, model weights & notebooks |

*(When deployed to cloud services such as Render, Railway, or Hugging Face Spaces, replace `localhost` with your production URL, e.g. `https://diabetes-risk-ai.onrender.com`)*

---

## 1. Executive Summary & Research Novelty

Type-2 Diabetes Mellitus (T2DM) arises from a complex interplay between polygenic inherited predisposition and environmental/behavioral lifestyle factors. Traditional clinical calculators typically analyze either lifestyle questionnaires or genetic markers in isolation, ignoring potential non-linear synergies between them.

This research prototype introduces an end-to-end machine learning platform that evaluates:
1. **Inherited Susceptibility:** Synthetic Polygenic Risk Score (PRS) normalized as a standardized Z-score liability scale.
2. **Multigenerational Pedigree History:** Weighted family history scoring across parents, siblings, and grandparents.
3. **Modifiable Lifestyle Factors:** Weekly physical exercise volume, sleep architecture, diet quality score, sedentary hours, and smoking exposure.
4. **Clinical & Hemodynamic Biomarkers:** BMI, visceral waist circumference, systolic/diastolic blood pressure, and serum lipids.
5. **Gene-Environment (GxE) Interactions:** Explicit standardized interaction terms between PRS and modifiable lifestyle variables (`PRS × Diet Quality`, `PRS × Physical Activity`, `PRS × Sleep`, and `PRS × BMI`).

Empirical non-parametric bootstrapping (1,000 resamples) confirms that incorporating standardized GxE interaction terms (**Experiment 5**) achieves a statistically significant performance boost over non-interaction models (**$p = 0.0410$**, $95\%\text{ CI } [-0.0006, 0.0094]$), establishing the **E5 L2-Regularized Logistic Regression** model ($C=0.01$) as the overall project champion.

---

## 2. Experimental Framework: E1 to E6

| Experiment | Description | Features Included | Excluded Features | Champion Model & Performance |
| :--- | :--- | :--- | :--- | :--- |
| **E1** | Baseline Lifestyle & Clinical | Demographics (5) + Lifestyle (17) + Clinical (7) = **29 features** | Genetic PRS & Family History | XGBoost (AUC: **0.7452**) / Logistic Regression (AUC: **0.7448**) |
| **E2** | Inherited & Pedigree Baseline | PRS (3) + Pedigree History (7) = **10 features** | Lifestyle & Clinical variables | Logistic Regression (AUC: **0.6562**) / XGBoost (AUC: **0.6561**) |
| **E3** | Combined Raw Multi-Modal | All E1 + E2 features = **39 raw predictor variables** | Engineered & GxE terms | Logistic Regression (AUC: **0.7791**) |
| **E4** | Domain-Specific Feature Engineering | E3 (39) + CVRI, SSR, DAS, OAS = **43 features** | GxE interaction terms | Logistic Regression (AUC: **0.7790**) |
| **E5** | **Gene-Environment (GxE) Modeling** | E4 (43) + 4 GxE interaction terms = **47 features (57 transformed)** | None (Full Feature Space) | **Logistic Regression Champion (AUC: 0.7835, PR-AUC: 0.4110, Brier: 0.1054)** |
| **E6** | Statistical Comparison & Champion Selection | Paired 1,000 Bootstraps, Calibration Curves, Subgroup Analysis | N/A | **Empirical $p = 0.0410$** (Statistically Significant Enhancement) |

### E4 Non-Interaction Engineered Indices
- **Cardiovascular Risk Index (CVRI):** `systolic_bp * diastolic_bp / 100.0`
- **Sleep-to-Sedentary Ratio (SSR):** `sleep_duration_hours / (sedentary_hours_day + 0.1)`
- **Diet-Activity Synergy (DAS):** `diet_quality_score * physical_activity_minutes_week`
- **Obesity-Age Score (OAS):** `bmi * age`

### E5 Standardized Gene-Environment Interaction Terms
To prevent data leakage, training-split means and standard deviations are computed and fixed:
- **GxE1 (PRS × Activity):** `prs_std * activity_std`
- **GxE2 (PRS × Sleep):** `prs_std * sleep_std`
- **GxE3 (PRS × Diet Quality):** `prs_std * diet_std` ($\beta = -0.1549$, strongest protective interaction)
- **GxE4 (PRS × BMI):** `prs_std * bmi_std` ($\beta = +0.0381$, compounded adiposity hazard)

---

## 3. Technology Stack & System Architecture

```
DiabeteRisk AI Architecture
┌────────────────────────────────────────────────────────┐
│               React 18 + Tailwind CSS UI               │
│   (Recharts Visualizations, Circular Gauge, Presets)   │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JSON)
┌───────────────────────────▼────────────────────────────┐
│                  FastAPI Backend Server                │
│             (Port 8000, Uvicorn ASGI Server)           │
├────────────────────────────────────────────────────────┤
│                 Preprocessing Pipeline                 │
│  - SimpleImputer (Median for Num, Mode for Cat)        │
│  - OutlierWinsorizer (0.5% lower, 99.5% upper)         │
│  - StandardScaler, OrdinalEncoder, OneHotEncoder       │
│  - Non-Interaction (E4) & GxE (E5) Feature Computation │
├────────────────────────────────────────────────────────┤
│             Champion E5 Model (Scikit-Learn)           │
│   - L2-Regularized Logistic Regression (C=0.01)        │
│   - Optimal F1 Decision Threshold = 27.94%             │
│   - Linear SHAP & Exact Log-Odds Attributions          │
└────────────────────────────────────────────────────────┘
```

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React Icons, Recharts
- **Backend:** Python 3.10+, FastAPI, Uvicorn, Pydantic, Scikit-learn, Pandas, NumPy, Joblib
- **Machine Learning Artifacts:** Scikit-Learn `ColumnTransformer` + `LogisticRegression` pipeline saved via Joblib

---

## 4. Repository Structure

```
DiabetesAI/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── CircularGauge.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── RiskAssessmentPage.jsx
│       │   ├── PredictionResultsPage.jsx
│       │   ├── FeatureExplorerPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── ModelInsightsPage.jsx
│       │   ├── ExplainableAiPage.jsx
│       │   ├── WhatIfPage.jsx
│       │   ├── ResearchFrameworkPage.jsx
│       │   └── AboutProjectPage.jsx
│       ├── services/
│       │   └── api.js
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── backend/
│   ├── main.py                  # FastAPI server & route handlers
│   ├── predict.py               # Singleton model loader & prediction engine
│   ├── preprocessing.py         # OutlierWinsorizer, E4/E5 feature engineering
│   ├── train_and_save.py        # Reproducible model training & artifact exporter
│   ├── model/
│   │   └── champion_diabetes_model.joblib
│   ├── data/
│   │   ├── diabetes_master_dataset.csv
│   │   ├── demographics.csv
│   │   ├── genetic_data.csv
│   │   ├── family_history.csv
│   │   ├── lifestyle_clinical.csv
│   │   └── diabetes_outcome.csv
│   ├── config/
│   │   ├── feature_schema.json
│   │   ├── model_metrics.json
│   │   ├── dataset_stats.json
│   │   ├── all_experiments_metrics.json
│   │   └── shap_summary.json
│   └── requirements.txt
│
├── notebooks/
│   └── diabetes_prediction.ipynb
│
├── run_backend.bat              # One-click backend startup script
├── run_frontend.bat             # One-click frontend startup script
├── run_all.bat                  # One-click full-stack launcher
├── test_api.py                  # End-to-end automated verification test suite
└── README.md
```

---

## 5. Quick Start & Execution Guide

### Prerequisites
- Python 3.10, 3.11, 3.12, or 3.13
- Node.js (v18+) and npm

### Method A: One-Click Launch (Windows)
Double-click `run_all.bat` or run:
```powershell
.\run_all.bat
```
This automatically starts the FastAPI backend on `http://127.0.0.1:8000` and the React frontend on `http://localhost:3000`.

---

### Method B: Manual Step-by-Step Execution

#### 1. Setup and Run Backend
```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- API Health Status: `http://127.0.0.1:8000/api/health`
- Interactive Swagger API Documentation: `http://127.0.0.1:8000/docs`

#### 2. Setup and Run Frontend
In a separate terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open your browser and navigate to: `http://localhost:3000`

---

## 6. Verification and Automated Testing

Execute the automated verification test suite to ensure the pipeline, model artifacts, and predictions match the notebook down to four decimal places:
```powershell
python test_api.py
```

### Verified Benchmark Output:
```
==================================================
   Type-2 Diabetes AI Model Verification Tests   
==================================================
[PASS] Champion Model loaded successfully. Transformed feature dimensions: 57
[PASS] Configuration file model_metrics.json verified.
[PASS] Configuration file all_experiments_metrics.json verified.
[PASS] Configuration file dataset_stats.json verified.
[PASS] Configuration file feature_schema.json verified.
[PASS] Configuration file shap_summary.json verified.

[INFO] Evaluating 4 diverse participant clinical profiles:
  * Low Risk Profile (Young & Active)                         -> Risk:   1.0% | Low Risk        | Threshold: 27.94%
  * High Risk Profile (GxE Interaction & Clinical Elevated)   -> Risk:  96.6% | High Risk       | Threshold: 27.94%
  * High Genetic Risk with Protective Lifestyle (Mitigation) -> Risk:   2.6% | Low Risk        | Threshold: 27.94%
  * Median Population Profile (Average Adult)                 -> Risk:  18.9% | Moderate Risk   | Threshold: 27.94%

[PASS] What-If Counterfactual Simulation:
  * Baseline: 96.6% (High Risk)
  * Scenario: 45.6% (Elevated Risk)
  * Risk Reduction: -51.0 percentage points

ALL VERIFICATION TESTS COMPLETED WITH 100% SUCCESS!
```

---

## 7. API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | System and ML pipeline operational status |
| `/api/schema` | `GET` | Dynamic form field definitions, units, ranges, and tooltips |
| `/api/predict` | `POST` | Executes E5 Champion prediction; returns probability, threshold, and log-odds contributions |
| `/api/what-if` | `POST` | Simulates counterfactual scenarios with recalculated E4 and E5 GxE terms |
| `/api/feature-explorer`| `POST` | Analyzes custom feature group configurations and maps to experiments E1–E5 |
| `/api/model-info` | `GET` | Model hyperparameters, coefficients, intercept, and evaluation metrics |
| `/api/experiments` | `GET` | Full performance tables for all 5 models across E1–E6 |
| `/api/dataset-stats` | `GET` | 7,000-cohort distributions, demographic rates, and evaluator profile presets |
| `/api/shap` | `GET` | Global SHAP feature importance rankings and directionality |

---

## 8. Academic Governance & Disclaimer

> **Important Medical Notice:**  
> This software is an experimental academic prototype developed for a final-year computer science research evaluation (Review III). It is **not an FDA/CE-cleared medical device** and does not deliver clinical diagnoses, clinical prognosis, or clinical recommendations. Synthetic Polygenic Risk Scores represent simulated continuous liabilities and are not derived from clinical genomic sequencing. Individuals should never initiate, alter, or discontinue medical care based on the estimates generated by this research software.

