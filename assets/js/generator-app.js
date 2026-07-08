import { calculateGeneratorCapability, exampleGeneratorInputs } from "./generator-model.js";
import { exportState } from "./storage.js";
import { formatNumber } from "./reporting.js";

const inputIds = [
  "base-mva", "generator-mva", "rated-pf", "mw-rated", "q-max", "q-min", "v-rated-kv", "v-hi", "v-lo",
  "connection-kv", "test-voltage-production", "test-voltage-absorption", "pss-l", "qss-l", "gsu-mva",
  "percent-r", "percent-x", "x-over-r", "taps"
];

const dom = {
  error: document.getElementById("error-message"),
  productionRows: document.getElementById("production-rows"),
  absorptionRows: document.getElementById("absorption-rows"),
  summaryText: document.getElementById("study-summary"),
  chart: document.getElementById("tap-chart")
};

let latestResult = null;

init();

function init() {
  inputIds.forEach((id) => {
    document.getElementById(id).addEventListener("input", calculateAndRender);
  });
  document.getElementById("load-example").addEventListener("click", loadExample);
  document.getElementById("export-json").addEventListener("click", () => {
    exportState({ type: "generator-reactive-capability", result: latestResult });
  });
  document.getElementById("print-report").addEventListener("click", () => window.print());
  calculateAndRender();
}

function loadExample() {
  const example = exampleGeneratorInputs();
  setValue("base-mva", example.baseMva);
  setValue("generator-mva", example.generatorMva);
  setValue("rated-pf", example.ratedPf);
  setValue("mw-rated", example.mwRated);
  setValue("q-max", example.qMax);
  setValue("q-min", example.qMin);
  setValue("v-rated-kv", example.vRatedKv);
  setValue("v-hi", example.vHi);
  setValue("v-lo", example.vLo);
  setValue("connection-kv", example.connectionKv);
  setValue("test-voltage-production", example.testVoltageProduction);
  setValue("test-voltage-absorption", example.testVoltageAbsorption);
  setValue("pss-l", example.pssL);
  setValue("qss-l", example.qssL);
  setValue("gsu-mva", example.gsuMva);
  setValue("percent-r", example.percentR);
  setValue("percent-x", example.percentX);
  setValue("x-over-r", example.xOverR);
  setValue("taps", example.taps);
  calculateAndRender();
}

function calculateAndRender() {
  try {
    const inputs = readInputs();
    if (isBlankStudy(inputs)) {
      latestResult = null;
      clearResults();
      dom.error.textContent = "";
      return;
    }
    latestResult = calculateGeneratorCapability(inputs);
    renderResult(latestResult);
    dom.error.textContent = "";
  } catch (error) {
    latestResult = null;
    clearResults();
    dom.error.textContent = error.message || "Unable to calculate generator capability.";
  }
}

function isBlankStudy(inputs) {
  return Object.values(inputs).every((item) => String(item || "").trim() === "");
}

function readInputs() {
  return {
    baseMva: value("base-mva"),
    generatorMva: value("generator-mva"),
    ratedPf: value("rated-pf"),
    mwRated: value("mw-rated"),
    qMax: value("q-max"),
    qMin: value("q-min"),
    vRatedKv: value("v-rated-kv"),
    vHi: value("v-hi"),
    vLo: value("v-lo"),
    connectionKv: value("connection-kv"),
    testVoltageProduction: value("test-voltage-production"),
    testVoltageAbsorption: value("test-voltage-absorption"),
    pssL: value("pss-l"),
    qssL: value("qss-l"),
    gsuMva: value("gsu-mva"),
    percentR: value("percent-r"),
    percentX: value("percent-x"),
    xOverR: value("x-over-r"),
    taps: value("taps")
  };
}

