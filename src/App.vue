<template>
  <div>
    <router-view />
    <ToastContainer />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import ToastContainer from '@/components/ui/toast-container.vue'
import { useTheme } from '@/composables/use-theme'

export default {
  name: 'App',
  components: {
    ToastContainer
  },
  setup() {
    const { initializeTheme } = useTheme()

    onMounted(() => {
      initializeTheme()
    })

    return {}
  }
}
</script>
