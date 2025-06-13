<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
    <!-- Ultra Compact Header -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-lg flex items-center justify-center shadow-lg">
              <Brain class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">PartnerAI</h1>
              <p v-if="userEmail" class="text-sm text-gray-500 font-medium -mt-1">{{ userEmail.split('@')[0] }}</p>
            </div>
          </div>

          <Button
            @click="handleLogout"
            variant="outline"
            size="sm"
            class="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 hover:text-red-800 transition-all duration-200 font-medium text-xs px-3 py-1 shadow-sm"
          >
            <LogOut class="w-3 h-3 mr-1" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-3">
      <!-- Ultra Compact Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div class="group relative">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <Card class="relative p-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/90 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold text-gray-900">{{ dashboardStats.activePartners }}</p>
                <p class="text-xs font-semibold text-gray-600">Active Partners</p>
              </div>
              <div class="relative">
                <div class="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Users class="w-3.5 h-3.5" />
                </div>
                <div class="absolute -inset-1 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
            </div>
          </Card>
        </div>

        <div class="group relative">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <Card class="relative p-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/90 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold text-gray-900">{{ dashboardStats.aiAccuracy }}%</p>
                <p class="text-xs font-semibold text-gray-600">AI Accuracy</p>
              </div>
              <div class="relative">
                <div class="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Brain class="w-3.5 h-3.5" />
                </div>
                <div class="absolute -inset-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
            </div>
          </Card>
        </div>

        <div class="group relative">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <Card class="relative p-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/90 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold text-gray-900">{{ dashboardStats.pendingReviews }}</p>
                <p class="text-xs font-semibold text-gray-600">Pending Reviews</p>
              </div>
              <div class="relative">
                <div class="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Clock class="w-3.5 h-3.5" />
                </div>
                <div class="absolute -inset-1 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
            </div>
          </Card>
        </div>

        <div class="group relative">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <Card class="relative p-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/90 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold text-gray-900">{{ dashboardStats.validatedToday }}</p>
                <p class="text-xs font-semibold text-gray-600">Validated Today</p>
              </div>
              <div class="relative">
                <div class="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <CheckCircle class="w-3.5 h-3.5" />
                </div>
                <div class="absolute -inset-1 bg-gradient-to-br from-green-50 to-green-100 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Compact Navigation -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div class="flex flex-wrap gap-3">
          <Button
            @click="activeView = 'overview'"
            :class="activeView === 'overview'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-slate-200 hover:bg-white hover:border-slate-300'"
            class="font-semibold transition-all duration-200 rounded-xl"
          >
            <Building class="w-3.5 h-3.5 mr-2" />
            Validation Center
          </Button>

          <Button
            @click="activeView = 'review'"
            :class="activeView === 'review'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-slate-200 hover:bg-white hover:border-slate-300'"
            class="font-semibold transition-all duration-200 rounded-xl"
          >
            <CheckCircle class="w-3.5 h-3.5 mr-2" />
            Review Queue
          </Button>

          <Button
            @click="activeView = 'partners'"
            :class="activeView === 'partners'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-slate-200 hover:bg-white hover:border-slate-300'"
            class="font-semibold transition-all duration-200 rounded-xl"
          >
            <Users class="w-3.5 h-3.5 mr-2" />
            Partner Directory
          </Button>
        </div>

        <Button
          @click="activeView = 'register'"
          class="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:scale-105"
        >
          <Plus class="w-3.5 h-3.5 mr-2" />
          Add Partner
        </Button>
      </div>

      <!-- Main Content Area -->
      <div class="space-y-6">
        <div v-if="activeView === 'overview'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Quick Add Section -->
          <div class="group relative">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <Card class="relative p-8 bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl hover:bg-white/90 transition-all duration-300 h-full">
              <div class="space-y-6 h-full flex flex-col">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Plus class="w-5 h-5" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900">Register New Partner</h3>
                </div>

                <div class="flex-1 flex flex-col justify-between">
                  <p class="text-gray-600 font-medium mb-4">Add a new business partner for AI validation</p>
                  <Button
                    @click="activeView = 'register'"
                    class="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:scale-105 w-fit"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <!-- AI Workflow Section -->
          <div class="group relative">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <Card class="relative p-8 bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl hover:bg-white/90 transition-all duration-300 h-full">
              <div class="space-y-6 h-full flex flex-col">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Brain class="w-5 h-5" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900">AI Validation</h3>
                </div>

                <div class="flex-1">
                  <div v-if="activePartnerRequest" class="space-y-3">
                    <p class="text-sm font-semibold text-gray-600">{{ getValidationStatusText(activePartnerRequest.status) }}:</p>
                    <p class="font-bold text-gray-900 text-lg">{{ activePartnerRequest.companyName }}</p>
                    <div :class="getValidationStatusClass(activePartnerRequest.status)">
                      <div :class="getValidationStatusDotClass(activePartnerRequest.status)"></div>
                      {{ getValidationStatusLabel(activePartnerRequest.status) }}
                    </div>
                  </div>
                  <p v-else class="text-gray-600 font-medium">No active validations. Register a partner to start the AI workflow.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <!-- Full Width Workflow Display -->
        <AIValidationWorkflow
          v-if="activeView === 'overview' && activePartnerRequest"
          :key="activePartnerRequest?.id"
          :partner-data="activePartnerRequest"
          @navigate-to-review="handleNavigateToReview"
        />

        <PartnerRegistration
          v-if="activeView === 'register'"
          @submit="handlePartnerSubmit"
        />

        <HITLInterface v-if="activeView === 'review'" />

        <PartnerDirectory v-if="activeView === 'partners'" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import { LogOut, Plus, Brain, CheckCircle, Clock, Users, Building } from 'lucide-vue-next'
