import { useMemo } from 'react';
import type { SolarMetrics } from '../types';

export function useSolarMath(monthlyBill: string, roofSpace: string): SolarMetrics {
  return useMemo(() => {
    const bill = parseFloat(monthlyBill) || 0;
    const space = parseFloat(roofSpace) || 0;

    const empty: SolarMetrics = {
      systemSizeKw: 0, panelCount: 0, cost: 0, subsidy: 0, netCost: 0,
      annualGeneration: 0, co2Offset: 0, roiYears: 0,
      monthlyGeneration: 0, savingsPerMonth: 0
    };

    if (bill === 0) return empty;

    let calculatedKw = bill / 1500;
    const structuralMaxKw = space > 0 ? space / 100 : Infinity;
    if (calculatedKw > structuralMaxKw) calculatedKw = structuralMaxKw;

    const systemSizeKw = Math.round(calculatedKw * 10) / 10;
    const panelCount = Math.ceil(systemSizeKw / 0.5);
    const cost = systemSizeKw * 60000;

    let subsidy = 0;
    if (systemSizeKw >= 1 && systemSizeKw < 2) subsidy = 30000;
    else if (systemSizeKw >= 2 && systemSizeKw < 3) subsidy = 60000;
    else if (systemSizeKw >= 3) subsidy = 78000;

    const netCost = Math.max(0, cost - subsidy);
    const annualGeneration = Math.round(systemSizeKw * 4.5 * 365);
    const monthlyGeneration = Math.round(annualGeneration / 12);
    const co2Offset = Math.round((annualGeneration * 0.82) / 1000 * 10) / 10;
    const savingsPerMonth = Math.round(bill * 0.85);
    const annualSavings = savingsPerMonth * 12;
    const roiYears = annualSavings > 0 ? Math.round((netCost / annualSavings) * 10) / 10 : 0;

    return {
      systemSizeKw, panelCount, cost, subsidy, netCost,
      annualGeneration, co2Offset, roiYears,
      monthlyGeneration, savingsPerMonth
    };
  }, [monthlyBill, roofSpace]);
}