function renderResult(result) {
  setText("best-production", `${formatNumber(result.summary.bestProductionMvar)} Mvar @ tap ${formatNumber(result.summary.bestProductionTap, 3)}`);
  setText("best-absorption", `${formatNumber(result.summary.strongestAbsorptionMvar)} Mvar @ tap ${formatNumber(result.summary.strongestAbsorptionTap, 3)}`);
  setText("limited-cases", `${result.summary.limitedProduction + result.summary.limitedAbsorption} cases`);
  setText("review-status", result.summary.reviewLevel);
  dom.summaryText.textContent = result.summary.action;

  renderRows(dom.productionRows, result.production);
  renderRows(dom.absorptionRows, result.absorption);
  renderChart(result);
}

function renderRows(body, rows) {
  body.innerHTML = "";
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatNumber(row.tap, 3)}</td>
      <td>${formatNumber(row.v1, 4)}</td>
      <td>${formatNumber(row.v2, 4)}</td>
      <td>${formatNumber(row.qgMvar)}</td>
      <td>${formatNumber(row.qLossMvar)}</td>
      <td>${formatNumber(row.q2Mvar)}</td>
      <td>${formatNumber(row.p2Mw)}</td>
      <td><span class="status-pill ${row.limited ? "status-review" : "status-ok"}">${row.limited ? "Limited" : "OK"}</span></td>
    `;
    body.appendChild(tr);
  });
}

function renderChart(result) {
  const canvas = dom.chart;
  const ctx = canvas.getContext("2d");
  const width = canvas.width = canvas.clientWidth * devicePixelRatio;
  const height = canvas.height = canvas.clientHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  const padding = 42;
  const plotW = canvas.clientWidth - padding * 2;
  const plotH = canvas.clientHeight - padding * 2;
  const values = [...result.production.map((row) => row.q2Mvar), ...result.absorption.map((row) => row.q2Mvar)];
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const span = Math.max(max - min, 1);
  const xStep = plotW / Math.max(result.production.length - 1, 1);
  const y = (value) => padding + (max - value) / span * plotH;
  const x = (index) => padding + index * xStep;

  ctx.strokeStyle = "#d9dee8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, y(0));
  ctx.lineTo(padding + plotW, y(0));
  ctx.stroke();

  drawLine(ctx, result.production, x, y, "#13795b");
  drawLine(ctx, result.absorption, x, y, "#b42318");

  ctx.fillStyle = "#303846";
  ctx.font = "12px Segoe UI, sans-serif";
  result.production.forEach((row, index) => {
    ctx.fillText(formatNumber(row.tap, 3), x(index) - 12, padding + plotH + 24);
  });
  ctx.fillText("Net Mvar delivered by tap", padding, 18);
  ctx.fillStyle = "#13795b";
  ctx.fillText("Production", padding + plotW - 140, 18);
  ctx.fillStyle = "#b42318";
  ctx.fillText("Absorption", padding + plotW - 70, 18);
}

function drawLine(ctx, rows, x, y, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  rows.forEach((row, index) => {
    if (index === 0) ctx.moveTo(x(index), y(row.q2Mvar));
    else ctx.lineTo(x(index), y(row.q2Mvar));
  });
  ctx.stroke();
  rows.forEach((row, index) => {
    ctx.beginPath();
    ctx.arc(x(index), y(row.q2Mvar), 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function clearResults() {
  ["best-production", "best-absorption", "limited-cases", "review-status"].forEach((id) => setText(id, "N/A"));
  dom.summaryText.textContent = "Enter generator, GSU, station-service, voltage schedule, and tap data to run the screen.";
  dom.productionRows.innerHTML = "";
  dom.absorptionRows.innerHTML = "";
  const ctx = dom.chart.getContext("2d");
  ctx.clearRect(0, 0, dom.chart.width, dom.chart.height);
}

function value(id) {
  return document.getElementById(id).value;
}

function setValue(id, valueToSet) {
  document.getElementById(id).value = valueToSet;
}

function setText(id, text) {
  document.getElementById(id).textContent = text;
}
