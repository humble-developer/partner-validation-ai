<template>
  <div
    :class="cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', $attrs.class)"
  >
    <div
      class="h-full w-full flex-1 bg-primary transition-all"
      :style="{ transform: `translateX(-${100 - (value || 0)}%)` }"
    />
  </div>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'Progress',
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  setup() {
    return {
      cn
    }
  }
}
</script>
