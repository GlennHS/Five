import type { ChartConfiguration } from 'chart.js';
import { METRIC_COLORS } from './Colors';

export const defaultLineConfig: ChartConfiguration<'line'> = {
  type: 'line',
  data: {
    labels: [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ],
    datasets: [{
      label: 'Metrics',
      data: [65, 59, 80, 81, 56, 55, 40],
      pointHitRadius: 20  
    }]
  },
  options: {
    scales: {
      y: {
        min: 0,
        suggestedMax: 70,
        beginAtZero: true,
        ticks: {
          stepSize: 20
        },
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: true
    },
    plugins: {
      legend: {
        display: false
      }
    }
  },
}

export const defaultBarConfig: ChartConfiguration<'bar'> = {
  type: 'bar',
  data: {
    labels: [
      'MIND',
      'BODY',
      'CASH',
      'WORK',
      'BOND',
    ],
    datasets: [{
      label: 'Metrics',
      data: [65, 59, 80, 81, 56],
      backgroundColor: [
        `rgba(${METRIC_COLORS.MIND}, 0.3)`,
        `rgba(${METRIC_COLORS.BODY}, 0.3)`,
        `rgba(${METRIC_COLORS.CASH}, 0.3)`,
        `rgba(${METRIC_COLORS.WORK}, 0.3)`,
        `rgba(${METRIC_COLORS.BOND}, 0.3)`,
      ],
      borderColor: [
        `rgb(${METRIC_COLORS.MIND})`,
        `rgb(${METRIC_COLORS.BODY})`,
        `rgb(${METRIC_COLORS.CASH})`,
        `rgb(${METRIC_COLORS.WORK})`,
        `rgb(${METRIC_COLORS.BOND})`,
      ],
      borderWidth: 2,
      hoverBorderWidth: 4
    }]
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        suggestedMax: 70,
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        }
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: true
    },
    plugins: {
      legend: {
        display: false
      }
    }
  },
}

export const defaultRadarConfig: ChartConfiguration<'radar'> = {
  type: 'radar',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Metrics',
        data: [],

        backgroundColor: 'rgba(54, 162, 235, 0.15)',
        borderColor: '#36A2EB',
        borderWidth: 2,

        pointBackgroundColor: [
          `rgb(${METRIC_COLORS.MIND})`,
          `rgb(${METRIC_COLORS.BODY})`,
          `rgb(${METRIC_COLORS.CASH})`,
          `rgb(${METRIC_COLORS.WORK})`,
          `rgb(${METRIC_COLORS.BOND})`,
        ],
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: [
          `rgb(${METRIC_COLORS.MIND})`,
          `rgb(${METRIC_COLORS.BODY})`,
          `rgb(${METRIC_COLORS.CASH})`,
          `rgb(${METRIC_COLORS.WORK})`,
          `rgb(${METRIC_COLORS.BOND})`,
        ],
        pointHoverBorderColor: '#ffffff',

        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            return `${ctx.label}: ${ctx.raw}`
          },
        },
      },
    },

    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,

        grid: {
          color: 'rgba(0,0,0,0.1)',
        },

        angleLines: {
          color: 'rgba(0,0,0,0.1)',
        },

        pointLabels: {
          font: {
            size: 12,
          },
        },

        ticks: {
          display: false,
          stepSize: 20,
        },
      },
    },
  },
}