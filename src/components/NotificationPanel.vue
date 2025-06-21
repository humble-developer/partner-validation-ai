<template>
  <div v-if="showNotifications" class="fixed top-16 right-8 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden" @click.stop>
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
      <div class="flex items-center space-x-2">
        <Button variant="ghost" size="sm" @click="markAllAsRead" v-if="unreadCount > 0">
          <CheckCircle class="w-4 h-4 mr-1" />
          Mark All Read
        </Button>
        <Button variant="ghost" size="sm" @click="$emit('close')">
          <X class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="max-h-80 overflow-y-auto">
      <div v-if="notifications.length === 0" class="p-8 text-center">
        <Bell class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400">No notifications yet</p>
      </div>
      
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="notification in recentNotifications"
          :key="notification.id"
          :class="[
            'p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer',
            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          ]"
          @click="markAsRead(notification.id)"
        >
          <div class="flex items-start space-x-3">
            <!-- Icon -->
            <div :class="getNotificationIconClass(notification.type)">
              <component :is="getNotificationIcon(notification.type)" class="w-4 h-4" />
            </div>
            
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {{ notification.title }}
                </h4>
                <div class="flex items-center space-x-2">
                  <span v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTime(notification.timestamp) }}
                  </span>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {{ notification.message }}
              </p>
              
              <!-- Action button if available -->
              <div v-if="notification.actionUrl" class="mt-2">
                <Button variant="outline" size="sm" @click.stop="handleAction(notification)">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="notifications.length > 10" class="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
      <Button variant="ghost" size="sm" class="text-blue-600 dark:text-blue-400">
        View All Notifications
      </Button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import Button from '@/components/ui/button.vue'
import { Bell, CheckCircle, X, AlertTriangle, AlertCircle, Users, Clock } from 'lucide-vue-next'
import { useNotifications } from '@/composables/use-notifications'

export default {
  name: 'NotificationPanel',
  components: {
    Button,
    Bell,
    CheckCircle,
    X,
    AlertTriangle,
    AlertCircle,
    Users,
    Clock
  },
  props: {
    showNotifications: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup() {
    const { 
      notifications, 
      unreadCount, 
      recentNotifications, 
      markAsRead, 
      markAllAsRead, 
      clearAll,
      NOTIFICATION_TYPES 
    } = useNotifications()

    const getNotificationIcon = (type) => {
      switch (type) {
        case NOTIFICATION_TYPES.PARTNER_APPROVED:
          return CheckCircle
        case NOTIFICATION_TYPES.PARTNER_REJECTED:
        case NOTIFICATION_TYPES.API_ERROR:
          return AlertCircle
        case NOTIFICATION_TYPES.REVIEW_REQUIRED:
        case NOTIFICATION_TYPES.SYSTEM_ALERT:
          return AlertTriangle
        case NOTIFICATION_TYPES.VALIDATION_COMPLETE:
          return Users
        default:
          return Bell
      }
    }

    const getNotificationIconClass = (type) => {
      const baseClass = "w-8 h-8 rounded-lg flex items-center justify-center"
      switch (type) {
        case NOTIFICATION_TYPES.PARTNER_APPROVED:
        case NOTIFICATION_TYPES.VALIDATION_COMPLETE:
          return `${baseClass} bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400`
        case NOTIFICATION_TYPES.PARTNER_REJECTED:
        case NOTIFICATION_TYPES.API_ERROR:
          return `${baseClass} bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400`
        case NOTIFICATION_TYPES.REVIEW_REQUIRED:
        case NOTIFICATION_TYPES.SYSTEM_ALERT:
          return `${baseClass} bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400`
        default:
          return `${baseClass} bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400`
      }
    }

    const formatTime = (timestamp) => {
      const now = new Date()
      const time = new Date(timestamp)
      const diffInMinutes = Math.floor((now - time) / (1000 * 60))
      
      if (diffInMinutes < 1) return 'Just now'
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`
      
      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `${diffInHours}h ago`
      
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `${diffInDays}d ago`
      
      return time.toLocaleDateString()
    }

    const handleAction = (notification) => {
      if (notification.actionUrl) {
        // Handle navigation or action
        console.log('Navigate to:', notification.actionUrl)
      }
    }

    return {
      notifications,
      unreadCount,
      recentNotifications,
      markAsRead,
      markAllAsRead,
      clearAll,
      getNotificationIcon,
      getNotificationIconClass,
      formatTime,
      handleAction
    }
  }
}
</script>
