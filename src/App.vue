<template>
  <div>
    <router-view />
    <ToastContainer />
  </div>
</template>

<script>
import ToastContainer from '@/components/ui/toast-container.vue'

export default {
  name: 'App',
  components: {
    ToastContainer
  }
}
</script>
