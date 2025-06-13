<template>
  <button
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      activeTab === value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
      $attrs.class
    )"
    @click="activeTab = value"
  >
    <slot />
  </button>
</template>

<script>
import { inject } from 'vue'
import { cn } from '@/lib/utils'

export default {
  name: 'TabsTrigger',
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
