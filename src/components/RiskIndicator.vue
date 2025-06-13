<template>
  <div class="flex items-center justify-between">
    <span class="text-sm font-medium text-gray-700">{{ label }}</span>
    <div class="flex items-center space-x-2">
      <div class="w-16 bg-gray-200 rounded-full h-2">
        <div
          :class="`h-2 rounded-full ${getRiskColor(level)}`"
          :style="{ width: `${score}%` }"
        ></div>
      </div>
      <span :class="`text-xs font-semibold px-2 py-1 rounded-full ${getRiskBadgeClass(level)}`">
        {{ level.toUpperCase() }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RiskIndicator',
  props: {
    label: {
      type: String,
      required: true
    },
    level: {
      type: String,
      validator: value => ['low', 'medium', 'high'].includes(value),
      required: true
    },
    score: {
      type: Number,
      required: true,
      validator: value => value >= 0 && value <= 100
    }
  },
  setup() {
    const getRiskColor = (level) => {
      switch (level) {
        case 'low': return 'bg-green-500'
        case 'medium': return 'bg-yellow-500'
        case 'high': return 'bg-red-500'
        default: return 'bg-gray-500'
      }
    }

    const getRiskBadgeClass = (level) => {
      switch (level) {
        case 'low': return 'bg-green-100 text-green-800'
        case 'medium': return 'bg-yellow-100 text-yellow-800'
        case 'high': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    return {
      getRiskColor,
      getRiskBadgeClass
    }
  }
}
</script>
