let powerChart;
let costChart;
let beforeCorrectionTriangle;
let afterCorrectionTriangle;
let harmonicWaveformChart;

export function renderCharts(analysis) {
  renderPowerChart(analysis);
  renderCostChart(analysis);
  renderCorrectionTriangles(analysis);
  renderHarmonicWaveform(analysis);
}

function renderPowerChart(analysis) {
  const canvas = document.getElementById("power-chart");
  if (!canvas) return;
  if (!window.Chart) {
    drawBarChart(canvas, {
      title: "Power Component Distinctions",
      labels: ["P kW", "Q kVAr", "S kVA", "Harmonic kVA"],
      values: [analysis.totals.pKw, analysis.totals.qKvar, analysis.totals.sKva, analysis.harmonics.harmonicS],
      colors: ["#245a9b", "#a15c00", "#13795b", "#b42318"]
    });
    return;
  }
  if (powerChart) powerChart.destroy();

  powerChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["P kW", "Q kVAr", "S kVA", "Harmonic kVA"],
      datasets: [{
        label: "Power components",
        data: [
          analysis.totals.pKw,
          analysis.totals.qKvar,
          analysis.totals.sKva,
          analysis.harmonics.harmonicS
        ],
        backgroundColor: ["#245a9b", "#a15c00", "#13795b", "#b42318"]
      }]
    },
    options: baseOptions("Power Component Distinctions")
  });
}

function renderCostChart(analysis) {
  const canvas = document.getElementById("cost-chart");
  if (!canvas) return;
  if (!window.Chart) {
    drawBarChart(canvas, {
      title: "Monthly Cost and Savings",
      labels: ["Energy", "Reactive", "Savings"],
      values: [analysis.economics.energyCost, analysis.economics.reactiveCost, analysis.correction.monthlySavings],
      colors: ["#245a9b", "#a15c00", "#13795b"]
    });
    return;
  }
  if (costChart) costChart.destroy();

  costChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Energy", "Reactive", "Savings"],
      datasets: [{
        label: "Monthly USD",
        data: [
          analysis.economics.energyCost,
          analysis.economics.reactiveCost,
          analysis.correction.monthlySavings
        ],
        backgroundColor: ["#245a9b", "#a15c00", "#13795b"]
      }]
    },
    options: baseOptions("Monthly Cost and Savings")
  });
}

function renderCorrectionTriangles(analysis) {
  beforeCorrectionTriangle = renderPowerTriangle(
    "before-correction-triangle",
    beforeCorrectionTriangle,
    analysis.totals.pKw,
    analysis.totals.qKvar,
    "Before Correction"
  );

  afterCorrectionTriangle = renderPowerTriangle(
    "after-correction-triangle",
    afterCorrectionTriangle,
    analysis.totals.pKw,
    analysis.correction.correctedQ,
    "After Correction"
  );
}

function renderPowerTriangle(canvasId, existingChart, pKw, qKvar, title) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return existingChart;
  if (!window.Chart) {
    drawPowerTriangleCanvas(canvas, pKw, qKvar, title);
    return existingChart;
  }
  if (existingChart) existingChart.destroy();

  const p = Math.max(Number(pKw) || 0, 0);
  const q = Math.max(Number(qKvar) || 0, 0);
  const s = Math.sqrt(p * p + q * q);
  const maxAxis = Math.max(p, q, s, 1) * 1.18;

  return new Chart(canvas, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Real Power P",
          data: [{ x: 0, y: 0 }, { x: p, y: 0 }],
          borderColor: "#245a9b",
          backgroundColor: "#245a9b",
          pointRadius: 3,
          borderWidth: 3
        },
        {
          label: "Reactive Power Q",
          data: [{ x: p, y: 0 }, { x: p, y: q }],
          borderColor: "#a15c00",
          backgroundColor: "#a15c00",
          pointRadius: 3,
          borderWidth: 3
        },
        {
          label: "Apparent Power S",
          data: [{ x: 0, y: 0 }, { x: p, y: q }],
          borderColor: "#13795b",
          backgroundColor: "#13795b",
          pointRadius: 3,
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: title, color: "#111827", font: { weight: "bold" } },
        tooltip: {
          callbacks: {
            label: (item) => `${item.dataset.label}: (${item.parsed.x.toFixed(2)}, ${item.parsed.y.toFixed(2)})`
          }
        }
      },
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: maxAxis,
          title: { display: true, text: "Real Power P (kW)" },
          grid: { color: "#e7ebf2" }
        },
        y: {
          min: 0,
          max: maxAxis,
          title: { display: true, text: "Reactive Power Q (kVAr)" },
          grid: { color: "#e7ebf2" }
        }
      }
    }
  });
}

