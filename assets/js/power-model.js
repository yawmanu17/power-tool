export const DEFAULT_HARMONIC_ORDERS = [3, 5, 7, 11, 13];

export function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

export function round(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Number(number.toFixed(digits));
}

export function calculateLoad(load, system) {
  const mode = load.mode || "kw-pf";
  const loadVoltageKv = Number(load.voltageKv) > 0 ? Number(load.voltageKv) : Number(system.voltageKv);
  const voltageV = Math.max(loadVoltageKv * 1000, 1);
  const multiplier = system.type === "three" ? Math.sqrt(3) : 1;
  const demandFactor = percentOrDefault(load.demandPct, 100);
  const efficiency = percentOrDefault(load.efficiencyPct, defaultEfficiency(load.type));
  const hp = Math.max(Number(load.hp) || 0, 0);
  let p = Math.max(Number(load.pKw) || 0, 0);
  let q = Math.max(Number(load.qKvar) || 0, 0);
  let s = Math.max(Number(load.sKva) || 0, 0);
  let current = Math.max(Number(load.currentA) || 0, 0);
  let pf = clamp(load.pf || defaultPowerFactor(load.type, mode), 0.01, 1);

  if (mode === "motor-hp") {
    p = hp > 0 ? (hp * 0.746 / efficiency) * demandFactor : p * demandFactor;
    s = p / pf;
    q = Math.sqrt(Math.max(s * s - p * p, 0));
  }

  if (mode === "kw-pf") {
    p *= demandFactor;
    s = p / pf;
    q = Math.sqrt(Math.max(s * s - p * p, 0));
  }

  if (mode === "kva-pf") {
    s *= demandFactor;
    p = s * pf;
    q = Math.sqrt(Math.max(s * s - p * p, 0));
  }

  if (mode === "kw-kvar") {
    p *= demandFactor;
    q *= demandFactor;
    s = Math.sqrt(p * p + q * q);
    pf = s > 0 ? p / s : 1;
  }

  if (mode === "current-pf") {
    current *= demandFactor;
    s = (multiplier * voltageV * current) / 1000;
    p = s * pf;
    q = Math.sqrt(Math.max(s * s - p * p, 0));
  }

  current = s > 0 ? (s * 1000) / (multiplier * voltageV) : 0;
  const phiDeg = Math.acos(clamp(pf, 0, 1)) * (180 / Math.PI);

  return {
    id: load.id,
    name: load.name || "Load",
    type: load.type || "Other",
    mode,
    pKw: p,
    qKvar: q,
    sKva: s,
    pf,
    currentA: current,
    phiDeg,
    voltageKv: loadVoltageKv,
    demandFactor,
    efficiency
  };
}

function percentOrDefault(value, fallbackPercent) {
  const number = Number(value);
  const percent = Number.isFinite(number) && number > 0 ? number : fallbackPercent;
  return clamp(percent / 100, 0, 1);
}

function defaultPowerFactor(type = "", mode = "") {
  if (mode === "kw-kvar") return 1;
  const normalized = type.toLowerCase();
  if (normalized.includes("heater")) return 1;
  if (normalized.includes("welder")) return 0.75;
  if (normalized.includes("motor") || normalized.includes("pump") || normalized.includes("fan") || normalized.includes("compressor")) return 0.85;
  if (normalized.includes("vfd") || normalized.includes("drive")) return 0.95;
  if (normalized.includes("transformer")) return 0.98;
  if (normalized.includes("lighting")) return 0.95;
  return 0.9;
}

function defaultEfficiency(type = "") {
  const normalized = type.toLowerCase();
  if (normalized.includes("motor") || normalized.includes("pump") || normalized.includes("fan") || normalized.includes("compressor")) return 90;
  if (normalized.includes("vfd") || normalized.includes("drive")) return 96;
  if (normalized.includes("transformer")) return 98;
  if (normalized.includes("heater")) return 100;
  return 90;
}

