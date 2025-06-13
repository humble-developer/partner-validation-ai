<template>
  <div class="space-y-1">
    <label class="text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="text-gray-900">
      <a
        v-if="type === 'link'"
        :href="value"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {{ value }}
      </a>
      <a
        v-else-if="type === 'email'"
        :href="`mailto:${value}`"
        class="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {{ value }}
      </a>
      <a
        v-else-if="type === 'phone'"
        :href="`tel:${value}`"
        class="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {{ value }}
      </a>
      <div
        v-else-if="type === 'address'"
        class="text-gray-900"
      >
        {{ value }}
      </div>
      <span v-else class="text-gray-900">{{ value || 'N/A' }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoField',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      validator: value => ['text', 'link', 'email', 'phone', 'address'].includes(value),
      default: 'text'
    }
  }
}
</script>
