/* ══════════════════════════════════════
   EV MARKET ANALYSIS DASHBOARD — app.js
   India · 2019–2023
   ══════════════════════════════════════ */

'use strict';

/* ── GLOBAL CHART DEFAULTS ── */
Chart.defaults.color          = '#7b9ab3';
Chart.defaults.font.family    = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size      = 12;
Chart.defaults.plugins.legend.labels.boxWidth  = 10;
Chart.defaults.plugins.legend.labels.padding   = 16;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(13,27,46,0.95)';
Chart.defaults.plugins.tooltip.borderColor     = 'rgba(59,130,246,0.3)';
Chart.defaults.plugins.tooltip.borderWidth     = 1;
Chart.defaults.plugins.tooltip.padding         = 12;
Chart.defaults.plugins.tooltip.titleColor      = '#ffffff';
Chart.defaults.plugins.tooltip.bodyColor       = '#7b9ab3';

/* ── COLOUR PALETTE ── */
const COLORS = {
  green:   '#00d4aa',
  blue:    '#3b82f6',
  purple:  '#8b5cf6',
  amber:   '#f59e0b',
  red:     '#ef4444',
  cyan:    '#06b6d4',
  pink:    '#ec4899',
};

const makeGrad = (ctx, c1, c2) => {
  const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
};

/* ══════════════════════════════
   1. EV SALES TREND CHART
   ══════════════════════════════ */
const YEARS = ['2019', '2020', '2021', '2022', '2023'];

const salesData = {
  all: {
    '2Wheeler': [152000, 143000, 230000, 623000, 898000],
    '3Wheeler': [135000, 113000, 180000, 348000, 570000],
    '4Wheeler': [4600,   4984,   8900,   46000,  82000],
  }
};

const getTrendDatasets = (filter) => {
  const base = salesData.all;
  const alpha1 = 0.18, alpha2 = 0.0;

  const makeDS = (label, data, color) => ({
    label,
    data,
    borderColor: color,
    backgroundColor: (ctx) => {
      const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 340);
      g.addColorStop(0, color.replace(')', `, ${alpha1})`).replace('rgb', 'rgba'));
      g.addColorStop(1, color.replace(')', `, ${alpha2})`).replace('rgb', 'rgba'));
      return g;
    },
    fill: true,
    tension: 0.45,
    pointRadius: 4,
    pointHoverRadius: 7,
    borderWidth: 2.5,
    pointBackgroundColor: color,
    pointBorderColor: '#0d1b2e',
    pointBorderWidth: 2,
  });

  if (filter === '2W') return [makeDS('2-Wheeler EV', base['2Wheeler'], COLORS.green)];
  if (filter === '3W') return [makeDS('3-Wheeler EV', base['3Wheeler'], COLORS.blue)];
  if (filter === '4W') return [makeDS('4-Wheeler EV', base['4Wheeler'], COLORS.purple)];

  return [
    makeDS('2-Wheeler EV', base['2Wheeler'], COLORS.green),
    makeDS('3-Wheeler EV', base['3Wheeler'], COLORS.blue),
    makeDS('4-Wheeler EV', base['4Wheeler'], COLORS.purple),
  ];
};

const gridOpts = {
  color: 'rgba(255,255,255,0.04)',
  drawBorder: false,
};

const trendCtx = document.getElementById('salesTrendChart').getContext('2d');
const trendChart = new Chart(trendCtx, {
  type: 'line',
  data: { labels: YEARS, datasets: getTrendDatasets('all') },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', align: 'end' },
      tooltip: {
        callbacks: {
          label: (ctx) => `  ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('en-IN')} units`,
        }
      }
    },
    scales: {
      x: { grid: gridOpts, ticks: { font: { size: 11 } } },
      y: {
        grid: gridOpts,
        ticks: {
          callback: (v) => v >= 1000 ? (v/1000).toFixed(0)+'K' : v,
          font: { size: 11 },
        }
      }
    }
  }
});

/* Filter toggle */
window.toggleSalesTrend = (filter) => {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  trendChart.data.datasets = getTrendDatasets(filter);
  trendChart.update('active');
};

/* ══════════════════════════════
   2. SEGMENT PIE / DOUGHNUT
   ══════════════════════════════ */
const segCtx = document.getElementById('segmentChart').getContext('2d');
new Chart(segCtx, {
  type: 'doughnut',
  data: {
    labels: ['2-Wheeler (59%)', '3-Wheeler (37.6%)', '4-Wheeler (5.4%)'],
    datasets: [{
      data: [898000, 570000, 82000],
      backgroundColor: [COLORS.green, COLORS.blue, COLORS.purple],
      hoverBackgroundColor: [COLORS.green + 'dd', COLORS.blue + 'dd', COLORS.purple + 'dd'],
      borderColor: '#0d1b2e',
      borderWidth: 3,
      hoverOffset: 8,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 8 } },
      tooltip: {
        callbacks: {
          label: (ctx) => `  ${ctx.label}: ${ctx.parsed.toLocaleString('en-IN')} units`,
        }
      }
    }
  }
});