export function calculateHarmonics(inputs, totals) {
  const voltageThd = Math.max(Number(inputs.voltageThd) || 0, 0);
  const currentThd = Math.max(Number(inputs.currentThd) || 0, 0);
  const dominant = Math.max(Math.round(Number(inputs.dominantHarmonic) || 5), 2);
  const nonlinearShare = clamp(inputs.nonlinearShare || 0, 0, 100);
  const distortionFactor = 1 / Math.sqrt(1 + (currentThd / 100) ** 2);
  const truePf = clamp(totals.displacementPf * distortionFactor, 0, 1);
  const totalRmsS = totals.sKva / distortionFactor;
  const harmonicS = Math.sqrt(Math.max(totalRmsS ** 2 - totals.sKva ** 2, 0));
  const harmonicCurrent = totals.currentA * (currentThd / 100);
  const orderSet = spreadHarmonics(dominant, currentThd, nonlinearShare);
  const kFactor = orderSet.reduce((sum, item) => sum + (item.percent / 100) ** 2 * item.order ** 2, 1);
  const risk = classifyHarmonicRisk(voltageThd, currentThd, nonlinearShare, inputs.detunedBank, dominant);

  return {
    voltageThd,
    currentThd,
    dominantHarmonic: dominant,
    nonlinearShare,
    distortionFactor,
    truePf,
    totalRmsS,
    harmonicS,
    harmonicCurrent,
    kFactor,
    risk,
    orderSet
  };
}

export function calculateAnalysis(state) {
  const system = {
    type: state.systemType || "single",
    voltageKv: Math.max(Number(state.voltageKv) || 0.23, 0.01),
    frequencyHz: Math.max(Number(state.frequencyHz) || 50, 1)
  };

  const loads = state.loads.map((load) => calculateLoad(load, system));
  const pKw = loads.reduce((sum, load) => sum + load.pKw, 0);
  const qKvar = loads.reduce((sum, load) => sum + load.qKvar, 0);
  const sKva = Math.sqrt(pKw * pKw + qKvar * qKvar);
  const displacementPf = sKva > 0 ? clamp(pKw / sKva, 0, 1) : 1;
  const multiplier = system.type === "three" ? Math.sqrt(3) : 1;
  const currentA = sKva > 0 ? (sKva * 1000) / (multiplier * system.voltageKv * 1000) : 0;
  const impedanceOhm = sKva > 0 ? (system.voltageKv * 1000) ** 2 / (sKva * 1000) : 0;

  const hours = Math.max(Number(state.hoursDay) || 0, 0);
  const days = Math.max(Number(state.daysMonth) || 0, 0);
  const energyRate = Math.max(Number(state.energyRate) || 0, 0);
  const reactiveRate = Math.max(Number(state.reactiveRate) || 0, 0);
  const monthlyHours = hours * days;
  const energyKwh = pKw * monthlyHours;
  const reactiveKvarh = qKvar * monthlyHours;
  const energyCost = energyKwh * energyRate;
  const reactiveCost = reactiveKvarh * reactiveRate;

  const targetPf = clamp(state.targetPf || 0.95, displacementPf, 1);
  const correction = calculateCorrection({
    pKw,
    qKvar,
    targetPf,
    voltageKv: system.voltageKv,
    frequencyHz: system.frequencyHz,
    systemType: system.type,
    monthlyHours,
    reactiveRate,
    capacitorCost: Math.max(Number(state.capacitorCost) || 0, 0)
  });

  const harmonics = calculateHarmonics(state.harmonics, {
    pKw,
    qKvar,
    sKva,
    currentA,
    displacementPf
  });

  return {
    system,
    loads,
    totals: { pKw, qKvar, sKva, displacementPf, currentA, impedanceOhm },
    economics: { monthlyHours, energyKwh, reactiveKvarh, energyCost, reactiveCost },
    correction,
    harmonics
  };
}

