<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'max-w-sm p-4 rounded-lg shadow-lg border transition-all duration-300 transform',
        toast.variant === 'destructive' 
          ? 'bg-red-50 border-red-200 text-red-800' 
          : 'bg-white border-gray-200 text-gray-900'
      ]"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h4 v-if="toast.title" class="font-medium mb-1">{{ toast.title }}</h4>
          <p v-if="toast.description" class="text-sm opacity-90">{{ toast.description }}</p>
        </div>
        <button
          @click="dismiss(toast.id)"
          class="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { X } from 'lucide-vue-next'
import { useToast } from '@/composables/use-toast'

export default {
  name: 'ToastContainer',
  components: {
    X
  },
  setup() {
    const { toasts, dismiss } = useToast()
    
    return {
      toasts,
      dismiss
    }
  }
}
</script>
