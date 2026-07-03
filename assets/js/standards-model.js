const IEC_LV_VOLTAGES = new Set([0.12, 0.208, 0.23, 0.24, 0.4, 0.415, 0.48, 0.6, 0.69, 1]);
const IEC_MV_VOLTAGES = new Set([3, 3.3, 4.16, 6, 6.6, 10, 11, 12.47, 13.2, 13.8, 20, 22, 24.94, 30, 33, 34.5, 35]);

export function screenStandards(state, analysis) {
  const basis = state.standardsBasis || "hybrid";
  const voltageClass = classifyVoltage(analysis.system.voltageKv);
  const voltageStatus = checkVoltageStandard(analysis.system.voltageKv, voltageClass);
  const frequencyStatus = [50, 60].includes(Number(analysis.system.frequencyHz))
    ? { level: "Review", text: `${analysis.system.frequencyHz} Hz selected. Confirm against local utility and equipment nameplates.` }
    : { level: "Action", text: "Frequency is outside the usual 50/60 Hz utility basis." };
  const harmonicStatus = screenHarmonics(analysis, voltageClass, basis);
  const correctionStatus = screenCorrection(analysis);
  const equipmentChecks = buildEquipmentChecks(analysis.loads, basis);
  const installationChecks = buildInstallationChecks(analysis, voltageClass, basis);
  const summaryLevel = highestLevel([
    voltageStatus.level,
    frequencyStatus.level,
    harmonicStatus.level,
    correctionStatus.level,
    ...equipmentChecks.map((item) => item.level),
    ...installationChecks.map((item) => item.level)
  ]);

  return {
    basis,
    voltageClass,
    summaryLevel,
    voltageStatus,
    frequencyStatus,
    harmonicStatus,
    correctionStatus,
    equipmentChecks,
    installationChecks,
    references: referencesForBasis(basis)
  };
}

function classifyVoltage(kv) {
  if (kv <= 0.05) return "ELV";
  if (kv <= 1) return "LV";
  if (kv <= 35) return "MV";
  return "HV";
}

function checkVoltageStandard(kv, voltageClass) {
  const rounded = Number(kv.toFixed(3));
  const preferred = voltageClass === "LV" ? IEC_LV_VOLTAGES : IEC_MV_VOLTAGES;
  if (voltageClass === "ELV" || voltageClass === "HV") {
    return { level: "Review", text: `${voltageClass} system. Confirm this tool scope and equipment insulation ratings.` };
  }
  if (preferred.has(rounded)) {
    return { level: "OK", text: `${rounded} kV is in the app's IEC/industry preferred ${voltageClass} voltage list.` };
  }
  return { level: "Review", text: `${rounded} kV is not in the preferred quick-list. Confirm nominal voltage, tolerance, and equipment rating.` };
}

function screenHarmonics(analysis, voltageClass, basis) {
  const voltageThd = analysis.harmonics.voltageThd;
  const currentThd = analysis.harmonics.currentThd;
  const voltageLimit = voltageClass === "LV" ? 8 : 5;
  const currentGuide = currentGuideText(analysis.totals.currentA, basis);
  let level = "OK";
  if (voltageThd > voltageLimit || currentThd > 20) level = "Action";
  else if (voltageThd > voltageLimit * 0.75 || currentThd > 8) level = "Review";

  return {
    level,
    text: `Voltage THD ${voltageThd.toFixed(1)}% screened against ${voltageLimit}% ${voltageClass} planning guide. ${currentGuide}`
  };
}

function currentGuideText(currentA, basis) {
  if (basis === "iec" || basis === "hybrid") {
    if (currentA <= 16) return "For IEC product emission review, check IEC 61000-3-2 scope.";
    if (currentA <= 75) return "For IEC product emission review, check IEC 61000-3-12 scope.";
  }
  return "For facility/PCC harmonic limits, use a site study such as IEEE 519 or utility requirements.";
}

