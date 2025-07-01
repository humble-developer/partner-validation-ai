<template>
  <div class="h-[calc(100vh-280px)] flex flex-col overflow-hidden">
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 flex-shrink-0">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shadow-lg">
              <Building class="w-5 h-5" />
            </div>
            <div class="absolute -inset-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl blur opacity-25"></div>
          </div>
          <div>
            <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">Partner Directory</h3>
            <p class="text-gray-600 dark:text-gray-400 font-medium">Comprehensive view of all registered partners</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <Button @click="exportPartners" variant="outline" size="sm" class="flex items-center space-x-2">
            <Download class="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="mb-6 flex items-center space-x-4">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search partners by company name..."
            class="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-700 shadow-sm text-base font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 text-gray-900 dark:text-white"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium"
        >
          <option value="all">All Partners</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending_review">Pending Review</option>
        </select>
      </div>

      <!-- Partners Table -->
      <Card class="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden">
        <div class="overflow-x-auto h-full">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
              <tr>
                <th class="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-sm">Company</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-sm">Status</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-sm">Confidence</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-sm">Address</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-sm">Subsidiaries</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-sm">Date</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-if="filteredPartners.length === 0">
                <td colspan="7" class="py-12 text-center">
                  <div class="flex flex-col items-center space-y-3">
                    <div class="w-16 h-16 bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 rounded-xl flex items-center justify-center">
                      <Building class="w-8 h-8" />
                    </div>
                    <div>
                      <h4 class="text-lg font-medium text-gray-900 dark:text-white">No Partners Found</h4>
                      <p class="text-gray-500 dark:text-gray-400">{{ searchQuery ? 'Try adjusting your search criteria' : 'No partners match the selected filters' }}</p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                v-for="partner in filteredPartners"
                :key="partner.id"
                class="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                @click="selectPartner(partner)"
              >
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-3">
                    <div :class="`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusIconClass(partner.status)}`">
                      <Building class="w-5 h-5" />
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">{{ getDisplayName(partner) }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ partner.businessType || 'Business' }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <Badge :class="getStatusBadgeClass(partner.status)">
                    <component :is="getStatusIcon(partner.status)" class="w-3 h-3 mr-1" />
                    {{ getStatusLabel(partner.status) }}
                  </Badge>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-2">
                    <div class="w-16 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        :class="`h-2 rounded-full ${getConfidenceBarClass(partner.overallConfidence)}`"
                        :style="{ width: `${partner.overallConfidence}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ partner.overallConfidence }}%</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                    {{ getDisplayAddress(partner) }}
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div v-if="getSubsidiaries(partner)?.length" class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ getSubsidiaries(partner).length }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">subsidiaries</span>
                  </div>
                  <span v-else class="text-sm text-gray-500 dark:text-gray-400">None</span>
                </td>
                <td class="py-4 px-6">
                  <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(partner.submittedAt) }}</div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-2">
                    <!-- Edit Button (only for non-rejected partners) -->
                    <Button
                      v-if="partner.status !== 'rejected'"
                      @click.stop="editPartner(partner)"
                      variant="ghost"
                      size="sm"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      title="Edit Partner"
                    >
                      <Edit class="w-4 h-4" />
                    </Button>

                    <!-- AI Details Button (for all partners) -->
                    <Button
                      @click.stop="viewAIDetails(partner)"
                      variant="ghost"
                      size="sm"
                      class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                      title="View AI Details"
                    >
                      <Brain class="w-4 h-4" />
                    </Button>

                    <!-- Delete Button (for all partners) -->
                    <Button
                      @click.stop="confirmDeletePartner(partner)"
                      variant="ghost"
                      size="sm"
                      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                      title="Delete Partner"
                    >
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- AI Details Modal -->
      <div v-if="selectedPartnerForAI" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeAIModal">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden" @click.stop>
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                <Brain class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">AI Validation Details</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ getDisplayName(selectedPartnerForAI) }}</p>
              </div>
            </div>
            <Button @click="closeAIModal" variant="ghost" size="sm">
              <X class="w-5 h-5" />
            </Button>
          </div>

          <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div class="space-y-6">
              <div v-for="agentResult in getAgentResults(selectedPartnerForAI)"
                   :key="agentResult.name"
                   class="bg-gray-50 dark:bg-slate-700 p-6 rounded-xl border border-gray-200 dark:border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ agentResult.name }}</h4>
                  <Badge :class="getConfidenceBadgeClass(agentResult.confidence)" class="text-sm px-3 py-1">
                    {{ agentResult.confidence }}% Confidence
                  </Badge>
                </div>

                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Analysis</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-600">
                      {{ agentResult.reasoning }}
                    </p>
                  </div>

                  <div v-if="shouldShowRecommendationSectionInModal(agentResult)" class="border-l-4 border-blue-400 dark:border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 p-3 rounded-r-lg">
                    <div class="flex items-center justify-between mb-2">
                      <h5 class="text-sm font-semibold text-blue-900 dark:text-blue-200">{{ getRecommendationLabelInModal(agentResult) }}</h5>
                      <Button
                        v-if="shouldShowAcceptButtonInModal(agentResult)"
                        size="sm"
                        variant="outline"
                        @click="acceptRecommendationInModal(agentResult.name, agentResult.recommended_value)"
                        class="text-xs px-3 py-1.5 h-auto bg-blue-600 text-white border-blue-600 hover:bg-blue-700 transition-colors duration-200"
                      >
                        Accept
                      </Button>
                      <div v-else-if="isRecommendationAcceptedInModal(agentResult.name) || isAutoUpdatedInModal(agentResult)" class="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded border border-green-200 dark:border-green-700">
                        <div class="flex items-center space-x-1">
                          <span>✓ {{ isAutoUpdatedInModal(agentResult) ? 'Verified' : 'Accepted' }}</span>
                        </div>
                        <div v-if="getAcceptMessageForAgent(agentResult.name)" class="text-xs text-gray-600 dark:text-gray-400 mt-1" :key="`accept-msg-${agentResult.name}-${refreshTrigger}`">
                          {{ getAcceptMessageForAgent(agentResult.name) }}
                        </div>
                        <!-- <div v-else class="text-xs text-red-500 mt-1" :key="`debug-msg-${agentResult.name}-${refreshTrigger}`">
                          🔥 DEBUG: No accept message - Agent: {{ agentResult.name }}, Accepted: {{ isRecommendationAcceptedInModal(agentResult.name) }}
                        </div> -->
                      </div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                      <p class="text-sm text-blue-900 dark:text-blue-200 font-medium">
                        {{ getDisplayValueInModal(agentResult) }}
                      </p>
                    </div>
                  </div>

                  <!-- Subsidiaries Display (for Subsidiary Discovery Agent) -->
                  <div v-if="agentResult.name === 'Subsidiary Discovery Agent' && getSubsidiaries(selectedPartnerForAI)?.length" class="border-l-4 border-blue-400 dark:border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 p-3 rounded-r-lg">
                    <div class="flex items-center justify-between mb-3">
                      <h5 class="text-sm font-semibold text-blue-900 dark:text-blue-200">🏢 Discovered Subsidiaries</h5>
                      <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium border border-blue-200 dark:border-blue-600">
                        {{ getSubsidiaries(selectedPartnerForAI).length }} Found
                      </span>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div class="space-y-2">
                        <div v-for="subsidiary in getSubsidiaries(selectedPartnerForAI)"
                             :key="subsidiary.name"
                             class="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-200">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ subsidiary.name }}</p>
                          <p v-if="subsidiary.address" class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ subsidiary.address }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Subsidiary Sources -->
                  <div v-if="agentResult.name === 'Subsidiary Discovery Agent' && agentResult.sources?.length" class="border-l-4 border-gray-400 dark:border-gray-500 bg-gray-50/30 dark:bg-gray-900/10 p-3 rounded-r-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="toggleSources('Subsidiary_Sources')"
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-0 h-auto justify-start mb-2"
                    >
                      <ChevronDown v-if="!showSourcesForAgent['Subsidiary_Sources']" class="w-4 h-4 mr-1" />
                      <ChevronUp v-else class="w-4 h-4 mr-1" />
                      📋 Discovery Sources ({{ agentResult.sources.length }})
                    </Button>
                    <div v-if="showSourcesForAgent['Subsidiary_Sources']" class="space-y-2 pl-4 border-l-2 border-blue-200 dark:border-blue-700">
                      <div class="space-y-1">
                        <a v-for="(source, idx) in agentResult.sources"
                           :key="idx"
                           :href="source"
                           target="_blank"
                           class="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline bg-white dark:bg-slate-800 px-3 py-2 rounded border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-200">
                          <span class="font-medium mr-2">{{ idx + 1 }}.</span>
                          <span class="truncate">{{ formatSourceUrl(source) }}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div v-if="agentResult.sources?.length && agentResult.name !== 'Subsidiary Discovery Agent'" class="border-l-4 border-gray-400 dark:border-gray-500 bg-gray-50/30 dark:bg-gray-900/10 p-3 rounded-r-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="toggleSources(agentResult.name)"
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-0 h-auto justify-start mb-2"
                    >
                      <ChevronDown v-if="!showSourcesForAgent[agentResult.name]" class="w-4 h-4 mr-1" />
                      <ChevronUp v-else class="w-4 h-4 mr-1" />
                      📋 Validation Sources ({{ agentResult.sources.length }})
                    </Button>
                    <div v-if="showSourcesForAgent[agentResult.name]" class="space-y-2 pl-4 border-l-2 border-blue-200 dark:border-blue-700">
                      <div class="space-y-1">
                        <a v-for="(source, idx) in agentResult.sources"
                           :key="idx"
                           :href="source"
                           target="_blank"
                           class="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline bg-white dark:bg-slate-800 px-3 py-2 rounded border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-200">
                          <span class="font-medium mr-2">{{ idx + 1 }}.</span>
                          <span class="truncate">{{ formatSourceUrl(source) }}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

      <!-- Edit Partner Modal -->
      <div v-if="selectedPartnerForEdit" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeEditModal">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden" @click.stop>
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <Edit class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Edit Partner</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ getDisplayName(selectedPartnerForEdit) }}</p>
              </div>
            </div>
            <Button @click="closeEditModal" variant="ghost" size="sm">
              <X class="w-5 h-5" />
            </Button>
          </div>

          <div class="p-6">
            <form @submit.prevent="savePartnerChanges" class="space-y-6">
              <!-- Company Name -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  v-model="editForm.companyName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all duration-200"
                  placeholder="Enter company name"
                />
              </div>

              <!-- Primary Address -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Primary Address
                </label>
                <textarea
                  v-model="editForm.primaryAddress"
                  rows="3"
                  required
                  class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all duration-200 resize-none"
                  placeholder="Enter primary address"
                ></textarea>
              </div>

              <!-- Business Type (Optional) -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Business Type
                </label>
                <input
                  v-model="editForm.businessType"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all duration-200"
                  placeholder="Enter business type (optional)"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <Button
                  type="button"
                  @click="closeEditModal"
                  variant="outline"
                  class="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  class="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="cancelDelete">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4" @click.stop>
          <div class="p-6">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                <Trash2 class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Delete Partner</h3>
                <p class="text-gray-600 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>

            <div class="mb-6">
              <p class="text-gray-700 dark:text-gray-300">
                Are you sure you want to permanently delete
                <span class="font-semibold text-gray-900 dark:text-white">{{ getDisplayName(selectedPartnerForDelete) }}</span>?
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This will remove all partner data, validation results, and AI recommendations.
              </p>
            </div>

            <div class="flex items-center justify-end space-x-3">
              <Button
                @click="cancelDelete"
                variant="outline"
                class="px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                @click="deletePartner"
                class="px-6 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
              >
                Delete Partner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import Card from '@/components/ui/card.vue'
