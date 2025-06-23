import { ref, watch } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  // Initialize theme from localStorage or default to light mode
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // Default to light mode instead of system preference
      isDark.value = false
    }
    applyTheme()
  }

  // Apply theme to document
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  // Watch for changes
  watch(isDark, applyTheme)

  // Initialize on first load
  if (typeof window !== 'undefined') {
    initializeTheme()
  }

  return {
    isDark,
    toggleTheme,
    initializeTheme
  }
}
