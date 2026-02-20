/**
 * Project Me - Financial Analytics Dashboard
 * Comprehensive view of income, expenses, and savings with Chart.js visualizations
 */

import {
  getAllTransactions,
  getMonthlyStats,
  getCategoryStats,
  getYearlyStats,
  getFinancialYears,
} from "../../data/finance";
import { formatNumber } from "../../services/utility";
import {
  Chart,
  DoughnutController,
  BarController,
  LineController,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
Chart.register(
  DoughnutController,
  BarController,
  LineController,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
);

const CATEGORY_COLORS: Record<string, string> = {
  "Money Transfer": "#6c5ce7",
  Shopping: "#00b894",
  "Food & Dining": "#fdcb6e",
  Travel: "#e17055",
  Health: "#d63031",
  "Bills & Utilities": "#0984e3",
  Investment: "#2ecc71",
  Salary: "#2ecc71",
  Freelance: "#f1c40f",
  Refund: "#95a5a6",
  Unknown: "#636e72",
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default async function FinancialAnalytics(
  container: HTMLElement,
): Promise<void> {
  const currentYear = new Date().getFullYear();
  const financialYears = getFinancialYears();

  // Initial State
  let selectedYear = currentYear;

  // --- Render Structure ---
  container.innerHTML = `
    <div class="page animate-fade-in finance-page">
      <header class="page-header">
        <h1 class="page-title">Financial Analytics</h1>
        <p class="page-subtitle">Track income, expenses, and savings across your financial history</p>
      </header>

      <!-- Controls -->
      <div class="controls-bar glass-panel">
        <label for="year-select">Fiscal Year:</label>
        <select id="year-select" class="control-select">
          ${financialYears.map((y) => `<option value="${y}" ${y === currentYear ? "selected" : ""}>${y}</option>`).join("")}
        </select>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-row">
        <div class="kpi-card glass-panel kpi-income">
          <span class="kpi-icon">💰</span>
          <div class="kpi-content">
            <span class="kpi-value" id="kpi-income">₹0</span>
            <span class="kpi-label">Total Income</span>
          </div>
        </div>
        <div class="kpi-card glass-panel kpi-expense">
          <span class="kpi-icon">💸</span>
          <div class="kpi-content">
            <span class="kpi-value" id="kpi-expense">₹0</span>
            <span class="kpi-label">Total Expenses</span>
          </div>
        </div>
        <div class="kpi-card glass-panel kpi-savings">
          <span class="kpi-icon">🏦</span>
          <div class="kpi-content">
            <span class="kpi-value" id="kpi-savings">₹0</span>
            <span class="kpi-label">Net Savings</span>
          </div>
        </div>
        <div class="kpi-card glass-panel kpi-rate">
          <span class="kpi-icon">📈</span>
          <div class="kpi-content">
            <span class="kpi-value" id="kpi-rate">0%</span>
            <span class="kpi-label">Savings Rate</span>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Main Trend Chart -->
        <div class="chart-panel glass-panel chart-full">
          <h3>📊 Income vs Expense Trend (<span id="chart-year">${selectedYear}</span>)</h3>
          <div class="chart-wrap chart-wrap-main"><canvas id="main-trend-chart"></canvas></div>
        </div>

        <!-- Expense Breakdown -->
        <div class="chart-panel glass-panel">
          <h3>📉 Expense Breakdown</h3>
          <div class="chart-wrap chart-wrap-donut"><canvas id="expense-donut"></canvas></div>
        </div>

        <!-- Income Breakdown -->
        <div class="chart-panel glass-panel">
          <h3>📈 Income Sources</h3>
          <div class="chart-wrap chart-wrap-donut"><canvas id="income-donut"></canvas></div>
        </div>
      </div>

       <!-- Back link -->
      <div class="back-link">
        <a href="#/me/index" class="back-btn">← Back to Dashboard</a>
      </div>
    </div>

    <style>
      .finance-page { max-width: 1200px; margin: 0 auto; }

      .controls-bar {
        padding: var(--space-3) var(--space-4);
        margin-bottom: var(--space-4);
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }

      .control-select {
        padding: var(--space-2) var(--space-3);
        background: var(--bg-secondary);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        font-family: var(--font-sans);
      }

      .kpi-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      @media (max-width: 800px) { .kpi-row { grid-template-columns: repeat(2, 1fr); } }

      .kpi-card {
        padding: var(--space-4);
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }

      .kpi-icon { font-size: var(--text-2xl); }

      .kpi-content { display: flex; flex-direction: column; }

      .kpi-value {
        font-size: var(--text-lg);
        font-weight: 700;
        font-family: var(--font-mono);
      }

      .kpi-income .kpi-value { color: var(--accent-green); }
      .kpi-expense .kpi-value { color: var(--accent-red); }
      .kpi-savings .kpi-value { color: var(--accent-blue); }
      .kpi-rate .kpi-value { color: var(--accent-purple); }

      .kpi-label { font-size: var(--text-xs); color: var(--text-secondary); }

      .charts-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      @media (max-width: 800px) { .charts-grid { grid-template-columns: 1fr; } }

      .chart-full { grid-column: 1 / -1; }

      .chart-panel { padding: var(--space-4); }
      .chart-panel h3 { margin-bottom: var(--space-4); font-size: var(--text-sm); color: var(--text-secondary); }

      .chart-wrap-main { height: 300px; }
      .chart-wrap-donut { height: 250px; display: flex; justify-content: center; }

      .back-link { text-align: center; padding: var(--space-4); margin-bottom: var(--space-8); }
      .back-btn { color: var(--accent-blue); text-decoration: none; font-weight: 600; font-size: var(--text-sm); }
      .back-btn:hover { text-decoration: underline; }
    </style>
    `;

  // --- Chart References ---
  let mainChart: Chart | null = null;
  let expenseChart: Chart | null = null;
  let incomeChart: Chart | null = null;

  // --- Data processing & Rendering ---
  const updateDashboard = (year: number) => {
    // 1. Fetch Stats
    const monthlyStats = getMonthlyStats(year);
    const expenseCats = getCategoryStats(year, "debit");
    const incomeCats = getCategoryStats(year, "credit");

    // 2. Update KPIs
    const totalIncome = monthlyStats.reduce((sum, m) => sum + m.income, 0);
    const totalExpense = monthlyStats.reduce((sum, m) => sum + m.expense, 0);
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    document.getElementById("kpi-income")!.textContent =
      `₹${formatNumber(totalIncome)}`;
    document.getElementById("kpi-expense")!.textContent =
      `₹${formatNumber(totalExpense)}`;
    document.getElementById("kpi-savings")!.textContent =
      `₹${formatNumber(netSavings)}`;
    document.getElementById("kpi-rate")!.textContent =
      `${savingsRate.toFixed(1)}%`;

    const chartYearSpan = document.getElementById("chart-year");
    if (chartYearSpan) chartYearSpan.textContent = year.toString();

    // 3. Update Main Trend Chart
    const ctxMain = document.getElementById(
      "main-trend-chart",
    ) as HTMLCanvasElement;
    if (mainChart) mainChart.destroy();

    mainChart = new Chart(ctxMain, {
      type: "bar",
      data: {
        labels: monthNames,
        datasets: [
          {
            label: "Income",
            data: monthlyStats.map((m) => m.income),
            backgroundColor: "#2ecc71",
            borderRadius: 4,
            order: 2,
          },
          {
            label: "Expense",
            data: monthlyStats.map((m) => m.expense),
            backgroundColor: "#e74c3c",
            borderRadius: 4,
            order: 3,
          },
          {
            type: "line",
            label: "Net Savings",
            data: monthlyStats.map((m) => m.savings),
            borderColor: "#3498db",
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "#3498db",
            fill: false,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += "₹" + formatNumber(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#888" } },
          y: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: {
              color: "#888",
              callback: (val) => "₹" + formatNumber(Number(val)),
            },
          },
        },
      },
    });

    // 4. Update Expense Donut
    const ctxExpense = document.getElementById(
      "expense-donut",
    ) as HTMLCanvasElement;
    if (expenseChart) expenseChart.destroy();

    const sortedExpenseCats = Object.entries(expenseCats).sort(
      (a, b) => b[1] - a[1],
    ); // Top expenses first
    expenseChart = new Chart(ctxExpense, {
      type: "doughnut",
      data: {
        labels: sortedExpenseCats.map((c) => c[0]),
        datasets: [
          {
            data: sortedExpenseCats.map((c) => c[1]),
            backgroundColor: sortedExpenseCats.map(
              (c) => CATEGORY_COLORS[c[0]] || "#95a5a6",
            ),
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: { color: "#ccc", font: { size: 11 } },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const val = context.parsed;
                const percentage =
                  totalExpense > 0
                    ? ((val / totalExpense) * 100).toFixed(1) + "%"
                    : "0%";
                return `${label}: ₹${formatNumber(val)} (${percentage})`;
              },
            },
          },
        },
      },
    });

    // 5. Update Income Donut
    const ctxIncome = document.getElementById(
      "income-donut",
    ) as HTMLCanvasElement;
    if (incomeChart) incomeChart.destroy();

    const sortedIncomeCats = Object.entries(incomeCats).sort(
      (a, b) => b[1] - a[1],
    );
    incomeChart = new Chart(ctxIncome, {
      type: "doughnut",
      data: {
        labels: sortedIncomeCats.map((c) => c[0]),
        datasets: [
          {
            data: sortedIncomeCats.map((c) => c[1]),
            backgroundColor: sortedIncomeCats.map(
              (c) => CATEGORY_COLORS[c[0]] || "#95a5a6",
            ),
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: { color: "#ccc", font: { size: 11 } },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const val = context.parsed;
                const percentage =
                  totalIncome > 0
                    ? ((val / totalIncome) * 100).toFixed(1) + "%"
                    : "0%";
                return `${label}: ₹${formatNumber(val)} (${percentage})`;
              },
            },
          },
        },
      },
    });
  };

  // Initial Render
  updateDashboard(selectedYear);

  // Event Listeners
  document.getElementById("year-select")?.addEventListener("change", (e) => {
    selectedYear = parseInt((e.target as HTMLSelectElement).value);
    updateDashboard(selectedYear);
  });
}
