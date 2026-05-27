import React, { useState, useEffect } from 'react';
import { CanvasContainer } from './components/3d/CanvasContainer';
import { InteractiveForm } from './components/ui/InteractiveForm';
import { useSolarMath } from './hooks/useSolarMath';
import { downloadDPRReport } from './utils/pdfGenerator';
import type { FormData, SolarMetrics } from './types';
import { initialFormData } from './types';

export default function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Storage for backend API calculations
  const [backendMetrics, setBackendMetrics] = useState<SolarMetrics | null>(null);

  // Compute local solar parameters (used as high-performance client fallback)
  const calculatedMetrics = useSolarMath(formData.monthlyBill, formData.roofSpace);

  // Active metrics: uses backend computations if available, otherwise falls back to local math
  const activeMetrics = backendMetrics || calculatedMetrics;

  // Numeric count-up interpolation states
  const [animatedKw, setAnimatedKw] = useState(0);
  const [animatedPanels, setAnimatedPanels] = useState(0);
  const [animatedCost, setAnimatedCost] = useState(0);
  const [animatedSubsidy, setAnimatedSubsidy] = useState(0);
  const [animatedNet, setAnimatedNet] = useState(0);
  const [animatedRoi, setAnimatedRoi] = useState(0);

  // Main submission handler — fetches assessment from local Node.js backend
  const handleCalculate = async () => {
    setIsCalculating(true);
    setIsCalculated(false);
    setBackendMetrics(null);

    // Reset animations
    setAnimatedKw(0);
    setAnimatedPanels(0);
    setAnimatedCost(0);
    setAnimatedSubsidy(0);
    setAnimatedNet(0);
    setAnimatedRoi(0);

    // Standardize and sanitize Indian phone number for Zod validator (+91xxxxxxxxx)
    let phoneStr = formData.phone.replace(/[^0-9]/g, '');
    if (phoneStr.length === 10) {
      phoneStr = '+91' + phoneStr;
    } else if (phoneStr.length === 12 && phoneStr.startsWith('91')) {
      phoneStr = '+' + phoneStr;
    } else if (!phoneStr.startsWith('+91')) {
      phoneStr = '+91' + phoneStr.slice(-10);
    }

    const payload = {
      clientName: formData.name,
      phoneNumber: phoneStr,
      email: formData.email,
      city: formData.city || 'Navsari',
      state: formData.state || 'Gujarat',
      roofOwnership: 'Own',
      monthlyBill: parseFloat(formData.monthlyBill) || 0,
      roofAreaSqFt: parseFloat(formData.roofSpace) || 0
    };

    try {
      const response = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        const recs = resData.data.recommendations;
        
        // Calculate subsidy and netCost dynamically on client based on backend recommendations
        const capacity = recs.systemCapacityKw;
        const grossCost = recs.totalSystemCostInr;
        
        let subsidy = 0;
        if (capacity >= 1 && capacity < 2) subsidy = 30000;
        else if (capacity >= 2 && capacity < 3) subsidy = 60000;
        else if (capacity >= 3) subsidy = 78000;
        
        const netCost = Math.max(0, grossCost - subsidy);
        const annualGen = Math.round(recs.monthlyGenerationUnits * 12);
        const co2 = Math.round((annualGen * 0.82) / 1000 * 10) / 10;

        const metricsFromBackend: SolarMetrics = {
          systemSizeKw: capacity,
          panelCount: Math.ceil(capacity / 0.5),
          cost: grossCost,
          subsidy,
          netCost,
          annualGeneration: annualGen,
          co2Offset: co2,
          roiYears: recs.paybackYears,
          monthlyGeneration: recs.monthlyGenerationUnits,
          savingsPerMonth: recs.monthlySavingsInr
        };

        setBackendMetrics(metricsFromBackend);
        setIsCalculating(false);
        setIsCalculated(true);
      } else {
        console.warn('Backend validation failed, falling back to local calculations:', resData.errors);
        triggerFallback();
      }
    } catch (err) {
      console.warn('Backend is offline, using high-performance local calculations fallback:', err);
      triggerFallback();
    }
  };

  const triggerFallback = () => {
    setBackendMetrics(null);
    setTimeout(() => {
      setIsCalculating(false);
      setIsCalculated(true);
    }, 1200);
  };

  // Triggers DPR PDF download containing exact entries and metrics
  const handleDownloadPDF = () => {
    downloadDPRReport(formData, activeMetrics);
  };

  // Interpolation loop to count up values smoothly
  useEffect(() => {
    if (!isCalculated && !isCalculating) return;

    let startTime = Date.now();
    const duration = 1800; // 1.8s animation

    const countUp = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      const ease = 1 - Math.pow(1 - progress, 4); // Ease out Quartic

      setAnimatedKw(parseFloat((activeMetrics.systemSizeKw * ease).toFixed(1)));
      setAnimatedPanels(Math.round(activeMetrics.panelCount * ease));
      setAnimatedCost(Math.round(activeMetrics.cost * ease));
      setAnimatedSubsidy(Math.round(activeMetrics.subsidy * ease));
      setAnimatedNet(Math.round(activeMetrics.netCost * ease));
      setAnimatedRoi(parseFloat((activeMetrics.roiYears * ease).toFixed(1)));

      if (progress < 1.0) {
        requestAnimationFrame(countUp);
      }
    };

    requestAnimationFrame(countUp);
  }, [isCalculated, isCalculating, activeMetrics]);

  // Unified metrics for rendering in the simplified UI
  const displayMetrics = {
    systemSizeKw: animatedKw,
    panelCount: animatedPanels,
    cost: animatedCost,
    subsidy: animatedSubsidy,
    netCost: animatedNet,
    roiYears: animatedRoi,
    annualGeneration: activeMetrics.annualGeneration,
    co2Offset: activeMetrics.co2Offset,
    monthlyGeneration: activeMetrics.monthlyGeneration,
    savingsPerMonth: activeMetrics.savingsPerMonth
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05080c] font-display" id="app-root">
      
      {/* 1. DYNAMIC 3D CANVAS VIEWPORT (Takes up full background) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <CanvasContainer panelCount={isCalculated || isCalculating ? activeMetrics.panelCount : 0} />
      </div>

      {/* 2. MINIMAL BRANDING HEADER (Top Left) */}
      <header className="absolute top-6 left-6 z-20 pointer-events-none select-none animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <h1 className="text-sm font-mono font-bold tracking-widest text-sky-200/90 uppercase">
            SOLARIS <span className="text-sky-500/30 font-light font-sans">/</span> SIMULATION ENGINE
          </h1>
        </div>
      </header>

      {/* 3. SIMPLIFIED GLASS CARD OVERLAY (Floating left sidebar) */}
      <div className="absolute inset-0 z-10 pointer-events-none w-full h-full flex items-center justify-start p-6 overflow-y-auto select-none">
        <div className="w-full max-w-[370px] pointer-events-auto animate-slide-up self-center">
          <div className="config-glass-card p-6">
            <InteractiveForm 
              formData={formData} 
              setFormData={setFormData} 
              metrics={displayMetrics}
              onCalculate={handleCalculate}
              onDownloadPDF={handleDownloadPDF}
              isCalculated={isCalculated}
              isCalculating={isCalculating}
            />
          </div>
        </div>
      </div>

      {/* 4. DISCRETE FOOTER METADATA */}
      <footer className="absolute bottom-4 left-6 z-20 pointer-events-none select-none font-mono text-[8px] text-slate-500/35 tracking-widest uppercase animate-fade-in">
        SOLYUG ENERGY © 2026 ● HARDWARE EMULATION ENGINE ENERGISED
      </footer>
    </main>
  );
}