/* ══════════════════════════════
   3. CHARGING INFRASTRUCTURE
   ══════════════════════════════ */
const chargingCtx = document.getElementById('chargingChart').getContext('2d');
new Chart(chargingCtx, {
  type: 'bar',
  data: {
    labels: YEARS,
    datasets: [
      {
        label: 'Public Chargers',
        data: [1800, 2100, 3500, 5800, 8100],
        backgroundColor: COLORS.blue + '99',
        borderColor: COLORS.blue,
        borderWidth: 1.5,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Private Chargers',
        data: [900, 1200, 2200, 3900, 6600],
        backgroundColor: COLORS.green + '99',
        borderColor: COLORS.green,
        borderWidth: 1.5,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Fast Chargers',
        data: [110, 190, 410, 980, 2200],
        backgroundColor: COLORS.amber + '99',
        borderColor: COLORS.amber,
        borderWidth: 1.5,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, pointStyleWidth: 8 } },
      tooltip: {
        callbacks: {
          label: (ctx) => `  ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('en-IN')}`,
        }
      }
    },
    scales: {
      x: { stacked: false, grid: gridOpts },
      y: {
        grid: gridOpts,
        ticks: { callback: (v) => v >= 1000 ? (v/1000).toFixed(1)+'K' : v }
      }
    }
  }
});

/* ══════════════════════════════
   4. COMPANY HORIZONTAL BAR
   ══════════════════════════════ */
const companyCtx = document.getElementById('companyChart').getContext('2d');
new Chart(companyCtx, {
  type: 'bar',
  data: {
    labels: ['Tata Motors', 'Ola Electric', 'TVS Motor', 'Ather Energy', 'Bajaj Auto', 'Piaggio', 'MG Motor'],
    datasets: [{
      label: '2023 Sales',
      data: [69000, 248000, 134000, 115000, 195000, 78000, 8200],
      backgroundColor: [
        COLORS.green   + 'bb',
        COLORS.blue    + 'bb',
        COLORS.purple  + 'bb',
        COLORS.amber   + 'bb',
        COLORS.cyan    + 'bb',
        COLORS.pink    + 'bb',
        COLORS.red     + 'bb',
      ],
      borderColor: [
        COLORS.green, COLORS.blue, COLORS.purple, COLORS.amber, COLORS.cyan, COLORS.pink, COLORS.red,
      ],
      borderWidth: 1.5,
      borderRadius: 4,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `  Units Sold: ${ctx.parsed.x.toLocaleString('en-IN')}`,
        }
      }
    },
    scales: {
      x: {
        grid: gridOpts,
        ticks: { callback: (v) => v >= 1000 ? (v/1000).toFixed(0)+'K' : v }
      },
      y: { grid: { display: false } }
    }
  }
});

/* ══════════════════════════════
   5. YoY GROWTH RATE
   ══════════════════════════════ */
const growthCtx = document.getElementById('growthRateChart').getContext('2d');
new Chart(growthCtx, {
  type: 'line',
  data: {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: '2-Wheeler',
        data: [-5.9, 60.8, 170.9, 44.1],
        borderColor: COLORS.green,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: COLORS.green,
        pointBorderColor: '#0d1b2e',
        pointBorderWidth: 2,
        borderWidth: 2.5,
      },
      {
        label: '3-Wheeler',
        data: [-16.3, 59.3, 93.3, 63.8],
        borderColor: COLORS.blue,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: COLORS.blue,
        pointBorderColor: '#0d1b2e',
        pointBorderWidth: 2,
        borderWidth: 2.5,
      },
      {
        label: '4-Wheeler',
        data: [8.3, 78.6, 417.0, 78.3],
        borderColor: COLORS.purple,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: COLORS.purple,
        pointBorderColor: '#0d1b2e',
        pointBorderWidth: 2,
        borderWidth: 2.5,
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, pointStyleWidth: 8 } },
      tooltip: {
        callbacks: {
          label: (ctx) => `  ${ctx.dataset.label}: ${ctx.parsed.y > 0 ? '+' : ''}${ctx.parsed.y.toFixed(1)}%`,
        }
      }
    },
    scales: {
      x: { grid: gridOpts },
      y: {
        grid: gridOpts,
        ticks: { callback: (v) => v + '%' }
      }
    }
  }
});

/* ══════════════════════════════
   COUNTER ANIMATION
   ══════════════════════════════ */
const counters = document.querySelectorAll('.counter');
const easeInOut = (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  const tick = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const val = Math.round(easeInOut(progress) * target);
    el.textContent = val.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

counters.forEach(c => observer.observe(c));

/* ══════════════════════════════
   DATA TABLE TABS
   ══════════════════════════════ */
window.showTable = (name) => {
  document.querySelectorAll('.table-container').forEach(t => t.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`table-${name}`).classList.remove('hidden');
  event.target.classList.add('active');
};
