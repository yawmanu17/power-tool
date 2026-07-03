import { calculateAnalysis } from "./power-model.js";
import { saveState, exportState } from "./storage.js";
import { renderCharts } from "./charts.js";
import { buildReportState, createExecutiveSummary, formatCurrency, formatNumber } from "./reporting.js";

const defaultState = {
  systemType: "single",
  voltagePreset: "",
  voltageKv: "",
  frequencyHz: "",
  studyBasis: "nameplate",
  targetPf: "",
  capacitorCost: "",
  energyRate: "",
  reactiveRate: "",
  hoursDay: "",
  daysMonth: "",
  harmonics: {
    voltageThd: "",
    currentThd: "",
    dominantHarmonic: "",
    nonlinearShare: "",
    detunedBank: false
  },
  loads: []
};

function createBlankLoad(name = "Load") {
  return {
    id: crypto.randomUUID(),
    name,
    type: "Motor",
    mode: "motor-hp",
    hp: "",
    pKw: "",
    pf: "",
    sKva: "",
    qKvar: "",
    currentA: "",
    voltageKv: "",
    efficiencyPct: "",
    demandPct: ""
  };
}

const dom = {
  loadList: document.getElementById("load-list"),
  template: document.getElementById("load-template"),
  error: document.getElementById("error-message")
};

let state = normalizeState(defaultState);
let latestAnalysis;

init();

function init() {
  bindStaticEvents();
  renderInputs();
  calculateAndRender();
}

function bindStaticEvents() {
  document.querySelectorAll("[data-system]").forEach((button) => {
    button.addEventListener("click", () => {
      state.systemType = button.dataset.system;
      renderSystemButtons();
      calculateAndRender();
    });
  });

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.tab));
  });

  document.querySelectorAll("[data-input-tab]").forEach((button) => {
    button.addEventListener("click", () => showInputTab(button.dataset.inputTab));
  });

  document.getElementById("add-load").addEventListener("click", () => {
    state.loads.push(createBlankLoad(`Load ${state.loads.length + 1}`));
    renderLoads();
    showInputTab("loads");
    calculateAndRender();
  });

  document.getElementById("calculate").addEventListener("click", calculateAndRender);
  document.getElementById("print-report").addEventListener("click", () => window.print());
  document.getElementById("export-json").addEventListener("click", () => {
    exportState(buildReportState(state, latestAnalysis || calculateAnalysis(state)));
  });

  [
    "voltage-preset", "voltage", "frequency", "study-basis", "target-pf", "capacitor-cost", "energy-rate",
    "reactive-rate", "hours-day", "days-month", "voltage-thd",
    "current-thd", "dominant-harmonic", "nonlinear-share", "detuned-bank"
  ].forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => {
      if (id === "voltage-preset" && input.value) {
        document.getElementById("voltage").value = input.value;
      }
      readGlobalInputs();
      calculateAndRender();
    });
  });
}

function renderInputs() {
  renderSystemButtons();
  setValue("voltage-preset", state.voltagePreset);
  setValue("voltage", state.voltageKv);
  setValue("frequency", state.frequencyHz);
  setValue("study-basis", state.studyBasis);
  setValue("target-pf", state.targetPf);
  setValue("capacitor-cost", state.capacitorCost);
  setValue("energy-rate", state.energyRate);
  setValue("reactive-rate", state.reactiveRate);
  setValue("hours-day", state.hoursDay);
  setValue("days-month", state.daysMonth);
  setValue("voltage-thd", state.harmonics.voltageThd);
  setValue("current-thd", state.harmonics.currentThd);
  setValue("dominant-harmonic", state.harmonics.dominantHarmonic);
  setValue("nonlinear-share", state.harmonics.nonlinearShare);
  document.getElementById("detuned-bank").checked = Boolean(state.harmonics.detunedBank);
  renderLoads();
}

function renderSystemButtons() {
  document.querySelectorAll("[data-system]").forEach((button) => {
    button.classList.toggle("active", button.dataset.system === state.systemType);
  });
}

