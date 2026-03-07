import type { ChartConfiguration } from 'chart.js';
import { FIVE_COLORS } from '../utils/colors';
import { METRIC_COLORS } from './Colors';

const radarColor = FIVE_COLORS.WORK

export const RADAR_DEFAULT_CONFIG: ChartConfiguration<'radar'> = {
  type: 'radar',
  data: {
    labels: [
      'MIND',
      'BODY',
      'CASH',
      'WORK',
      'BOND',
    ],
    datasets:[{
      label: 'Metrics',
      data: [0,0,0,0,0,0],
      fill: true,
      backgroundColor: `${radarColor}66`,
      borderColor: radarColor,
      pointBackgroundColor: radarColor,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: radarColor,
      borderWidth: 5,
      pointRadius: 2,
      pointHitRadius: 8
    }]
  },
  options: {
    elements: {
      arc: {
        borderWidth: 10
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        ticks: {
          stepSize: 20
        },
        grid: {
          circular: true
        }
      }
    },
  },
}

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
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        ticks: {
          stepSize: 20
        },
        grid: {
          circular: true
        }
      }
    },
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
    }]
  },
  options: {
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        ticks: {
          stepSize: 20
        }
      }
    },
  },
}
