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

        <!-- Tab Navigation -->
        <div class="flex space-x-1 mb-6 bg-gray-50 p-1 rounded-lg flex-shrink-0">
          <button
            @click="activeTab = 'active'"
            :class="activeTab === 'active'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'"
            class="flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200"
          >
            <CheckCircle class="w-4 h-4 inline mr-2" />
            Active Partners ({{ activePartners.length }})
          </button>
          <button
            @click="activeTab = 'rejected'"
            :class="activeTab === 'rejected'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'"
            class="flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200"
          >
            <X class="w-4 h-4 inline mr-2" />
            Rejected Partners ({{ rejectedPartners.length }})
          </button>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-hidden min-h-0">
          <!-- Active Partners Tab -->
          <div v-if="activeTab === 'active'" class="h-full overflow-y-auto">
            <div v-if="activePartners.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-center">
              <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Building class="w-8 h-8" />
              </div>
              <h4 class="text-lg font-bold text-gray-900 mb-2">No Active Partners</h4>
              <p class="text-gray-600 font-medium text-sm">Register and approve partners to see them here.</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="partner in activePartners"
                :key="partner.id"
                class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
              >
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

          <!-- Rejected Partners Tab -->
          <div v-if="activeTab === 'rejected'" class="h-full overflow-y-auto">
            <div v-if="rejectedPartners.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-center">
              <div class="w-16 h-16 bg-gray-50 text-gray-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <X class="w-8 h-8" />
              </div>
              <h4 class="text-lg font-bold text-gray-900 mb-2">No Rejected Partners</h4>
              <p class="text-gray-600 font-medium text-sm">Partners that fail validation will appear here.</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="partner in rejectedPartners"
                :key="partner.id"
                class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
              >
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
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Card from '@/components/ui/card.vue'
import Badge from '@/components/ui/badge.vue'
import { Building, CheckCircle, X } from 'lucide-vue-next'
import { useValidationStore } from '@/stores/validation'

export default {
  name: 'PartnerDirectory',
  components: {
    Card,
    Badge,
    Building,
    CheckCircle,
    X
  },
  setup() {
    const validationStore = useValidationStore()
    const activeTab = ref('active')

    // Get active partners (approved status)
    const activePartners = computed(() => {
      return validationStore.validationResults.filter(partner => partner.status === 'approved')
    })

    // Get rejected partners
    const rejectedPartners = computed(() => {
      return validationStore.validationResults.filter(partner => partner.status === 'rejected')
    })

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
      activePartners,
      rejectedPartners,
      formatAddress,
      formatDate,
      getValidationSummary,
      getRejectionReason
    }
  }
}
</script>
