import { round } from "./power-model.js";

export function formatCurrency(value) {
  return `$${round(value, 2).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(value, digits = 2) {
  return round(value, digits).toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function createExecutiveSummary(analysis) {
  const risk = analysis.harmonics.risk;
  const payback = analysis.correction.paybackMonths === null ? "not available" : `${formatNumber(analysis.correction.paybackMonths, 1)} months`;
  return `
    <h2>Executive Engineering Summary</h2>
    <p>The connected load is estimated at <strong>${formatNumber(analysis.totals.pKw)} kW</strong>, <strong>${formatNumber(analysis.totals.qKvar)} kVAr</strong>, and <strong>${formatNumber(analysis.totals.sKva)} kVA</strong>. The displacement power factor is <strong>${formatNumber(analysis.totals.displacementPf, 3)}</strong>, while harmonic distortion gives a true power factor of <strong>${formatNumber(analysis.harmonics.truePf, 3)}</strong>.</p>
    <p>To reach the selected target power factor, the screening calculation recommends <strong>${formatNumber(analysis.correction.qcNeeded)} kVAr</strong> of compensation. Estimated monthly savings are <strong>${formatCurrency(analysis.correction.monthlySavings)}</strong>, with a simple payback of <strong>${payback}</strong>.</p>
    <p>Harmonic screening is rated <strong class="${risk.className}">${risk.level}</strong>. ${risk.action}</p>
    <ul>
      <li><strong>Power factor correction:</strong> size capacitors from fundamental reactive demand.</li>
      <li><strong>Harmonics:</strong> use current THD, voltage THD, dominant orders, and nonlinear load share to decide whether filters or detuned banks are needed.</li>
      <li><strong>Publication note:</strong> report calculations as screening estimates and cite the software version used.</li>
    </ul>
  `;
}

export function buildReportState(state, analysis) {
  return {
    generatedAt: new Date().toISOString(),
    state,
    analysis: {
      totals: analysis.totals,
      economics: analysis.economics,
      correction: analysis.correction,
      harmonics: analysis.harmonics,
      loads: analysis.loads
    }
  };
}
