<template>
  <div class="relative group">
    <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
    <Card class="relative p-6 bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl">
      <div class="space-y-6">
        <!-- Search Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Search class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">Advanced Search</h3>
              <p class="text-sm text-gray-600">Find partners with specific criteria</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            @click="clearFilters"
            class="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            <X class="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        <!-- Search Filters -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Company Name Search -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Company Name</label>
            <Input
              v-model="filters.companyName"
              placeholder="Search by company name..."
              class="h-10"
            />
          </div>

          <!-- Status Filter -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Status</label>
            <select
              v-model="filters.status"
              class="w-full h-10 px-3 border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending_review">Pending Review</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <!-- Confidence Range -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Min Confidence</label>
            <Input
              v-model.number="filters.minConfidence"
              type="number"
              min="0"
              max="100"
              placeholder="0-100%"
              class="h-10"
            />
          </div>

          <!-- Date Range -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Date From</label>
            <Input
              v-model="filters.dateFrom"
              type="date"
              class="h-10"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Date To</label>
            <Input
              v-model="filters.dateTo"
              type="date"
              class="h-10"
            />
          </div>

          <!-- Country Filter -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Country</label>
            <Input
              v-model="filters.country"
              placeholder="Filter by country..."
              class="h-10"
            />
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="space-y-3">
          <label class="text-sm font-semibold text-gray-700">Quick Filters</label>
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="quickFilter in quickFilters"
              :key="quickFilter.key"
              variant="outline"
              size="sm"
              @click="applyQuickFilter(quickFilter)"
              :class="isQuickFilterActive(quickFilter) ? 'bg-blue-50 border-blue-300 text-blue-700' : ''"
            >
              <component :is="quickFilter.icon" class="w-4 h-4 mr-2" />
              {{ quickFilter.label }}
            </Button>
          </div>
        </div>

        <!-- Search Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <div class="text-sm text-gray-600">
            {{ filteredCount }} results found
          </div>
          <div class="flex space-x-3">
            <Button
              variant="outline"
              @click="exportResults"
              class="flex items-center space-x-2"
            >
              <Download class="w-4 h-4" />
              <span>Export</span>
            </Button>
            <Button
              @click="applyFilters"
              class="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Search class="w-4 h-4" />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Card from '@/components/ui/card.vue'
import { Search, X, Download, CheckCircle, Clock, AlertTriangle, Globe } from 'lucide-vue-next'

export default {
  name: 'AdvancedSearch',
  components: {
    Button,
    Input,
    Card,
    Search,
    X,
    Download,
    CheckCircle,
    Clock,
    AlertTriangle,
    Globe
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  emits: ['filter-change', 'export'],
  setup(props, { emit }) {
    const filters = ref({
      companyName: '',
      status: '',
      minConfidence: null,
      dateFrom: '',
      dateTo: '',
      country: ''
    })

    const quickFilters = [
      { key: 'high-confidence', label: 'High Confidence', icon: CheckCircle, filter: { minConfidence: 90 } },
      { key: 'pending', label: 'Pending Review', icon: Clock, filter: { status: 'pending_review' } },
      { key: 'low-confidence', label: 'Needs Attention', icon: AlertTriangle, filter: { minConfidence: 0, maxConfidence: 70 } },
      { key: 'recent', label: 'Last 7 Days', icon: Globe, filter: { dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } }
    ]

    const activeQuickFilter = ref(null)

    const filteredCount = computed(() => {
      return applyFiltersToData(props.data).length
    })

    const applyFiltersToData = (data) => {
      return data.filter(item => {
        // Company name filter
        if (filters.value.companyName && !item.companyName?.toLowerCase().includes(filters.value.companyName.toLowerCase())) {
          return false
        }

        // Status filter
        if (filters.value.status && item.status !== filters.value.status) {
          return false
        }

        // Confidence filter
        if (filters.value.minConfidence !== null && item.overallConfidence < filters.value.minConfidence) {
          return false
        }

        // Date filters
        if (filters.value.dateFrom && new Date(item.submittedAt) < new Date(filters.value.dateFrom)) {
          return false
        }

        if (filters.value.dateTo && new Date(item.submittedAt) > new Date(filters.value.dateTo)) {
          return false
        }

        // Country filter
        if (filters.value.country && !item.country?.toLowerCase().includes(filters.value.country.toLowerCase())) {
          return false
        }

        return true
      })
    }

    const applyQuickFilter = (quickFilter) => {
      activeQuickFilter.value = quickFilter.key
      Object.assign(filters.value, quickFilter.filter)
      applyFilters()
    }

    const isQuickFilterActive = (quickFilter) => {
      return activeQuickFilter.value === quickFilter.key
    }

    const clearFilters = () => {
      filters.value = {
        companyName: '',
        status: '',
        minConfidence: null,
        dateFrom: '',
        dateTo: '',
        country: ''
      }
      activeQuickFilter.value = null
      // When clearing filters, emit all data
      emit('filter-change', props.data)
    }

    const applyFilters = () => {
      // Check if any filters are active
      const hasActiveFilters = Object.values(filters.value).some(value =>
        value !== '' && value !== null && value !== undefined
      )

      if (!hasActiveFilters) {
        // No filters active, emit all data
        emit('filter-change', props.data)
      } else {
        // Filters active, apply them
        const filteredData = applyFiltersToData(props.data)
        emit('filter-change', filteredData)
      }
    }

    const exportResults = () => {
      const filteredData = applyFiltersToData(props.data)
      emit('export', filteredData)
    }

    // Watch for filter changes
    watch(filters, applyFilters, { deep: true })

    // Watch for data changes and emit initial unfiltered data
    watch(() => props.data, (newData) => {
      if (newData && newData.length > 0) {
        // Check if any filters are active
        const hasActiveFilters = Object.values(filters.value).some(value =>
          value !== '' && value !== null && value !== undefined
        )

        if (!hasActiveFilters) {
          // No filters active, emit all data
          emit('filter-change', newData)
        } else {
          // Filters active, apply them
          applyFilters()
        }
      }
    }, { immediate: true })

    return {
      filters,
      quickFilters,
      activeQuickFilter,
      filteredCount,
      applyQuickFilter,
      isQuickFilterActive,
      clearFilters,
      applyFilters,
      exportResults
    }
  }
}
</script>
