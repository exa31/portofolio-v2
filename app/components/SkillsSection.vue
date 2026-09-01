<script setup lang="ts">
import type { Skill } from '~/types/skill'
import { computed, ref } from 'vue'

const props = defineProps<{
  skills: Skill[]
}>()

const searchQuery = ref('')

const filteredSkills = computed(() => {
  if (!searchQuery.value.trim()) return props.skills
  const q = searchQuery.value.toLowerCase()
  return props.skills.filter(s => s.name.toLowerCase().includes(q))
})
</script>

<template>
  <section id="stack" class="py-24 relative overflow-hidden" aria-labelledby="skills-heading">
    <!-- Ambient light orb -->
    <div class="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[140px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 sm:px-6">
      
      <!-- Section Header -->
      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, amount: 0.2 }"
        :transition="{ duration: 0.7, ease: 'easeOut' }"
        class="text-center max-w-3xl mx-auto mb-14"
      >
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
          <Icon name="carbon:code" size="14" />
          <span>TECH ECOSYSTEM</span>
        </div>
        <h2 id="skills-heading" class="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight mb-4">
          Skills & <span class="text-gradient-cyan">Technologies</span>
        </h2>
        <p class="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
          The comprehensive stack of languages, frameworks, cloud tooling, and databases I leverage to engineer high-impact solutions.
        </p>
      </Motion>

      <!-- Search / Filter bar if more than 8 skills -->
      <div v-if="skills.length > 8" class="max-w-md mx-auto mb-10">
        <div class="relative">
          <Icon name="carbon:search" size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search technologies (e.g. Vue, Go, Docker)..."
            class="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Skills Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Motion
          v-for="(skill, index) in filteredSkills"
          :key="skill.id"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.05 }"
          :transition="{
            duration: 0.4,
            delay: (index % 6) * 0.06,
            ease: 'easeOut'
          }"
          class="group relative rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer overflow-hidden border"
          :style="{
            '--skill-color': skill.color || '#3b82f6',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.08)'
          }"
        >
          <!-- Hover Ambient Glow -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            :style="{
              background: `radial-gradient(circle at center, ${skill.color || '#3b82f6'}15 0%, transparent 70%)`
            }"
          ></div>

          <!-- Top Highlight line on hover -->
          <div 
            class="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            :style="{ backgroundColor: skill.color || '#3b82f6' }"
          ></div>

          <!-- Skill Icon Container with Halo -->
          <div
            class="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 shadow-sm"
            :style="{
              backgroundColor: `${skill.color || '#3b82f6'}12`,
              border: `1px solid ${skill.color || '#3b82f6'}25`
            }"
          >
            <Icon
              :name="skill.icon || 'carbon:code'"
              size="32"
              :style="{ color: skill.color || '#3b82f6' }"
            />
          </div>

          <!-- Skill Name -->
          <span class="text-xs sm:text-sm font-semibold text-slate-300 group-hover:text-white transition-colors text-center truncate max-w-full">
            {{ skill.name }}
          </span>
        </Motion>
      </div>

      <!-- Empty State if no search matches -->
      <div v-if="filteredSkills.length === 0" class="text-center py-12 text-slate-500">
        <Icon name="carbon:search-locate" size="32" class="mx-auto mb-2 text-slate-600" />
        <p class="text-sm">No technologies found matching "{{ searchQuery }}"</p>
      </div>

    </div>
  </section>
</template>
