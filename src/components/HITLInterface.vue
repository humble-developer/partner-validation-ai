<template>
  <div class="h-[calc(100vh-280px)] flex flex-col overflow-hidden">
    <div class="flex-1 flex flex-col overflow-hidden">
      <Card class="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-3xl flex-1 flex flex-col overflow-hidden max-h-full">
        <div class="flex items-center justify-between mb-6 flex-shrink-0">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                <Users class="w-5 h-5" />
              </div>
              <div class="absolute -inset-1 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl blur opacity-25"></div>
            </div>
            <div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">Review Queue</h3>
              <p class="text-gray-600 dark:text-gray-400 font-medium">AI validation results requiring human oversight</p>
            </div>
          </div>
          <div class="relative">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 rounded-xl blur opacity-25"></div>
            <Badge class="relative bg-slate-100/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600/50 px-4 py-2 text-sm font-semibold">
              {{ pendingReviews.length }} Pending
            </Badge>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1 overflow-hidden min-h-0 bg-white dark:bg-slate-800 rounded-b-3xl">
          <!-- Left Column: Review Queue -->
          <div class="lg:col-span-2 flex flex-col overflow-hidden min-h-0">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex-shrink-0">Review Items</h3>
            <div class="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col min-h-0">
              <div class="flex-1 overflow-y-auto min-h-0">
                <!-- Empty State -->
                <div v-if="pendingReviews.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div class="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle class="w-8 h-8" />
                  </div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">All Clear!</h4>
                  <p class="text-gray-600 dark:text-gray-400 font-medium text-sm">No partners pending review at the moment.</p>
                  <p class="text-gray-500 dark:text-gray-500 text-xs mt-2">New validations will appear here when they require human oversight.</p>
                </div>

                <!-- Review Items -->
                <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
                  <div
                    v-for="item in pendingReviews"
                    :key="item.id"
                    @click="() => { selectedItem = item; console.log('Selected:', item.id, 'Current:', selectedItem?.id) }"
                    class="p-4 cursor-pointer transition-all duration-200"
                    :class="{
                      'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500': selectedItem?.id === item.id,
                      'hover:bg-gray-50 dark:hover:bg-slate-700': selectedItem?.id !== item.id
                    }"
                  >
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="w-6 h-6 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                            <Building class="w-3 h-3" />
                          </div>
                          <h4 class="font-bold text-gray-900 dark:text-white text-sm">{{ item.company }}</h4>
                        </div>
                        <Badge :class="`text-xs font-bold ${getPriorityColor(item.priority)}`">
                          {{ item.priority.toUpperCase() }}
                        </Badge>
                      </div>

                      <div class="flex items-start space-x-2">
                        <div class="w-4 h-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded flex items-center justify-center mt-0.5">
                          <AlertCircle class="w-2.5 h-2.5" />
                        </div>
                        <div class="flex-1">
                          <p class="text-xs font-semibold text-gray-600 dark:text-gray-400">{{ item.agent }}</p>
                          <p class="text-xs text-gray-800 dark:text-gray-200 font-medium line-clamp-2">{{ item.finding }}</p>
                        </div>
                      </div>

                      <div class="flex items-center justify-between">
                        <Badge :class="`text-xs font-bold ${getConfidenceColor(item.confidence)}`">
                          {{ item.confidence }}% Confidence
                        </Badge>
                        <div class="flex items-center space-x-1">
                          <div :class="selectedItem?.id === item.id ? 'w-2 h-2 bg-blue-500 rounded-full' : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full'"></div>
                          <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ selectedItem?.id === item.id ? 'Selected' : 'Click to review' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Analysis Details -->
          <div class="lg:col-span-3 flex flex-col overflow-hidden min-h-0">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex-shrink-0">Analysis Details</h3>

            <div class="flex-1 overflow-y-auto pr-2 min-h-0">
              <div v-if="selectedItem" class="space-y-4 p-4">
                <Card class="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-2xl">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shadow-lg">
                        <Brain class="w-4 h-4" />
                      </div>
                      <h4 class="text-lg font-bold text-gray-900 dark:text-white">
                        Analysis for {{ selectedItem.company }}
                      </h4>
                    </div>
                    <Badge :class="`border-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm font-bold text-sm ${getConfidenceColor(selectedItem.confidence)}`">
                      {{ selectedItem.confidence }}% Confidence
                    </Badge>
                  </div>

                  <div class="grid grid-cols-1 gap-4">
                    <div class="space-y-2">
                      <h5 class="font-bold text-gray-900 dark:text-white text-sm">Issue</h5>
                      <p class="text-gray-700 dark:text-gray-300 font-medium bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 p-3 rounded-lg text-sm">
                        {{ selectedItem.details.issue }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <h5 class="font-bold text-gray-900 dark:text-white text-sm">AI Analysis</h5>
                      <p class="text-gray-700 dark:text-gray-300 font-medium bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 p-3 rounded-lg text-sm">
                        {{ selectedItem.details.aiAnalysis }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <h5 class="font-bold text-gray-900 dark:text-white text-sm">Sources</h5>
                      <div class="flex flex-wrap gap-2">
                        <Badge
                          v-for="(source, index) in selectedItem.details.sources"
                          :key="index"
                          class="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/30 hover:text-blue-800 dark:hover:text-blue-300 font-semibold text-xs"
                        >
                          {{ source }}
                        </Badge>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <h5 class="font-bold text-gray-900 dark:text-white text-sm">Recommendation</h5>
                      <p class="text-gray-700 dark:text-gray-300 font-medium bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 p-3 rounded-lg text-sm">
                        {{ selectedItem.details.recommendation }}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card class="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-2xl">
                <div class="space-y-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center shadow-lg">
                      <MessageSquare class="w-4 h-4" />
                    </div>
                    <h5 class="text-lg font-bold text-gray-900 dark:text-white">Your Review</h5>
                  </div>

                  <Textarea
                    v-model="feedback"
                    placeholder="Provide your analysis and feedback..."
                    class="border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-xl text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-24 text-gray-900 dark:text-white"
                  />

                  <div class="flex flex-wrap gap-3">
                    <Button
                      @click="handleApprove(selectedItem)"
                      class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:scale-105 text-sm"
                    >
                      <CheckCircle class="w-4 h-4 mr-2" />
                      Approve
                    </Button>

                    <Button
                      @click="handleReject(selectedItem)"
                      class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:scale-105 text-sm"
                    >
                      <X class="w-4 h-4 mr-2" />
                      Reject
                    </Button>

                    <Button
                      @click="handleRequestMoreInfo(selectedItem)"
                      class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:scale-105 text-sm"
                    >
                      <Brain class="w-4 h-4 mr-2" />
                      Request Analysis
                    </Button>
                  </div>
                </div>
              </Card>
              </div>

              <Card v-else class="p-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-2xl text-center">
                <div class="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users class="w-6 h-6" />
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Select Review Item</h4>
                <p class="text-gray-600 dark:text-gray-400 font-medium text-sm">Choose an item from the queue to view analysis</p>
              </Card>
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
import Button from '@/components/ui/button.vue'
import Badge from '@/components/ui/badge.vue'
import Textarea from '@/components/ui/textarea.vue'
import Tabs from '@/components/ui/tabs.vue'
import TabsList from '@/components/ui/tabs-list.vue'
import TabsTrigger from '@/components/ui/tabs-trigger.vue'
import TabsContent from '@/components/ui/tabs-content.vue'
import { AlertCircle, CheckCircle, X, Brain, Building, Users, MessageSquare } from 'lucide-vue-next'
import { useToast } from '@/composables/use-toast'
import { useValidationStore } from '@/stores/validation'

export default {
  name: 'HITLInterface',
  components: {
    Card,
    Button,
    Badge,
    Textarea,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    AlertCircle,
    CheckCircle,
    X,
    Brain,
    Building,
    Users,
    MessageSquare
  },
  setup() {
    const { toast } = useToast()
    const validationStore = useValidationStore()
    const selectedItem = ref(null)
    const feedback = ref('')

    // Use validation store data only - no fallback mock data
    const pendingReviews = computed(() => {
      const storeReviews = validationStore.pendingReviews

      return storeReviews.map(validation => ({
        id: validation.id,
        company: validation.companyName,
        agent: "AI Validation System",
        finding: `Overall confidence: ${validation.overallConfidence}%`,
        confidence: validation.overallConfidence,
        priority: validation.priority,
        details: {
          issue: validation.aiValidation?.flags?.join(', ') || 'No issues detected',
          aiAnalysis: validation.aiValidation?.recommendations?.join('. ') || 'Standard validation completed',
          sources: ["AI Validation Agents", "Business Registry", "Web Research"],
          recommendation: validation.aiValidation?.recommendations?.[0] || 'Standard review process'
        },
        partnerInfo: validation.partnerInfo,
        aiValidation: validation.aiValidation,
        validationId: validation.id
      }))
    })

    const handleApprove = (item) => {
      if (item.validationId) {
        validationStore.updateValidationStatus(item.validationId, 'approved', {
          reviewedBy: localStorage.getItem('userEmail') || 'Unknown',
          decision: 'approved',
          feedback: feedback.value || 'Approved after review'
        })

        // Update the active validation if this is the currently active one
        const updatedValidation = validationStore.getValidationById(item.validationId)
        if (updatedValidation && validationStore.activeValidation?.id === item.validationId) {
          console.log('Updating active validation after approval')
          validationStore.setActiveValidation(updatedValidation)
        }
      }

      toast({
        title: "Partner Approved",
        description: `${item.company} has been approved.`,
      })

      // Clear selection
      selectedItem.value = null
      feedback.value = ''
    }

    const handleReject = (item) => {
      if (item.validationId) {
        validationStore.updateValidationStatus(item.validationId, 'rejected', {
          reviewedBy: localStorage.getItem('userEmail') || 'Unknown',
          decision: 'rejected',
          feedback: feedback.value || 'Rejected after review'
        })

        // Update the active validation if this is the currently active one
        const updatedValidation = validationStore.getValidationById(item.validationId)
        if (updatedValidation && validationStore.activeValidation?.id === item.validationId) {
          console.log('Updating active validation after rejection')
          validationStore.setActiveValidation(updatedValidation)
        }
      }

      toast({
        title: "Partner Rejected",
        description: `${item.company} registration has been rejected.`,
        variant: "destructive",
      })

      // Clear selection
      selectedItem.value = null
      feedback.value = ''
    }

    const handleRequestMoreInfo = (item) => {
      if (item.validationId) {
        validationStore.updateValidationStatus(item.validationId, 'needs_info', {
          reviewedBy: localStorage.getItem('userEmail') || 'Unknown',
          decision: 'needs_info',
          feedback: feedback.value || 'Additional information requested'
        })
      }

      toast({
        title: "Additional Information Requested",
        description: `AI agents will gather more information about ${item.company}.`,
      })

      // Clear selection
      selectedItem.value = null
      feedback.value = ''
    }

    const getPriorityColor = (priority) => {
      switch (priority) {
        case "high": return "bg-slate-100/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-600/50"
        case "medium": return "bg-slate-100/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-600/50"
        case "low": return "bg-slate-100/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-600/50"
        default: return "bg-slate-100/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-600/50"
      }
    }

    const getPriorityGradient = (priority) => {
      switch (priority) {
        case "high": return "bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800"
        case "medium": return "bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800"
        case "low": return "bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800"
        default: return "bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800"
      }
    }

    const getConfidenceColor = (confidence) => {
      if (confidence >= 80) return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/30 hover:text-green-800 dark:hover:text-green-300"
      if (confidence >= 60) return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-900/30 hover:text-yellow-800 dark:hover:text-yellow-300"
      return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/30 hover:text-red-800 dark:hover:text-red-300"
    }

    const getConfidenceGradient = (confidence) => {
      if (confidence >= 80) return "bg-gradient-to-r from-slate-600 to-slate-700"
      if (confidence >= 60) return "bg-gradient-to-r from-slate-600 to-slate-700"
      return "bg-gradient-to-r from-slate-600 to-slate-700"
    }

    return {
      selectedItem,
      feedback,
      pendingReviews,
      handleApprove,
      handleReject,
      handleRequestMoreInfo,
      getPriorityColor,
      getPriorityGradient,
      getConfidenceColor,
      getConfidenceGradient
    }
  }
}
</script>
