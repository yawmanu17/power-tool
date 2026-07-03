let powerChart;
let costChart;

export function renderCharts(analysis) {
  renderPowerChart(analysis);
  renderCostChart(analysis);
}

function renderPowerChart(analysis) {
  const canvas = document.getElementById("power-chart");
  if (!canvas || !window.Chart) return;
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
  if (!canvas || !window.Chart) return;
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
