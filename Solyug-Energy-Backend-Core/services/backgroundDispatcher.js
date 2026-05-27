/**
 * Background task dispatcher: Handles async email and n8n webhook tasks
 * Designed to be fire-and-forget from the controller, with built-in error isolation
 *
 * @param {Object} leadData - Plain JS object containing the full saved lead document
 * @returns {Promise<void>} - Resolves when both tasks are attempted (not necessarily succeeded)
 */
export const dispatchBackgroundTasks = async (leadData) => {
  // ------------------------------------------------------------------------
  // TASK A: Trigger client email with PDF (handled by frontend PDF generation)
  // ------------------------------------------------------------------------
  // Since we're using client-side PDF generation, we don't need to generate/send here
  // Instead, we could send a simple "Your report is ready" email with a link
  // For now, we skip this and rely on the frontend to handle PDF + optional email trigger

  // ------------------------------------------------------------------------
  // TASK B: Dispatch structured JSON to n8n webhook for internal alerts
  // ------------------------------------------------------------------------
  try {
    const n8nPayload = {
      event: "new_residential_lead",
      timestamp: new Date().toISOString(),
      leadId: leadData._id,
      data: {
        name: leadData.clientProfile.name,
        phone: leadData.clientProfile.phone,
        city: leadData.clientProfile.city,
        systemSize: `${leadData.solarRecommendations.systemCapacityKw} kW`,
        payback: `${leadData.solarRecommendations.paybackYears} Years`,
        monthlySavings: `₹${leadData.solarRecommendations.monthlySavingsInr.toLocaleString("en-IN")}`,
        lifetimeProfit: `₹${leadData.solarRecommendations.lifetimeNetProfitInr.toLocaleString("en-IN")}`,
      },
    };

    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(n8nPayload),
      timeout: 5000, // Fail fast if n8n is unresponsive
    });

    if (response.ok) {
      await leadData.updateOne({
        "dispatchStatus.n8nWebhookSent": true,
        "dispatchStatus.state": "FULLY_DISPATCHED",
      });
    } else {
      // Log failure but don't throw - the PENDING_DISPATCH status remains for cron recovery
      console.warn(
        `[n8n Webhook Failed] Status: ${response.status} for Lead ${leadData._id}`,
      );
    }
  } catch (error) {
    console.error(`[n8n Dispatch Error] Lead ${leadData._id}:`, error.message);
  }
};
