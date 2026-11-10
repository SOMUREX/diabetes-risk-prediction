/**
 * API Service for Communicating with FastAPI Backend
 */

// Seamless integration: Works with Vite proxy, direct FastAPI serving, and external domains
const API_BASE_URL = typeof window !== 'undefined' && window.location.port === '3000'
  ? '/api'
  : (typeof window !== 'undefined' && window.location.origin.includes('8000') ? '/api' : 'http://127.0.0.1:8000/api');

export const fetchHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline or health unreachable:', err);
    return { status: 'offline' };
  }
};

export const fetchSchema = async () => {
  const res = await fetch(`${API_BASE_URL}/schema`);
  if (!res.ok) throw new Error('Failed to load feature schema');
  return await res.json();
};

export const fetchModelInfo = async () => {
  const res = await fetch(`${API_BASE_URL}/model-info`);
  if (!res.ok) throw new Error('Failed to load model info');
  return await res.json();
};

export const fetchExperiments = async () => {
  const res = await fetch(`${API_BASE_URL}/experiments`);
  if (!res.ok) throw new Error('Failed to load experiments');
  return await res.json();
};

export const fetchDatasetStats = async () => {
  const res = await fetch(`${API_BASE_URL}/dataset-stats`);
  if (!res.ok) throw new Error('Failed to load dataset statistics');
  return await res.json();
};

export const fetchShapSummary = async () => {
  const res = await fetch(`${API_BASE_URL}/shap`);
  if (!res.ok) throw new Error('Failed to load SHAP summary');
  return await res.json();
};

export const submitRiskAssessment = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Prediction request failed');
  }
  return await res.json();
};

export const submitWhatIfSimulation = async (baseline, modifications) => {
  const res = await fetch(`${API_BASE_URL}/what-if`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ baseline, modifications })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'What-If simulation failed');
  }
  return await res.json();
};

export const queryFeatureExplorer = async (selectedGroups, selectedInteractions) => {
  const res = await fetch(`${API_BASE_URL}/feature-explorer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      selected_groups: selectedGroups,
      selected_interactions: selectedInteractions
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Feature explorer query failed');
  }
  return await res.json();
};

