import { ref, reactive } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const toast = ({ title, description, variant = 'default' }) => {
    const id = ++toastId
    const newToast = {
      id,
      title,
      description,
      variant
    }
    
    toasts.value.push(newToast)
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index > -1) {
        toasts.value.splice(index, 1)
      }
    }, 5000)
    
    return newToast
  }
  
  const dismiss = (toastId) => {
    const index = toasts.value.findIndex(t => t.id === toastId)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  return {
    toast,
    dismiss,
    toasts
  }
}