function renderLoads() {
  dom.loadList.innerHTML = "";
  document.getElementById("load-empty").classList.toggle("hidden", state.loads.length > 0);
  state.loads.forEach((load, index) => {
    const node = dom.template.content.firstElementChild.cloneNode(true);
    node.dataset.loadId = load.id;
    node.querySelector(".load-name").value = load.name;
    node.querySelector(".load-type").value = load.type;
    node.querySelector(".input-mode").value = load.mode;
    node.querySelector(".load-hp").value = load.hp;
    node.querySelector(".load-p").value = load.pKw;
    node.querySelector(".load-pf").value = load.pf;
    node.querySelector(".load-s").value = load.sKva;
    node.querySelector(".load-q").value = load.qKvar;
    node.querySelector(".load-i").value = load.currentA;
    node.querySelector(".load-voltage").value = load.voltageKv;
    node.querySelector(".load-efficiency").value = load.efficiencyPct;
    node.querySelector(".load-demand").value = load.demandPct;
    node.querySelector(".remove-load").addEventListener("click", () => {
      state.loads = state.loads.filter((item) => item.id !== load.id);
      renderLoads();
      calculateAndRender();
    });
    node.querySelectorAll("input, select").forEach((input) => {
      input.addEventListener("input", () => {
        readLoadNode(node, index);
        calculateAndRender();
      });
    });
    dom.loadList.appendChild(node);
  });
}

function readGlobalInputs() {
  state.voltagePreset = document.getElementById("voltage-preset").value;
  state.voltageKv = readNumber("voltage", state.voltagePreset ? Number(state.voltagePreset) : 0.23);
  state.frequencyHz = readNumber("frequency", 50);
  state.studyBasis = document.getElementById("study-basis").value;
  state.targetPf = readNumber("target-pf", 0.95);
  state.capacitorCost = readNumber("capacitor-cost", 18);
  state.energyRate = readNumber("energy-rate", 0.12);
  state.reactiveRate = readNumber("reactive-rate", 0.05);
  state.hoursDay = readNumber("hours-day", 8);
  state.daysMonth = readNumber("days-month", 30);
  state.harmonics = {
    voltageThd: readNumber("voltage-thd", 0),
    currentThd: readNumber("current-thd", 0),
    dominantHarmonic: readNumber("dominant-harmonic", 5),
    nonlinearShare: readNumber("nonlinear-share", 0),
    detunedBank: document.getElementById("detuned-bank").checked
  };
}

function readLoadNode(node, index) {
  state.loads[index] = {
    id: state.loads[index].id,
    name: node.querySelector(".load-name").value || `Load ${index + 1}`,
    type: node.querySelector(".load-type").value,
    mode: node.querySelector(".input-mode").value,
    hp: readNodeNumber(node, ".load-hp", 0),
    pKw: readNodeNumber(node, ".load-p", 0),
    pf: readNodeNumber(node, ".load-pf", 0),
    sKva: readNodeNumber(node, ".load-s", 0),
    qKvar: readNodeNumber(node, ".load-q", 0),
    currentA: readNodeNumber(node, ".load-i", 0),
    voltageKv: readNodeNumber(node, ".load-voltage", 0),
    efficiencyPct: readNodeNumber(node, ".load-efficiency", 0),
    demandPct: readNodeNumber(node, ".load-demand", 100)
  };
}

function calculateAndRender() {
  try {
    readGlobalInputs();
    document.querySelectorAll(".load-card").forEach((node, index) => readLoadNode(node, index));
    latestAnalysis = calculateAnalysis(state);
    renderResults(latestAnalysis);
    saveState(state);
    dom.error.textContent = "";
  } catch (error) {
    dom.error.textContent = error.message || "Unable to calculate analysis.";
  }
}