function renderHarmonicWaveform(analysis) {
  const canvas = document.getElementById("harmonic-waveform-chart");
  if (!canvas) return;
  const samples = createWaveformSamples(analysis);

  if (!window.Chart) {
    drawWaveformCanvas(canvas, samples, "Fundamental Waveform vs Harmonic Distortion");
    return;
  }
  if (harmonicWaveformChart) harmonicWaveformChart.destroy();

  harmonicWaveformChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: samples.map((sample) => sample.deg),
      datasets: [
        {
          label: "Fundamental",
          data: samples.map((sample) => sample.fundamental),
          borderColor: "#245a9b",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.25
        },
        {
          label: "With Harmonics",
          data: samples.map((sample) => sample.distorted),
          borderColor: "#b42318",
          backgroundColor: "rgba(180, 35, 24, 0.08)",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.25,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Fundamental Waveform vs Harmonic Distortion", color: "#111827", font: { weight: "bold" } }
      },
      scales: {
        x: {
          title: { display: true, text: "Electrical Angle (degrees)" },
          ticks: { maxTicksLimit: 9 },
          grid: { color: "#edf1f7" }
        },
        y: {
          title: { display: true, text: "Per-unit waveform" },
          suggestedMin: -1.5,
          suggestedMax: 1.5,
          grid: { color: "#e7ebf2" }
        }
      }
    }
  });
}

function drawBarChart(canvas, config) {
  const { ctx, width, height } = setupCanvas(canvas);
  const padding = { top: 38, right: 18, bottom: 54, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...config.values, 1) * 1.12;

  drawTitle(ctx, config.title, width);
  drawAxes(ctx, padding, chartWidth, chartHeight);

  const barGap = 16;
  const barWidth = Math.max((chartWidth - barGap * (config.values.length + 1)) / config.values.length, 18);
  config.values.forEach((value, index) => {
    const x = padding.left + barGap + index * (barWidth + barGap);
    const barHeight = (Math.max(value, 0) / maxValue) * chartHeight;
    const y = padding.top + chartHeight - barHeight;
    ctx.fillStyle = config.colors[index] || "#245a9b";
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = "#5b6472";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(config.labels[index], x + barWidth / 2, height - 22);
  });
}

