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
  const CONFIG = {
    SQ_FT_PER_KW: 100,

    MONTHLY_GENERATION_PER_KW: 135,

    TARIFF_PER_UNIT_INR: 7,

    COST_PER_KW_INR: 65000,

    SYSTEM_LIFETIME_YEARS: 25,
  };

  const systemCapacityKw = Math.floor(roofAreaSqFt / CONFIG.SQ_FT_PER_KW);

  const monthlyGenerationUnits =
    systemCapacityKw * CONFIG.MONTHLY_GENERATION_PER_KW;

  const monthlySavingsInr = monthlyGenerationUnits * CONFIG.TARIFF_PER_UNIT_INR;

  const totalSystemCostInr = systemCapacityKw * CONFIG.COST_PER_KW_INR;

  const annualSavingsInr = monthlySavingsInr * 12;
  const paybackYears =
    annualSavingsInr > 0
      ? parseFloat((totalSystemCostInr / annualSavingsInr).toFixed(1))
      : 999;

  const lifetimeNetProfitInr =
    annualSavingsInr * CONFIG.SYSTEM_LIFETIME_YEARS - totalSystemCostInr;

  return {
    systemCapacityKw,
    monthlyGenerationUnits,
    monthlySavingsInr,
    totalSystemCostInr,
    paybackYears,
    lifetimeNetProfitInr,
  };
};
