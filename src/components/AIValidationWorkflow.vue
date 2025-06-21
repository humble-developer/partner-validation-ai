<template>
  <div v-if="!partnerData" class="space-y-6">
    <Card class="p-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
      <Brain class="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
      <h3 class="text-xl font-medium text-slate-900 dark:text-white mb-2">AI Validation Workflow</h3>
      <p class="text-slate-600 dark:text-slate-400">Submit a partner registration to view the validation process</p>
    </Card>
  </div>

  <div v-else class="space-y-6">
    <!-- Progress Overview -->
    <Card class="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-medium text-slate-900 dark:text-white">Validation Progress</h3>
          <Badge :class="isWorkflowComplete ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'">
            {{ isWorkflowComplete ? "Complete" : "Processing" }}
          </Badge>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-slate-600 dark:text-slate-400">Step {{ Math.min(currentStep + 1, agents.length) }} of {{ agents.length }}</span>
            <span class="text-slate-900 dark:text-white font-medium">{{ Math.round(computedProgress) }}%</span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
              :style="{ width: `${computedProgress}%` }"
            ></div>
          </div>
        </div>

        <div class="text-center p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
          <p class="text-slate-700 dark:text-slate-300">
            <strong>Validating:</strong> {{ partnerData.companyName }}
          </p>
        </div>
      </div>
    </Card>

    <!-- Agent Workflow -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card
        v-for="(agent, index) in agents"
        :key="index"
        :class="`p-6 bg-white dark:bg-slate-800 border transition-all duration-300 ${
          agent.status === 'active' ? 'border-blue-500 shadow-md' : 'border-slate-200 dark:border-slate-700'
        }`"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div :class="`w-10 h-10 rounded-lg flex items-center justify-center ${
                agent.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
                agent.status === 'active' ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-700'
              }`">
                <component
                  :is="agent.icon"
                  :class="`w-5 h-5 ${
                    agent.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                    agent.status === 'active' ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                  }`"
                />
              </div>
              <div>
                <h4 class="font-medium text-slate-900 dark:text-white">{{ agent.name }}</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">{{ agent.task }}</p>
              </div>
            </div>

            <div class="text-right">
              <Badge
                v-if="agent.status === 'completed'"
                :class="getConfidenceBadgeClass(agent.name, agent.confidence)"
              >
                {{ agent.confidence }}%
              </Badge>
              <div v-if="agent.status === 'active'" class="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
                <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>Processing</span>
              </div>
            </div>
          </div>

          <!-- Enhanced Agent Details -->
          <div v-if="agent.status === 'completed'" class="space-y-3">
            <!-- Basic Details -->
            <div class="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-3 rounded">
              ✓ {{ agent.details }}
            </div>

            <!-- Enhanced Details for specific agents -->
            <div v-if="getAgentEnhancedData(agent)" class="space-y-3">
              <!-- Partner Name Agent Details -->
              <div v-if="agent.name === 'Partner Name Validator' && getAgentEnhancedData(agent).recommended_partner_name"
                   class="bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-r-lg">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h5 class="text-sm font-semibold text-blue-900 dark:text-blue-200">💡 Recommended Name</h5>
                    <Button
                      v-if="!isNameAccepted"
                      size="sm"
                      variant="outline"
                      @click="acceptRecommendedName(getAgentEnhancedData(agent).recommended_partner_name)"
                      class="text-xs px-3 py-1.5 h-auto bg-blue-600 text-white border-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      Accept
                    </Button>
                    <span v-else class="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded border border-green-200 dark:border-green-700">
                      ✓ Accepted
                    </span>
                  </div>
                  <div class="bg-white dark:bg-slate-800 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p class="text-sm text-blue-900 dark:text-blue-200 font-medium">
                      {{ getAgentEnhancedData(agent).recommended_partner_name }}
                    </p>
                  </div>
                  <div v-if="getAgentEnhancedData(agent).alternative_names?.length" class="space-y-2">
                    <p class="text-xs font-medium text-gray-700 dark:text-gray-300">Alternative Names:</p>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="name in getAgentEnhancedData(agent).alternative_names"
                            :key="name"
                            class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded border">
                        {{ name }}
                      </span>
                    </div>
                  </div>
                  <div v-if="getAgentEnhancedData(agent).sources" class="space-y-2">
                    <p class="text-xs font-medium text-gray-700 dark:text-gray-300">📋 Sources:</p>
                    <div class="flex flex-wrap gap-2">
                      <a v-for="(source, idx) in getAgentEnhancedData(agent).sources.split(', ')"
                         :key="idx"
                         :href="source.trim()"
                         target="_blank"
                         class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline bg-white dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-200">
                        Source {{ idx + 1 }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Address Validator Details -->
              <div v-if="agent.name === 'Address Validator' && getAgentEnhancedData(agent).recommended_address"
                   class="bg-green-50/50 dark:bg-green-900/10 border-l-4 border-green-500 dark:border-green-400 p-4 rounded-r-lg">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h5 class="text-sm font-semibold text-green-900 dark:text-green-200">📍 Recommended Address</h5>
                    <Button
                      v-if="!isAddressAccepted"
                      size="sm"
                      variant="outline"
                      @click="acceptRecommendedAddress(getAgentEnhancedData(agent).recommended_address)"
                      class="text-xs px-3 py-1.5 h-auto bg-green-600 text-white border-green-600 hover:bg-green-700 transition-colors duration-200"
                    >
                      Accept
                    </Button>
                    <span v-else class="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded border border-green-200 dark:border-green-700">
                      ✓ Accepted
                    </span>
                  </div>
                  <div class="bg-white dark:bg-slate-800 p-3 rounded-lg border border-green-200 dark:border-green-700">
                    <p class="text-sm text-green-900 dark:text-green-200 font-medium">
                      {{ getAgentEnhancedData(agent).recommended_address }}
                    </p>
                  </div>
                  <div v-if="getAgentEnhancedData(agent).sources" class="space-y-2">
                    <p class="text-xs font-medium text-gray-700 dark:text-gray-300">📋 Sources:</p>
                    <div class="flex flex-wrap gap-2">
                      <a v-for="(source, idx) in getAgentEnhancedData(agent).sources.split(', ')"
                         :key="idx"
                         :href="source.trim()"
                         target="_blank"
                         class="text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 underline bg-white dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 transition-colors duration-200">
                        Source {{ idx + 1 }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Subsidiary Discovery Details -->
              <div v-if="agent.name === 'Subsidiary Discovery Agent' && getAgentEnhancedData(agent).subsidiaries?.length"
                   class="bg-purple-50/50 dark:bg-purple-900/10 border-l-4 border-purple-500 dark:border-purple-400 p-4 rounded-r-lg">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h5 class="text-sm font-semibold text-purple-900 dark:text-purple-200">🏢 Discovered Subsidiaries</h5>
                    <span class="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full font-medium border border-purple-200 dark:border-purple-600">
                      {{ getAgentEnhancedData(agent).subsidiaries.length }} Found
                    </span>
                  </div>
                  <div class="bg-white dark:bg-slate-800 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div class="space-y-2">
                      <div v-for="subsidiary in getAgentEnhancedData(agent).subsidiaries"
                           :key="subsidiary.name"
                           class="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 transition-colors duration-200">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ subsidiary.name }}</p>
                        <p v-if="subsidiary.address" class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ subsidiary.address }}</p>
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

    <!-- Human Review Required -->
    <Card
      v-if="shouldShowReviewRequired"
      class="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <Users class="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <div>
            <h4 class="text-lg font-medium text-slate-900 dark:text-white">Review Required</h4>
            <p class="text-amber-700 dark:text-amber-300">
              {{ reviewRequiredMessage }}
            </p>
          </div>
        </div>
        <Button
          @click="navigateToReview"
          class="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Review Results
        </Button>
      </div>
    </Card>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import Card from '@/components/ui/card.vue'
import Button from '@/components/ui/button.vue'
import Badge from '@/components/ui/badge.vue'
import Progress from '@/components/ui/progress.vue'
import { Brain, Search, CheckCircle, Clock, AlertCircle, Users, Building, MapPin, Network } from 'lucide-vue-next'
import { useValidationStore } from '@/stores/validation'
import { useToast } from '@/composables/use-toast'

export default {
  name: 'AIValidationWorkflow',
  components: {
    Card,
    Button,
    Badge,
    Progress,
    Brain,
    Search,
    CheckCircle,
    Clock,
    AlertCircle,
    Users,
    Building,
    MapPin,
    Network
  },
  props: {
    partnerData: {
      type: Object,
      default: null
    }
  },
  emits: ['navigate-to-review'],
  setup(props, { emit }) {
    const validationStore = useValidationStore()
    const { toast } = useToast()
    const currentStep = ref(0)
    const progress = ref(0)
    const workflowStarted = ref(false)
    let timer = null

    // Helper function to get workflow state key
    const getWorkflowStateKey = (partnerId) => `workflow_state_${partnerId}`

    // Helper function to save workflow state
    const saveWorkflowState = (partnerId, state) => {
      try {
        localStorage.setItem(getWorkflowStateKey(partnerId), JSON.stringify(state))
      } catch (error) {
        console.warn('Failed to save workflow state:', error)
      }
    }

    // Helper function to load workflow state
    const loadWorkflowState = (partnerId) => {
      try {
        const saved = localStorage.getItem(getWorkflowStateKey(partnerId))
        return saved ? JSON.parse(saved) : null
      } catch (error) {
        console.warn('Failed to load workflow state:', error)
        return null
      }
    }

    // Helper function to clear workflow state
    const clearWorkflowState = (partnerId) => {
      try {
        localStorage.removeItem(getWorkflowStateKey(partnerId))
        console.log('Cleared workflow state for partner:', partnerId)
      } catch (error) {
        console.warn('Failed to clear workflow state:', error)
      }
    }

    // Helper function to clear all workflow states (for cleanup)
    const clearAllWorkflowStates = () => {
      try {
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith('workflow_state_')) {
            localStorage.removeItem(key)
          }
        })
        console.log('Cleared all workflow states')
      } catch (error) {
        console.warn('Failed to clear all workflow states:', error)
      }
    }

    // Navigation function
    const navigateToReview = () => {
      console.log('Navigating to review screen')
      emit('navigate-to-review')
    }

    // Computed progress to ensure it reaches 100% when complete
    const computedProgress = computed(() => {
      // Always use animation-based progress calculation
      // This gives users the feeling of agents running step by step

      if (agents.value.length === 0) {
        return 0
      }

      // If we're at the last step or beyond, show 100%
      if (currentStep.value >= agents.value.length - 1) {
        return 100
      }

      // Calculate progress based on completed steps
      return ((currentStep.value + 1) / agents.value.length) * 100
    })

    // Computed property to determine if workflow is complete
    const isWorkflowComplete = computed(() => {
      // Debug logging
      console.log('isWorkflowComplete check:')
      console.log('- currentStep:', currentStep.value)
      console.log('- agents.length:', agents.value.length)
      console.log('- computedProgress:', computedProgress.value)

      // Only consider complete when animation finishes (all agents processed)
      // This ensures users see the full agent-by-agent process
      const isComplete = computedProgress.value === 100 || currentStep.value >= agents.value.length
      console.log('- isComplete (animation-based):', isComplete)

      return isComplete
    })

    // Get agents from validation data or use defaults
    const agents = computed(() => {
      // Debug logging
      console.log('🤖 agents computed - partnerData:', !!props.partnerData)
      console.log('🤖 agents computed - currentStep:', currentStep.value)
      console.log('🤖 agents computed - aiValidation:', !!props.partnerData?.aiValidation)
      console.log('🤖 agents computed - aiValidation.agents:', !!props.partnerData?.aiValidation?.agents)

      if (props.partnerData?.aiValidation?.agents) {
        console.log('🤖 Using API agents, length:', props.partnerData.aiValidation.agents.length)

        // Always use animation-based status for better UX
        // This gives users the feeling of agents running step by step
        return props.partnerData.aiValidation.agents.map((agent, index) => ({
          ...agent,
          icon: getIconForAgent(agent.name),
          // Simplified status logic for animation
          status: index < currentStep.value ? "completed" :
                  index === currentStep.value ? "active" : "pending"
        }))
      }

      // Default agents for display with animation-based status
      const defaultAgents = [
        {
          name: "Planner Agent",
          icon: Brain,
          task: "Planning validation workflow",
          confidence: 95,
          details: "Analyzed company data structure and planned validation approach"
        },
        {
          name: "Name Validator",
          icon: Building,
          task: "Validating company registration",
          confidence: 92,
          details: "Verified company registration in official databases"
        },
        {
          name: "Address Validator",
          icon: MapPin,
          task: "Verifying addresses",
          confidence: 88,
          details: "Cross-referenced addresses with postal services"
        },
        {
          name: "Entity Crawler",
          icon: Network,
          task: "Discovering subsidiaries",
          confidence: 85,
          details: "Identified subsidiary entities for validation"
        },
        {
          name: "Web Researcher",
          icon: Search,
          task: "Gathering web information",
          confidence: 90,
          details: "Analyzed company reports and documentation"
        },
        {
          name: "Reasoning Agent",
          icon: CheckCircle,
          task: "Final analysis",
          confidence: 87,
          details: "Generated confidence scores and recommendations"
        }
      ]

      // Apply animation-based status to default agents
      console.log('🤖 Using default agents, length:', defaultAgents.length)
      console.log('🤖 Current step for status calculation:', currentStep.value)

      const agentsWithStatus = defaultAgents.map((agent, index) => ({
        ...agent,
        status: index < currentStep.value ? "completed" :
                index === currentStep.value ? "active" : "pending"
      }))

      console.log('🤖 Agents with status:', agentsWithStatus.map(a => `${a.name}: ${a.status}`))
      return agentsWithStatus
    })

    const getIconForAgent = (agentName) => {
      const iconMap = {
        "Planner Agent": Brain,
        "Partner Name Validator": Building,
        "Name Validator": Building,
        "Address Validator": MapPin,
        "Subsidiary Discovery Agent": Network,
        "Entity Crawler": Network,
        "Web Researcher": Search,
        "Reflecting Agent": CheckCircle,
        "Reasoning Agent": CheckCircle
      }
      return iconMap[agentName] || Brain
    }

    // Computed property to determine if review is required
    const shouldShowReviewRequired = computed(() => {
      // Only show if workflow is complete
      if (!isWorkflowComplete.value) {
        return false
      }

      // Check API response for human review requirement
      if (props.partnerData?.apiResponse?.needsHumanReview !== undefined) {
        return props.partnerData.apiResponse.needsHumanReview
      }

      // Check raw API response
      if (props.partnerData?.rawApiResponse?.processing_summary?.needs_human_review !== undefined) {
        return props.partnerData.rawApiResponse.processing_summary.needs_human_review
      }

      // Check confidence scores - if any are below thresholds, require review
      const apiResponse = props.partnerData?.rawApiResponse
      if (apiResponse?.confidence_scores) {
        const scores = apiResponse.confidence_scores
        const thresholds = apiResponse.partner_request?.thresholds || { name: 0.8, address: 0.7, subsidiary: 0.6 }

        return scores.partner_name < thresholds.name ||
               scores.partner_address < thresholds.address ||
               scores.partner_subsidiaries < thresholds.subsidiary
      }

      // Check overall confidence - if below 85%, require review
      if (props.partnerData?.overallConfidence !== undefined) {
        return props.partnerData.overallConfidence < 85
      }

      // Default: require review for safety
      return true
    })

    // Helper function to get confidence badge class based on agent type and score
    const getConfidenceBadgeClass = (agentName, confidence) => {
      let threshold = 70 // Default threshold

      // Set specific thresholds based on agent type
      if (agentName.toLowerCase().includes('name') || agentName.toLowerCase().includes('partner name')) {
        threshold = 80 // Partner name threshold
      } else if (agentName.toLowerCase().includes('address')) {
        threshold = 70 // Address threshold
      } else if (agentName.toLowerCase().includes('subsidiary') || agentName.toLowerCase().includes('subsidiaries')) {
        threshold = 60 // Subsidiary threshold
      }

      // Return appropriate classes with proper hover states and dark mode support
      if (confidence >= threshold) {
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/30 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200'
      } else {
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-900/30 hover:text-yellow-800 dark:hover:text-yellow-300 transition-colors duration-200'
      }
    }

    // Helper function to format area names for user display
    const formatAreaName = (apiFieldName) => {
      const areaMap = {
        'partner_name': 'Company Name Verification',
        'partner_address': 'Address Validation',
        'subsidiary_discovery': 'Subsidiary Research',
        'entity_validation': 'Entity Verification',
        'business_registration': 'Business Registration',
        'compliance_check': 'Compliance Verification',
        'financial_validation': 'Financial Information',
        'contact_verification': 'Contact Details',
        'ownership_structure': 'Ownership Structure',
        'regulatory_status': 'Regulatory Status'
      }
      return areaMap[apiFieldName] || apiFieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    // Computed property for review required message
    const reviewRequiredMessage = computed(() => {
      const apiResponse = props.partnerData?.rawApiResponse

      // Check if we have specific reasons from API
      if (apiResponse?.validation_results?.reflection?.areas_needing_human_review) {
        const areas = Object.keys(apiResponse.validation_results.reflection.areas_needing_human_review)
        if (areas.length > 0) {
          const formattedAreas = areas.map(area => formatAreaName(area))

          if (formattedAreas.length === 1) {
            return `Manual review required for ${formattedAreas[0].toLowerCase()}.`
          } else if (formattedAreas.length === 2) {
            return `Manual review required for ${formattedAreas[0].toLowerCase()} and ${formattedAreas[1].toLowerCase()}.`
          } else {
            const lastArea = formattedAreas.pop()
            return `Manual review required for ${formattedAreas.join(', ').toLowerCase()}, and ${lastArea.toLowerCase()}.`
          }
        }
      }

      // Check confidence scores
      if (apiResponse?.confidence_scores) {
        const scores = apiResponse.confidence_scores
        const lowScores = []

        if (scores.partner_name < 0.8) lowScores.push('Company Name Verification')
        if (scores.partner_address < 0.7) lowScores.push('Address Validation')
        if (scores.partner_subsidiaries < 0.6) lowScores.push('Subsidiary Research')

        if (lowScores.length > 0) {
          if (lowScores.length === 1) {
            return `${lowScores[0]} requires additional verification due to low confidence score.`
          } else if (lowScores.length === 2) {
            return `${lowScores[0]} and ${lowScores[1]} require additional verification due to low confidence scores.`
          } else {
            const lastScore = lowScores.pop()
            return `${lowScores.join(', ')}, and ${lastScore} require additional verification due to low confidence scores.`
          }
        }
      }

      // Default message
      return "AI validation complete. Human verification recommended for final approval."
    })

    // Update agent statuses based on current step
    const updateAgentStatuses = () => {
      // Agents are now computed, so status updates happen automatically
      // This function is kept for compatibility but agents.value handles the logic
    }

    const startWorkflow = () => {
      console.log('=== startWorkflow called ===')
      console.log('- props.partnerData:', !!props.partnerData)
      console.log('- timer:', !!timer)
      console.log('- workflowStarted:', workflowStarted.value)

      if (props.partnerData && !timer && !workflowStarted.value) {
        console.log('✅ Starting workflow animation for:', props.partnerData.companyName || props.partnerData.partnerInfo?.companyName)
        console.log('- Initial currentStep:', currentStep.value)
        console.log('- Agents length:', agents.value.length)

        workflowStarted.value = true

        // Always run animation for better UX, regardless of API vs mock data
        // This gives users the feeling of agents running step by step
        timer = setInterval(() => {
          console.log('⏰ Timer tick - currentStep:', currentStep.value, 'agents.length:', agents.value.length)
          if (currentStep.value < agents.value.length) {
            currentStep.value++
            // Fix progress calculation to reach 100%
            progress.value = (currentStep.value / agents.value.length) * 100
            updateAgentStatuses()
            console.log('🎬 Animation step:', currentStep.value, 'Progress:', progress.value, 'Total agents:', agents.value.length)

            // Check if we've completed all steps
            if (currentStep.value >= agents.value.length) {
              clearInterval(timer)
              timer = null
              console.log('Workflow animation completed for:', props.partnerData.companyName || props.partnerData.partnerInfo?.companyName)

              // Mark workflow as completed in store
              if (props.partnerData?.id) {
                validationStore.markWorkflowCompleted(props.partnerData.id)

                // Auto-approve partners that don't need human review
                if (!props.partnerData.needsHumanReview) {
                  console.log('Auto-approving partner after animation completion')
                  validationStore.updateValidationStatus(props.partnerData.id, 'approved', {
                    reviewedBy: 'AI System',
                    decision: 'approved',
                    feedback: 'Automatically approved after successful AI validation'
                  })
                }

                saveWorkflowState(props.partnerData.id, {
                  currentStep: currentStep.value,
                  progress: progress.value,
                  workflowStarted: workflowStarted.value
                })
              }
            }
          }
        }, 2000) // 2 seconds per step
      } else {
        console.log('❌ startWorkflow conditions not met:')
        console.log('- props.partnerData:', !!props.partnerData)
        console.log('- timer:', !!timer)
        console.log('- workflowStarted:', workflowStarted.value)
        if (workflowStarted.value) {
          console.log('Workflow already started, skipping animation restart')
        }
      }
    }

    // Track if this is the initial mount
    const isInitialMount = ref(true)

    watch(() => props.partnerData, (newData, oldData) => {
      console.log('=== WATCH TRIGGERED ===')
      console.log('- newData ID:', newData?.id)
      console.log('- oldData ID:', oldData?.id)
      console.log('- isInitialMount:', isInitialMount.value)
      console.log('- workflowStarted:', workflowStarted.value)

      if (!newData) {
        console.log('No partner data, skipping')
        return
      }

      // Handle initial mount separately
      if (isInitialMount.value) {
        isInitialMount.value = false
        console.log('=== INITIAL MOUNT ===')

        // Only restore state for completed partners, not pending ones
        // This ensures fresh workflow animations for new submissions
        if (newData.status === 'approved' || newData.status === 'rejected') {
          const savedState = loadWorkflowState(newData.id)
          if (savedState && savedState.workflowStarted) {
            console.log('Restoring saved workflow state for completed partner:', savedState)
            currentStep.value = savedState.currentStep
            progress.value = savedState.progress
            workflowStarted.value = savedState.workflowStarted
            return
          }
        }

        // Check if partner is already processed
        if (newData.status === 'approved' || newData.status === 'rejected') {
          console.log('Partner already processed, showing completed state')
          console.log('Partner status:', newData.status)
          console.log('Setting currentStep to agents.length:', agents.value.length)
          currentStep.value = agents.value.length
          progress.value = 100
          workflowStarted.value = true

          // Save completed state
          saveWorkflowState(newData.id, {
            currentStep: currentStep.value,
            progress: progress.value,
            workflowStarted: workflowStarted.value
          })
          return
        }

        console.log('Partner status is:', newData.status, '- proceeding with animation')

        // For pending partners, always start fresh workflow
        // Only preserve completed state for approved/rejected partners
        if (newData.status === 'pending_review') {
          console.log('Pending partner detected - starting fresh workflow')
          console.log('Clearing any existing workflow state for fresh start')
          clearWorkflowState(newData.id)
          validationStore.clearWorkflowCompletion(newData.id)

          currentStep.value = 0
          progress.value = 0
          workflowStarted.value = false
          startWorkflow()
          return
        }

        // Check if workflow was already completed for approved/rejected partners
        if (validationStore.isWorkflowCompleted(newData.id)) {
          console.log('Workflow already completed for this partner')
          console.log('Showing completed state')
          currentStep.value = agents.value.length
          progress.value = 100
          workflowStarted.value = true
          return
        }

        // Start workflow for new pending partner
        console.log('Starting workflow for new partner')
        console.log('Resetting currentStep to 0 before starting')
        currentStep.value = 0
        progress.value = 0
        workflowStarted.value = false
        startWorkflow()
        return
      }

      // Handle data changes after initial mount
      if (oldData && newData.id !== oldData.id) {
        console.log('=== NEW PARTNER DETECTED ===')
        console.log('Old partner:', oldData.id, 'New partner:', newData.id)

        // Different partner - reset and start fresh
        currentStep.value = 0
        progress.value = 0
        workflowStarted.value = false
        isInitialMount.value = false // Reset initial mount flag

        // Clear workflow completion for new partner to ensure fresh start
        validationStore.clearWorkflowCompletion(newData.id)

        console.log('Starting fresh workflow for new partner')
        startWorkflow()
      } else if (oldData && newData.id === oldData.id) {
        console.log('=== SAME PARTNER, CHECKING STATUS ===')
        // Same partner - check for status changes
        if (newData.status === 'approved' || newData.status === 'rejected') {
          console.log('Partner status changed to processed, showing completed state')
          currentStep.value = agents.value.length
          progress.value = 100
          workflowStarted.value = true

          if (timer) {
            clearInterval(timer)
            timer = null
          }

          // Save completed state
          saveWorkflowState(newData.id, {
            currentStep: currentStep.value,
            progress: progress.value,
            workflowStarted: workflowStarted.value
          })
        }
      }
    }, { immediate: true })

    onMounted(() => {
      console.log('AIValidationWorkflow component mounted')
      updateAgentStatuses()
      // Don't start workflow here - let the watch handle it
    })

    onUnmounted(() => {
      console.log('AIValidationWorkflow component unmounting - cleaning up')
      if (timer) {
        clearInterval(timer)
        timer = null
      }

      // Clear workflow state when navigating away
      if (props.partnerData?.id) {
        console.log('Clearing workflow state for partner:', props.partnerData.id)
        clearWorkflowState(props.partnerData.id)
        validationStore.clearWorkflowCompletion(props.partnerData.id)
      }

      // Reset component state
      currentStep.value = 0
      progress.value = 0
      workflowStarted.value = false
    })

    // Helper function to get enhanced agent data from API response
    const getAgentEnhancedData = (agent) => {
      if (!props.partnerData?.rawApiResponse?.validation_results) return null

      const validationResults = props.partnerData.rawApiResponse.validation_results

      switch (agent.name) {
        case 'Partner Name Validator':
          return validationResults.partner_name || null
        case 'Address Validator':
          return validationResults.partner_address || null
        case 'Subsidiary Discovery Agent':
          return validationResults.partner_subsidiaries || null
        default:
          return null
      }
    }

    // Computed properties for accepted recommendations
    const isNameAccepted = computed(() => {
      if (!props.partnerData) return false
      const partnerId = props.partnerData.id || props.partnerData.partnerId
      return validationStore.isRecommendationAccepted(partnerId, 'name')
    })

    const isAddressAccepted = computed(() => {
      if (!props.partnerData) return false
      const partnerId = props.partnerData.id || props.partnerData.partnerId
      return validationStore.isRecommendationAccepted(partnerId, 'address')
    })

    // Accept recommended partner name
    const acceptRecommendedName = (recommendedName) => {
      if (props.partnerData?.partnerInfo) {
        const partnerId = props.partnerData.id || props.partnerData.partnerId

        // Update the store
        validationStore.acceptRecommendation(partnerId, 'name', recommendedName)

        // Update props data
        props.partnerData.partnerInfo.companyName = recommendedName

        // Update in validation store
        const validation = validationStore.getValidationById(props.partnerData.id)
        if (validation) {
          validation.companyName = recommendedName
          validation.partnerInfo.companyName = recommendedName
        }

        toast({
          title: "Partner Name Updated",
          description: `Partner name updated to: ${recommendedName}`,
        })
      }
    }

    // Accept recommended address
    const acceptRecommendedAddress = (recommendedAddress) => {
      if (props.partnerData?.partnerInfo) {
        const partnerId = props.partnerData.id || props.partnerData.partnerId

        // Update the store
        validationStore.acceptRecommendation(partnerId, 'address', recommendedAddress)

        // Update props data
        props.partnerData.partnerInfo.primaryAddress = recommendedAddress

        // Update in validation store
        const validation = validationStore.getValidationById(props.partnerData.id)
        if (validation) {
          validation.partnerInfo.primaryAddress = recommendedAddress
        }

        toast({
          title: "Partner Address Updated",
          description: `Partner address updated to: ${recommendedAddress}`,
        })
      }
    }

    return {
      currentStep,
      progress,
      computedProgress,
      isWorkflowComplete,
      agents,
      shouldShowReviewRequired,
      reviewRequiredMessage,
      navigateToReview,
      isInitialMount,
      getConfidenceBadgeClass,
      getAgentEnhancedData,
      acceptRecommendedName,
      acceptRecommendedAddress,
      isNameAccepted,
      isAddressAccepted
    }
  }
}
</script>