import PartnerRegistration from './PartnerRegistration.vue'
import AIValidationWorkflow from './AIValidationWorkflow.vue'
import HITLInterface from './HITLInterface.vue'
import PartnerDirectory from './PartnerDirectory.vue'
import { useToast } from '@/composables/use-toast'
import { useValidationStore } from '@/stores/validation'

export default {
  name: 'Dashboard',
  components: {
    Button,
    Card,
    LogOut,
    Plus,
    Brain,
    CheckCircle,
    Clock,
    Users,
    Building,
    PartnerRegistration,
    AIValidationWorkflow,
    HITLInterface,
    PartnerDirectory
  },
  setup() {
    const router = useRouter()
    const { toast } = useToast()
    const validationStore = useValidationStore()
    const activeView = ref('overview')
    const activePartnerRequest = ref(null)
    const userEmail = ref('')
    const animationCompleted = ref(false)

    onMounted(() => {
      // Get user email from localStorage
      userEmail.value = localStorage.getItem('userEmail') || ''
    })

    // Watch for changes in the validation store to keep activePartnerRequest in sync
    watch(() => validationStore.activeValidation, (newActiveValidation, oldActiveValidation) => {
      if (newActiveValidation) {
        // Always update for new validations or status changes
        if (!activePartnerRequest.value ||
            activePartnerRequest.value.id !== newActiveValidation.id ||
            activePartnerRequest.value.status !== newActiveValidation.status) {

          console.log('Updating activePartnerRequest with validation data')
          console.log('Old partner ID:', activePartnerRequest.value?.id)
          console.log('New partner ID:', newActiveValidation.id)
          console.log('Old status:', activePartnerRequest.value?.status)
          console.log('New status:', newActiveValidation.status)

          activePartnerRequest.value = { ...newActiveValidation }
        }
      }
    }, { deep: true })

    // Watch for view changes to handle state properly
    watch(() => activeView.value, (newView, oldView) => {
      console.log('View changed from', oldView, 'to', newView)

      // When returning to overview, ensure we have the latest data
      if (newView === 'overview' && activePartnerRequest.value) {
        const latestValidation = validationStore.getValidationById(activePartnerRequest.value.id)
        if (latestValidation) {
          console.log('Refreshing active partner request with latest data')
          activePartnerRequest.value = { ...latestValidation }
        }
      }
    })

    // Dynamic computed values for dashboard cards
    const dashboardStats = computed(() => {
      const today = new Date().toDateString()

      // Active Partners - only approved partners count as active
      const activePartners = validationStore.completedValidations.length

      // AI Accuracy - average confidence score of all validations
      const allValidations = validationStore.validationResults
      const totalConfidence = allValidations.reduce((sum, validation) => sum + validation.overallConfidence, 0)
      const aiAccuracy = allValidations.length > 0 ? Math.round(totalConfidence / allValidations.length) : 0

      // Pending Reviews - validations waiting for human review
      const pendingReviews = validationStore.pendingReviews.length

      // Validated Today - validations completed today (both approved and those that went through review)
      const validatedToday = allValidations.filter(validation => {
        const validationDate = new Date(validation.submittedAt).toDateString()
        const isToday = validationDate === today
        const isCompleted = validation.status === 'approved' || validation.status === 'rejected'
        return isToday && (isCompleted || validation.status === 'pending_review')
      }).length

      return {
        activePartners,
        aiAccuracy,
        pendingReviews,
        validatedToday
      }
    })

    const handlePartnerSubmit = (partnerData) => {
      console.log('=== NEW PARTNER SUBMISSION ===')
      console.log('Partner:', partnerData.companyName)

      // Clear any previous workflow completion state
      if (activePartnerRequest.value) {
        console.log('Clearing previous workflow state for:', activePartnerRequest.value.id)
        validationStore.clearWorkflowCompletion(activePartnerRequest.value.id)
      }

      // Check if we have API response data
      if (partnerData.apiResponse) {
        // Use the mapped API results
        const aiResults = partnerData.apiResponse

        // Store the validation result with real API data
        const validationResult = validationStore.addValidationResult(partnerData, aiResults)

        // Set as active validation for workflow display
        validationStore.setActiveValidation(validationResult)
        activePartnerRequest.value = validationResult

        // Reset animation state and start timer
        animationCompleted.value = false

        // Set animation completion after 10 seconds (5 agents × 2 seconds each)
        setTimeout(() => {
          animationCompleted.value = true
          console.log('Animation completed, updating dashboard card status')
        }, 10000)

        // Show success message based on validation status
        const needsReview = validationStore.determineIfHumanReviewNeeded(partnerData, aiResults)

        toast({
          title: needsReview ? "Validation Complete - Review Required" : "Validation Complete - Auto-Approved",
          description: needsReview
            ? `${partnerData.companyName} requires human review (${aiResults.overallConfidence}% confidence)`
            : `${partnerData.companyName} has been automatically approved (${aiResults.overallConfidence}% confidence)`,
          variant: needsReview ? "default" : "default"
        })

        // Log the raw API response for debugging
        console.log('Raw API Response:', partnerData.rawApiResponse)
        console.log('Mapped API Response:', partnerData.apiResponse)

      } else {
        // Fallback to mock data if API call failed
        console.log('Using mock data for partner validation')
        const aiResults = validationStore.generateAIResults(partnerData)
        const validationResult = validationStore.addValidationResult(partnerData, aiResults)

        validationStore.setActiveValidation(validationResult)
        activePartnerRequest.value = validationResult

        // Reset animation state and start timer for mock data too
        animationCompleted.value = false

        // Set animation completion after 10 seconds (5 agents × 2 seconds each)
        setTimeout(() => {
          animationCompleted.value = true
          console.log('Mock animation completed, updating dashboard card status')
        }, 10000)

        toast({
          title: "Validation Started",
          description: `AI validation initiated for ${partnerData.companyName} (using mock data)`,
          variant: "destructive"
        })
      }

      activeView.value = 'overview' // Auto-switch to see the workflow
    }

    // Helper functions for validation status display
    const getValidationStatusText = (status) => {
      // Show "Currently processing" during animation, then show final status
      if (activePartnerRequest.value && !animationCompleted.value) {
        return 'Currently processing'
      }

      switch (status) {
        case 'approved':
          return 'Validation complete'
        case 'pending_review':
          return 'Awaiting human review'
        case 'rejected':
          return 'Validation rejected'
        default:
          return 'Processing'
      }
    }

    const getValidationStatusLabel = (status) => {
      // Show "Processing" during animation, then show final status
      if (activePartnerRequest.value && !animationCompleted.value) {
        return 'Processing'
      }

      switch (status) {
        case 'approved':
          return 'Approved'
        case 'pending_review':
          return 'Pending Review'
        case 'rejected':
          return 'Rejected'
        default:
          return 'Processing'
      }
    }

    const getValidationStatusClass = (status) => {
      const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"

      // Show processing colors during animation, then show final status colors
      if (activePartnerRequest.value && !animationCompleted.value) {
        return `${baseClass} text-blue-700 bg-blue-100 border border-blue-200`
      }

      switch (status) {
        case 'approved':
          return `${baseClass} text-green-700 bg-green-100 border border-green-200`
        case 'pending_review':
          return `${baseClass} text-amber-700 bg-amber-100 border border-amber-200`
        case 'rejected':
          return `${baseClass} text-red-700 bg-red-100 border border-red-200`
        default:
          return `${baseClass} text-blue-700 bg-blue-100 border border-blue-200`
      }
    }

    const getValidationStatusDotClass = (status) => {
      const baseClass = "w-2 h-2 rounded-full mr-2"

      // Show pulsing blue dot during animation, then show final status dot
      if (activePartnerRequest.value && !animationCompleted.value) {
        return `${baseClass} bg-blue-500 animate-pulse`
      }

      switch (status) {
        case 'approved':
          return `${baseClass} bg-green-500`
        case 'pending_review':
          return `${baseClass} bg-amber-500 animate-pulse`
        case 'rejected':
          return `${baseClass} bg-red-500`
        default:
          return `${baseClass} bg-blue-500 animate-pulse`
      }
    }

    const handleNavigateToReview = () => {
      console.log('Navigating to review screen from workflow')
      activeView.value = 'review'
    }

    const clearActivePartnerRequest = () => {
      console.log('Clearing active partner request')
      activePartnerRequest.value = null
      animationCompleted.value = false
      validationStore.clearActiveValidation()
    }

    const handleLogout = () => {
      // Clear authentication state
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userEmail')

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })

      // Redirect to login
      router.push('/login')
    }

    return {
      activeView,
      activePartnerRequest,
      handlePartnerSubmit,
      handleNavigateToReview,
      handleLogout,
      userEmail,
      validationStore,
      dashboardStats,
      animationCompleted,
      getValidationStatusText,
      getValidationStatusLabel,
      getValidationStatusClass,
      getValidationStatusDotClass
    }
  }
}
</script>
