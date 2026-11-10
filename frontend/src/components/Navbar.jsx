import React, { useState, useEffect } from 'react';
import { 
  Activity, Dna, LayoutDashboard, BrainCircuit, Sliders, 
  HelpCircle, Sparkles, Menu, X, BookOpen, ShieldAlert
} from 'lucide-react';
import { fetchHealth } from '../services/api';

export default function Navbar({ activePage, setActivePage, hasPrediction }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    fetchHealth().then(res => {
      setBackendOnline(res.status === 'healthy');
    });
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Activity },
    { id: 'assessment', label: 'Risk Assessment', icon: Sliders },
    ...(hasPrediction ? [{ id: 'results', label: 'Prediction Results', icon: Sparkles }] : []),
    { id: 'explorer', label: 'Feature Explorer', icon: Dna },
    { id: 'what-if', label: 'What-If Tool', icon: Sliders },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'insights', label: 'Model Insights', icon: BrainCircuit },
    { id: 'xai', label: 'Explainable AI', icon: Sparkles },
    { id: 'framework', label: 'Research Framework', icon: BookOpen },
    { id: 'about', label: 'About & Limitations', icon: HelpCircle },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Academic Title */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-800 to-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/10 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight font-sans">
                  DiabeteRisk<span className="text-teal-600">.AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  Review III Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                GxE Inherited Susceptibility & Lifestyle Risk Modelling
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Backend Status indicator & Start Assessment CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            <div 
              title={backendOnline ? "FastAPI ML Server Connected (Port 8000)" : "Connecting to Local ML Server..."}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200 cursor-help"
            >
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden lg:inline">{backendOnline ? 'ML Backend Online' : 'Connecting ML...'}</span>
            </div>

            <button
              onClick={() => handleNavClick('assessment')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all shadow-sm shadow-teal-600/20"
            >
              Start Assessment
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick('assessment')}
              className="px-2.5 py-1 text-xs font-semibold text-white bg-teal-600 rounded-lg sm:hidden"
            >
              Assess
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs text-slate-500">
            <span>Server: {backendOnline ? 'Online (FastAPI)' : 'Reconnecting...'}</span>
            <span className="font-semibold text-teal-600">Synthetic Cohort N=7,000</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-navy-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

