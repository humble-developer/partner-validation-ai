<template>
  <div class="space-y-6">
    <!-- Analytics Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
        <p class="text-gray-600">Track validation performance and partner trends</p>
      </div>
      <div class="flex space-x-3">
        <select
          v-model="selectedTimeRange"
          class="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
        <Button @click="exportReport" class="flex items-center space-x-2">
          <Download class="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>
    </div>

    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        v-for="metric in keyMetrics"
        :key="metric.title"
        :title="metric.title"
        :value="metric.value"
        :change="metric.change"
        :trend="metric.trend"
        :icon="metric.icon"
        :color="metric.color"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Validation Trends Chart -->
      <Card class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Validation Trends</h3>
          <div class="flex space-x-2">
            <Button
              v-for="chartType in chartTypes"
              :key="chartType.value"
              variant="ghost"
              size="sm"
              @click="selectedChartType = chartType.value"
              :class="selectedChartType === chartType.value ? 'bg-blue-50 text-blue-600' : ''"
            >
              {{ chartType.label }}
            </Button>
          </div>
        </div>
        <ValidationTrendsChart
          :data="filteredValidations"
          :type="selectedChartType"
        />
      </Card>

      <!-- Validation Status Distribution -->
      <Card class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Validation Status Distribution</h3>
        <StatusDistributionChart :data="filteredValidations" />
      </Card>
    </div>

    <!-- Additional Metrics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Confidence Score Distribution -->
      <Card class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Confidence Score Ranges</h3>
        <div class="space-y-3">
          <div
            v-for="range in confidenceRanges"
            :key="range.label"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div :class="`w-3 h-3 rounded-full ${range.color}`"></div>
              <span class="font-medium text-gray-700">{{ range.label }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-20 bg-gray-200 rounded-full h-2">
                <div
                  :class="`h-2 rounded-full ${range.color}`"
                  :style="{ width: `${range.percentage}%` }"
                ></div>
              </div>
              <span class="text-sm font-semibold text-gray-600 w-8">{{ range.count }}</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- Processing Time Stats -->
      <Card class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Processing Performance</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Average Time</span>
            <span class="font-semibold text-gray-900">{{ processingStats.average }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Fastest</span>
            <span class="font-semibold text-green-600">{{ processingStats.fastest }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Slowest</span>
            <span class="font-semibold text-orange-600">{{ processingStats.slowest }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Total Processed</span>
            <span class="font-semibold text-blue-600">{{ processingStats.total }}</span>
          </div>
        </div>
      </Card>

      <!-- Recent Activity -->
      <Card class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-3">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-center space-x-3"
          >
            <div :class="`w-2 h-2 rounded-full ${activity.color}`"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ activity.company }}</p>
              <p class="text-xs text-gray-500">{{ activity.action }} • {{ activity.time }}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Detailed Analytics Table -->
    <Card class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Recent Validations</h3>
        <div class="flex space-x-2">
          <Input
            v-model="searchQuery"
            placeholder="Search validations..."
            class="w-64"
          />
          <Button variant="outline" @click="refreshData">
            <RefreshCw class="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Confidence</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Processing Time</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="validation in filteredValidations"
              :key="validation.id"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="py-3 px-4">
                <div class="font-medium text-gray-900">{{ validation.companyName }}</div>
                <div class="text-sm text-gray-500">{{ validation.country }}</div>
              </td>
              <td class="py-3 px-4">
                <span :class="getStatusClass(validation.status)">
                  {{ getStatusLabel(validation.status) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center space-x-2">
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      :class="`h-2 rounded-full ${getConfidenceColor(validation.confidence)}`"
                      :style="{ width: `${validation.confidence}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium">{{ validation.confidence }}%</span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm text-gray-600">
                {{ validation.processingTime }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-600">
                {{ formatDate(validation.date) }}
              </td>
              <td class="py-3 px-4">
                <Button variant="ghost" size="sm" @click="viewDetails(validation)">
                  <Eye class="w-4 h-4" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Card from '@/components/ui/card.vue'
import MetricCard from '@/components/MetricCard.vue'
import ValidationTrendsChart from '@/components/charts/ValidationTrendsChart.vue'
import StatusDistributionChart from '@/components/charts/StatusDistributionChart.vue'
import { useValidationStore } from '@/stores/validation'
import {
  Download,
  TrendingUp,
  RefreshCw,
  Eye,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-vue-next'

export default {
  name: 'AnalyticsDashboard',
  components: {
    Button,
    Input,
    Card,
    MetricCard,
    ValidationTrendsChart,
    StatusDistributionChart,
    Download,
    TrendingUp,
    RefreshCw,
    Eye,
    Users,
    CheckCircle,
    Clock,
    AlertTriangle
  },
  setup() {
    const validationStore = useValidationStore()
    const selectedTimeRange = ref('30d')
    const selectedChartType = ref('validations')
    const searchQuery = ref('')

    const chartTypes = [
      { value: 'validations', label: 'Validations' },
      { value: 'confidence', label: 'Confidence' },
      { value: 'processing', label: 'Processing Time' }
    ]

    // Calculate real metrics from validation store
    const keyMetrics = computed(() => {
      const totalValidations = validationStore.totalValidations
      const completedValidations = validationStore.completedValidations.length
      const pendingReviews = validationStore.pendingReviews.length
      const rejectedValidations = validationStore.rejectedValidations.length

      // Calculate success rate
      const successRate = totalValidations > 0
        ? ((completedValidations / totalValidations) * 100).toFixed(1)
        : '0.0'

      // Calculate average confidence
      const allValidations = validationStore.validationResults
      const avgConfidence = allValidations.length > 0
        ? (allValidations.reduce((sum, v) => sum + v.overallConfidence, 0) / allValidations.length).toFixed(1)
        : '0.0'

      // Calculate average processing time (mock for now)
      const avgProcessingTime = allValidations.length > 0 ? '2.1 min' : '0 min'

      return [
        {
          title: 'Total Validations',
          value: totalValidations.toString(),
          change: totalValidations > 0 ? '+' + totalValidations : '0',
          trend: 'up',
          icon: Users,
          color: 'blue'
        },
        {
          title: 'Success Rate',
          value: successRate + '%',
          change: successRate > 80 ? '+' + (successRate - 80).toFixed(1) + '%' : successRate + '%',
          trend: successRate > 80 ? 'up' : 'neutral',
          icon: CheckCircle,
          color: 'green'
        },
        {
          title: 'Avg Confidence',
          value: avgConfidence + '%',
          change: avgConfidence > 85 ? 'High' : avgConfidence > 70 ? 'Good' : 'Low',
          trend: avgConfidence > 85 ? 'up' : avgConfidence > 70 ? 'neutral' : 'down',
          icon: Clock,
          color: 'purple'
        },
        {
          title: 'Pending Reviews',
          value: pendingReviews.toString(),
          change: pendingReviews > 0 ? '+' + pendingReviews : '0',
          trend: pendingReviews > 0 ? 'up' : 'neutral',
          icon: AlertTriangle,
          color: 'orange'
        }
      ]
    })

    // Confidence score distribution
    const confidenceRanges = computed(() => {
      const ranges = {
        'High (90-100%)': { count: 0, color: 'bg-green-500' },
        'Good (75-89%)': { count: 0, color: 'bg-blue-500' },
        'Medium (60-74%)': { count: 0, color: 'bg-yellow-500' },
        'Low (0-59%)': { count: 0, color: 'bg-red-500' }
      }

      filteredValidations.value.forEach(validation => {
        const confidence = validation.overallConfidence || validation.confidence || 0
        if (confidence >= 90) ranges['High (90-100%)'].count++
        else if (confidence >= 75) ranges['Good (75-89%)'].count++
        else if (confidence >= 60) ranges['Medium (60-74%)'].count++
        else ranges['Low (0-59%)'].count++
      })

      const total = filteredValidations.value.length || 1
      return Object.entries(ranges).map(([label, data]) => ({
        label,
        count: data.count,
        percentage: Math.round((data.count / total) * 100),
        color: data.color
      }))
    })

    // Processing performance stats
    const processingStats = computed(() => {
      const validations = filteredValidations.value
      if (validations.length === 0) {
        return {
          average: '0 min',
          fastest: '0 min',
          slowest: '0 min',
          total: 0
        }
      }

      // Mock processing times (in real app, this would come from actual data)
      const times = validations.map(() => Math.random() * 3 + 1) // 1-4 minutes
      const average = times.reduce((sum, time) => sum + time, 0) / times.length
      const fastest = Math.min(...times)
      const slowest = Math.max(...times)

      return {
        average: `${average.toFixed(1)} min`,
        fastest: `${fastest.toFixed(1)} min`,
        slowest: `${slowest.toFixed(1)} min`,
        total: validations.length
      }
    })

    // Recent activity
    const recentActivity = computed(() => {
      return filteredValidations.value
        .slice(0, 5)
        .map(validation => ({
          id: validation.id,
          company: validation.companyName,
          action: validation.status === 'approved' ? 'Approved' :
                  validation.status === 'rejected' ? 'Rejected' : 'Under Review',
          time: formatDate(validation.date),
          color: validation.status === 'approved' ? 'bg-green-500' :
                 validation.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
        }))
    })

    // Use real validation data from store
    const filteredValidations = computed(() => {
      let validations = validationStore.validationResults.map(v => ({
        id: v.id,
        companyName: v.companyName,
        country: v.partnerInfo?.country || 'N/A',
        status: v.status,
        overallConfidence: v.overallConfidence, // Use the correct field name
        confidence: v.overallConfidence, // Also provide as confidence for backward compatibility
        submittedAt: v.submittedAt, // Use the correct field name
        date: v.submittedAt, // Also provide as date for backward compatibility
        processingTime: calculateProcessingTime(v.overallConfidence) // Calculate based on confidence
      }))

      if (!searchQuery.value) return validations
      return validations.filter(v =>
        v.companyName.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    // Calculate processing time based on confidence (simulation)
    const calculateProcessingTime = (confidence) => {
      if (!confidence) return '0 min'

      // Lower confidence = longer processing time
      const baseTime = 1.5 // base processing time in minutes
      const complexityFactor = (100 - confidence) / 100 // 0 to 1
      const processingTime = baseTime + complexityFactor * 2 // 1.5 to 3.5 minutes

      return `${processingTime.toFixed(1)} min`
    }

    const getStatusClass = (status) => {
      const baseClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      switch (status) {
        case 'approved':
          return `${baseClass} bg-green-100 text-green-800`
        case 'pending':
          return `${baseClass} bg-yellow-100 text-yellow-800`
        case 'rejected':
          return `${baseClass} bg-red-100 text-red-800`
        default:
          return `${baseClass} bg-gray-100 text-gray-800`
      }
    }

    const getStatusLabel = (status) => {
      switch (status) {
        case 'approved': return 'Approved'
        case 'pending': return 'Pending'
        case 'rejected': return 'Rejected'
        default: return 'Unknown'
      }
    }

    const getConfidenceColor = (confidence) => {
      if (confidence >= 90) return 'bg-green-500'
      if (confidence >= 75) return 'bg-blue-500'
      if (confidence >= 60) return 'bg-yellow-500'
      return 'bg-red-500'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    const exportReport = () => {
      // Create CSV content from filtered validations
      const csvHeaders = [
        'Company Name',
        'Country',
        'Status',
        'Confidence (%)',
        'Processing Time',
        'Date Submitted'
      ]

      const csvData = filteredValidations.value.map(validation => [
        validation.companyName,
        validation.country,
        validation.status,
        validation.confidence,
        validation.processingTime,
        formatDate(validation.date)
      ])

      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `partner_analytics_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    const refreshData = () => {
      // Refresh data
      console.log('Refreshing data...')
    }

    const viewDetails = (validation) => {
      // View validation details
      console.log('Viewing details for:', validation)
    }



    return {
      selectedTimeRange,
      selectedChartType,
      searchQuery,
      chartTypes,
      keyMetrics,
      confidenceRanges,
      processingStats,
      recentActivity,
      filteredValidations,
      getStatusClass,
      getStatusLabel,
      getConfidenceColor,
      formatDate,
      exportReport,
      refreshData,
      viewDetails
    }
  }
}
</script>
