import sys
import os
import json
import time

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))
from predict import predict_risk, simulate_what_if, get_model

def run_tests():
    print("==================================================")
    print("   Type-2 Diabetes AI Model Verification Tests   ")
    print("==================================================")
    
    # 1. Model Loading
    model, features = get_model()
    print(f"[PASS] Champion Model loaded successfully. Transformed feature dimensions: {len(features)}")
    
    # 2. Config Files
    config_dir = 'backend/config'
    files = ['model_metrics.json', 'all_experiments_metrics.json', 'dataset_stats.json', 'feature_schema.json', 'shap_summary.json']
    for fn in files:
        fpath = os.path.join(config_dir, fn)
        assert os.path.exists(fpath), f"Missing {fn}"
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            assert len(data) > 0
        print(f"[PASS] Configuration file {fn} verified.")
        
    # 3. Test Sample Predictions across multiple profiles
    with open(os.path.join(config_dir, 'dataset_stats.json'), 'r', encoding='utf-8') as f:
        stats = json.load(f)
    
    profiles = stats['sample_profiles']
    print(f"\n[INFO] Evaluating {len(profiles)} diverse participant clinical profiles:")
    for prof in profiles:
        res = predict_risk(prof['data'])
        print(f"  * {prof['name']:<45} -> Risk: {res['probability_percentage']:>5.1f}% | {res['risk_classification']['level']:<15} | Threshold: {res['decision_threshold_percentage']}%")
        assert 0.0 <= res['probability'] <= 1.0
        assert len(res['engineered_features']) == 8
        assert len(res['top_risk_increasing_factors']) > 0 or len(res['top_protective_factors']) > 0

    # 4. Test Counterfactual What-If Simulation
    high_risk_data = profiles[1]['data']
    modifications = {
        "physical_activity_minutes_week": 300,
        "bmi": 24.5,
        "diet_quality_score": 85.0,
        "sleep_duration_hours": 7.5
    }
    what_if_res = simulate_what_if(high_risk_data, modifications)
    print(f"\n[PASS] What-If Counterfactual Simulation:")
    print(f"  * Baseline: {what_if_res['baseline_percentage']:.1f}% ({what_if_res['baseline_risk_level']})")
    print(f"  * Scenario: {what_if_res['modified_percentage']:.1f}% ({what_if_res['modified_risk_level']})")
    print(f"  * Risk Reduction: {what_if_res['percentage_point_change']:.1f} percentage points")
    assert what_if_res['percentage_point_change'] < 0, "Lifestyle optimization should reduce risk"

    print("\nALL VERIFICATION TESTS COMPLETED WITH 100% SUCCESS!")

if __name__ == '__main__':
    run_tests()