function screenCorrection(analysis) {
  if (analysis.correction.qcNeeded <= 0) {
    return { level: "OK", text: "No capacitor correction is required for the selected target PF." };
  }
  if (analysis.harmonics.currentThd > 8) {
    return {
      level: "Action",
      text: "Capacitor correction is requested while current THD is elevated. Check resonance and use detuned or filtered banks where required."
    };
  }
  return {
    level: "Review",
    text: "Capacitor correction should be reviewed for switching duty, discharge, overcurrent protection, conductor sizing, and available fault current."
  };
}

function buildEquipmentChecks(loads, basis) {
  if (!loads.length) {
    return [{ area: "Load data", level: "Review", text: "Add nameplate or measured loads before standards review." }];
  }

  return loads.map((load) => {
    const type = load.type.toLowerCase();
    if (type.includes("motor") || type.includes("pump") || type.includes("fan") || type.includes("compressor")) {
      return {
        area: load.name,
        level: "Review",
        text: basisText(basis, "NEC Article 430 motor circuits; IEC 60034 motor data and IEC 60947 control/protection coordination.")
      };
    }
    if (type.includes("vfd") || type.includes("drive")) {
      return {
        area: load.name,
        level: "Action",
        text: basisText(basis, "Drive loads need harmonic, grounding, cable, EMC, and motor insulation review. Check IEC 61800 and applicable NEC motor/controller articles.")
      };
    }
    if (type.includes("transformer")) {
      return {
        area: load.name,
        level: "Review",
        text: basisText(basis, "Check transformer loading, impedance, temperature rise, harmonic K-factor exposure, and NEC Article 450 / IEC transformer requirements.")
      };
    }
    if (type.includes("welder")) {
      return {
        area: load.name,
        level: "Review",
        text: basisText(basis, "Welders are intermittent nonlinear loads; review duty cycle, flicker, harmonics, and branch-circuit rules.")
      };
    }
    return {
      area: load.name,
      level: "Review",
      text: "Confirm equipment listing, nameplate voltage/current, duty cycle, short-circuit rating, grounding, and local code requirements."
    };
  });
}

function buildInstallationChecks(analysis, voltageClass, basis) {
  const checks = [
    {
      area: "Voltage class",
      level: voltageClass === "LV" || voltageClass === "MV" ? "Review" : "Action",
      text: `${voltageClass} system detected. Verify insulation level, clearances, grounding, protection, and qualified-person requirements.`
    },
    {
      area: "Capacitors",
      level: analysis.correction.qcNeeded > 0 ? "Review" : "OK",
      text: basisText(basis, "For PF capacitors, review NEC Article 460 and IEC capacitor bank standards for disconnecting, overcurrent protection, discharge, enclosure, and short-circuit rating.")
    },
    {
      area: "Short-circuit duty",
      level: "Review",
      text: "Confirm equipment SCCR/interrupting ratings against available fault current. This app does not replace a short-circuit study."
    },
    {
      area: "Power quality",
      level: analysis.harmonics.risk.level === "High" ? "Action" : analysis.harmonics.risk.level === "Watch" ? "Review" : "OK",
      text: "Confirm voltage THD, current distortion, flicker, unbalance, transients, and neutral loading with field measurements when power quality is critical."
    }
  ];

  return checks;
}

function basisText(basis, text) {
  if (basis === "iec") return text.replace(/NEC[^.;]*/g, "local installation code");
  if (basis === "nec") return text.replace(/IEC[^.;]*/g, "manufacturer/listing standards");
  return text;
}

function referencesForBasis(basis) {
  const common = ["IEC 60038 voltage classes", "IEC 61000 power-quality family", "IEEE 519 harmonic planning at PCC"];
  if (basis === "iec") return [...common, "IEC equipment/product standards by load type"];
  if (basis === "nec") return ["NFPA 70 NEC installation review", "NEC Article 430 motors", "NEC Article 450 transformers", "NEC Article 460 capacitors", "IEEE 519 harmonic planning at PCC"];
  return [...common, "NFPA 70 NEC installation review", "NEC Articles 430, 450, and 460 where applicable"];
}

function highestLevel(levels) {
  if (levels.includes("Action")) return "Action";
  if (levels.includes("Review")) return "Review";
  return "OK";
}
