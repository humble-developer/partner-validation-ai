<template>
  <div :class="badgeClass">
    <slot />
  </div>
</template>

<script>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground hover:bg-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export default {
  name: 'Badge',
  props: {
    variant: {
      type: String,
      default: 'default'
    },

  },
  inheritAttrs: false,
  setup(props, { attrs }) {
    const badgeClass = computed(() => {
      return cn(badgeVariants({ variant: props.variant }), attrs.class)
    })

    return {
      badgeClass
    }
  }
}
</script>