function calculateCorrection(inputs) {
  if (inputs.pKw <= 0) {
    return emptyCorrection();
  }

  const currentAngle = Math.atan2(inputs.qKvar, inputs.pKw);
  const targetAngle = Math.acos(clamp(inputs.targetPf, 0.01, 1));
  const qTarget = inputs.pKw * Math.tan(targetAngle);
  const qcNeeded = Math.max(inputs.qKvar - qTarget, 0);
  const correctedQ = Math.max(inputs.qKvar - qcNeeded, 0);
  const correctedS = Math.sqrt(inputs.pKw ** 2 + correctedQ ** 2);
  const correctedPf = correctedS > 0 ? inputs.pKw / correctedS : 1;
  const voltageV = inputs.voltageKv * 1000;
  const omega = 2 * Math.PI * inputs.frequencyHz;
  const capacitanceF = qcNeeded > 0 ? (qcNeeded * 1000) / (omega * voltageV * voltageV) : 0;
  const perPhaseF = inputs.systemType === "three" ? capacitanceF / 3 : capacitanceF;
  const reactiveSavings = qcNeeded * inputs.monthlyHours * inputs.reactiveRate;
  const lossSavings = Math.max(inputs.qKvar - correctedQ, 0) * inputs.monthlyHours * inputs.reactiveRate * 0.06;
  const monthlySavings = reactiveSavings + lossSavings;
  const estimatedCost = qcNeeded * inputs.capacitorCost;
  const paybackMonths = monthlySavings > 0 ? estimatedCost / monthlySavings : null;

  return {
    currentAngle,
    targetAngle,
    qTarget,
    qcNeeded,
    correctedQ,
    correctedS,
    correctedPf,
    capacitanceF,
    perPhaseF,
    reactiveSavings,
    lossSavings,
    monthlySavings,
    estimatedCost,
    paybackMonths
  };
}

function emptyCorrection() {
  return {
    currentAngle: 0,
    targetAngle: 0,
    qTarget: 0,
    qcNeeded: 0,
    correctedQ: 0,
    correctedS: 0,
    correctedPf: 1,
    capacitanceF: 0,
    perPhaseF: 0,
    reactiveSavings: 0,
    lossSavings: 0,
    monthlySavings: 0,
    estimatedCost: 0,
    paybackMonths: null
  };
}

function spreadHarmonics(dominant, currentThd, nonlinearShare) {
  const weights = DEFAULT_HARMONIC_ORDERS.map((order) => ({
    order,
    weight: order === dominant ? 0.5 : 0.5 / (Math.abs(order - dominant) + 1)
  }));
  const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
  const exposure = currentThd * (0.65 + nonlinearShare / 200);
  return weights.map((item) => ({
    order: item.order,
    percent: (item.weight / totalWeight) * exposure
  }));
}

function classifyHarmonicRisk(voltageThd, currentThd, nonlinearShare, detunedBank, dominant) {
  let score = 0;
  if (voltageThd > 5) score += 2;
  else if (voltageThd > 3) score += 1;
  if (currentThd > 20) score += 2;
  else if (currentThd > 8) score += 1;
  if (nonlinearShare > 50) score += 1;
  if (!detunedBank && currentThd > 8) score += 1;
  if ([3, 5, 7].includes(dominant) && currentThd > 12) score += 1;

  if (score >= 4) {
    return {
      level: "High",
      className: "status-high",
      voltageStatus: voltageThd > 5 ? "Above common planning threshold" : "Review with site limits",
      currentStatus: "Detailed harmonic study recommended",
      action: "Use filtered or detuned correction and verify resonance before installation."
    };
  }

  if (score >= 2) {
    return {
      level: "Watch",
      className: "status-watch",
      voltageStatus: voltageThd > 3 ? "Monitor against site standard" : "Usually acceptable",
      currentStatus: "Screen nonlinear sources",
      action: "Check resonance risk before applying standard capacitors."
    };
  }

  return {
    level: "Low",
    className: "status-low",
    voltageStatus: "Low distortion screen",
    currentStatus: "Low distortion screen",
    action: "Standard correction may be suitable after routine verification."
  };
}
