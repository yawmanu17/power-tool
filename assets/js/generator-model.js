export function calculateGeneratorCapability(inputs) {
  const baseMva = positive(inputs.baseMva, 100);
  const taps = parseTaps(inputs.taps);
  if (!taps.length) throw new Error("Enter at least one GSU tap ratio.");

  const pG = required(inputs.mwRated, "Rated MW") / baseMva;
  const qMax = required(inputs.qMax, "Q max") / baseMva;
  const qMin = required(inputs.qMin, "Q min") / baseMva;
  const pssL = nonNegative(inputs.pssL, 0) / baseMva;
  const qssL = nonNegative(inputs.qssL, 0) / baseMva;
  const x = required(inputs.percentX, "GSU percent X") / 100;
  const r = transformerResistance(inputs.percentR, inputs.xOverR, x);
  const z = Math.hypot(r, x);
  if (z <= 0) throw new Error("Transformer impedance must be greater than zero.");

  const vHi = required(inputs.vHi, "High generator voltage limit");
  const vLo = required(inputs.vLo, "Low generator voltage limit");
  const schedules = scheduledVoltages(inputs.connectionKv, inputs.testVoltageProduction, inputs.testVoltageAbsorption);
  const p1 = pG - pssL;
  if (p1 <= 0) throw new Error("Net low-side active power must be greater than zero.");

  const common = { baseMva, taps, p1, qssL, r, x, z, phiDeg: Math.atan2(r, x) * 180 / Math.PI };
  const production = solveMode({
    ...common,
    v1Start: vHi,
    v2Schedule: schedules.production,
    qLimit: qMax,
    isProduction: true
  });
  const absorption = solveMode({
    ...common,
    v1Start: vLo,
    v2Schedule: schedules.absorption,
    qLimit: qMin,
    isProduction: false
  });

  return {
    inputs: { ...inputs, baseMva },
    assumptions: {
      baseMva,
      pG,
      p1,
      pssL,
      qssL,
      qMax,
      qMin,
      r,
      x,
      z,
      phiDeg: common.phiDeg,
      productionSchedule: schedules.production,
      absorptionSchedule: schedules.absorption
    },
    production,
    absorption,
    summary: summarize(production, absorption, qMax, qMin, baseMva)
  };
}

export function exampleGeneratorInputs() {
  return {
    baseMva: 100,
    generatorMva: 347,
    ratedPf: 0.85,
    mwRated: 295,
    qMax: 183,
    qMin: -100,
    vRatedKv: 18,
    vHi: 1.05,
    vLo: 0.95,
    connectionKv: 230,
    testVoltageProduction: "",
    testVoltageAbsorption: "",
    pssL: 5.9,
    qssL: 3.54,
    gsuMva: 350,
    percentR: 0.129,
    percentX: 5.119,
    xOverR: "",
    taps: "1.05, 1.025, 1, 0.975, 0.95"
  };
}

function solveMode({ taps, p1, qssL, r, x, z, phiDeg, v1Start, v2Schedule, qLimit, isProduction, baseMva }) {
  return taps.map((tap) => {
    const v2 = v2Schedule / tap;
    let v1 = v1Start;
    let delta = calculateDelta(v1, v2, p1, z, phiDeg);
    let q1 = calculateQ1(v1, v2, z, delta, phiDeg);
    let qg = q1 + qssL;
    const limited = isProduction ? qg > qLimit : qg < qLimit;

    if (limited) {
      qg = qLimit;
      q1 = qg - qssL;
      const e2 = ((p1 * x) - (q1 * r)) / v2;
      const discriminant = Math.max(v2 ** 2 - 4 * (e2 ** 2 - p1 * r - q1 * x), 0);
      const e1 = (v2 + Math.sqrt(discriminant)) / 2;
      v1 = Math.hypot(e1, e2);
      delta = Math.atan2(e2, e1) * 180 / Math.PI;
    }

    const iSquared = ((v1 * cosd(delta) - v2) ** 2 + (v1 * sind(delta)) ** 2) / (z ** 2);
    const qLoss = iSquared * x;
    const pLoss = iSquared * r;
    const q2 = qg - qssL - qLoss;
    const p2 = p1 - pLoss;
    const trapped = isProduction
      ? Math.max(qLimit - qg, 0)
      : Math.max(qg - qLimit, 0);

    return {
      tap,
      v1,
      v2,
      qg,
      qssL,
      qLoss,
      q2,
      p2,
      pLoss,
      iSquared,
      limited,
      trapped,
      qgMvar: qg * baseMva,
      q2Mvar: q2 * baseMva,
      p2Mw: p2 * baseMva,
      qLossMvar: qLoss * baseMva,
      pLossMw: pLoss * baseMva,
      trappedMvar: trapped * baseMva
    };
  });
}

