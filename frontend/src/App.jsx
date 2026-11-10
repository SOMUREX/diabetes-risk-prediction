import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import PredictionResultsPage from './pages/PredictionResultsPage';
import FeatureExplorerPage from './pages/FeatureExplorerPage';
import DashboardPage from './pages/DashboardPage';
import ModelInsightsPage from './pages/ModelInsightsPage';
import ExplainableAiPage from './pages/ExplainableAiPage';
import WhatIfPage from './pages/WhatIfPage';
import ResearchFrameworkPage from './pages/ResearchFrameworkPage';
import AboutProjectPage from './pages/AboutProjectPage';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [predictionResult, setPredictionResult] = useState(null);
  const [whatIfBaseline, setWhatIfBaseline] = useState(null);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} />;
      case 'assessment':
        return (
          <RiskAssessmentPage 
            setActivePage={setActivePage} 
            setPredictionResult={setPredictionResult} 
          />
        );
      case 'results':
        return (
          <PredictionResultsPage 
            predictionResult={predictionResult} 
            setActivePage={setActivePage}
            setWhatIfBaseline={setWhatIfBaseline}
          />
        );
      case 'explorer':
        return <FeatureExplorerPage setActivePage={setActivePage} />;
      case 'what-if':
        return (
          <WhatIfPage 
            whatIfBaseline={whatIfBaseline} 
            setWhatIfBaseline={setWhatIfBaseline} 
          />
        );
      case 'dashboard':
        return <DashboardPage />;
      case 'insights':
        return <ModelInsightsPage />;
      case 'xai':
        return <ExplainableAiPage />;
      case 'framework':
        return <ResearchFrameworkPage />;
      case 'about':
        return <AboutProjectPage />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        hasPrediction={!!predictionResult} 
      />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderPage()}
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
}

