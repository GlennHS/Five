export const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
]

export const calculateTotal = (five: number[]) : number => {
  if (five.length !== 5)
    return 0
  else
    return five.reduce((a,b) => a + b) / 5
}

export const createLineChartData = (labels: string[], values: number[][]) : object => {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Metrics',
        data: values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
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
      }
    }
  }
}

export const createLineChartData_Week = (values: number[][]): object => createLineChartData(days, values)
