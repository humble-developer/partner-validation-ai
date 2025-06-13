import { ref, computed } from 'vue'
import { useToast } from '@/composables/use-toast'

export function useNotifications() {
  const { toast } = useToast()
  const notifications = ref([])
  const unreadCount = ref(0)

  // Notification types
  const NOTIFICATION_TYPES = {
    VALIDATION_COMPLETE: 'validation_complete',
    REVIEW_REQUIRED: 'review_required',
    PARTNER_APPROVED: 'partner_approved',
    PARTNER_REJECTED: 'partner_rejected',
    SYSTEM_ALERT: 'system_alert',
    API_ERROR: 'api_error'
  }

  // Add notification
  const addNotification = (notification) => {
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }

    notifications.value.unshift(newNotification)
    unreadCount.value++

    // Show toast for important notifications
    if (notification.showToast !== false) {
      toast({
        title: notification.title,
        description: notification.message,
        variant: getToastVariant(notification.type)
      })
    }

    // Auto-remove after 30 seconds for non-critical notifications
    if (notification.autoRemove !== false && notification.type !== NOTIFICATION_TYPES.REVIEW_REQUIRED) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 30000)
    }

    return newNotification.id
  }

  // Remove notification
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      const notification = notifications.value[index]
      if (!notification.read) {
        unreadCount.value--
      }
      notifications.value.splice(index, 1)
    }
  }

  // Mark as read
  const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value--
    }
  }

  // Mark all as read
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      if (!notification.read) {
        notification.read = true
      }
    })
    unreadCount.value = 0
  }

  // Clear all notifications
  const clearAll = () => {
    notifications.value = []
    unreadCount.value = 0
  }

  // Get toast variant based on notification type
  const getToastVariant = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.PARTNER_APPROVED:
        return 'default'
      case NOTIFICATION_TYPES.PARTNER_REJECTED:
      case NOTIFICATION_TYPES.API_ERROR:
        return 'destructive'
      case NOTIFICATION_TYPES.REVIEW_REQUIRED:
      case NOTIFICATION_TYPES.SYSTEM_ALERT:
        return 'default'
      default:
        return 'default'
    }
  }

  // Computed properties
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read)
  )

  const recentNotifications = computed(() => 
    notifications.value.slice(0, 10)
  )

  // Predefined notification creators
  const notifyValidationComplete = (partnerName, confidence, needsReview) => {
    return addNotification({
      type: needsReview ? NOTIFICATION_TYPES.REVIEW_REQUIRED : NOTIFICATION_TYPES.VALIDATION_COMPLETE,
      title: needsReview ? 'Review Required' : 'Validation Complete',
      message: needsReview 
        ? `${partnerName} requires human review (${confidence}% confidence)`
        : `${partnerName} validation completed successfully (${confidence}% confidence)`,
      icon: needsReview ? 'AlertTriangle' : 'CheckCircle',
      priority: needsReview ? 'high' : 'medium',
      actionUrl: needsReview ? '/review' : '/partners'
    })
  }

  const notifyPartnerApproved = (partnerName) => {
    return addNotification({
      type: NOTIFICATION_TYPES.PARTNER_APPROVED,
      title: 'Partner Approved',
      message: `${partnerName} has been approved and added to your partner network`,
      icon: 'CheckCircle',
      priority: 'medium',
      actionUrl: '/partners'
    })
  }

  const notifyPartnerRejected = (partnerName, reason) => {
    return addNotification({
      type: NOTIFICATION_TYPES.PARTNER_REJECTED,
      title: 'Partner Rejected',
      message: `${partnerName} has been rejected. Reason: ${reason}`,
      icon: 'XCircle',
      priority: 'medium',
      actionUrl: '/partners'
    })
  }

  const notifySystemAlert = (message, priority = 'medium') => {
    return addNotification({
      type: NOTIFICATION_TYPES.SYSTEM_ALERT,
      title: 'System Alert',
      message,
      icon: 'AlertTriangle',
      priority,
      autoRemove: false
    })
  }

  const notifyApiError = (operation, error) => {
    return addNotification({
      type: NOTIFICATION_TYPES.API_ERROR,
      title: 'API Error',
      message: `Failed to ${operation}: ${error}`,
      icon: 'AlertCircle',
      priority: 'high',
      autoRemove: false
    })
  }

  // Initialize with browser notifications permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return Notification.permission === 'granted'
  }

  // Send browser notification
  const sendBrowserNotification = (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/favicon-purple.svg',
        badge: '/favicon-purple.svg',
        ...options
      })
    }
  }

  return {
    // State
    notifications,
    unreadCount,
    unreadNotifications,
    recentNotifications,

    // Actions
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,

    // Notification creators
    notifyValidationComplete,
    notifyPartnerApproved,
    notifyPartnerRejected,
    notifySystemAlert,
    notifyApiError,

    // Browser notifications
    requestNotificationPermission,
    sendBrowserNotification,

    // Constants
    NOTIFICATION_TYPES
  }
}
