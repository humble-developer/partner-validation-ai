import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useNotifications } from '@/composables/use-notifications'

export const useValidationStore = defineStore('validation', () => {
  // Get notifications composable
  const { notifyValidationComplete, notifyPartnerApproved, notifyPartnerRejected } = useNotifications()

  // State
  const validationResults = ref([])
  const activeValidation = ref(null)
  const validationHistory = ref([])
  const completedWorkflows = ref(new Set()) // Track which partners have completed workflows
  const acceptedRecommendations = ref(new Map()) // Track accepted recommendations by partner ID

  // Getters
  const pendingReviews = computed(() =>
    validationResults.value.filter(result =>
      result.status === 'pending_review' && result.needsHumanReview
    )
  )

  const completedValidations = computed(() =>
    validationResults.value.filter(result => result.status === 'approved')
  )

  const rejectedValidations = computed(() => 
    validationResults.value.filter(result => result.status === 'rejected')
  )

  const totalValidations = computed(() => validationResults.value.length)

  // Actions
  const addValidationResult = (partnerData, aiResults) => {
    const validationId = `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Always start with pending_review to allow animation to run
    // Status will be updated to 'approved' after animation completes
    const needsHumanReview = determineIfHumanReviewNeeded(partnerData, aiResults)
    const status = 'pending_review' // Always start pending to show animation

    const validationResult = {
      id: validationId,
      partnerId: partnerData.id || `partner_${Date.now()}`,
      companyName: partnerData.companyName,
      submittedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status: status, // pending_review, approved, rejected, needs_info
      needsHumanReview: needsHumanReview, // Track if human review is actually needed
      overallConfidence: aiResults.overallConfidence,
      priority: aiResults.priority,
      
      // Partner Information
      partnerInfo: {
        companyName: partnerData.companyName,
        website: partnerData.website,
        primaryAddress: partnerData.primaryAddress,
        city: partnerData.city,
        state: partnerData.state,
        country: partnerData.country,
        zipCode: partnerData.zipCode,
        businessType: partnerData.businessType,
        description: partnerData.description,
        contactPerson: partnerData.contactPerson,
        email: partnerData.email,
        phone: partnerData.phone
      },

      // AI Validation Results
      aiValidation: {
        agents: aiResults.agents,
        overallScore: aiResults.overallConfidence,
        riskLevel: aiResults.riskLevel,
        recommendations: aiResults.recommendations,
        flags: aiResults.flags,
        verificationDetails: aiResults.verificationDetails
      },

      // Human Review
      humanReview: {
        reviewedBy: null,
        reviewedAt: null,
        decision: null,
        feedback: null,
        notes: null
      },

      // Preserve original API response data for workflow component
      rawApiResponse: partnerData.rawApiResponse || null,
      apiResponse: partnerData.apiResponse || null,
      apiPayload: partnerData.apiPayload || null
    }

    validationResults.value.unshift(validationResult)

    // Send notification for validation completion
    console.log('Sending validation complete notification for:', partnerData.companyName)
    notifyValidationComplete(
      partnerData.companyName,
      aiResults.overallConfidence,
      needsHumanReview
    )

    return validationResult
  }

  const updateValidationStatus = (validationId, status, reviewData = {}) => {
    const validation = validationResults.value.find(v => v.id === validationId)
    if (validation) {
      validation.status = status
      validation.humanReview = {
        ...validation.humanReview,
        ...reviewData,
        reviewedAt: new Date().toISOString()
      }
      
      // Send notifications for status changes
      if (status === 'approved') {
        notifyPartnerApproved(validation.companyName)
      } else if (status === 'rejected') {
        notifyPartnerRejected(validation.companyName, reviewData.feedback || 'Did not meet validation criteria')
      }

      // Move to history if completed
      if (status === 'approved' || status === 'rejected') {
        validationHistory.value.unshift({
          ...validation,
          finalStatus: status
        })
      }
    }
  }

  const getValidationById = (id) => {
    return validationResults.value.find(v => v.id === id)
  }

  const setActiveValidation = (validation) => {
    activeValidation.value = validation
  }

  const clearActiveValidation = () => {
    activeValidation.value = null
  }

  // Determine if human review is needed based on API response
  const determineIfHumanReviewNeeded = (partnerData, aiResults) => {
    // Check raw API response first (most authoritative)
    if (partnerData?.rawApiResponse?.processing_summary?.needs_human_review !== undefined) {
      console.log('Using API needs_human_review:', partnerData.rawApiResponse.processing_summary.needs_human_review)
      return partnerData.rawApiResponse.processing_summary.needs_human_review
    }

    // Check mapped API response
    if (aiResults?.needsHumanReview !== undefined) {
      console.log('Using mapped needsHumanReview:', aiResults.needsHumanReview)
      return aiResults.needsHumanReview
    }

    // Check confidence scores against thresholds
    const rawApiResponse = partnerData?.rawApiResponse
    if (rawApiResponse?.confidence_scores && rawApiResponse?.partner_request?.thresholds) {
      const scores = rawApiResponse.confidence_scores
      const thresholds = rawApiResponse.partner_request.thresholds

      const belowThreshold = scores.partner_name < thresholds.name ||
                            scores.partner_address < thresholds.address ||
                            scores.partner_subsidiaries < thresholds.subsidiary

      console.log('Confidence check - belowThreshold:', belowThreshold)
      console.log('Scores:', scores)
      console.log('Thresholds:', thresholds)

      if (belowThreshold) {
        return true
      }
    }

    // Check overall confidence
    if (aiResults?.overallConfidence !== undefined) {
      const needsReview = aiResults.overallConfidence < 85
      console.log('Overall confidence check:', aiResults.overallConfidence, 'needs review:', needsReview)
      return needsReview
    }

    // Check if there are areas needing human review
    if (rawApiResponse?.validation_results?.reflection?.areas_needing_human_review) {
      const areas = Object.keys(rawApiResponse.validation_results.reflection.areas_needing_human_review)
      if (areas.length > 0) {
        console.log('Areas needing review found:', areas)
        return true
      }
    }

    // Default to not requiring review if all checks pass
    console.log('No review needed - all checks passed')
    return false
  }

  // Workflow completion tracking
  const markWorkflowCompleted = (partnerId) => {
    completedWorkflows.value.add(partnerId)
    console.log('Marked workflow as completed for partner:', partnerId)
  }

  const isWorkflowCompleted = (partnerId) => {
    return completedWorkflows.value.has(partnerId)
  }

  const clearWorkflowCompletion = (partnerId) => {
    completedWorkflows.value.delete(partnerId)
    console.log('Cleared workflow completion for partner:', partnerId)
  }

  // Accepted recommendations management
  const acceptRecommendation = (partnerId, type, value) => {
    if (!acceptedRecommendations.value.has(partnerId)) {
      acceptedRecommendations.value.set(partnerId, {})
    }

    const partnerAccepted = acceptedRecommendations.value.get(partnerId)
    partnerAccepted[type] = {
      value,
      acceptedAt: new Date().toISOString()
    }

    // Update the partner data in validationResults
    const partner = validationResults.value.find(p => p.partnerId === partnerId || p.id === partnerId)
    if (partner) {
      if (type === 'name') {
        partner.companyName = value
        partner.partnerInfo.companyName = value
      } else if (type === 'address') {
        partner.partnerInfo.primaryAddress = value
      }
    }

    console.log(`Accepted ${type} recommendation for partner ${partnerId}:`, value)
  }

  const isRecommendationAccepted = (partnerId, type) => {
    const partnerAccepted = acceptedRecommendations.value.get(partnerId)
    return partnerAccepted && partnerAccepted[type] !== undefined
  }

  const getAcceptedRecommendation = (partnerId, type) => {
    const partnerAccepted = acceptedRecommendations.value.get(partnerId)
    return partnerAccepted ? partnerAccepted[type] : null
  }

  const clearAcceptedRecommendations = (partnerId) => {
    acceptedRecommendations.value.delete(partnerId)
    console.log('Cleared accepted recommendations for partner:', partnerId)
  }

  // Generate mock AI results for demonstration
  const generateAIResults = (partnerData) => {
    const confidence = Math.floor(Math.random() * 30) + 70 // 70-100%
    const riskLevel = confidence >= 85 ? 'low' : confidence >= 70 ? 'medium' : 'high'
    
    return {
      overallConfidence: confidence,
      riskLevel,
      priority: riskLevel === 'high' ? 'high' : riskLevel === 'medium' ? 'medium' : 'low',
      
      agents: [
        {
          name: "Planner Agent",
          task: "Planning validation workflow",
          status: "completed",
          confidence: Math.floor(Math.random() * 10) + 90,
          details: "Analyzed company data structure and planned validation approach"
        },
        {
          name: "Name Validator",
          task: "Validating company registration",
          status: "completed",
          confidence: Math.floor(Math.random() * 15) + 85,
          details: "Verified company registration in official databases"
        },
        {
          name: "Address Validator",
          task: "Verifying addresses",
          status: "completed",
          confidence: Math.floor(Math.random() * 20) + 80,
          details: "Cross-referenced addresses with postal services"
        },
        {
          name: "Entity Crawler",
          task: "Discovering subsidiaries",
          status: "completed",
          confidence: Math.floor(Math.random() * 25) + 75,
          details: "Identified subsidiary entities for validation"
        },
        {
          name: "Web Researcher",
          task: "Gathering web information",
          status: "completed",
          confidence: Math.floor(Math.random() * 20) + 80,
          details: "Analyzed company reports and documentation"
        },
        {
          name: "Reasoning Agent",
          task: "Final analysis",
          status: "completed",
          confidence: confidence,
          details: "Generated confidence scores and recommendations"
        }
      ],

      recommendations: [
        confidence >= 85 ? "Recommend approval with standard monitoring" : 
        confidence >= 70 ? "Recommend approval with enhanced monitoring" : 
        "Recommend additional verification before approval",
        
        riskLevel === 'high' ? "High-risk partner - requires detailed review" : 
        riskLevel === 'medium' ? "Medium-risk partner - standard review process" : 
        "Low-risk partner - expedited review possible"
      ],

      flags: confidence < 80 ? [
        "Below standard confidence threshold",
        "Requires additional verification"
      ] : [],

      verificationDetails: {
        companyRegistration: confidence >= 80 ? "Verified" : "Needs Review",
        addressVerification: confidence >= 75 ? "Verified" : "Needs Review",
        webPresence: confidence >= 70 ? "Strong" : "Limited",
        businessLegitimacy: confidence >= 85 ? "High" : confidence >= 70 ? "Medium" : "Low"
      }
    }
  }

  return {
    // State
    validationResults,
    activeValidation,
    validationHistory,

    // Getters
    pendingReviews,
    completedValidations,
    rejectedValidations,
    totalValidations,

    // Actions
    addValidationResult,
    updateValidationStatus,
    getValidationById,
    setActiveValidation,
    clearActiveValidation,
    generateAIResults,
    determineIfHumanReviewNeeded,
    markWorkflowCompleted,
    isWorkflowCompleted,
    clearWorkflowCompletion,

    // Accepted recommendations
    acceptRecommendation,
    isRecommendationAccepted,
    getAcceptedRecommendation,
    clearAcceptedRecommendations
  }
})
