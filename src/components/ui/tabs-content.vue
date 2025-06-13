<template>
  <div
    v-if="activeTab === value"
    :class="cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      $attrs.class
    )"
  >
    <slot />
  </div>
</template>

<script>
import { inject } from 'vue'
import { cn } from '@/lib/utils'

export default {
  name: 'TabsContent',
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      required: true
    }
  },
  setup() {
    const activeTab = inject('activeTab')
    
    return {
      cn,
      activeTab
    }
  }
}
</script>
