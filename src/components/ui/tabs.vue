<template>
  <div :class="cn('w-full', $attrs.class)">
    <slot />
  </div>
</template>

<script>
import { provide, ref } from 'vue'
import { cn } from '@/lib/utils'

export default {
  name: 'Tabs',
  inheritAttrs: false,
  props: {
    defaultValue: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const activeTab = ref(props.defaultValue)
    
    provide('activeTab', activeTab)
    
    return {
      cn,
      activeTab
    }
  }
}
</script>