import Badge from '@/components/ui/badge.vue'

import { Building, CheckCircle, X, Download, ChevronUp, ChevronDown, Eye, Brain, Edit, Trash2 } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import { useValidationStore } from '@/stores/validation'
import { useToast } from '@/composables/use-toast'

export default {
  name: 'PartnerDirectory',
  components: {
    Card,
    Badge,
    Button,
    Building,
    CheckCircle,
    X,
    Download,
    ChevronUp,
    ChevronDown,
    Eye,
    Brain,
    Edit,
    Trash2
  },
  setup() {
    const validationStore = useValidationStore()
    const { toast } = useToast()
    const searchQuery = ref('')
    const statusFilter = ref('all')
    const selectedPartnerForAI = ref(null)
    const selectedPartnerForEdit = ref(null)
    const selectedPartnerForDelete = ref(null)
    const showDeleteConfirmation = ref(false)
    const showSourcesForAgent = ref({})
    const originalValues = ref({})
    const refreshTrigger = ref(0) // Force reactivity trigger
    const editForm = ref({
      companyName: '',
      primaryAddress: '',
      businessType: ''
    })

    // Get all partners
    const allPartners = computed(() => {
      return validationStore.validationResults
    })

    // Filter partners based on status and search
    const filteredPartners = computed(() => {
      // Include trigger to force reactivity when accepted recommendations change
      refreshTrigger.value

      let partners = allPartners.value

      // Filter by status
      if (statusFilter.value !== 'all') {
        partners = partners.filter(partner => {
          switch (statusFilter.value) {
            case 'approved':
              return partner.status === 'approved'
            case 'rejected':
              return partner.status === 'rejected'
            case 'pending_review':
              return partner.status === 'pending_review'
            default:
              return true
          }
        })
      }

      // Filter by search query
      if (searchQuery.value) {
        partners = partners.filter(partner =>
          partner.companyName.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }

      return partners
    })

    // Export partners function
    const exportPartners = () => {
      const allData = filteredPartners.value
      const csvHeaders = [
        'Company Name',
        'Status',
        'Confidence (%)',
        'Address',
        'Subsidiaries',
        'Date Submitted'
      ]

      const csvData = allData.map(partner => [
        getDisplayName(partner),
        partner.status,
        partner.overallConfidence,
        getDisplayAddress(partner),
        getSubsidiaries(partner)?.length || 0,
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

    // Table helper functions
    const selectPartner = (partner) => {
      // Could be used for future row selection functionality
      console.log('Selected partner:', partner.companyName)
    }

    const viewPartnerDetails = (partner) => {
      // Navigate to partner details or open details modal
      console.log('View details for:', partner.companyName)
    }

    const editPartner = (partner) => {
      selectedPartnerForEdit.value = partner
      // Populate the edit form with current data (including accepted values)
      editForm.value = {
        companyName: getDisplayName(partner) || '',
        primaryAddress: getDisplayAddress(partner) || '',
        businessType: partner.businessType || ''
      }
    }

    const closeEditModal = () => {
      selectedPartnerForEdit.value = null
      editForm.value = {
        companyName: '',
        primaryAddress: '',
        businessType: ''
      }
    }

    const savePartnerChanges = () => {
      if (!selectedPartnerForEdit.value) return

      const partner = selectedPartnerForEdit.value
      const partnerId = partner.partnerId || partner.id

      // Update the partner data
      partner.companyName = editForm.value.companyName
      partner.businessType = editForm.value.businessType

      if (partner.partnerInfo) {
        partner.partnerInfo.companyName = editForm.value.companyName
        partner.partnerInfo.primaryAddress = editForm.value.primaryAddress
      }

      // Update in validation store
      const validation = validationStore.getValidationById(partnerId)
      if (validation) {
        validation.companyName = editForm.value.companyName
        validation.businessType = editForm.value.businessType
        if (validation.partnerInfo) {
          validation.partnerInfo.companyName = editForm.value.companyName
          validation.partnerInfo.primaryAddress = editForm.value.primaryAddress
        }
      }

      // Show success toast
      toast({
        title: "Partner Updated",
        description: `${editForm.value.companyName} has been updated successfully.`,
        variant: "default"
      })

      // Close modal
      closeEditModal()

      console.log('Partner updated:', editForm.value)
    }

    // Delete partner functionality
    const confirmDeletePartner = (partner) => {
      selectedPartnerForDelete.value = partner
      showDeleteConfirmation.value = true
    }

    const cancelDelete = () => {
      selectedPartnerForDelete.value = null
      showDeleteConfirmation.value = false
    }

    const deletePartner = () => {
      if (!selectedPartnerForDelete.value) return

      const partner = selectedPartnerForDelete.value
      const partnerId = partner.partnerId || partner.id

      // Remove from validation store
      const partnerIndex = validationStore.validationResults.findIndex(
        p => (p.partnerId === partnerId || p.id === partnerId)
      )

      if (partnerIndex !== -1) {
        validationStore.validationResults.splice(partnerIndex, 1)
      }

      // Clear any accepted recommendations for this partner
      validationStore.clearAcceptedRecommendations(partnerId)

      // Show success toast
      toast({
        title: "Partner Deleted",
        description: `${partner.companyName} has been permanently deleted.`,
        variant: "destructive"
      })

      // Close modal
      cancelDelete()

      console.log('Partner deleted:', partner.companyName)
    }

    const viewAIDetails = (partner) => {
      selectedPartnerForAI.value = partner

      // Store original values for comparison
      const partnerId = partner.id || partner.partnerId
      originalValues.value[partnerId] = {
        name: partner.companyName,
        address: partner.partnerInfo?.primaryAddress
      }

      // Force refresh of acceptance status
      refreshTrigger.value++

      console.log('PartnerDirectory viewing AI details for partner:', partnerId, partner.companyName)
    }

    const closeAIModal = () => {
      selectedPartnerForAI.value = null
    }

    // Status helper functions
    const getStatusIcon = (status) => {
      switch (status) {
        case 'approved':
          return 'CheckCircle'
        case 'rejected':
          return 'X'
        case 'pending_review':
          return 'Clock'
        default:
          return 'Building'
      }
    }

    const getStatusIconClass = (status) => {
      switch (status) {
        case 'approved':
          return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
        case 'rejected':
          return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        case 'pending_review':
          return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
        default:
          return 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
      }
    }

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'approved':
          return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700'
        case 'rejected':
          return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700'
        case 'pending_review':
          return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700'
        default:
          return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
      }
    }

    const getStatusLabel = (status) => {
      switch (status) {
        case 'approved':
          return 'Approved'
        case 'rejected':
          return 'Rejected'
        case 'pending_review':
          return 'Pending Review'
        default:
          return 'Unknown'
      }
    }

    const getConfidenceBarClass = (confidence) => {
      if (confidence >= 80) return 'bg-green-500'
      if (confidence >= 60) return 'bg-yellow-500'
      return 'bg-red-500'
    }

    // Accept button logic for modal
    const shouldShowAcceptButton = (agentName) => {
      if (!selectedPartnerForAI.value) return false

      // Only show for approved and pending review partners
      const status = selectedPartnerForAI.value.status
      if (status !== 'approved' && status !== 'pending_review') return false

      // Only show for name and address validators
      return agentName === 'Partner Name Validator' || agentName === 'Address Validator'
    }

    // Create a reactive computed property for acceptance status
    const acceptanceStatus = computed(() => {
      // Include refresh trigger to force reactivity
      refreshTrigger.value

      if (!selectedPartnerForAI.value) return {}

      const partnerId = selectedPartnerForAI.value.id || selectedPartnerForAI.value.partnerId
      console.log('PartnerDirectory computing acceptance status for partnerId:', partnerId, 'trigger:', refreshTrigger.value)

      // Force reactivity by accessing the store's reactive state
      const nameAccepted = validationStore.isRecommendationAccepted(partnerId, 'name')
      const addressAccepted = validationStore.isRecommendationAccepted(partnerId, 'address')

      console.log('Computed acceptance status:', { name: nameAccepted, address: addressAccepted })

      return {
        name: nameAccepted,
        address: addressAccepted
      }
    })

    const isRecommendationAcceptedInModal = (agentName) => {
      // Only check acceptance for Name and Address validators
      if (agentName !== 'Partner Name Validator' && agentName !== 'Address Validator') {
        return false
      }

      if (!selectedPartnerForAI.value) return false

      const partnerId = selectedPartnerForAI.value.partnerId || selectedPartnerForAI.value.id
      const type = agentName === 'Partner Name Validator' ? 'name' : 'address'
      const isAccepted = validationStore.isRecommendationAccepted(partnerId, type)
      console.log('🔥 PartnerDirectory isRecommendationAcceptedInModal - partnerId:', partnerId, 'type:', type, 'isAccepted:', isAccepted)
      return isAccepted
    }

    const acceptRecommendationInModal = (agentName, recommendedValue) => {
      if (!selectedPartnerForAI.value) return

      const partnerId = selectedPartnerForAI.value.partnerId || selectedPartnerForAI.value.id
      const type = agentName === 'Partner Name Validator' ? 'name' : 'address'

      // Store original value before updating
      let previousValue = ''
      if (type === 'name') {
        previousValue = originalValues.value[partnerId]?.name || selectedPartnerForAI.value.companyName
      } else if (type === 'address') {
        previousValue = originalValues.value[partnerId]?.address || selectedPartnerForAI.value.partnerInfo?.primaryAddress
      }

      // Update the store
      console.log('PartnerDirectory accepting for partnerId:', partnerId, 'type:', type, 'value:', recommendedValue)
      console.log('PartnerDirectory calling validationStore.acceptRecommendation with:', partnerId, type, recommendedValue)
      validationStore.acceptRecommendation(partnerId, type, recommendedValue)

      // Update the selected partner data
      if (type === 'name') {
        selectedPartnerForAI.value.companyName = recommendedValue
        if (selectedPartnerForAI.value.partnerInfo) {
          selectedPartnerForAI.value.partnerInfo.companyName = recommendedValue
        }
      } else if (type === 'address') {
        if (selectedPartnerForAI.value.partnerInfo) {
          selectedPartnerForAI.value.partnerInfo.primaryAddress = recommendedValue
        }
      }

      // Also update the validation data in the store for consistency
      const validation = validationStore.getValidationById(selectedPartnerForAI.value.id)
      if (validation) {
        if (type === 'name') {
          validation.companyName = recommendedValue
          if (validation.partnerInfo) {
            validation.partnerInfo.companyName = recommendedValue
          }
        } else if (type === 'address') {
          if (validation.partnerInfo) {
            validation.partnerInfo.primaryAddress = recommendedValue
          }
        }
      }

      // Force display update trigger
      refreshTrigger.value++

      // Show success toast
      toast({
        title: type === 'name' ? "Partner Name Updated" : "Partner Address Updated",
        description: `AI Recommended ${type} "${recommendedValue}" accepted (was "${previousValue}")`,
        variant: "default"
      })

      console.log(`Accepted ${type} recommendation in modal:`, recommendedValue)
    }

    // Helper functions for sources
    const toggleSources = (agentName) => {
      showSourcesForAgent.value[agentName] = !showSourcesForAgent.value[agentName]
    }

    const formatSourceUrl = (url) => {
      try {
        const urlObj = new URL(url.trim())
        return urlObj.hostname.replace('www.', '')
      } catch {
        return url.trim()
      }
    }

    const getOriginalValue = (agentName) => {
      if (!selectedPartnerForAI.value) return ''

      // Only return values for Name and Address validators
      if (agentName !== 'Partner Name Validator' && agentName !== 'Address Validator') {
        return ''
      }

      const partnerId = selectedPartnerForAI.value.id || selectedPartnerForAI.value.partnerId
      const type = agentName === 'Partner Name Validator' ? 'name' : 'address'

      // Get original value from store (preferred) or fallback to local storage
      const storeOriginal = validationStore.getOriginalValue(partnerId, type)
      if (storeOriginal) {
        return storeOriginal
      }

      return originalValues.value[partnerId]?.[type] || ''
    }

    const getAcceptedValue = (agentName) => {
      if (!selectedPartnerForAI.value) return ''

      // Only return values for Name and Address validators
      if (agentName !== 'Partner Name Validator' && agentName !== 'Address Validator') {
        return ''
      }

      const partnerId = selectedPartnerForAI.value.id || selectedPartnerForAI.value.partnerId
      const type = agentName === 'Partner Name Validator' ? 'name' : 'address'

      const accepted = validationStore.getAcceptedRecommendation(partnerId, type)
      // Extract value if it's an object, otherwise return as is
      return accepted?.value || accepted || ''
    }

    // New helper functions for enhanced accept button logic
    const shouldShowRecommendationSectionInModal = (agentResult) => {
      // Show if there's a recommendation OR if it's verified/updated
      return agentResult.recommended_value || agentResult.is_updated !== undefined
    }

    const shouldShowAcceptButtonInModal = (agentResult) => {
      // Only show accept button if there's a recommendation (Scenario 3)
      return agentResult.recommended_value && shouldShowAcceptButton(agentResult.name) && !isRecommendationAcceptedInModal(agentResult.name)
    }

    const isAutoUpdatedInModal = (agentResult) => {
      // Scenario 1 & 2: No recommendation but is_updated flag exists
      return !agentResult.recommended_value && agentResult.is_updated !== undefined
    }

    const getRecommendationLabelInModal = (agentResult) => {
      if (agentResult.recommended_value) {
        return '💡 AI Recommendation' // Scenario 3
      } else {
        const type = agentResult.name === 'Partner Name Validator' ? 'Name' : 'Address'
        return `✓ Verified ${type}` // Scenario 1 & 2
      }
    }

    const getDisplayValueInModal = (agentResult) => {
      if (agentResult.recommended_value) {
        return agentResult.recommended_value // Scenario 3: Show recommendation
      } else {
        // Scenario 1 & 2: Show current value
        if (agentResult.name === 'Partner Name Validator') {
          return agentResult.partner_name
        } else if (agentResult.name === 'Address Validator') {
          return agentResult.address || agentResult.formatted_address
        }
      }
      return agentResult.recommended_value || ''
    }

    const getAcceptedMessageInModal = (agentResult) => {
      // Check if this is a manual acceptance (Scenario 3)
      if (agentResult.recommended_value && isRecommendationAcceptedInModal(agentResult.name)) {
        // Manual acceptance (Scenario 3) - only for recommendations
        const acceptedValue = getAcceptedValue(agentResult.name)
        const originalValue = getOriginalValue(agentResult.name)
        if (acceptedValue && originalValue) {
          const type = agentResult.name === 'Partner Name Validator' ? 'name' : 'address'
          return `AI Recommended ${type} "${acceptedValue}" accepted (was "${originalValue}")`
        }
        return 'AI Recommended value accepted'
      }

      // Check if this is an auto-update (Scenario 2)
      if (agentResult.is_updated === true && !agentResult.recommended_value) {
        // Auto-updated (Scenario 2) - AI updated with high confidence
        const type = agentResult.name === 'Partner Name Validator' ? 'name' : 'address'
        const originalValue = agentResult.name === 'Partner Name Validator' ? agentResult.original_name : agentResult.original_address

        // Get AI updated value from the correct source
        let aiUpdatedValue
        if (agentResult.name === 'Partner Name Validator') {
          aiUpdatedValue = agentResult.partner_name
        } else {
          aiUpdatedValue = agentResult.address || agentResult.formatted_address
        }

        if (originalValue && aiUpdatedValue && originalValue !== aiUpdatedValue) {
          return `AI recommended ${type} updated to "${aiUpdatedValue}" from "${originalValue}"`
        }
      }

      // Scenario 1: is_updated = false OR no value change, no message should be shown
      return null
    }

    // Helper functions to get display values (considering API response conditions)
    const getDisplayName = (partner) => {
      if (!partner) return ''

      console.log('PartnerDirectory getDisplayName - partner:', partner)

      // Check if there's a name validation result from API response
      const nameValidation = partner.rawApiResponse?.validation_results?.partner_name
      if (nameValidation) {
        // Scenario 3: Manual review required (has recommendation)
        if (nameValidation.recommended_partner_name) {
          // Check if user has accepted the recommendation
          const partnerId = partner.partnerId || partner.id
          const acceptedName = validationStore.getAcceptedRecommendation(partnerId, 'name')
          if (acceptedName) {
            console.log('PartnerDirectory getDisplayName - using accepted recommendation:', acceptedName.value)
            return acceptedName.value || acceptedName
          }
          // Not accepted yet, show original
          const originalValue = partner.rawApiResponse?.partner_request?.partner_name || partner.companyName
          console.log('PartnerDirectory getDisplayName - using original (recommendation not accepted):', originalValue)
          return originalValue
        }

        // Scenario 1 & 2: No recommendation (verified or auto-updated)
        // Use the AI validated name from validation results
        const aiValidatedName = nameValidation.partner_name || nameValidation.name || partner.companyName
        console.log('PartnerDirectory getDisplayName - using AI validated name:', aiValidatedName)
        return aiValidatedName
      }

      // Fallback to original
      const fallbackValue = partner.companyName || partner.partnerInfo?.companyName || ''
      console.log('PartnerDirectory getDisplayName - using fallback value:', fallbackValue)
      return fallbackValue
    }

    const getDisplayAddress = (partner) => {
      if (!partner) return ''

      console.log('PartnerDirectory getDisplayAddress - partner:', partner)

      // Check if there's an address validation result from API response
      const addressValidation = partner.rawApiResponse?.validation_results?.partner_address
      if (addressValidation) {
        // Scenario 3: Manual review required (has recommendation)
        if (addressValidation.recommended_address) {
          // Check if user has accepted the recommendation
          const partnerId = partner.partnerId || partner.id
          const acceptedAddress = validationStore.getAcceptedRecommendation(partnerId, 'address')
          if (acceptedAddress) {
            console.log('PartnerDirectory getDisplayAddress - using accepted recommendation:', acceptedAddress.value)
            return acceptedAddress.value || acceptedAddress
          }
          // Not accepted yet, show original
          const originalValue = partner.rawApiResponse?.partner_request?.partner_address || partner.partnerInfo?.primaryAddress
          console.log('PartnerDirectory getDisplayAddress - using original (recommendation not accepted):', originalValue)
          return originalValue
        }

        // Scenario 1 & 2: No recommendation (verified or auto-updated)
        // Use the AI validated address from validation results
        const aiValidatedAddress = addressValidation.address || addressValidation.formatted_address || partner.partnerInfo?.primaryAddress
        console.log('PartnerDirectory getDisplayAddress - using AI validated address:', aiValidatedAddress)
        return aiValidatedAddress
      }

      // Fallback to original
      const fallbackValue = partner.partnerInfo?.primaryAddress || 'Address not available'
      console.log('PartnerDirectory getDisplayAddress - using fallback value:', fallbackValue)
      return fallbackValue
    }

    // Watch for changes in the validation store to ensure reactivity
    watch(() => validationStore.validationResults, () => {
      // Force reactivity update when store changes
      console.log('PartnerDirectory detected store changes')
    }, { deep: true })

    // COMPLETELY REBUILT Accept message functions
    const getAcceptMessage = computed(() => {
      // Force reactivity by watching the trigger
      validationStore.acceptedRecommendationsTrigger
      refreshTrigger.value // Also watch local trigger

      console.log('🔥 PartnerDirectory: getAcceptMessage computed called - trigger:', validationStore.acceptedRecommendationsTrigger, 'refreshTrigger:', refreshTrigger.value)

      if (!selectedPartnerForAI.value) {
        console.log('🔥 PartnerDirectory: No selectedPartnerForAI, returning empty')
        return {}
      }

      const partnerId = selectedPartnerForAI.value.partnerId || selectedPartnerForAI.value.id
      console.log('🔥 PartnerDirectory: getAcceptMessage computed - partnerId:', partnerId)
      console.log('🔥 PartnerDirectory: selectedPartnerForAI.value:', selectedPartnerForAI.value)

      const result = {}

      // Check name acceptance
      const nameAccepted = validationStore.isRecommendationAccepted(partnerId, 'name')
      console.log('🔥 PartnerDirectory: nameAccepted:', nameAccepted)
      if (nameAccepted) {
        const acceptedValue = validationStore.getAcceptedRecommendation(partnerId, 'name')
        const originalValue = validationStore.getOriginalValue(partnerId, 'name')
        console.log('🔥 PartnerDirectory: name accepted - acceptedValue:', acceptedValue, 'originalValue:', originalValue)

        if (acceptedValue && originalValue) {
          const displayAccepted = acceptedValue.value || acceptedValue
          const displayOriginal = originalValue
          result.name = `AI Recommended name "${displayAccepted}" accepted (was "${displayOriginal}")`
          console.log('🔥 PartnerDirectory: Created name message:', result.name)
        } else {
          result.name = 'AI Recommended name accepted'
          console.log('🔥 PartnerDirectory: Created default name message:', result.name)
        }
      }

      // Check address acceptance
      const addressAccepted = validationStore.isRecommendationAccepted(partnerId, 'address')
      console.log('🔥 PartnerDirectory: addressAccepted:', addressAccepted)
      if (addressAccepted) {
        const acceptedValue = validationStore.getAcceptedRecommendation(partnerId, 'address')
        const originalValue = validationStore.getOriginalValue(partnerId, 'address')
        console.log('🔥 PartnerDirectory: address accepted - acceptedValue:', acceptedValue, 'originalValue:', originalValue)

        if (acceptedValue && originalValue) {
          const displayAccepted = acceptedValue.value || acceptedValue
          const displayOriginal = originalValue
          result.address = `AI Recommended address "${displayAccepted}" accepted (was "${displayOriginal}")`
          console.log('🔥 PartnerDirectory: Created address message:', result.address)
        } else {
          result.address = 'AI Recommended address accepted'
          console.log('🔥 PartnerDirectory: Created default address message:', result.address)
        }
      }

      console.log('🔥 PartnerDirectory: getAcceptMessage computed result:', result)
      return result
    })

    const getAcceptMessageForAgent = (agentName) => {
      const type = agentName === 'Partner Name Validator' ? 'name' : 'address'

      // First check for manual acceptance (Scenario 3)
      const manualMessage = getAcceptMessage.value[type]
      if (manualMessage) {
        console.log('🔥 PartnerDirectory: Returning manual message for', agentName, ':', manualMessage)
        return manualMessage
      }

      // Then check for auto-update scenarios (Scenario 1 & 2)
      if (!selectedPartnerForAI.value) return null

      // Get agent results to check for auto-updates
      const agentResults = getAgentResults(selectedPartnerForAI.value)
      const agentResult = agentResults.find(agent => agent.name === agentName)

      if (agentResult && agentResult.is_updated === true && !agentResult.recommended_value) {
        // This is an auto-update scenario (Scenario 2)
        console.log('🔥 PartnerDirectory: Found auto-update scenario for', agentName, ':', agentResult)

        let originalValue = ''
        let aiUpdatedValue = ''

        if (type === 'name') {
          originalValue = selectedPartnerForAI.value.rawApiResponse?.partner_request?.partner_name || ''
          aiUpdatedValue = selectedPartnerForAI.value.rawApiResponse?.validation_results?.partner_name?.name ||
                          selectedPartnerForAI.value.rawApiResponse?.validation_results?.partner_name?.partner_name ||
                          agentResult.partner_name || agentResult.name || ''
        } else if (type === 'address') {
          originalValue = selectedPartnerForAI.value.rawApiResponse?.partner_request?.partner_address || ''
          aiUpdatedValue = selectedPartnerForAI.value.rawApiResponse?.validation_results?.partner_address?.address ||
                          selectedPartnerForAI.value.rawApiResponse?.validation_results?.partner_address?.formatted_address ||
                          agentResult.address || agentResult.formatted_address || ''
        }

        if (originalValue && aiUpdatedValue && originalValue !== aiUpdatedValue) {
          const autoMessage = `AI recommended ${type} updated to "${aiUpdatedValue}" from "${originalValue}"`
          console.log('🔥 PartnerDirectory: Returning auto-update message for', agentName, ':', autoMessage)
          return autoMessage
        }
      }

      console.log('🔥 PartnerDirectory: No message found for', agentName)
      return null
    }

    // Watch for changes in accepted recommendations to trigger display updates
    watch(() => validationStore.acceptedRecommendationsTrigger, () => {
      refreshTrigger.value++
      console.log('PartnerDirectory detected accepted recommendations change, triggering display update')
    })

    // Format address for display
    const formatAddress = (partnerInfo) => {
      if (!partnerInfo) return 'Address not available'

      // Check for primaryAddress first
      if (partnerInfo.primaryAddress) {
        return partnerInfo.primaryAddress
      }

      // Fallback to individual address components
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

    // Get subsidiaries from partner data
    const getSubsidiaries = (partner) => {
      // Check raw API response first
      if (partner.rawApiResponse?.validation_results?.partner_subsidiaries?.subsidiaries) {
        return partner.rawApiResponse.validation_results.partner_subsidiaries.subsidiaries
      }

      // Check aiValidation data
      if (partner.aiValidation?.subsidiaries) {
        return partner.aiValidation.subsidiaries
      }

      // Check partnerInfo
      if (partner.partnerInfo?.subsidiaries) {
        return partner.partnerInfo.subsidiaries
      }

      return []
    }



    // Get agent results for display
    const getAgentResults = (partner) => {
      const results = []

      // Check raw API response
      if (partner.rawApiResponse?.validation_results) {
        const validationResults = partner.rawApiResponse.validation_results

        // Partner Name Validator
        if (validationResults.partner_name) {
          const nameData = validationResults.partner_name
          results.push({
            name: 'Partner Name Validator',
            confidence: Math.round((nameData.confidence_score || 0) * 100),
            reasoning: nameData.reasoning || 'Name validation completed',
            recommended_value: nameData.recommended_partner_name,
            sources: nameData.sources ? nameData.sources.split(', ') : [],
            // Enhanced data for new accept button logic
            recommended_partner_name: nameData.recommended_partner_name,
            partner_name: nameData.partner_name,
            is_updated: nameData.is_updated,
            original_name: partner.rawApiResponse?.partner_request?.partner_name
          })
        }

        // Address Validator
        if (validationResults.partner_address) {
          const addressData = validationResults.partner_address
          results.push({
            name: 'Address Validator',
            confidence: Math.round((addressData.confidence_score || 0) * 100),
            reasoning: addressData.reasoning || 'Address validation completed',
            recommended_value: addressData.recommended_address,
            sources: addressData.sources ? addressData.sources.split(', ') : [],
            // Enhanced data for new accept button logic
            recommended_address: addressData.recommended_address,
            address: addressData.address,
            formatted_address: addressData.formatted_address,
            is_updated: addressData.is_updated,
            original_address: partner.rawApiResponse?.partner_request?.partner_address
          })
        }

        // Subsidiary Discovery Agent
        if (validationResults.partner_subsidiaries) {
          const subsidiaryData = validationResults.partner_subsidiaries
          results.push({
            name: 'Subsidiary Discovery Agent',
            confidence: Math.round((subsidiaryData.confidence_score || 0) * 100),
            reasoning: subsidiaryData.reasoning || 'Subsidiary discovery completed',
            recommended_value: subsidiaryData.subsidiaries?.length ?
              `Found ${subsidiaryData.subsidiaries.length} subsidiaries` : null,
            sources: subsidiaryData.sources ? subsidiaryData.sources.split(', ') : []
          })
        }
      }

      // Fallback to aiValidation data if available
      if (results.length === 0 && partner.aiValidation?.agents) {
        return partner.aiValidation.agents.map(agent => ({
          name: agent.name,
          confidence: agent.confidence || 0,
          reasoning: agent.details || agent.reasoning || 'Validation completed',
          recommended_value: null,
          sources: []
        }))
      }

      return results
    }

    // Get confidence badge class
    const getConfidenceBadgeClass = (confidence) => {
      if (confidence >= 80) {
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700'
      } else if (confidence >= 60) {
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700'
      } else {
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700'
      }
    }

    return {
      // State
      searchQuery,
      statusFilter,
      selectedPartnerForAI,
      selectedPartnerForEdit,
      selectedPartnerForDelete,
      showDeleteConfirmation,
      editForm,
      refreshTrigger,

      // Computed
      filteredPartners,
      acceptanceStatus,

      // Functions
      exportPartners,
      selectPartner,
      viewPartnerDetails,
      editPartner,
      closeEditModal,
      savePartnerChanges,
      viewAIDetails,
      closeAIModal,
      confirmDeletePartner,
      cancelDelete,
      deletePartner,
      getStatusIcon,
      getStatusIconClass,
      getStatusBadgeClass,
      getStatusLabel,
      getConfidenceBarClass,
      formatAddress,
      formatDate,
      getValidationSummary,
      getRejectionReason,
      getSubsidiaries,
      getAgentResults,
      getConfidenceBadgeClass,
      shouldShowAcceptButton,
      isRecommendationAcceptedInModal,
      acceptRecommendationInModal,
      showSourcesForAgent,
      toggleSources,
      formatSourceUrl,
      getOriginalValue,
      getAcceptedValue,
      getAcceptMessage,
      getAcceptMessageForAgent,
      // New enhanced accept button functions
      shouldShowRecommendationSectionInModal,
      shouldShowAcceptButtonInModal,
      isAutoUpdatedInModal,
      getRecommendationLabelInModal,
      getDisplayValueInModal,
      getAcceptedMessageInModal,
      // Display helper functions
      getDisplayName,
      getDisplayAddress
    }
  }
}
</script>
