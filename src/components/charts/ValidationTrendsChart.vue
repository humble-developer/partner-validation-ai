<template>
  <div class="relative">
    <canvas ref="chartCanvas" class="w-full h-64"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default {
  name: 'ValidationTrendsChart',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'validations',
      validator: value => ['validations', 'confidence', 'processing'].includes(value)
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null

    const processData = () => {
      // Generate last 30 days of data
      const days = []
      const validationCounts = []
      const confidenceScores = []
      const processingTimes = []

      // Get validation data
      const validationData = props.data || []

      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))

        // Calculate validations for this day using real data
        const dayValidations = validationData.filter(validation => {
          const validationDate = new Date(validation.submittedAt || validation.date)
          const targetDate = new Date(date)

          // Compare dates (ignore time)
          return validationDate.toDateString() === targetDate.toDateString()
        })

        validationCounts.push(dayValidations.length)

        // Calculate average confidence for the day using real data
        const avgConfidence = dayValidations.length > 0
          ? dayValidations.reduce((sum, v) => sum + (v.overallConfidence || v.confidence || 0), 0) / dayValidations.length
          : 0
        confidenceScores.push(Math.round(avgConfidence))

        // Calculate average processing time for the day
        // For now, we'll simulate processing times based on confidence scores
        // In a real app, you'd have actual processing time data
        const avgProcessingTime = dayValidations.length > 0
          ? dayValidations.reduce((sum, v) => {
              // Simulate processing time based on confidence (lower confidence = longer processing)
              const confidence = v.overallConfidence || v.confidence || 50
              const baseTime = 1.5 // base processing time in minutes
              const complexityFactor = (100 - confidence) / 100 // 0 to 1
              return sum + (baseTime + complexityFactor * 2) // 1.5 to 3.5 minutes
            }, 0) / dayValidations.length
          : 0

        processingTimes.push(Number(avgProcessingTime.toFixed(1)))
      }

      return { days, validationCounts, confidenceScores, processingTimes }
    }

    const createChart = () => {
      if (!chartCanvas.value) return

      try {
        const { days, validationCounts, confidenceScores, processingTimes } = processData()

      const getChartConfig = () => {
        const baseConfig = {
          type: 'line',
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: '#6b7280',
                  font: {
                    size: 12
                  }
                }
              },
              y: {
                grid: {
                  color: '#f3f4f6'
                },
                ticks: {
                  color: '#6b7280',
                  font: {
                    size: 12
                  }
                }
              }
            },
            elements: {
              point: {
                radius: 4,
                hoverRadius: 6
              },
              line: {
                tension: 0.4
              }
            }
          }
        }

        switch (props.type) {
          case 'validations':
            return {
              ...baseConfig,
              data: {
                labels: days,
                datasets: [{
                  label: 'Validations',
                  data: validationCounts,
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true
                }]
              },
              options: {
                ...baseConfig.options,
                scales: {
                  ...baseConfig.options.scales,
                  y: {
                    ...baseConfig.options.scales.y,
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Validations',
                      color: '#6b7280'
                    }
                  }
                }
              }
            }

          case 'confidence':
            return {
              ...baseConfig,
              data: {
                labels: days,
                datasets: [{
                  label: 'Average Confidence',
                  data: confidenceScores,
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true
                }]
              },
              options: {
                ...baseConfig.options,
                scales: {
                  ...baseConfig.options.scales,
                  y: {
                    ...baseConfig.options.scales.y,
                    min: 0,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Confidence Score (%)',
                      color: '#6b7280'
                    }
                  }
                }
              }
            }

          case 'processing':
            return {
              ...baseConfig,
              data: {
                labels: days,
                datasets: [{
                  label: 'Processing Time',
                  data: processingTimes,
                  borderColor: '#8b5cf6',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  fill: true
                }]
              },
              options: {
                ...baseConfig.options,
                scales: {
                  ...baseConfig.options.scales,
                  y: {
                    ...baseConfig.options.scales.y,
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Processing Time (minutes)',
                      color: '#6b7280'
                    }
                  }
                }
              }
            }

          default:
            return baseConfig
        }
      }

      // Destroy existing chart
      if (chartInstance) {
        chartInstance.destroy()
      }

        // Create new chart
        chartInstance = new ChartJS(chartCanvas.value, getChartConfig())
      } catch (error) {
        console.error('Error creating chart:', error)
        // Fallback: show error message in canvas
        if (chartCanvas.value) {
          const ctx = chartCanvas.value.getContext('2d')
          ctx.fillStyle = '#6b7280'
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('Chart loading error', chartCanvas.value.width / 2, chartCanvas.value.height / 2)
        }
      }
    }

    onMounted(() => {
      createChart()
    })

    watch([() => props.data, () => props.type], () => {
      createChart()
    }, { deep: true })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      chartCanvas
    }
  }
}
</script>
