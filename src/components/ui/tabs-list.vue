<template>
  <div
    :class="cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      $attrs.class
    )"
  >
    <slot />
  </div>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'TabsList',
  inheritAttrs: false,
  setup() {
    return {
      cn
    }
  }
}
</script>
