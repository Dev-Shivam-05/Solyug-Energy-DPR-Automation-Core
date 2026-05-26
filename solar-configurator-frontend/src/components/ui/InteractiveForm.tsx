import React, { useState, useCallback } from 'react';
import type { FormData, FieldStatus, SolarMetrics } from '../../types';

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  metrics: SolarMetrics;
  onCalculate: () => void;
  isCalculated: boolean;
  isCalculating: boolean;
  timeOfDay: number;
  setTimeOfDay: (t: number) => void;
  setIsManualTime: (m: boolean) => void;
}

export const InteractiveForm: React.FC<Props> = ({ 
  formData, 
  setFormData, 
  metrics, 
  onCalculate, 
  isCalculated, 
  isCalculating,
  timeOfDay,
  setTimeOfDay,
  setIsManualTime
}) => {
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, [setFormData]);

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  // Helper to determine active field badge status
  const getFieldStatus = (name: keyof FormData, value: string): FieldStatus => {
    if (activeField === name) return 'TYPING...';
    return value.trim().length > 0 ? 'READY ✓' : 'REQUESTING INPUT...';
  };

  const isFormValid = formData.name.trim().length > 0 && 
                      formData.email.trim().length > 0 && 
                      formData.phone.trim().length > 0 && 
                      formData.monthlyBill.trim().length > 0 && 
                      formData.roofSpace.trim().length > 0;

  const fmtCurrency = (val: number) => {
    return val ? `₹${Math.round(val).toLocaleString('en-IN')}` : '—';
  };

  // Helper to convert float hours (e.g. 17.5) into AM/PM digital clock string
  const formatTime = (h: number): string => {
    const totalMinutes = Math.round(h * 60);
    const hh = Math.floor(totalMinutes / 60) % 24;
    const mm = totalMinutes % 60;
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const displayHours = hh % 12 === 0 ? 12 : hh % 12;
    const displayMinutes = mm.toString().padStart(2, '0');
    return `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;
  };

  return (
    <div id="dpr-customer-form" className="w-full text-mono">
      {/* Brand Header Inside Card */}
      <div className="mb-5 pb-3 border-b border-white/5">
        <h3 className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
          CUSTOMER CONFIGURATION
        </h3>
        <p className="text-[10px] text-slate-400/60 font-mono mt-1">
          REAL-TIME 3D PHOTOVOLTAIC ESTIMATOR
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Name Input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="f-name" className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Customer Name
            </label>
            <span className={`field-status-badge ${
              getFieldStatus('name', formData.name) === 'READY ✓' ? 'badge-ready' :
              getFieldStatus('name', formData.name) === 'TYPING...' ? 'badge-typing' :
              'badge-requesting'
            }`}>
              {getFieldStatus('name', formData.name)}
            </span>
          </div>
          <div className="config-input-wrapper">
            <input
              id="f-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
              placeholder="e.g. Rahul Sharma"
              className="config-input"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        {/* 2. Email Input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="f-email" className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Email Address
            </label>
            <span className={`field-status-badge ${
              getFieldStatus('email', formData.email) === 'READY ✓' ? 'badge-ready' :
              getFieldStatus('email', formData.email) === 'TYPING...' ? 'badge-typing' :
              'badge-requesting'
            }`}>
              {getFieldStatus('email', formData.email)}
            </span>
          </div>
          <div className="config-input-wrapper">
            <input
              id="f-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              placeholder="e.g. rahul@example.com"
              className="config-input"
              autoComplete="off"
              spellCheck={false}
            />
            {/* Email Icon Suffix */}
            <div className="absolute right-4 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. Phone Input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="f-phone" className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Phone Number
            </label>
            <span className={`field-status-badge ${
              getFieldStatus('phone', formData.phone) === 'READY ✓' ? 'badge-ready' :
              getFieldStatus('phone', formData.phone) === 'TYPING...' ? 'badge-typing' :
              'badge-requesting'
            }`}>
              {getFieldStatus('phone', formData.phone)}
            </span>
          </div>
          <div className="config-input-wrapper">
            <input
              id="f-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => handleFocus('phone')}
              onBlur={handleBlur}
              placeholder="e.g. +91 98765 43210"
              className="config-input"
              autoComplete="off"
              spellCheck={false}
            />
            {/* Phone Icon Suffix */}
            <div className="absolute right-4 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. Monthly Bill Input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="f-monthlyBill" className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Avg. Monthly Bill
            </label>
            <span className={`field-status-badge ${
              getFieldStatus('monthlyBill', formData.monthlyBill) === 'READY ✓' ? 'badge-ready' :
              getFieldStatus('monthlyBill', formData.monthlyBill) === 'TYPING...' ? 'badge-typing' :
              'badge-requesting'
            }`}>
              {getFieldStatus('monthlyBill', formData.monthlyBill)}
            </span>
          </div>
          <div className="config-input-wrapper">
            <input
              id="f-monthlyBill"
              type="number"
              name="monthlyBill"
              value={formData.monthlyBill}
              onChange={handleChange}
              onFocus={() => handleFocus('monthlyBill')}
              onBlur={handleBlur}
              placeholder="billing amount"
              className="config-input"
              autoComplete="off"
            />
            <div className="absolute right-4 font-sans text-xs font-semibold text-slate-500 select-none">
              ₹
            </div>
          </div>
        </div>

        {/* 5. Roof Space Input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="f-roofSpace" className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Available Roof Space
            </label>
            <span className={`field-status-badge ${
              getFieldStatus('roofSpace', formData.roofSpace) === 'READY ✓' ? 'badge-ready' :
              getFieldStatus('roofSpace', formData.roofSpace) === 'TYPING...' ? 'badge-typing' :
              'badge-requesting'
            }`}>
              {getFieldStatus('roofSpace', formData.roofSpace)}
            </span>
          </div>
          <div className="config-input-wrapper">
            <input
              id="f-roofSpace"
              type="number"
              name="roofSpace"
              value={formData.roofSpace}
              onChange={handleChange}
              onFocus={() => handleFocus('roofSpace')}
              onBlur={handleBlur}
              placeholder="area in sq. ft."
              className="config-input pr-12"
              autoComplete="off"
            />
            <div className="absolute right-4 text-xs font-mono font-semibold text-slate-500 select-none">
              ft.
            </div>
          </div>
        </div>

        {/* 6. INTERACTIVE SUNLIGHT SLIDER */}
        <div className="pt-1.5 pb-2">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Sunlight / Time of Day
            </label>
            <span className="text-[10px] font-bold text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded-full transition-all duration-300 font-mono">
              {formatTime(timeOfDay)}
            </span>
          </div>
          <div className="flex items-center px-1">
            <input
              type="range"
              min="0"
              max="24"
              step="0.1"
              value={timeOfDay}
              onChange={(e) => {
                setIsManualTime(true);
                setTimeOfDay(parseFloat(e.target.value));
              }}
              className="w-full h-1.5 bg-slate-800/90 rounded-lg appearance-none cursor-pointer accent-sky-400 transition-all focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Estimate Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onCalculate}
            disabled={!isFormValid || isCalculating}
            className={`btn-estimate ${(!isFormValid || isCalculating) ? 'opacity-50 cursor-not-allowed saturate-50' : ''}`}
            id="calculate-estimate-btn"
          >
            <span className="flex items-center justify-center gap-2">
              {isCalculating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Calculating Simulation...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Run 3D Simulation
                </>
              )}
            </span>
          </button>
        </div>

        {/* COMPACT METRIC ESTIMATES READOUT SECTION */}
        {(isCalculated || isCalculating) && (
          <div className="animate-slide-up pt-4 mt-2 border-t border-white/5 space-y-3">
            <h4 className="text-[10px] font-mono font-bold tracking-wider text-sky-400 uppercase">
              Calculated Photovoltaic Output
            </h4>
            
            <div className="grid grid-cols-2 gap-2 text-mono">
              
              {/* Capacity */}
              <div className="compact-stat-card">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">System Size</span>
                <span className="text-xs font-bold font-mono text-slate-200 mt-1">
                  {metrics.systemSizeKw > 0 ? `${metrics.systemSizeKw.toFixed(1)} kW` : '—'}
                </span>
              </div>

              {/* Panel Count */}
              <div className="compact-stat-card">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Module Count</span>
                <span className="text-xs font-bold font-mono text-slate-200 mt-1">
                  {metrics.panelCount > 0 ? `${metrics.panelCount} Cells` : '—'}
                </span>
              </div>

              {/* Net Investment */}
              <div className="compact-stat-card">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Net Cost</span>
                <span className="text-xs font-bold font-mono text-sky-400 mt-1">
                  {fmtCurrency(metrics.netCost)}
                </span>
              </div>

              {/* Payback period */}
              <div className="compact-stat-card">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">ROI Payback</span>
                <span className="text-xs font-bold font-mono text-amber-400 mt-1">
                  {metrics.roiYears > 0 ? `${metrics.roiYears} Yrs` : '—'}
                </span>
              </div>

              {/* Est. Savings */}
              <div className="compact-stat-card">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Est. Savings</span>
                <span className="text-xs font-bold font-mono text-emerald-400 mt-1">
                  {metrics.savingsPerMonth > 0 ? `₹${Math.round(metrics.savingsPerMonth * 12).toLocaleString('en-IN')}/Yr` : '—'}
                </span>
              </div>

              {/* CO2 Saved */}
              <div className="compact-stat-card">
                <div className="flex justify-between items-center w-full">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">CO2 Saved</span>
                  {metrics.co2Offset > 0 && (
                    <span className="text-[8px] bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 px-1 rounded font-bold font-mono select-none leading-none pt-0.5 pb-0.5">
                      ECO
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold font-mono text-emerald-400 mt-1">
                  {metrics.co2Offset > 0 ? `${metrics.co2Offset.toFixed(1)} t/Yr` : '—'}
                </span>
                {metrics.co2Offset > 0 && (
                  <span className="text-[8px] text-slate-500/80 font-mono mt-0.5">
                    🌳 ~{Math.round(metrics.co2Offset * 45)} Trees
                  </span>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
