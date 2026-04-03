import type { ChartConfiguration } from 'chart.js';
import { METRIC_COLORS } from './Colors';

export const LINE_DEFAULT_CONFIG: ChartConfiguration<'line'> = {
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

export const BAR_DEFAULT_CONFIG: ChartConfiguration<'bar'> = {
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
