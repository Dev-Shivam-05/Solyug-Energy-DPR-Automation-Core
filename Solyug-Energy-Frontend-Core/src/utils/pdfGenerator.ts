import { jsPDF } from 'jspdf';
import type { FormData, SolarMetrics } from '../types';

/**
 * Generates and downloads a beautifully styled premium Detailed Project Report (DPR)
 * in PDF format using the client's data inputs and backend calculations.
 * 
 * @param formData - Client inputs from the Glass Card form
 * @param metrics - Solar metrics computed by the solar math engine
 */
export const downloadDPRReport = (formData: FormData, metrics: SolarMetrics) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Color Palette (Premium Corporate Slate & Sky Blue Theme)
  const colors = {
    primary: [15, 23, 42],       // Deep Slate Navy #0f172a
    secondary: [14, 165, 233],   // Solar Sky Blue #0ea5e9
    accent: [16, 185, 129],      // Emerald Green #10b981
    textDark: [51, 65, 85],      // Slate Dark 700 #334155
    textLight: [100, 116, 139],  // Slate Muted 500 #64748b
    bgLight: [248, 250, 252],    // Slate Light 50 #f8fafc
    border: [226, 232, 240]      // Slate Border 200 #e2e8f0
  };

  // Helper to format currency
  const fmtCurrency = (val: number) => {
    return `INR ${Math.round(val).toLocaleString('en-IN')}`;
  };

  // ═══════════════════════════════════════════════════════════════
  // 1. BRAND HEADER BLOCK
  // ═══════════════════════════════════════════════════════════════
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, 210, 42, 'F');

  // Solaris Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('SOLARIS ENERGY', 15, 22);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('DETAILED PROJECT REPORT (DPR) ● PHOTOVOLTAIC FEASIBILITY ASSESSMENT', 15, 30);

  // Document Metadata (Right-Aligned in Header)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(`DATE: ${new Date().toLocaleDateString('en-IN')}`, 155, 18);
  doc.text('STATUS: SYSTEM DESIGN VERIFIED', 155, 24);
  doc.text('REF ID: SE-DPR-' + Math.floor(10000 + Math.random() * 90000).toString(), 155, 30);

  // ═══════════════════════════════════════════════════════════════
  // 2. CLIENT & SITE PROFILE SECTION
  // ═══════════════════════════════════════════════════════════════
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. CLIENT & PROPERTY PROFILE', 15, 54);

  // Section divider line
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.setLineWidth(0.4);
  doc.line(15, 57, 195, 57);

  // Form label grid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);

  doc.text('Client Name:', 15, 65);
  doc.text('Email Address:', 15, 71);
  doc.text('Phone Number:', 15, 77);

  doc.text('Project Location:', 110, 65);
  doc.text('Roof Ownership:', 110, 71);
  doc.text('Available Roof Area:', 110, 77);

  // Form values grid
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
  
  doc.text(formData.name || '—', 45, 65);
  doc.text(formData.email || '—', 45, 71);
  doc.text(formData.phone || '—', 45, 77);

  doc.text(`${formData.city || 'Navsari'}, ${formData.state || 'Gujarat'}`, 146, 65);
  doc.text('Own', 146, 71);
  doc.text(`${formData.roofSpace} Sq. Ft.`, 146, 77);

  // ═══════════════════════════════════════════════════════════════
  // 3. TECHNICAL SYSTEM DESIGN Recommendations
  // ═══════════════════════════════════════════════════════════════
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. TECHNICAL SYSTEM Recommendations', 15, 92);
  doc.line(15, 95, 195, 95);

  // Box backing for specs highlight
  doc.setFillColor(colors.bgLight[0], colors.bgLight[1], colors.bgLight[2]);
  doc.rect(15, 99, 180, 24, 'F');

  // Specs Titles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);

  doc.text('RECOMMENDED CAPACITY', 20, 106);
  doc.text('EST. ANNUAL GENERATION', 80, 106);
  doc.text('SOLAR MODULE COUNT', 145, 106);

  // Specs Numbers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);

  doc.text(`${metrics.systemSizeKw.toFixed(1)} kWp`, 20, 115);
  doc.text(`${metrics.annualGeneration.toLocaleString('en-IN')} kWh / Yr`, 80, 115);
  doc.text(`${metrics.panelCount} Cells`, 145, 115);

  // ═══════════════════════════════════════════════════════════════
  // 4. FINANCIAL BENEFITS & ESTIMATES
  // ═══════════════════════════════════════════════════════════════
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. FINANCIAL ANALYSIS & ESTIMATES', 15, 134);
  doc.line(15, 137, 195, 137);

  // Table row calculations
  doc.setFontSize(9);
  const tableTop = 142;
  const rowHeight = 7.5;

  // Header row
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(15, tableTop, 180, rowHeight + 0.5, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Parameter', 20, tableTop + 5);
  doc.text('Estimated Value', 132, tableTop + 5);

  // Draw Table Rows
  const drawRow = (label: string, value: string, index: number, isAccent = false) => {
    const y = tableTop + rowHeight + 0.5 + index * rowHeight;
    doc.setFillColor(index % 2 === 0 ? 255 : colors.bgLight[0], index % 2 === 0 ? 255 : colors.bgLight[1], index % 2 === 0 ? 255 : colors.bgLight[2]);
    doc.rect(15, y, 180, rowHeight, 'F');
    
    doc.setFont('helvetica', isAccent ? 'bold' : 'normal');
    doc.setTextColor(
      isAccent ? colors.accent[0] : colors.textDark[0], 
      isAccent ? colors.accent[1] : colors.textDark[1], 
      isAccent ? colors.accent[2] : colors.textDark[2]
    );
    doc.text(label, 20, y + 5);
    doc.text(value, 132, y + 5);
  };

  drawRow('Gross Upfront Solar EPC Investment', fmtCurrency(metrics.cost), 0);
  drawRow('MNRE Government Subsidy (Approx)', fmtCurrency(metrics.subsidy), 1);
  drawRow('Net Upfront Capital Investment', fmtCurrency(metrics.netCost), 2, true);
  drawRow('Est. Electricity Bill Savings', `${fmtCurrency(metrics.savingsPerMonth)} / Month`, 3);
  drawRow('ROI Payback Period', `${metrics.roiYears.toFixed(1)} Years`, 4);
  drawRow('Projected 25-Year Lifetime Net Profit', fmtCurrency(metrics.savingsPerMonth * 12 * 25 - metrics.netCost), 5);

  // ═══════════════════════════════════════════════════════════════
  // 5. ECOLOGICAL IMPACT REPORT
  // ═══════════════════════════════════════════════════════════════
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('4. ENVIRONMENTAL & ECOLOGICAL BENEFITS', 15, 202);
  doc.line(15, 205, 195, 205);

  // Green callout box
  doc.setFillColor(209, 250, 229); // emerald 100
  doc.rect(15, 209, 180, 22, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(4, 120, 87); // emerald 700
  doc.text('🌱 ACTIVE DECARBONISATION IMPACT STATEMENT:', 22, 217);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(6, 95, 70); // emerald 800
  doc.text(`By going solar, your recommended PV array offsets ~${metrics.co2Offset.toFixed(1)} Tons of CO2 emissions annually.`, 22, 223);
  doc.text(`This matches the environmental contribution of planting ~${Math.round(metrics.co2Offset * 45)} mature trees every year!`, 22, 227);

  // ═══════════════════════════════════════════════════════════════
  // 6. TECHNICAL DISCLAIMERS & NOTES
  // ═══════════════════════════════════════════════════════════════
  doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('DISCLAIMER: The calculations, estimates, and assessments provided in this report are for indicative and project proposal purposes only.', 15, 246);
  doc.text('Actual generation values may vary depending on local radiation, weather cycles, system degradation, and active shading constraints.', 15, 250);
  doc.text('Solyug Energy reserves all final engineering layout rights. All regional subsidy approvals are subject to GUVNL and DISCOM regulations.', 15, 254);

  // Signatures
  doc.setLineWidth(0.3);
  doc.setDrawColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
  doc.line(15, 275, 65, 275);
  doc.line(145, 275, 195, 275);
  doc.text('CLIENT SIGNATURE', 26, 279);
  doc.text('SOLYUG ENERGY ENGINEER', 151, 279);

  // Save report
  const filename = `${(formData.name || 'Solar_Proposal').replace(/\s+/g, '_')}_DPR_Report.pdf`;
  doc.save(filename);
};