function renderResults(analysis) {
  setText("total-p", `${formatNumber(analysis.totals.pKw)} kW`);
  setText("total-q", `${formatNumber(analysis.totals.qKvar)} kVAr`);
  setText("total-s", `${formatNumber(analysis.totals.sKva)} kVA`);
  setText("total-current", `${formatNumber(analysis.totals.currentA)} A`);
  setText("displacement-pf", formatNumber(analysis.totals.displacementPf, 3));
  setText("true-pf", formatNumber(analysis.harmonics.truePf, 3));

  setText("qc-needed", `${formatNumber(analysis.correction.qcNeeded)} kVAr`);
  setText("corrected-q", `${formatNumber(analysis.correction.correctedQ)} kVAr`);
  setText("corrected-s", `${formatNumber(analysis.correction.correctedS)} kVA`);
  setText("capacitance", `${formatNumber(analysis.correction.capacitanceF * 1_000_000, 3)} uF`);
  setText("monthly-savings", formatCurrency(analysis.correction.monthlySavings));
  setText("payback", analysis.correction.paybackMonths === null ? "N/A" : `${formatNumber(analysis.correction.paybackMonths, 1)} months`);

  setText("voltage-thd-result", `${formatNumber(analysis.harmonics.voltageThd, 1)}%`);
  setText("current-thd-result", `${formatNumber(analysis.harmonics.currentThd, 1)}%`);
  setText("distortion-factor", formatNumber(analysis.harmonics.distortionFactor, 3));
  setText("harmonic-s", `${formatNumber(analysis.harmonics.harmonicS)} kVA`);
  setText("k-factor", formatNumber(analysis.harmonics.kFactor, 2));
  setText("harmonic-risk", analysis.harmonics.risk.level);
  setText("harmonic-action", analysis.harmonics.risk.action);
  setText("voltage-thd-status", analysis.harmonics.risk.voltageStatus);
  setText("current-thd-status", analysis.harmonics.risk.currentStatus);
  applyRiskClass("harmonic-risk", analysis.harmonics.risk.className);

  renderLoadResults(analysis.loads);
  document.getElementById("executive-summary").innerHTML = createExecutiveSummary(analysis);
  renderCharts(analysis);
}

function renderLoadResults(loads) {
  const body = document.getElementById("load-results");
  body.innerHTML = "";
  loads.forEach((load) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(load.name)}</td>
      <td>${escapeHtml(load.type)}</td>
      <td>${formatNumber(load.pKw)}</td>
      <td>${formatNumber(load.qKvar)}</td>
      <td>${formatNumber(load.sKva)}</td>
      <td>${formatNumber(load.pf, 3)}</td>
      <td>${formatNumber(load.currentA)}</td>
    `;
    body.appendChild(row);
  });
}

function showTab(tab) {
  document.querySelectorAll("[data-tab]").forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
  document.getElementById(`${tab}-panel`).classList.add("active");
  if (latestAnalysis) renderCharts(latestAnalysis);
}

function showInputTab(tab) {
  document.querySelectorAll("[data-input-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.inputTab === tab);
  });
  document.querySelectorAll(".input-section").forEach((section) => section.classList.remove("active"));
  document.getElementById(`${tab}-input`).classList.add("active");
}

function normalizeState(raw) {
  const merged = structuredClone(defaultState);
  Object.assign(merged, raw || {});
  merged.harmonics = { ...defaultState.harmonics, ...(raw?.harmonics || {}) };
  merged.loads = Array.isArray(raw?.loads) && raw.loads.length ? raw.loads.map((load) => ({
    ...createBlankLoad(),
    ...load,
    id: load.id || crypto.randomUUID()
  })) : [];
  return merged;
}

function setValue(id, value) {
  document.getElementById(id).value = value;
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function readNumber(id, fallback) {
  const value = Number(document.getElementById(id).value);
  return Number.isFinite(value) ? value : fallback;
}

function readNodeNumber(node, selector, fallback) {
  const value = Number(node.querySelector(selector).value);
  return Number.isFinite(value) ? value : fallback;
}

function applyRiskClass(id, className) {
  const element = document.getElementById(id);
  element.classList.remove("status-low", "status-watch", "status-high");
  element.classList.add(className);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
