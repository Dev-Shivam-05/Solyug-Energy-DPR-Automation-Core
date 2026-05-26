import React, { useState, useEffect } from 'react';
import { CanvasContainer } from './components/3d/CanvasContainer';
import { InteractiveForm } from './components/ui/InteractiveForm';
import { useSolarMath } from './hooks/useSolarMath';
import type { FormData } from './types';
import { initialFormData } from './types';

export default function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Compute local solar parameters
  const calculatedMetrics = useSolarMath(formData.monthlyBill, formData.roofSpace);

  // Numeric count-up interpolation states
  const [animatedKw, setAnimatedKw] = useState(0);
  const [animatedPanels, setAnimatedPanels] = useState(0);
  const [animatedCost, setAnimatedCost] = useState(0);
  const [animatedSubsidy, setAnimatedSubsidy] = useState(0);
  const [animatedNet, setAnimatedNet] = useState(0);
  const [animatedRoi, setAnimatedRoi] = useState(0);

  const handleCalculate = () => {
    setIsCalculating(true);
    setIsCalculated(false);

    // Reset animations
    setAnimatedKw(0);
    setAnimatedPanels(0);
    setAnimatedCost(0);
    setAnimatedSubsidy(0);
    setAnimatedNet(0);
    setAnimatedRoi(0);

    // Simulate real-time rendering logic
    setTimeout(() => {
      setIsCalculating(false);
      setIsCalculated(true);
    }, 1500);
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

      setAnimatedKw(parseFloat((calculatedMetrics.systemSizeKw * ease).toFixed(1)));
      setAnimatedPanels(Math.round(calculatedMetrics.panelCount * ease));
      setAnimatedCost(Math.round(calculatedMetrics.cost * ease));
      setAnimatedSubsidy(Math.round(calculatedMetrics.subsidy * ease));
      setAnimatedNet(Math.round(calculatedMetrics.netCost * ease));
      setAnimatedRoi(parseFloat((calculatedMetrics.roiYears * ease).toFixed(1)));

      if (progress < 1.0) {
        requestAnimationFrame(countUp);
      }
    };

    requestAnimationFrame(countUp);
  }, [isCalculated, isCalculating, calculatedMetrics]);

  // Unified metrics for rendering in the simplified UI
  const displayMetrics = {
    systemSizeKw: animatedKw,
    panelCount: animatedPanels,
    cost: animatedCost,
    subsidy: animatedSubsidy,
    netCost: animatedNet,
    roiYears: animatedRoi,
    annualGeneration: calculatedMetrics.annualGeneration,
    co2Offset: calculatedMetrics.co2Offset,
    monthlyGeneration: calculatedMetrics.monthlyGeneration,
    savingsPerMonth: calculatedMetrics.savingsPerMonth
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05080c] font-display" id="app-root">
      
      {/* 1. DYNAMIC 3D CANVAS VIEWPORT (Takes up full background) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <CanvasContainer panelCount={isCalculated || isCalculating ? calculatedMetrics.panelCount : 0} />
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
