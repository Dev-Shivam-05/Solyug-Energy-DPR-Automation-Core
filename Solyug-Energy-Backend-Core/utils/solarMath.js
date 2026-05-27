/**
 * Pure function: Calculates solar recommendations from raw structural inputs
 * NO side effects, NO database calls, NO external dependencies
 * Easy to unit-test, easy to reason about, easy to modify constants later
 *
 * @param {number} monthlyBill - Client's average monthly electricity bill in INR
 * @param {number} roofAreaSqFt - Shadow-free roof area in square feet
 * @returns {Object} Calculated solar metrics for the DPR
 */
export const calculateSolarMetrics = (monthlyBill, roofAreaSqFt) => {
  // ------------------------------------------------------------------------
  // CONFIGURABLE CONSTANTS (Abstracted for easy regional adjustment later)
  // ------------------------------------------------------------------------
  const CONFIG = {
    // 1 kW of solar panels requires ~100 sq. ft. of shadow-free roof space
    SQ_FT_PER_KW: 100,

    // Average monthly generation per 1 kW in Gujarat (units/kWh)
    // Source: MNRE/CERC data for Western India irradiation
    MONTHLY_GENERATION_PER_KW: 135,

    // Average residential electricity tariff in Gujarat (blended rate)
    // Source: Gujarat Urja Vikas Nigam Ltd (GUVNL) tariff slabs
    TARIFF_PER_UNIT_INR: 7,

    // Current market rate for premium residential solar EPC (₹/kW)
    // Includes panels, inverter, mounting, wiring, installation
    COST_PER_KW_INR: 65000,

    // Standard warranty/analysis period for solar ROI calculations
    SYSTEM_LIFETIME_YEARS: 25,
  };

  // ------------------------------------------------------------------------
  // STEP 1: CALCULATE RECOMMENDED SYSTEM CAPACITY (kW)
  // ------------------------------------------------------------------------
  // Simple division: total usable roof area / area required per kW
  // Math.floor ensures we don't over-promise capacity beyond physical constraints
  const systemCapacityKw = Math.floor(roofAreaSqFt / CONFIG.SQ_FT_PER_KW);

  // ------------------------------------------------------------------------
  // STEP 2: ESTIMATE MONTHLY ENERGY GENERATION (Units/kWh)
  // ------------------------------------------------------------------------
  // Capacity (kW) × Generation factor (units/kW/month) = Total monthly output
  const monthlyGenerationUnits =
    systemCapacityKw * CONFIG.MONTHLY_GENERATION_PER_KW;

  // ------------------------------------------------------------------------
  // STEP 3: CALCULATE MONTHLY FINANCIAL SAVINGS (INR)
  // ------------------------------------------------------------------------
  // Units generated × Tariff per unit = Money saved on electricity bill
  const monthlySavingsInr = monthlyGenerationUnits * CONFIG.TARIFF_PER_UNIT_INR;

  // ------------------------------------------------------------------------
  // STEP 4: ESTIMATE TOTAL SYSTEM INVESTMENT (INR)
  // ------------------------------------------------------------------------
  // Capacity (kW) × Cost per kW = Gross upfront investment
  const totalSystemCostInr = systemCapacityKw * CONFIG.COST_PER_KW_INR;

  // ------------------------------------------------------------------------
  // STEP 5: COMPUTE SIMPLE PAYBACK PERIOD (Years)
  // ------------------------------------------------------------------------
  // Total cost / Annual savings = Years to recover investment
  // Guard against division by zero (though monthlySavings should never be 0)
  const annualSavingsInr = monthlySavingsInr * 12;
  const paybackYears =
    annualSavingsInr > 0
      ? parseFloat((totalSystemCostInr / annualSavingsInr).toFixed(1))
      : 999; // Fallback for edge case

  // ------------------------------------------------------------------------
  // STEP 6: PROJECT 25-YEAR LIFETIME NET PROFIT (The Sales Closer)
  // ------------------------------------------------------------------------
  // (Annual savings × 25 years) - Total investment = Net profit over system life
  const lifetimeNetProfitInr =
    annualSavingsInr * CONFIG.SYSTEM_LIFETIME_YEARS - totalSystemCostInr;

  // Return all calculated metrics as a clean object
  return {
    systemCapacityKw,
    monthlyGenerationUnits,
    monthlySavingsInr,
    totalSystemCostInr,
    paybackYears,
    lifetimeNetProfitInr,
  };
};
