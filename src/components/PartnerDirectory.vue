<template>
  <div class="h-[calc(100vh-280px)] flex flex-col overflow-hidden">
    <div class="flex-1 flex flex-col overflow-hidden">
      <Card class="p-6 bg-white border border-gray-200 shadow-xl rounded-3xl flex-1 flex flex-col overflow-hidden max-h-full">
        <div class="flex items-center justify-between mb-6 flex-shrink-0">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building class="w-5 h-5" />
              </div>
              <div class="absolute -inset-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl blur opacity-25"></div>
            </div>
            <div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Partner Directory</h3>
              <p class="text-gray-600 font-medium">Comprehensive view of all registered partners</p>
            </div>
          </div>
        </div>

        <!-- Clean Search & Actions -->
        <div class="mb-6 flex items-center space-x-4">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search partners by company name..."
              class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white shadow-sm text-base font-medium placeholder:text-gray-400 transition-all duration-200"
            />
          </div>
          <button
            @click="exportPartners"
            class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Download class="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        <!-- Enhanced Tab Navigation -->
        <div class="flex space-x-1 mb-6 bg-gray-100/80 backdrop-blur-sm p-1 rounded-xl flex-shrink-0">
          <button
            @click="activeTab = 'active'"
            :class="activeTab === 'active'
              ? 'bg-white text-green-600 shadow-lg'
              : 'text-gray-600 hover:text-gray-800'"
            class="flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <CheckCircle class="w-4 h-4" />
            <span>Active Partners</span>
            <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
              {{ searchedActivePartners.length }}
            </span>
          </button>
          <button
            @click="activeTab = 'rejected'"
            :class="activeTab === 'rejected'
              ? 'bg-white text-orange-600 shadow-lg'
              : 'text-gray-600 hover:text-gray-800'"
            class="flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <X class="w-4 h-4" />
            <span>Rejected Partners</span>
            <span class="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold">
              {{ searchedRejectedPartners.length }}
            </span>
          </button>
        </div>

        <!-- Search Results Indicator -->
        <div v-if="searchQuery" class="mb-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Search results for "<span class="font-medium text-gray-900">{{ searchQuery }}</span>" -
            <span class="font-medium">{{ searchedActivePartners.length + searchedRejectedPartners.length }}</span> partners found
          </span>
          <button
            @click="searchQuery = ''"
            class="text-gray-500 hover:text-gray-700 flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
          >
            <X class="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-hidden min-h-0">
          <!-- Active Partners Tab -->
          <div v-if="activeTab === 'active'" class="h-full overflow-y-auto">
            <div v-if="searchedActivePartners.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-center">
              <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Building class="w-8 h-8" />
              </div>
              <h4 class="text-lg font-bold text-gray-900 mb-2">No Active Partners</h4>
              <p class="text-gray-600 font-medium text-sm">Register and approve partners to see them here.</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="partner in searchedActivePartners"
                :key="partner.id"
                class="relative group"
              >
                <div class="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div class="relative bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-5 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
                  <!-- Header Row -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                        <Building class="w-5 h-5" />
                      </div>
                      <div>
                        <h4 class="text-lg font-semibold text-gray-900">{{ partner.companyName }}</h4>
                        <p class="text-sm text-gray-500">{{ partner.businessType }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Badge class="bg-green-50 text-green-700 border-0 font-medium px-2 py-1">
                        <CheckCircle class="w-3 h-3 mr-1" />
                        Approved
                      </Badge>
                      <Badge class="bg-blue-50 text-blue-700 border-0 font-medium px-2 py-1">
                        {{ partner.overallConfidence }}%
                      </Badge>
                    </div>
                  </div>

                  <!-- Info Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Address</p>
                      <p class="text-sm text-gray-900">{{ formatAddress(partner.partnerInfo) }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Registered</p>
                      <p class="text-sm text-gray-900">{{ formatDate(partner.submittedAt) }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Validation</p>
                      <p class="text-sm text-gray-900">{{ getValidationSummary(partner) }}</p>
                    </div>
                  </div>

                  <!-- Human Review (if applicable) -->
                  <div v-if="partner.humanReview" class="border-t border-gray-100 pt-3">
                    <div class="flex items-start space-x-2">
                      <div class="w-6 h-6 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle class="w-3 h-3" />
                      </div>
                      <div class="flex-1">
                        <p class="text-xs text-gray-500 mb-1">
                          Reviewed by {{ partner.humanReview.reviewedBy }} • {{ formatDate(partner.humanReview.reviewedAt) }}
                        </p>
                        <p class="text-sm text-gray-700">{{ partner.humanReview.feedback }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Rejected Partners Tab -->
          <div v-if="activeTab === 'rejected'" class="h-full overflow-y-auto">
            <div v-if="searchedRejectedPartners.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-center">
              <div class="w-16 h-16 bg-gray-50 text-gray-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <X class="w-8 h-8" />
              </div>
              <h4 class="text-lg font-bold text-gray-900 mb-2">No Rejected Partners</h4>
              <p class="text-gray-600 font-medium text-sm">Partners that fail validation will appear here.</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="partner in searchedRejectedPartners"
                :key="partner.id"
                class="relative group"
              >
                <div class="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div class="relative bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-5 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
                  <!-- Header Row -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center">
                        <Building class="w-5 h-5" />
                      </div>
                      <div>
                        <h4 class="text-lg font-semibold text-gray-900">{{ partner.companyName }}</h4>
                        <p class="text-sm text-gray-500">{{ partner.businessType }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Badge class="bg-orange-50 text-orange-700 border-0 font-medium px-2 py-1">
                        <X class="w-3 h-3 mr-1" />
                        Rejected
                      </Badge>
                      <Badge class="bg-gray-50 text-gray-700 border-0 font-medium px-2 py-1">
                        {{ partner.overallConfidence }}%
                      </Badge>
                    </div>
                  </div>

                  <!-- Info Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Address</p>
                      <p class="text-sm text-gray-900">{{ formatAddress(partner.partnerInfo) }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Rejected</p>
                      <p class="text-sm text-gray-900">{{ formatDate(partner.submittedAt) }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Reason</p>
                      <p class="text-sm text-gray-900">{{ getRejectionReason(partner) }}</p>
                    </div>
                  </div>

                  <!-- Human Review (if applicable) -->
                  <div v-if="partner.humanReview" class="border-t border-gray-100 pt-3">
                    <div class="flex items-start space-x-2">
                      <div class="w-6 h-6 bg-orange-50 text-orange-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X class="w-3 h-3" />
                      </div>
                      <div class="flex-1">
                        <p class="text-xs text-gray-500 mb-1">
                          Reviewed by {{ partner.humanReview.reviewedBy }} • {{ formatDate(partner.humanReview.reviewedAt) }}
                        </p>
                        <p class="text-sm text-gray-700">{{ partner.humanReview.feedback }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Card from '@/components/ui/card.vue'
import Badge from '@/components/ui/badge.vue'

import { Building, CheckCircle, X, Download } from 'lucide-vue-next'
import { useValidationStore } from '@/stores/validation'

export default {
  name: 'PartnerDirectory',
  components: {
    Card,
    Badge,
    Building,
    CheckCircle,
    X,
    Download
  },
  setup() {
    const validationStore = useValidationStore()
    const activeTab = ref('active')
    const searchQuery = ref('')

    // Get active partners (approved status)
    const activePartners = computed(() => {
      return validationStore.validationResults.filter(partner => partner.status === 'approved')
    })

    // Get rejected partners
    const rejectedPartners = computed(() => {
      return validationStore.validationResults.filter(partner => partner.status === 'rejected')
    })

    // Search filtered partners
    const searchedActivePartners = computed(() => {
      if (!searchQuery.value) return activePartners.value
      return activePartners.value.filter(partner =>
        partner.companyName.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const searchedRejectedPartners = computed(() => {
      if (!searchQuery.value) return rejectedPartners.value
      return rejectedPartners.value.filter(partner =>
        partner.companyName.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    // Export partners function
    const exportPartners = () => {
      const allData = [...searchedActivePartners.value, ...searchedRejectedPartners.value]
      const csvHeaders = [
        'Company Name',
        'Status',
        'Confidence (%)',
        'Country',
        'Date Submitted'
      ]

      const csvData = allData.map(partner => [
        partner.companyName,
        partner.status,
        partner.overallConfidence,
        partner.country,
        new Date(partner.submittedAt).toLocaleDateString()
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
      link.setAttribute('download', `partners_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    // Format address for display
    const formatAddress = (partnerInfo) => {
      if (!partnerInfo) return 'Address not available'
      
      const parts = []
      if (partnerInfo.street) parts.push(partnerInfo.street)
      if (partnerInfo.city) parts.push(partnerInfo.city)
      if (partnerInfo.state) parts.push(partnerInfo.state)
      if (partnerInfo.zipCode) parts.push(partnerInfo.zipCode)
      if (partnerInfo.country) parts.push(partnerInfo.country)
      
      return parts.length > 0 ? parts.join(', ') : 'Address not available'
    }

    // Format date for display
    const formatDate = (dateString) => {
      if (!dateString) return 'Date not available'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Get validation summary
    const getValidationSummary = (partner) => {
      if (partner.aiValidation?.summary) {
        return partner.aiValidation.summary
      }

      const confidence = partner.overallConfidence
      if (confidence >= 90) {
        return 'Excellent validation'
      } else if (confidence >= 80) {
        return 'Good validation'
      } else if (confidence >= 70) {
        return 'Acceptable validation'
      } else {
        return 'Required human review'
      }
    }

    // Get rejection reason
    const getRejectionReason = (partner) => {
      if (partner.humanReview?.feedback) {
        // Truncate long feedback for grid display
        const feedback = partner.humanReview.feedback
        return feedback.length > 50 ? feedback.substring(0, 50) + '...' : feedback
      }

      if (partner.aiValidation?.flags && partner.aiValidation.flags.length > 0) {
        return partner.aiValidation.flags[0] // Show first flag only
      }

      return 'Validation failed'
    }

    return {
      activeTab,
      searchQuery,
      activePartners,
      rejectedPartners,
      searchedActivePartners,
      searchedRejectedPartners,
      exportPartners,
      formatAddress,
      formatDate,
      getValidationSummary,
      getRejectionReason
    }
  }
}
</script>
