const createLineChartData = (labels: string[] = days, values: number[][]) : object => {
  return {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Metrics',
        data: values,
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
}

export default createLineChartData
