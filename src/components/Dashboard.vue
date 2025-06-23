<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" @click="showNotifications = false">
    <!-- Ultra Compact Header -->
    <header class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-lg flex items-center justify-center shadow-lg">
              <Brain class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">PartnerAI</h1>
              <p v-if="userEmail" class="text-sm text-gray-500 dark:text-gray-400 font-medium -mt-1">{{ userEmail.split('@')[0] }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Theme Toggle -->
            <!-- <Button
              @click="toggleTheme"
              variant="outline"
              size="sm"
              class="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-200 transition-all duration-200 font-medium text-xs px-3 py-1 shadow-sm"
            >
              <Sun v-if="isDark" class="w-3 h-3 mr-1" />
              <Moon v-else class="w-3 h-3 mr-1" />
              {{ isDark ? 'Light' : 'Dark' }}
            </Button> -->

            <!-- Notifications -->
            <!-- <Button
              @click="toggleNotifications"
              variant="outline"
              size="sm"
              class="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-200 font-medium text-xs px-3 py-1 shadow-sm relative"
            >
              <Bell class="w-3 h-3 mr-1" />
              Alerts
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {{ unreadCount }}
              </span>
            </Button> -->

            <!-- User Profile -->
            <div class="relative pl-3 border-l border-gray-200 dark:border-slate-600">
              <div class="flex items-center space-x-2 cursor-pointer group" @click="toggleUserMenu">
                <!-- Profile Picture -->
                <div class="relative">
                  <div class="w-8 h-8 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-200 ring-2 ring-white dark:ring-slate-700">
                    <img
                      :src="userProfilePicture || getDefaultProfilePicture()"
                      :alt="getUserDisplayName()"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                  </div>
                  <div class="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-200"></div>
                </div>

                <!-- User Name -->
                <div class="hidden sm:block">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ getUserDisplayName() }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ userRole }}</p>
                </div>

                <!-- Dropdown Arrow -->
                <ChevronDown class="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
              </div>

              <!-- User Menu Dropdown -->
              <div v-if="showUserMenu" class="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50" @click.stop>
                <div class="p-4 border-b border-gray-200 dark:border-slate-700">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-full overflow-hidden shadow-lg ring-2 ring-gray-200 dark:ring-slate-600">
                      <img
                        :src="userProfilePicture || getDefaultProfilePicture()"
                        :alt="getUserDisplayName()"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">{{ getUserDisplayName() }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ userEmail }}</p>
                      <p class="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{{ userRole }}</p>
                    </div>
                  </div>
                </div>

                <div class="p-2">
                  <!-- <Button
                    variant="ghost"
                    class="w-full justify-start text-left p-3 hover:bg-gray-50 dark:hover:bg-slate-700"
                    @click="viewProfile"
                  >
                    <User class="w-4 h-4 mr-3" />
                    View Profile
                  </Button> -->
                  <Button
                    variant="ghost"
                    class="w-full justify-start text-left p-3 hover:bg-gray-50 dark:hover:bg-slate-700"
                    @click="uploadPhoto"
                  >
                    <Camera class="w-4 h-4 mr-3" />
                    Upload Photo
                  </Button>
                  <!-- <Button
                    variant="ghost"
                    class="w-full justify-start text-left p-3 hover:bg-gray-50 dark:hover:bg-slate-700"
                    @click="editSettings"
                  >
                    <Settings class="w-4 h-4 mr-3" />
                    Settings
                  </Button> -->
                  <!-- <Button
                    variant="ghost"
                    class="w-full justify-start text-left p-3 hover:bg-gray-50 dark:hover:bg-slate-700"
                    @click="viewHelp"
                  >
                    <HelpCircle class="w-4 h-4 mr-3" />
                    Help & Support
                  </Button> -->
                  <div class="border-t border-gray-200 dark:border-slate-700 my-2"></div>
                  <Button
                    variant="ghost"
                    class="w-full justify-start text-left p-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                    @click="handleLogout"
                  >
                    <LogOut class="w-4 h-4 mr-3" />
                    Sign Out
                  </Button>
                </div>

                <!-- Hidden file input for photo upload -->
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-3">
      <!-- Ultra Compact Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div class="group relative">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <Card class="relative p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-xl hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ dashboardStats.activePartners }}</p>
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400">Active Partners</p>
              </div>
              <div class="relative">
                <div class="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Users class="w-3.5 h-3.5" />
                </div>
                <div class="absolute -inset-1 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
            </div>
          </Card>
        </div>

        <div class="group relative">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <Card class="relative p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-xl hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ dashboardStats.aiAccuracy }}%</p>
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400">AI Accuracy</p>
              </div>
              <div class="relative">
                <div class="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Brain class="w-3.5 h-3.5" />
                </div>
                <div class="absolute -inset-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
            </div>
          </Card>
        </div>

        <div class="group relative">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <Card class="relative p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-xl hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ dashboardStats.pendingReviews }}</p>
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400">Pending Reviews</p>
              </div>
              <div class="relative">
                <div class="w-8 h-8 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Clock class="w-3.5 h-3.5" />
                </div>
                <div class="absolute -inset-1 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
            </div>
          </Card>
        </div>

        <div class="group relative">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <Card class="relative p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-xl hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ dashboardStats.validatedToday }}</p>
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400">Validated Today</p>
              </div>
              <div class="relative">
                <div class="w-8 h-8 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <CheckCircle class="w-3.5 h-3.5" />
                </div>
                <div class="absolute -inset-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
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
              : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'"
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

          <Button
            @click="activeView = 'bulk'"
            :class="activeView === 'bulk'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-slate-200 hover:bg-white hover:border-slate-300'"
            class="font-semibold transition-all duration-200 rounded-xl"
          >
            <Brain class="w-3.5 h-3.5 mr-2" />
            Bulk Operations
          </Button>

          <Button
            @click="activeView = 'analytics'"
            :class="activeView === 'analytics'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-slate-200 hover:bg-white hover:border-slate-300'"
            class="font-semibold transition-all duration-200 rounded-xl"
          >
            <Clock class="w-3.5 h-3.5 mr-2" />
            Analytics
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
            <Card class="relative p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-3xl hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 h-full">
              <div class="space-y-6 h-full flex flex-col">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center shadow-lg">
                    <Plus class="w-5 h-5" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">Register New Partner</h3>
                </div>

                <div class="flex-1 flex flex-col justify-between">
                  <p class="text-gray-600 dark:text-gray-400 font-medium mb-4">Add a new business partner for AI validation</p>
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
            <Card class="relative p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-3xl hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 h-full">
              <div class="space-y-6 h-full flex flex-col">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shadow-lg">
                    <Brain class="w-5 h-5" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">AI Validation</h3>
                </div>

                <div class="flex-1">
                  <div v-if="activePartnerRequest" class="space-y-3">
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">{{ getValidationStatusText(activePartnerRequest.status) }}:</p>
                    <p class="font-bold text-gray-900 dark:text-white text-lg">{{ activePartnerRequest.companyName }}</p>
                    <div :class="getValidationStatusClass(activePartnerRequest.status)">
                      <div :class="getValidationStatusDotClass(activePartnerRequest.status)"></div>
                      {{ getValidationStatusLabel(activePartnerRequest.status) }}
                    </div>
                  </div>
                  <p v-else class="text-gray-600 dark:text-gray-400 font-medium">No active validations. Register a partner to start the AI workflow.</p>
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

        <BulkOperations v-if="activeView === 'bulk'" />

        <AnalyticsDashboard v-if="activeView === 'analytics'" />

        <HITLInterface v-if="activeView === 'review'" />

        <PartnerDirectory v-if="activeView === 'partners'" />
      </div>
    </div>

    <!-- Notification Panel -->
    <NotificationPanel :show-notifications="showNotifications" @close="showNotifications = false" />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import { LogOut, Plus, Brain, CheckCircle, Clock, Users, Building, Sun, Moon, Bell, ChevronDown, User, Settings, HelpCircle, Camera } from 'lucide-vue-next'
