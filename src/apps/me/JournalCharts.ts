/**
 * Project Me - Journal Analytics Page
 * 9 charts powered by Chart.js for journal data visualization
 */

import {
    MOOD_MAP,
    DAYS,
    getAllJournalEntries,
    computeStats,
    type JournalStats,
} from '../../services/journal';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

export default async function JournalCharts(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📊 Journal Analytics</h1>
        <p class="page-subtitle">Insights from your journal entries</p>
      </header>

      <!-- Summary cards -->
      <div class="stats-summary" id="stats-summary">
        <div class="stat-card glass-panel">
          <span class="stat-value" id="stat-total">—</span>
          <span class="stat-label">Total Entries</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-value" id="stat-streak">—</span>
          <span class="stat-label">Current Streak</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-value" id="stat-longest">—</span>
          <span class="stat-label">Longest Streak</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-value" id="stat-avg-words">—</span>
          <span class="stat-label">Avg Words</span>
        </div>
      </div>

      <!-- Charts grid -->
      <div class="charts-grid">
        <!-- 1. Calendar Heatmap -->
        <div class="chart-container glass-panel chart-wide">
          <h3 class="chart-title">📅 Contribution Heatmap</h3>
          <div class="heatmap-wrapper" id="chart-heatmap">
            <div class="loading-container"><div class="loading-spinner"></div></div>
          </div>
        </div>

        <!-- 2. Mood Distribution (Doughnut) -->
        <div class="chart-container glass-panel">
          <h3 class="chart-title">🎭 Mood Distribution</h3>
          <div class="chart-canvas-wrapper"><canvas id="chart-mood-dist"></canvas></div>
        </div>

        <!-- 3. Mood Over Time (Line) -->
        <div class="chart-container glass-panel">
          <h3 class="chart-title">📈 Mood Over Time</h3>
          <div class="chart-canvas-wrapper"><canvas id="chart-mood-time"></canvas></div>
        </div>

        <!-- 4. Entries Per Month (Bar) -->
        <div class="chart-container glass-panel">
          <h3 class="chart-title">📦 Entries Per Month</h3>
          <div class="chart-canvas-wrapper"><canvas id="chart-monthly"></canvas></div>
        </div>

        <!-- 5. Day-of-Week Activity (Radar) -->
        <div class="chart-container glass-panel">
          <h3 class="chart-title">📅 Day-of-Week Activity</h3>
          <div class="chart-canvas-wrapper"><canvas id="chart-dow"></canvas></div>
        </div>

        <!-- 6. Writing Streak (Area) -->
        <div class="chart-container glass-panel">
          <h3 class="chart-title">🔥 Writing Streaks</h3>
          <div class="chart-canvas-wrapper"><canvas id="chart-streak"></canvas></div>
        </div>

        <!-- 7. Word Count Distribution (Histogram) -->
        <div class="chart-container glass-panel">
          <h3 class="chart-title">📝 Word Count Distribution</h3>
          <div class="chart-canvas-wrapper"><canvas id="chart-wordcount"></canvas></div>
        </div>

        <!-- 8. Time-of-Day Pattern (Polar) -->
        <div class="chart-container glass-panel">
          <h3 class="chart-title">🕐 Time-of-Day Pattern</h3>
          <div class="chart-canvas-wrapper"><canvas id="chart-tod"></canvas></div>
        </div>

        <!-- 9. Mood vs Day-of-Week (Grouped Bar) -->
        <div class="chart-container glass-panel">
          <h3 class="chart-title">🎯 Mood × Day of Week</h3>
          <div class="chart-canvas-wrapper"><canvas id="chart-mood-dow"></canvas></div>
        </div>
      </div>

      <!-- Nav back -->
      <div class="chart-nav">
        <a href="#/me/journal" class="btn btn-secondary">✍️ Write Entry</a>
        <a href="#/me/journal-feed" class="btn btn-secondary">📰 View Feed</a>
      </div>
    </div>

    <style>
      .stats-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); margin-bottom: var(--space-6); }
      @media (max-width: 768px) { .stats-summary { grid-template-columns: repeat(2, 1fr); } }
      .stat-card { padding: var(--space-5); text-align: center; }
      .stat-value {
        display: block; font-size: var(--text-2xl); font-weight: 800; font-family: var(--font-mono);
        background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        margin-bottom: var(--space-1);
      }
      .stat-label { font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; }

      .charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-5); margin-bottom: var(--space-6); }
      @media (max-width: 900px) { .charts-grid { grid-template-columns: 1fr; } }
      .chart-wide { grid-column: 1 / -1; }
      .chart-container { padding: var(--space-5); }
      .chart-title { font-size: var(--text-base); margin-bottom: var(--space-4); }
      .chart-canvas-wrapper { position: relative; height: 280px; }
      .chart-canvas-wrapper canvas { max-height: 280px; }

      /* Heatmap */
      .heatmap-wrapper { overflow-x: auto; }
      .heatmap-grid-c { display: flex; gap: 3px; min-width: 700px; }
      .heatmap-week-c { display: flex; flex-direction: column; gap: 3px; }
      .heatmap-cell-c { width: 12px; height: 12px; border-radius: 2px; cursor: default; transition: transform 0.1s; }
      .heatmap-cell-c:hover { transform: scale(1.5); }
      .heatmap-legend-c { display: flex; align-items: center; gap: 4px; margin-top: var(--space-2); justify-content: flex-end; }
      .hml { font-size: 10px; color: var(--text-tertiary); }
      .hmc { width: 12px; height: 12px; border-radius: 2px; display: inline-block; }

      .chart-nav { display: flex; gap: var(--space-4); justify-content: center; }
      .chart-empty { text-align: center; padding: var(--space-6); color: var(--text-tertiary); }
    </style>
  `;

    // Load data
    try {
        const entries = await getAllJournalEntries();
        const stats = computeStats(entries);

        renderSummary(stats);
        renderHeatmap(stats);

        if (entries.length === 0) {
            document.querySelectorAll('.chart-canvas-wrapper').forEach((el) => {
                el.innerHTML = '<div class="chart-empty">No data yet. Add journal entries to see charts!</div>';
            });
            return;
        }

        renderMoodDistribution(stats);
        renderMoodOverTime(stats);
        renderMonthlyEntries(stats);
        renderDayOfWeek(stats);
        renderStreaks(stats);
        renderWordCount(stats);
        renderTimeOfDay(stats);
        renderMoodByDow(entries);
    } catch (err) {
        console.error('[JournalCharts] Failed to load:', err);
    }
}

// --- Chart Defaults ---
const chartTextColor = () => getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#8E8E93';
const chartGridColor = () => 'rgba(128,128,128,0.15)';

function defaultScales(xTitle = '', yTitle = ''): Record<string, unknown> {
    return {
        x: {
            grid: { color: chartGridColor() },
            ticks: { color: chartTextColor(), maxRotation: 45 },
            ...(xTitle ? { title: { display: true, text: xTitle, color: chartTextColor() } } : {}),
        },
        y: {
            grid: { color: chartGridColor() },
            ticks: { color: chartTextColor() },
            beginAtZero: true,
            ...(yTitle ? { title: { display: true, text: yTitle, color: chartTextColor() } } : {}),
        },
    };
}

// --- Renderers ---

function renderSummary(stats: JournalStats): void {
    const totalEl = document.getElementById('stat-total');
    const streakEl = document.getElementById('stat-streak');
    const longestEl = document.getElementById('stat-longest');
    const avgEl = document.getElementById('stat-avg-words');

    if (totalEl) totalEl.textContent = String(stats.totalEntries);
    if (streakEl) streakEl.textContent = `${stats.streaks.current}d`;
    if (longestEl) longestEl.textContent = `${stats.streaks.longest}d`;
    if (avgEl) {
        const avg = stats.wordCounts.length > 0
            ? Math.round(stats.wordCounts.reduce((a, b) => a + b, 0) / stats.wordCounts.length)
            : 0;
        avgEl.textContent = String(avg);
    }
}

function renderHeatmap(stats: JournalStats): void {
    const wrapper = document.getElementById('chart-heatmap');
    if (!wrapper) return;

    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    start.setDate(start.getDate() - start.getDay());

    const weeks: string[][] = [];
    let week: string[] = [];
    const d = new Date(start);

    while (d <= today) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        week.push(key);
        if (d.getDay() === 6) { weeks.push(week); week = []; }
        d.setDate(d.getDate() + 1);
    }
    if (week.length > 0) weeks.push(week);

    const getColor = (count: number) => {
        if (count === 0) return 'var(--glass-border)';
        if (count === 1) return 'rgba(0,122,255,0.25)';
        if (count === 2) return 'rgba(0,122,255,0.45)';
        if (count === 3) return 'rgba(0,122,255,0.65)';
        return 'rgba(0,122,255,0.9)';
    };

    wrapper.innerHTML = `
    <div class="heatmap-grid-c">
      ${weeks.map((w) => `<div class="heatmap-week-c">${w.map((dk) => {
        const c = stats.entriesByDate[dk] || 0;
        return `<div class="heatmap-cell-c" style="background:${getColor(c)};" title="${dk}: ${c}"></div>`;
    }).join('')}</div>`).join('')}
    </div>
    <div class="heatmap-legend-c">
      <span class="hml">Less</span>
      <span class="hmc" style="background:var(--glass-border);"></span>
      <span class="hmc" style="background:rgba(0,122,255,0.25);"></span>
      <span class="hmc" style="background:rgba(0,122,255,0.45);"></span>
      <span class="hmc" style="background:rgba(0,122,255,0.65);"></span>
      <span class="hmc" style="background:rgba(0,122,255,0.9);"></span>
      <span class="hml">More</span>
    </div>
  `;
}

function renderMoodDistribution(stats: JournalStats): void {
    const ctx = (document.getElementById('chart-mood-dist') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    const moods = Object.entries(stats.moodCounts);
    if (moods.length === 0) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: moods.map(([k]) => MOOD_MAP[Number(k)]?.label || k),
            datasets: [{
                data: moods.map(([, v]) => v),
                backgroundColor: moods.map(([k]) => MOOD_MAP[Number(k)]?.color || '#888'),
                borderWidth: 0,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: chartTextColor(), padding: 12 } } },
        },
    });
}

function renderMoodOverTime(stats: JournalStats): void {
    const ctx = (document.getElementById('chart-mood-time') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx || stats.moodByDate.length === 0) return;

    const sorted = [...stats.moodByDate].sort((a, b) => a.date.localeCompare(b.date));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: sorted.map((d) => d.date.slice(5)), // MM-DD
            datasets: [{
                label: 'Mood',
                data: sorted.map((d) => d.mood),
                borderColor: '#5856D6',
                backgroundColor: 'rgba(88,86,214,0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: sorted.map((d) => MOOD_MAP[d.mood]?.color || '#888'),
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                ...defaultScales('', 'Mood'),
                y: {
                    ...((defaultScales('', 'Mood') as Record<string, Record<string, unknown>>).y),
                    min: 0,
                    max: 5,
                    ticks: {
                        color: chartTextColor(),
                        callback: (val: string | number) => MOOD_MAP[Number(val)]?.emoji || val,
                        stepSize: 1,
                    },
                },
            },
            plugins: { legend: { display: false } },
        },
    });
}

function renderMonthlyEntries(stats: JournalStats): void {
    const ctx = (document.getElementById('chart-monthly') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    const months = Object.entries(stats.entriesByMonth).sort((a, b) => a[0].localeCompare(b[0]));
    if (months.length === 0) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months.map(([k]) => k),
            datasets: [{
                label: 'Entries',
                data: months.map(([, v]) => v),
                backgroundColor: 'rgba(0,122,255,0.6)',
                borderRadius: 6,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: defaultScales('Month', 'Entries') as never,
            plugins: { legend: { display: false } },
        },
    });
}

function renderDayOfWeek(stats: JournalStats): void {
    const ctx = (document.getElementById('chart-dow') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: DAYS,
            datasets: [{
                label: 'Entries',
                data: stats.entriesByDayOfWeek,
                backgroundColor: 'rgba(88,86,214,0.2)',
                borderColor: '#5856D6',
                pointBackgroundColor: '#5856D6',
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    ticks: { color: chartTextColor(), backdropColor: 'transparent' },
                    grid: { color: chartGridColor() },
                    pointLabels: { color: chartTextColor() },
                    beginAtZero: true,
                },
            },
            plugins: { legend: { display: false } },
        },
    });
}

function renderStreaks(stats: JournalStats): void {
    const ctx = (document.getElementById('chart-streak') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    // Build daily streak data for last 90 days
    const today = new Date();
    const streakData: { date: string; streak: number }[] = [];
    let currentStreak = 0;

    for (let i = 89; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (stats.entriesByDate[key]) {
            currentStreak++;
        } else {
            currentStreak = 0;
        }
        streakData.push({ date: key.slice(5), streak: currentStreak });
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: streakData.map((d) => d.date),
            datasets: [{
                label: 'Streak (days)',
                data: streakData.map((d) => d.streak),
                borderColor: '#FF9500',
                backgroundColor: 'rgba(255,149,0,0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 0,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: defaultScales('Date', 'Streak Days') as never,
            plugins: { legend: { display: false } },
        },
    });
}

function renderWordCount(stats: JournalStats): void {
    const ctx = (document.getElementById('chart-wordcount') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx || stats.wordCounts.length === 0) return;

    // Bucket word counts: 0-10, 11-25, 26-50, 51-100, 101-200, 200+
    const buckets = [
        { label: '0-10', min: 0, max: 10 },
        { label: '11-25', min: 11, max: 25 },
        { label: '26-50', min: 26, max: 50 },
        { label: '51-100', min: 51, max: 100 },
        { label: '101-200', min: 101, max: 200 },
        { label: '200+', min: 201, max: Infinity },
    ];

    const counts = buckets.map((b) => stats.wordCounts.filter((w) => w >= b.min && w <= b.max).length);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: buckets.map((b) => b.label),
            datasets: [{
                label: 'Entries',
                data: counts,
                backgroundColor: 'rgba(52,199,89,0.6)',
                borderRadius: 6,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: defaultScales('Word Count', 'Entries') as never,
            plugins: { legend: { display: false } },
        },
    });
}

function renderTimeOfDay(stats: JournalStats): void {
    const ctx = (document.getElementById('chart-tod') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    // Group into 6 time buckets
    const buckets = [
        { label: '🌅 Morning (5-8)', range: [5, 8] },
        { label: '☀️ AM (9-12)', range: [9, 12] },
        { label: '🌤️ PM (13-17)', range: [13, 17] },
        { label: '🌆 Evening (18-21)', range: [18, 21] },
        { label: '🌙 Night (22-1)', range: [22, 1] },
        { label: '💤 Late (2-4)', range: [2, 4] },
    ];

    const bucketCounts = buckets.map((b) => {
        if (b.range[0] <= b.range[1]) {
            return stats.entriesByHour.slice(b.range[0], b.range[1] + 1).reduce((a, c) => a + c, 0);
        }
        // Wrap-around (22-1)
        return stats.entriesByHour.slice(b.range[0]).reduce((a, c) => a + c, 0) +
            stats.entriesByHour.slice(0, b.range[1] + 1).reduce((a, c) => a + c, 0);
    });

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: buckets.map((b) => b.label),
            datasets: [{
                data: bucketCounts,
                backgroundColor: [
                    'rgba(255,149,0,0.5)',
                    'rgba(255,204,0,0.5)',
                    'rgba(52,199,89,0.5)',
                    'rgba(0,122,255,0.5)',
                    'rgba(88,86,214,0.5)',
                    'rgba(142,142,147,0.5)',
                ],
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: chartTextColor(), padding: 8, font: { size: 11 } } } },
            scales: { r: { ticks: { display: false }, grid: { color: chartGridColor() } } },
        },
    });
}

function renderMoodByDow(entries: { m?: number; ts: unknown }[]): void {
    const ctx = (document.getElementById('chart-mood-dow') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    // Calculate average mood per day of week
    const moodSums: number[] = new Array(7).fill(0);
    const moodCounts: number[] = new Array(7).fill(0);

    for (const e of entries) {
        if (e.m === undefined || e.m === null) continue;
        const date = e.ts && typeof e.ts === 'object' && 'toDate' in (e.ts as Record<string, unknown>)
            ? (e.ts as { toDate: () => Date }).toDate()
            : new Date(e.ts as string);
        const dow = date.getDay();
        moodSums[dow] += e.m;
        moodCounts[dow]++;
    }

    const avgMoods = moodSums.map((sum, i) => moodCounts[i] > 0 ? +(sum / moodCounts[i]).toFixed(2) : 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: DAYS,
            datasets: [{
                label: 'Avg Mood',
                data: avgMoods,
                backgroundColor: DAYS.map((_, i) => {
                    const avg = avgMoods[i];
                    const closest = Math.round(avg);
                    return MOOD_MAP[closest]?.color || 'rgba(142,142,147,0.5)';
                }),
                borderRadius: 6,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                ...defaultScales('Day', 'Avg Mood'),
                y: {
                    ...((defaultScales('', '') as Record<string, Record<string, unknown>>).y),
                    min: 0,
                    max: 5,
                    ticks: {
                        color: chartTextColor(),
                        callback: (val: string | number) => MOOD_MAP[Number(val)]?.emoji || val,
                        stepSize: 1,
                    },
                },
            },
            plugins: { legend: { display: false } },
        },
    });
}
