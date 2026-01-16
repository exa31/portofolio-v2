<script setup lang="ts">
import type {Skill} from '~/types/skill'

defineProps<{
  skills: Skill[]
}>()
</script>

<template>
  <section id="stack" class="py-20">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-16" data-aos="fade-up">
        <h2 class="text-5xl lg:text-6xl font-black mb-3 leading-tight">Skills & Tech Stack</h2>
        <p class="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          A comprehensive overview of my technical ecosystem. From frontend architecture to backend scalability,
          explore the tools I use to build modern web solutions
        </p>
      </div>

      <!-- Tech Stack Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <!-- Dynamic Skills from API -->
        <!--        class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 cursor-pointer min-h-45">-->
        <div
            v-for="(skill, index) in skills"
            :key="skill.id"
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-(--skill-color)/30 hover:bg-(--skill-color)/5 transition-all duration-300 cursor-pointer min-h-45"
            :style="{
             '--skill-color': skill.color || '#64748b'
            }"
            data-aos="zoom-in"
            :data-aos-delay="index * 50"
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
        </div>
      </div>
    </div>
  </section>
</template>