import PartnerRegistration from './PartnerRegistration.vue'
import AIValidationWorkflow from './AIValidationWorkflow.vue'
import HITLInterface from './HITLInterface.vue'
import PartnerDirectory from './PartnerDirectory.vue'
import BulkOperations from './BulkOperations.vue'
import AnalyticsDashboard from './AnalyticsDashboard.vue'
import NotificationPanel from './NotificationPanel.vue'
import { useToast } from '@/composables/use-toast'
import { useValidationStore } from '@/stores/validation'
import { useTheme } from '@/composables/use-theme'
import { useNotifications } from '@/composables/use-notifications'

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
    Sun,
    Moon,
    Bell,
    ChevronDown,
    User,
    Settings,
    HelpCircle,
    Camera,
    PartnerRegistration,
    AIValidationWorkflow,
    HITLInterface,
    PartnerDirectory,
    BulkOperations,
    AnalyticsDashboard,
    NotificationPanel
  },
  setup() {
    const router = useRouter()
    const { toast } = useToast()
    const validationStore = useValidationStore()
    const { isDark, toggleTheme } = useTheme()
    const { notifications, unreadCount, markAllAsRead } = useNotifications()
    const showNotifications = ref(false)

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value
      if (showNotifications.value) {
        markAllAsRead()
      }
    }
    const activeView = ref('overview')
    const activePartnerRequest = ref(null)
    const userEmail = ref('')
    const animationCompleted = ref(false)
    const showUserMenu = ref(false)
    const userRole = ref('Validation Specialist')
    const userProfilePicture = ref('')
    const fileInput = ref(null)

    onMounted(() => {
      // Get user email from localStorage
      userEmail.value = localStorage.getItem('userEmail') || ''

      // Get profile picture from localStorage or set a default
      userProfilePicture.value = localStorage.getItem('userPicture') || getDefaultProfilePicture()
    })

    onUnmounted(() => {
      console.log('Dashboard component unmounting - cleaning up validation state')
      // Clear all workflow states and active validation when dashboard unmounts
      clearWorkflowStates()
      validationStore.clearActiveValidation()
      activePartnerRequest.value = null
      animationCompleted.value = false
    })

    // Watch for changes in the validation store to keep activePartnerRequest in sync
    watch(() => validationStore.activeValidation, (newActiveValidation) => {
      // Only update if we're on the overview screen and there's a new validation
      if (newActiveValidation && activeView.value === 'overview') {
        // Always update for new validations or status changes
        if (!activePartnerRequest.value ||
            activePartnerRequest.value.id !== newActiveValidation.id ||
            activePartnerRequest.value.status !== newActiveValidation.status) {

          console.log('Updating activePartnerRequest with validation data (overview screen)')
          console.log('Old partner ID:', activePartnerRequest.value?.id)
          console.log('New partner ID:', newActiveValidation.id)
          console.log('Old status:', activePartnerRequest.value?.status)
          console.log('New status:', newActiveValidation.status)

          activePartnerRequest.value = { ...newActiveValidation }
        }
      } else if (!newActiveValidation) {
        // Clear local state when store clears active validation
        console.log('Store cleared active validation - clearing local state')
        activePartnerRequest.value = null
        animationCompleted.value = false
      }
    }, { deep: true })

    // Helper function to clear workflow states
    const clearWorkflowStates = () => {
      try {
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith('workflow_state_')) {
            localStorage.removeItem(key)
          }
        })
        console.log('Cleared all workflow states from localStorage')
      } catch (error) {
        console.warn('Failed to clear workflow states:', error)
      }
    }

    // Watch for view changes to handle state properly
    watch(() => activeView.value, (newView, oldView) => {
      console.log('View changed from', oldView, 'to', newView)

      // Clear workflow states when navigating away from overview
      if (oldView === 'overview' && newView !== 'overview') {
        console.log('Navigating away from overview - clearing workflow states and active partner')
        clearWorkflowStates()

        // Clear the active partner request to prevent persistence
        if (activePartnerRequest.value) {
          console.log('Clearing active partner request:', activePartnerRequest.value.companyName)

          // Clear workflow completion flags for all partners to ensure fresh start
          validationStore.clearWorkflowCompletion(activePartnerRequest.value.id)

          // Clear the active validation from the store
          validationStore.clearActiveValidation()

          // Clear the local active partner request
          activePartnerRequest.value = null
          animationCompleted.value = false
        }
      }

      // When returning to overview, only restore if there's an active validation in the store
      if (newView === 'overview') {
        const storeActiveValidation = validationStore.activeValidation
        if (storeActiveValidation && !activePartnerRequest.value) {
          console.log('Restoring active validation from store:', storeActiveValidation.companyName)
          activePartnerRequest.value = { ...storeActiveValidation }
        } else if (!storeActiveValidation) {
          console.log('No active validation in store - keeping overview clean')
          activePartnerRequest.value = null
          animationCompleted.value = false
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

        // Show immediate processing started message
        toast({
          title: "AI Validation Started",
          description: `Processing ${partnerData.companyName} through AI validation workflow...`,
          variant: "default"
        })

        // Set animation completion after 10 seconds (5 agents × 2 seconds each)
        setTimeout(() => {
          animationCompleted.value = true
          console.log('Animation completed, updating dashboard card status')

          // Show validation complete message AFTER animation ends
          const needsReview = validationStore.determineIfHumanReviewNeeded(partnerData, aiResults)

          toast({
            title: needsReview ? "Validation Complete - Review Required" : "Validation Complete - Auto-Approved",
            description: needsReview
              ? `${partnerData.companyName} requires human review (${aiResults.overallConfidence}% confidence)`
              : `${partnerData.companyName} has been automatically approved (${aiResults.overallConfidence}% confidence)`,
            variant: needsReview ? "default" : "default"
          })
        }, 10000)

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

          // Show validation complete message AFTER animation ends (for mock data)
          const needsReview = validationStore.determineIfHumanReviewNeeded(partnerData, aiResults)

          toast({
            title: needsReview ? "Validation Complete - Review Required (Mock)" : "Validation Complete - Auto-Approved (Mock)",
            description: needsReview
              ? `${partnerData.companyName} requires human review (${aiResults.overallConfidence}% confidence) - Mock Data`
              : `${partnerData.companyName} has been automatically approved (${aiResults.overallConfidence}% confidence) - Mock Data`,
            variant: "default"
          })
        }, 10000)

        // Show immediate processing started message for mock data
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
      // Show "Currently processing" only during initial animation, then show final status
      if (activePartnerRequest.value && !animationCompleted.value && status === 'pending_review') {
        return 'Currently processing'
      }

      switch (status) {
        case 'approved':
          return 'Validation complete'
        case 'pending_review':
          return 'Validation complete - Awaiting human review'
        case 'rejected':
          return 'Validation complete - Rejected'
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



    const handleLogout = () => {
      // Clear authentication state for both email and Google users
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      localStorage.removeItem('userPicture')
      localStorage.removeItem('authProvider')

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })

      // Redirect to login
      router.push('/login')
    }

    // User Profile Methods
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const getUserInitials = () => {
      const email = userEmail.value
      if (email) {
        const name = email.split('@')[0]
        return name.length >= 2 ? name.substring(0, 2).toUpperCase() : name.toUpperCase()
      }
      return 'U'
    }

    const getUserDisplayName = () => {
      const email = userEmail.value
      if (email) {
        const name = email.split('@')[0]
        // Convert camelCase or snake_case to proper name
        return name.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase())
      }
      return 'User'
    }

    const viewProfile = () => {
      showUserMenu.value = false
      toast({
        title: "Profile",
        description: "Profile management coming soon!",
        variant: "default"
      })
    }

    const editSettings = () => {
      showUserMenu.value = false
      toast({
        title: "Settings",
        description: "Settings panel coming soon!",
        variant: "default"
      })
    }

    const viewHelp = () => {
      showUserMenu.value = false
      toast({
        title: "Help & Support",
        description: "Help documentation coming soon!",
        variant: "default"
      })
    }

    // Profile Picture Methods
    const getDefaultProfilePicture = () => {
      // Use a local default profile picture
      return '/default-profile.svg'
    }

    const handleImageError = () => {
      // Fallback to default profile picture if custom image fails to load
      console.log('Profile image failed to load, falling back to default')
      userProfilePicture.value = getDefaultProfilePicture()
    }

    const updateProfilePicture = (newPictureUrl) => {
      userProfilePicture.value = newPictureUrl
      localStorage.setItem('userPicture', newPictureUrl)
    }

    const uploadPhoto = () => {
      showUserMenu.value = false
      fileInput.value?.click()
    }

    const handleFileUpload = (event) => {
      const file = event.target.files?.[0]
      if (file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: "Please select an image smaller than 5MB.",
            variant: "destructive"
          })
          return
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File Type",
            description: "Please select a valid image file.",
            variant: "destructive"
          })
          return
        }

        // Create a FileReader to convert to base64
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64String = e.target?.result
          if (base64String) {
            updateProfilePicture(base64String)
            toast({
              title: "Profile Picture Updated",
              description: "Your profile picture has been updated successfully!",
              variant: "default"
            })
          }
        }
        reader.readAsDataURL(file)
      }
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
      getValidationStatusDotClass,
      // Theme
      isDark,
      toggleTheme,
      // Notifications
      notifications,
      unreadCount,
      showNotifications,
      toggleNotifications,
      // User Profile
      showUserMenu,
      userRole,
      userProfilePicture,
      fileInput,
      toggleUserMenu,
      getUserInitials,
      getUserDisplayName,
      viewProfile,
      editSettings,
      viewHelp,
      getDefaultProfilePicture,
      handleImageError,
      updateProfilePicture,
      uploadPhoto,
      handleFileUpload
    }
  }
}
</script>