function summarize(production, absorption, qMax, qMin, baseMva) {
  const bestProduction = production.reduce((best, row) => row.q2 > best.q2 ? row : best, production[0]);
  const strongestAbsorption = absorption.reduce((best, row) => row.q2 < best.q2 ? row : best, absorption[0]);
  const limitedProduction = production.filter((row) => row.limited).length;
  const limitedAbsorption = absorption.filter((row) => row.limited).length;
  const qMaxMvar = qMax * baseMva;
  const qMinMvar = qMin * baseMva;

  return {
    bestProductionTap: bestProduction.tap,
    bestProductionMvar: bestProduction.q2Mvar,
    strongestAbsorptionTap: strongestAbsorption.tap,
    strongestAbsorptionMvar: strongestAbsorption.q2Mvar,
    limitedProduction,
    limitedAbsorption,
    qMaxMvar,
    qMinMvar,
    reviewLevel: limitedProduction || limitedAbsorption ? "Review" : "OK",
    action: limitedProduction || limitedAbsorption
      ? "Some tap cases hit generator reactive or terminal voltage limits. Review GSU tap selection and voltage schedule."
      : "All tap cases remain inside the screening limits."
  };
}

function scheduledVoltages(connectionKv, productionCustom, absorptionCustom) {
  const customProduction = Number(productionCustom);
  const customAbsorption = Number(absorptionCustom);
  if (Number.isFinite(customProduction) && customProduction > 0 && Number.isFinite(customAbsorption) && customAbsorption > 0) {
    return { production: customProduction, absorption: customAbsorption };
  }

  const connection = Number(connectionKv);
  if (connection === 115) return { production: 1.00, absorption: 1.03 };
  if (connection === 230) return { production: 1.01, absorption: 1.04 };
  if (connection === 500) return { production: 1.02, absorption: 1.05 };
  throw new Error("Select 115, 230, or 500 kV, or enter both custom test voltages.");
}

function calculateDelta(v1, v2, p1, z, phiDeg) {
  const argument = (z / (v1 * v2)) * (p1 - (v1 ** 2 / z) * sind(phiDeg));
  const clamped = Math.max(-1, Math.min(1, argument));
  return Math.asin(clamped) * 180 / Math.PI + phiDeg;
}

function calculateQ1(v1, v2, z, delta, phiDeg) {
  return (v1 ** 2 / z) * cosd(phiDeg) - ((v1 * v2) / z) * cosd(delta - phiDeg);
}

function transformerResistance(percentR, xOverR, x) {
  const r = Number(percentR);
  if (Number.isFinite(r) && r > 0) return r / 100;
  const ratio = Number(xOverR);
  if (Number.isFinite(ratio) && ratio > 0) return x / ratio;
  throw new Error("Enter GSU percent R or X/R ratio.");
}

function parseTaps(value) {
  if (Array.isArray(value)) return value.map(Number).filter((item) => Number.isFinite(item) && item > 0);
  return String(value || "")
    .split(/[\s,;]+/)
    .map(Number)
    .filter((item) => Number.isFinite(item) && item > 0);
}

function required(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${label} is required.`);
  return number;
}

function nonNegative(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(number, 0);
}

function positive(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function sind(degrees) {
  return Math.sin(degrees * Math.PI / 180);
}

function cosd(degrees) {
  return Math.cos(degrees * Math.PI / 180);
}

