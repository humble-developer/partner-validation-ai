<template>
  <div class="relative group">
    <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
    <Card class="relative p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-xl rounded-2xl">
      <div class="space-y-6">
        <div class="text-center mb-6">
          <div class="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shadow-lg mx-auto mb-3">
            <Building class="w-5 h-5" />
          </div>
          <h2 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-1">Partner Registration</h2>
          <p class="text-gray-600 dark:text-gray-400 font-medium text-sm">Register a new business partner for validation</p>
        </div>

        <form @submit="handleSubmit" class="space-y-6" :class="{ 'opacity-75 pointer-events-none': isSubmitting }">
          <!-- Company Information -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shadow-lg">
                <Building class="w-4 h-4" />
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Company Details</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Company Name *</label>
                <Input
                  v-model="formData.companyName"
                  placeholder="Enter company name"
                  class="h-11 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Website</label>
                <Input
                  v-model="formData.website"
                  placeholder="https://company.com"
                  class="h-11 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Business Type</label>
              <Input
                v-model="formData.businessType"
                placeholder="Technology, Manufacturing, Services, etc."
                class="h-11 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
              <Textarea
                v-model="formData.description"
                placeholder="Brief description of the company"
                class="border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-20 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <!-- Address Information -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center shadow-lg">
                <MapPin class="w-4 h-4" />
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Address</h3>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Street Address *</label>
              <Input
                v-model="formData.primaryAddress"
                placeholder="Enter street address"
                class="h-11 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">City *</label>
                <Input
                  v-model="formData.city"
                  placeholder="City"
                  class="h-11 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">State</label>
                <Input
                  v-model="formData.state"
                  placeholder="State"
                  class="h-11 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Country *</label>
                <Input
                  v-model="formData.country"
                  placeholder="Country"
                  class="h-11 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">ZIP Code</label>
                <Input
                  v-model="formData.zipCode"
                  placeholder="ZIP"
                  class="h-11 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center shadow-lg">
                <User class="w-4 h-4" />
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Contact</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Contact Person</label>
                <Input
                  v-model="formData.contactPerson"
                  placeholder="Full name"
                  class="h-11 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"

                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                <Input
                  type="email"
                  v-model="formData.email"
                  placeholder="contact@company.com"
                  class="h-11 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"

                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</label>
                <Input
                  v-model="formData.phone"
                  placeholder="+1 (555) 123-4567"
                  class="h-11 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-lg text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            :disabled="isSubmitting"
            class="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 rounded-lg transform hover:scale-[1.02] disabled:transform-none"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
            <Send v-else class="w-4 h-4 mr-2" />
            {{ isSubmitting ? 'Validating Partner...' : 'Submit for Validation' }}
          </Button>
        </form>

        <!-- Loading Overlay -->
        <div v-if="isSubmitting" class="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Loader2 class="w-8 h-8 animate-spin" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Processing Registration</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">AI agents are validating partner information...</p>
            <div class="mt-4 flex items-center justify-center space-x-2">
              <div class="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Card from '@/components/ui/card.vue'
import Textarea from '@/components/ui/textarea.vue'
import { Building, MapPin, User, Send, Loader2 } from 'lucide-vue-next'
import { useToast } from '@/composables/use-toast'

