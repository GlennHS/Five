import type { ChartConfiguration } from 'chart.js';
import { FIVE_COLORS } from '../utils/colors';

export const RADAR_DEFAULT_CONFIG: ChartConfiguration<'radar'> = {
  type: 'radar',
  data: {
    labels: [
      'MIND',
      'BODY',
      'CASH',
      'WORK',
      'BOND',
      'TOTAL',
    ],
    datasets:[{
      label: 'Metrics',
      data: [0,0,0,0,0,0],
      fill: true,
      backgroundColor: `#${FIVE_COLORS.MIND}44`,
      borderColor: FIVE_COLORS.MIND,
      pointBackgroundColor: FIVE_COLORS.MIND,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: FIVE_COLORS.MIND
    }]
  },
  options: {
    scales: {
      r: {
          angleLines: {
              display: false
          },
          min: 0,
          max: 100
      }
    }
  }
}
