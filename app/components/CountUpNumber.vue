<template>
  <span :id="`countup-${id}`">0</span>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import {CountUp} from 'countup.js'

interface Props {
  endVal: number | null | undefined
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2,
})

// Generate unique ID untuk setiap instance
const id = Math.random().toString(36).substr(2, 9)

onMounted(async () => {
  // Tunggu sedikit untuk memastikan DOM sudah siap
  await new Promise(resolve => setTimeout(resolve, 50))

  const element = document.getElementById(`countup-${id}`)
  if (!element) {
    console.error('[CountUp] Element not found:', id)
    return
  }

  const finalValue = props.endVal || 0

  try {
    const countUp = new CountUp(element, finalValue, {
      duration: props.duration,
      useEasing: true,
      separator: ',',
    })

    if (!countUp.error) {
      countUp.start()
      console.log('[CountUp] Started:', finalValue)
    } else {
      console.error('[CountUp Error]', countUp.error)
      element.textContent = finalValue.toString()
    }
  } catch (error) {
    console.error('[CountUp Exception]', error)
    element.textContent = finalValue.toString()
  }
})
</script>
