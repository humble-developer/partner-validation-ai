<template>
  <div class="relative">
    <canvas ref="chartCanvas" class="w-full h-64"></canvas>
    <div v-if="!hasData" class="absolute inset-0 flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <p class="text-gray-500 text-sm">No validation data available</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, DoughnutController, Tooltip, Legend)

export default {
  name: 'StatusDistributionChart',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null

    const hasData = computed(() => props.data && props.data.length > 0)

    const processData = () => {
      const statusCounts = {
        approved: 0,
        pending_review: 0,
        rejected: 0
      }

      const validationData = props.data || []

      validationData.forEach(validation => {
        const status = validation.status

        // Map different status values to our standard ones
        if (status === 'approved') {
          statusCounts.approved++
        } else if (status === 'pending_review' || status === 'pending' || status === 'under_review') {
          statusCounts.pending_review++
        } else if (status === 'rejected') {
          statusCounts.rejected++
        }
      })

      return statusCounts
    }

    const createChart = () => {
      if (!chartCanvas.value || !hasData.value) return

      try {
        const statusCounts = processData()
        const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)

        if (total === 0) return

      const chartConfig = {
        type: 'doughnut',
        data: {
          labels: ['Approved', 'Pending Review', 'Rejected'],
          datasets: [{
            data: [
              statusCounts.approved,
              statusCounts.pending_review,
              statusCounts.rejected
            ],
            backgroundColor: [
              '#10b981', // Green for approved
              '#f59e0b', // Amber for pending
              '#ef4444'  // Red for rejected
            ],
            borderColor: [
              '#059669',
              '#d97706',
              '#dc2626'
            ],
            borderWidth: 2,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12
                },
                color: '#374151'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#1f2937',
              bodyColor: '#1f2937',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              cornerRadius: 8,
              callbacks: {
                label: function(context) {
                  const label = context.label || ''
                  const value = context.parsed
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${label}: ${value} (${percentage}%)`
                }
              }
            }
          }
        }
      }

      // Destroy existing chart
      if (chartInstance) {
        chartInstance.destroy()
      }

        // Create new chart
        chartInstance = new ChartJS(chartCanvas.value, chartConfig)
      } catch (error) {
        console.error('Error creating doughnut chart:', error)
      }
    }

    onMounted(() => {
      if (hasData.value) {
        createChart()
      }
    })

    watch(() => props.data, () => {
      createChart()
    }, { deep: true })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      chartCanvas,
      hasData
    }
  }
}
</script>
