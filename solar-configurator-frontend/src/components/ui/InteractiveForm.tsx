import React, { useState, useCallback } from 'react';
import type { FormData, FieldStatus, SolarMetrics } from '../../types';

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  metrics: SolarMetrics;
  onCalculate: () => void;
  isCalculated: boolean;
  isCalculating: boolean;
}

export const InteractiveForm: React.FC<Props> = ({ 
  formData, 
  setFormData, 
  metrics, 
  onCalculate, 
  isCalculated, 
  isCalculating 
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
                      formData.monthlyBill.trim().length > 0 && 
                      formData.roofSpace.trim().length > 0;

  const fmtCurrency = (val: number) => {
    return val ? `₹${Math.round(val).toLocaleString('en-IN')}` : '—';
  };

  return (
    <div id="dpr-customer-form" className="w-full">
      {/* Brand Header Inside Card */}
      <div className="mb-6 pb-4 border-b border-white/5">
        <h3 className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
          CUSTOMER CONFIGURATION
        </h3>
        <p className="text-[10px] text-slate-400/60 font-mono mt-1">
          REAL-TIME 3D PHOTOVOLTAIC ESTIMATOR
        </p>
      </div>

      <div className="space-y-4.5">
        {/* 1. Name Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="f-name" className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
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

        {/* 2. Location Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="f-city" className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
              Project Location
            </label>
            <span className={`field-status-badge ${
              getFieldStatus('city', formData.city) === 'READY ✓' ? 'badge-ready' :
              getFieldStatus('city', formData.city) === 'TYPING...' ? 'badge-typing' :
              'badge-requesting'
            }`}>
              {getFieldStatus('city', formData.city)}
            </span>
          </div>
          <div className="config-input-wrapper">
            <input
              id="f-city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onFocus={() => handleFocus('city')}
              onBlur={handleBlur}
              placeholder="Navsari, Gujarat"
              className="config-input"
              autoComplete="off"
              spellCheck={false}
            />
            {/* Location Pin Suffix */}
            <div className="absolute right-4 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. Monthly Bill Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="f-monthlyBill" className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
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

        {/* 4. Roof Space Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="f-roofSpace" className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
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

        {/* Submit Estimate Button */}
        <div className="pt-2">
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

        {/* COMPACT METRIC ESTIMATES READOUT SECTION (Reveals inside the card when computed) */}
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

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
