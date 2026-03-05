import type { ChartConfiguration } from 'chart.js';
import { FIVE_COLORS } from '../utils/colors';

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
          angleLines: {
              display: false
          },
          min: 0,
          max: 100
      }
    }
  }
}