function drawPowerTriangleCanvas(canvas, pKw, qKvar, title) {
  const { ctx, width, height } = setupCanvas(canvas);
  const padding = { top: 38, right: 24, bottom: 52, left: 54 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const p = Math.max(Number(pKw) || 0, 0);
  const q = Math.max(Number(qKvar) || 0, 0);
  const s = Math.sqrt(p * p + q * q);
  const maxAxis = Math.max(p, q, s, 1) * 1.18;
  const point = (x, y) => ({
    x: padding.left + (x / maxAxis) * chartWidth,
    y: padding.top + chartHeight - (y / maxAxis) * chartHeight
  });
  const origin = point(0, 0);
  const realEnd = point(p, 0);
  const apparentEnd = point(p, q);

  drawTitle(ctx, title, width);
  drawAxes(ctx, padding, chartWidth, chartHeight);
  drawAxisLabels(ctx, width, height, "Real Power P (kW)", "Reactive Power Q (kVAr)");
  drawLine(ctx, origin, realEnd, "#245a9b", 4);
  drawLine(ctx, realEnd, apparentEnd, "#a15c00", 4);
  drawLine(ctx, origin, apparentEnd, "#13795b", 4);
  drawLegend(ctx, [
    ["P", "#245a9b"],
    ["Q", "#a15c00"],
    ["S", "#13795b"]
  ], padding.left, height - 18);
}

function drawWaveformCanvas(canvas, samples, title) {
  const { ctx, width, height } = setupCanvas(canvas);
  const padding = { top: 38, right: 18, bottom: 48, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const yMin = -1.5;
  const yMax = 1.5;
  const xFor = (index) => padding.left + (index / (samples.length - 1)) * chartWidth;
  const yFor = (value) => padding.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;

  drawTitle(ctx, title, width);
  drawAxes(ctx, padding, chartWidth, chartHeight);
  drawAxisLabels(ctx, width, height, "Electrical Angle (degrees)", "Per-unit waveform");
  drawWaveLine(ctx, samples.map((sample, index) => ({ x: xFor(index), y: yFor(sample.fundamental) })), "#245a9b", 2);
  drawWaveLine(ctx, samples.map((sample, index) => ({ x: xFor(index), y: yFor(sample.distorted) })), "#b42318", 2);
  drawLegend(ctx, [
    ["Fundamental", "#245a9b"],
    ["With Harmonics", "#b42318"]
  ], padding.left, height - 18);
}

function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(Math.round(rect.width), 320);
  const height = Math.max(Math.round(rect.height), 240);
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  return { ctx, width, height };
}

function drawTitle(ctx, title, width) {
  ctx.fillStyle = "#111827";
  ctx.font = "700 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 22);
}

function drawAxes(ctx, padding, chartWidth, chartHeight) {
  ctx.strokeStyle = "#d9dee8";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i += 1) {
    const y = padding.top + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartWidth, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#6b7280";
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + chartHeight);
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
  ctx.stroke();
}

function drawAxisLabels(ctx, width, height, xLabel, yLabel) {
  ctx.fillStyle = "#5b6472";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(xLabel, width / 2, height - 30);
  ctx.save();
  ctx.translate(16, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();
}

function drawLine(ctx, start, end, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function drawWaveLine(ctx, points, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
}

function drawLegend(ctx, items, x, y) {
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  items.forEach(([label, color], index) => {
    const itemX = x + index * 118;
    ctx.fillStyle = color;
    ctx.fillRect(itemX, y - 9, 16, 4);
    ctx.fillStyle = "#5b6472";
    ctx.fillText(label, itemX + 22, y - 4);
  });
}

function createWaveformSamples(analysis) {
  const currentThd = Math.max(Number(analysis.harmonics.currentThd) || 0, 0) / 100;
  const dominant = Math.max(Math.round(Number(analysis.harmonics.dominantHarmonic) || 5), 2);
  const nonlinearShare = Math.max(Number(analysis.harmonics.nonlinearShare) || 0, 0) / 100;
  const harmonicAmplitude = currentThd * (0.75 + nonlinearShare * 0.25);
  const secondaryAmplitude = harmonicAmplitude * 0.35;

  return Array.from({ length: 145 }, (_, index) => {
    const deg = index * 2.5;
    const rad = deg * Math.PI / 180;
    const fundamental = Math.sin(rad);
    const distorted = fundamental
      + harmonicAmplitude * Math.sin(dominant * rad)
      + secondaryAmplitude * Math.sin((dominant + 2) * rad + Math.PI / 7);

    return {
      deg,
      fundamental,
      distorted
    };
  });
}

function baseOptions(title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title, color: "#111827", font: { weight: "bold" } }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "#e7ebf2" } },
      x: { grid: { display: false } }
    }
  };
}
