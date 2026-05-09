<script setup lang="ts">
import type { Skill } from '~/types/skill'

defineProps<{
  skills: Skill[]
}>()
</script>

<template>
  <section id="stack" class="py-20" aria-labelledby="skills-heading">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <Motion
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="text-center mb-16"
      >
        <h2 id="skills-heading" class="text-5xl lg:text-6xl font-black mb-3 leading-tight">Skills & Tech Stack</h2>
        <p class="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          A comprehensive overview of my technical ecosystem. From frontend architecture to backend scalability,
          explore the tools I use to build modern web solutions
        </p>
      </Motion>

      <!-- Tech Stack Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 skills-grid">
        <!-- Dynamic Skills from API -->
        <Motion
            v-for="(skill, index) in skills"
            :key="skill.id"
            :initial="{ opacity: 0, y: 20 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :viewport="{ once: true, amount: 0.1 }"
            :transition="{ 
              duration: 0.5, 
              delay: (index % 6) * 0.1, 
              ease: [0.34, 1.56, 0.64, 1] 
            }"
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-(--skill-color)/30 hover:bg-(--skill-color)/5 transition-all duration-300 cursor-pointer min-h-45 skill-card"
            :style="{
             '--skill-color': skill.color || '#64748b'
            }"
        >
          <div
              class="w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              :style="{ backgroundColor: `${skill.color || '#64748b'}10` }"
          >
            <Icon
                :name="skill.icon || 'mdi:code'"
                size="40"
                :style="{ color: skill.color || '#64748b' }"
            />
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">{{ skill.name }}</span>
        </Motion>
      </div>
    </div>
  </section>
</template>
