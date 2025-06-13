<template>
  <Card class="p-6 hover:shadow-lg transition-all duration-300">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ value }}</p>
        <div class="flex items-center mt-2">
          <span
            :class="[
              'text-sm font-medium',
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            ]"
          >
            {{ change }}
          </span>
          <span class="text-sm text-gray-500 ml-1">vs last period</span>
        </div>
      </div>
      <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClass(color)}`">
        <component :is="icon" class="w-6 h-6" />
      </div>
    </div>
  </Card>
</template>

<script>
import Card from '@/components/ui/card.vue'

export default {
  name: 'MetricCard',
  components: {
    Card
  },
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    change: {
      type: String,
      required: true
    },
    trend: {
      type: String,
      validator: value => ['up', 'down', 'neutral'].includes(value),
      default: 'neutral'
    },
    icon: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      validator: value => ['blue', 'green', 'purple', 'orange', 'red'].includes(value),
      default: 'blue'
    }
  },
  setup(props) {
    const getColorClass = (color) => {
      const colorMap = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
        red: 'bg-red-100 text-red-600'
      }
      return colorMap[color] || colorMap.blue
    }

    return {
      getColorClass
    }
  }
}
</script>