export default {
  name: 'PartnerRegistration',
  components: {
    Button,
    Input,
    Card,
    Textarea,
    Building,
    MapPin,
    User,
    Send,
    Loader2
  },
  emits: ['submit'],
  setup(_, { emit }) {
    const { toast } = useToast()
    
    const formData = reactive({
      companyName: '',
      website: '',
      primaryAddress: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      businessType: '',
      description: '',
      contactPerson: '',
      email: '',
      phone: ''
    })

    // Loading state
    const isSubmitting = ref(false)

    const handleSubmit = async (e) => {
      e.preventDefault()

      // Validate required fields
      if (!formData.companyName || !formData.primaryAddress || !formData.city || !formData.country) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        })
        return
      }

      // Set loading state
      isSubmitting.value = true

      try {
        // Map form data to API payload structure
        const apiPayload = {
          partner_name: formData.companyName,
          partner_address: buildFullAddress(),
          additional_info: formData.businessType || 'Not specified'
        }

        // Make API call
        const response = await fetch('http://localhost:8000/validate-partner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiPayload)
        })

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const apiResult = await response.json()

        // Map API response to our UI structure
        const mappedApiResponse = mapApiResponseToUI(apiResult)

        // Success - emit the form data along with mapped API response
        toast({
          title: "Registration Submitted",
          description: "AI validation workflow has been initiated.",
        })

        // Emit both form data and mapped API response
        emit('submit', {
          ...formData,
          apiResponse: mappedApiResponse,
          apiPayload: apiPayload,
          rawApiResponse: apiResult
        })

      } catch (error) {
        console.error('API Error:', error)

        toast({
          title: "Submission Failed",
          description: `Failed to submit registration: ${error.message}`,
          variant: "destructive"
        })
      } finally {
        // Clear loading state
        isSubmitting.value = false
      }
    }

    const buildFullAddress = () => {
      const addressParts = [
        formData.primaryAddress,
        formData.city,
        formData.state,
        formData.country,
        formData.zipCode
      ].filter(part => part && part.trim() !== '')

      return addressParts.join(', ')
    }

    const mapApiResponseToUI = (apiResponse) => {
      try {
        const validationResults = apiResponse.validation_results || {}
        const confidenceScores = apiResponse.confidence_scores || {}
        const processingSummary = apiResponse.processing_summary || {}

        // Calculate overall confidence from individual scores
        const overallConfidence = Math.round(
          (confidenceScores.partner_name + confidenceScores.partner_address + confidenceScores.partner_subsidiaries) / 3 * 100
        )

        // Determine risk level based on confidence and human review needs
        const riskLevel = processingSummary.needs_human_review ? 'high' :
                         overallConfidence >= 85 ? 'low' :
                         overallConfidence >= 70 ? 'medium' : 'high'

        // Map the 5 agents to our UI structure
        const agents = [
          {
            name: "Planner Agent",
            task: "Planning validation workflow",
            status: "completed",
            confidence: validationResults.plan ? 95 : 0,
            details: validationResults.plan ?
              "Created comprehensive validation strategy with defined thresholds and success criteria" :
              "Planning phase not completed"
          },
          {
            name: "Partner Name Validator",
            task: "Validating company registration",
            status: "completed",
            confidence: Math.round((confidenceScores.partner_name || 0) * 100),
            details: validationResults.partner_name?.reasoning ||
              `Partner name validation: ${validationResults.partner_name?.is_valid ? 'Valid' : 'Invalid'}`
          },
          {
            name: "Address Validator",
            task: "Verifying addresses",
            status: "completed",
            confidence: Math.round((confidenceScores.partner_address || 0) * 100),
            details: validationResults.partner_address?.reasoning ||
              `Address validation: ${validationResults.partner_address?.is_valid ? 'Valid' : 'Invalid'}`
          },
          {
            name: "Subsidiary Discovery Agent",
            task: "Discovering subsidiaries",
            status: "completed",
            confidence: Math.round((confidenceScores.partner_subsidiaries || 0) * 100),
            details: validationResults.partner_subsidiaries?.reasoning ||
              `Found ${validationResults.partner_subsidiaries?.subsidiaries?.length || 0} subsidiaries`
          },
          {
            name: "Reflecting Agent",
            task: "Final analysis and recommendations",
            status: "completed",
            confidence: Math.round(processingSummary.average_confidence * 100),
            details: validationResults.reflection?.assessment?.overall_validation_quality ||
              "Completed comprehensive analysis and provided recommendations"
          }
        ]

        // Extract flags and recommendations
        const flags = []
        const recommendations = []

        // Add flags based on confidence scores and human review needs
        if (processingSummary.needs_human_review) {
          flags.push("Requires human review")
        }

        if (confidenceScores.partner_name < 0.8) {
          flags.push("Partner name confidence below threshold")
        }

        if (confidenceScores.partner_address < 0.7) {
          flags.push("Address verification needs attention")
        }

        if (confidenceScores.partner_subsidiaries < 0.6) {
          flags.push("Subsidiary discovery incomplete")
        }

        // Add recommendations from reflection
        if (validationResults.reflection?.areas_needing_human_review) {
          Object.keys(validationResults.reflection.areas_needing_human_review).forEach(area => {
            recommendations.push(validationResults.reflection.areas_needing_human_review[area].reason)
          })
        }

        // Default recommendations if none provided
        if (recommendations.length === 0) {
          if (overallConfidence >= 85) {
            recommendations.push("Recommend approval with standard monitoring")
          } else if (overallConfidence >= 70) {
            recommendations.push("Recommend approval with enhanced monitoring")
          } else {
            recommendations.push("Recommend additional verification before approval")
          }
        }

        // Build verification details
        const verificationDetails = {
          companyRegistration: validationResults.partner_name?.is_valid ? "Verified" : "Needs Review",
          addressVerification: validationResults.partner_address?.is_valid ? "Verified" : "Needs Review",
          webPresence: "API Validated",
          businessLegitimacy: overallConfidence >= 80 ? "High" : overallConfidence >= 60 ? "Medium" : "Low",
          subsidiaryCount: validationResults.partner_subsidiaries?.subsidiaries?.length || 0,
          subsidiaryDetails: validationResults.partner_subsidiaries?.subsidiaries || []
        }

        return {
          overallConfidence,
          riskLevel,
          priority: riskLevel === 'high' ? 'high' : riskLevel === 'medium' ? 'medium' : 'low',
          agents,
          recommendations,
          flags,
          verificationDetails,
          needsHumanReview: processingSummary.needs_human_review,
          processingStats: {
            totalPartnersProcessed: processingSummary.total_partners_processed,
            averageConfidence: Math.round(processingSummary.average_confidence * 100),
            completedPartners: apiResponse.completed_partners || []
          }
        }

      } catch (error) {
        console.error('Error mapping API response:', error)

        // Return fallback structure if mapping fails
        return {
          overallConfidence: 75,
          riskLevel: 'medium',
          priority: 'medium',
          agents: [
            { name: "Planner Agent", task: "Planning validation workflow", status: "completed", confidence: 95, details: "API response mapping failed, using fallback data" },
            { name: "Partner Name Validator", task: "Validating company registration", status: "completed", confidence: 75, details: "Unable to parse API response" },
            { name: "Address Validator", task: "Verifying addresses", status: "completed", confidence: 75, details: "Unable to parse API response" },
            { name: "Subsidiary Discovery Agent", task: "Discovering subsidiaries", status: "completed", confidence: 75, details: "Unable to parse API response" },
            { name: "Reflecting Agent", task: "Final analysis", status: "completed", confidence: 75, details: "Unable to parse API response" }
          ],
          recommendations: ["API response parsing failed - manual review recommended"],
          flags: ["API response mapping error"],
          verificationDetails: {
            companyRegistration: "API Error",
            addressVerification: "API Error",
            webPresence: "API Error",
            businessLegitimacy: "Unknown"
          }
        }
      }
    }

    return {
      formData,
      isSubmitting,
      handleSubmit,
      buildFullAddress,
      mapApiResponseToUI
    }
  }
}
</script>
