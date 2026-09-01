<script setup lang="ts">
import { ref } from 'vue'

interface Project {
  id?: number;
  title: string;
  shortDesc: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
  liveUrl?: string;
  details: string;
  features: string[];
}

defineProps<{
  projects: Project[]
}>()

const selectedProject = ref<Project | null>(null)
const isModalOpen = ref(false)
const copied = ref(false)

const openProjectModal = (project: Project) => {
  selectedProject.value = project
  isModalOpen.value = true
  copied.value = false
}

const closeModal = () => {
  isModalOpen.value = false
  selectedProject.value = null
}

const copyToClipboard = (text?: string) => {
  if (text) {
    navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<template>
  <section id="project" class="py-24 relative overflow-hidden" aria-labelledby="projects-heading">
    <!-- Ambient glow -->
    <div class="absolute top-1/2 right-10 w-[600px] h-[600px] bg-indigo-600/5 blur-[160px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 sm:px-6">
      
      <!-- Section Header -->
      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, amount: 0.2 }"
        :transition="{ duration: 0.7, ease: 'easeOut' }"
        class="text-center max-w-3xl mx-auto mb-16"
      >
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
          <Icon name="carbon:application-web" size="14" />
          <span>PORTFOLIO SHOWCASE</span>
        </div>
        <h2 id="projects-heading" class="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight mb-4">
          Featured <span class="text-gradient-primary">Engineering Projects</span>
        </h2>
        <p class="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
          A showcase of full-stack web applications, scalable backend microservices, and mobile products engineered for real-world reliability.
        </p>
      </Motion>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <Motion
          v-for="(project, index) in projects"
          :key="project.id ?? index"
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.1 }"
          :transition="{
            duration: 0.6,
            delay: (index % 3) * 0.12,
            ease: 'easeOut'
          }"
          @click="openProjectModal(project)"
          class="group rounded-3xl bg-[#090e1a]/80 border border-white/10 overflow-hidden cursor-pointer backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between"
        >
          <!-- Project Banner Image -->
          <div class="relative h-56 w-full overflow-hidden bg-slate-900">
            <NuxtImg
              :src="project.image || '/images/project-preview.webp'"
              :alt="project.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-[#090e1a]/30 to-transparent"></div>

            <!-- Top Live / Status Badge -->
            <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span
                v-if="project.liveUrl"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono backdrop-blur-md"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live App</span>
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 text-xs font-mono backdrop-blur-md"
              >
                <span>Case Study</span>
              </span>

              <!-- Hover explore icon -->
              <div class="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                <Icon name="carbon:arrow-up-right" size="16" />
              </div>
            </div>
          </div>

          <!-- Project Details Container -->
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-heading font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                {{ project.title }}
              </h3>

              <p class="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2 font-light">
                {{ project.shortDesc || project.description }}
              </p>
            </div>

            <!-- Technology Chips -->
            <div class="pt-4 border-t border-white/[0.06] flex flex-wrap gap-1.5">
              <span
                v-for="tech in project.technologies.slice(0, 4)"
                :key="tech"
                class="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-white/[0.03] text-slate-300 border border-white/[0.08] group-hover:border-blue-500/20 group-hover:bg-blue-500/5 transition-colors"
              >
                {{ tech }}
              </span>
              <span
                v-if="project.technologies.length > 4"
                class="px-2 py-1 rounded-md text-[11px] font-mono text-slate-500 bg-white/[0.02]"
              >
                +{{ project.technologies.length - 4 }}
              </span>
            </div>
          </div>
        </Motion>
      </div>

    </div>

    <!-- Project Details Modal -->
    <UModal
      v-model:open="isModalOpen"
      :ui="{
        content: 'w-full max-w-4xl bg-[#090e1a] border border-white/15 shadow-2xl rounded-3xl overflow-hidden',
        header: 'p-6 sm:p-8 bg-[#0c1424] border-b border-white/10',
        body: 'p-6 sm:p-8 max-h-[70vh] overflow-y-auto',
        footer: 'p-4 sm:p-6 bg-[#0c1424] border-t border-white/10'
      }"
    >
      <template #title>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-mono text-blue-400 uppercase tracking-wider">PROJECT DEEP DIVE</span>
          <h2 class="text-2xl sm:text-3xl font-heading font-black text-white">
            {{ selectedProject?.title }}
          </h2>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- Featured Image Display -->
          <div class="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
            <NuxtImg
              :src="selectedProject?.image || '/images/project-preview.webp'"
              :alt="selectedProject?.title"
              class="w-full h-64 sm:h-80 object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-transparent to-transparent"></div>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Icon name="carbon:code" size="20" />
              </div>
              <div>
                <p class="text-[10px] font-mono uppercase text-slate-400">Stack</p>
                <p class="text-xs sm:text-sm font-semibold text-white">{{ selectedProject?.technologies.length || 0 }} Technologies</p>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Icon name="carbon:star" size="20" />
              </div>
              <div>
                <p class="text-[10px] font-mono uppercase text-slate-400">Features</p>
                <p class="text-xs sm:text-sm font-semibold text-white">{{ selectedProject?.features.length || 0 }} Key Features</p>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0"
                :class="selectedProject?.liveUrl ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'"
              >
                <Icon :name="selectedProject?.liveUrl ? 'carbon:network-4' : 'carbon:document'" size="20" />
              </div>
              <div>
                <p class="text-[10px] font-mono uppercase text-slate-400">Status</p>
                <p class="text-xs sm:text-sm font-semibold text-white">{{ selectedProject?.liveUrl ? 'Live Production' : 'Completed Project' }}</p>
              </div>
            </div>
          </div>

          <!-- Project Overview Description -->
          <div>
            <h3 class="text-sm font-mono uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-2">
              <Icon name="carbon:align-box-top-left" size="16" class="text-blue-400" />
              <span>Project Architecture & Overview</span>
            </h3>
            <div class="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <p class="text-slate-200 text-sm sm:text-base leading-relaxed font-light">
                {{ selectedProject?.details || selectedProject?.description }}
              </p>
            </div>
          </div>

          <!-- Key Features Checklist -->
          <div v-if="selectedProject?.features?.length">
            <h3 class="text-sm font-mono uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
              <Icon name="carbon:checkbox-checked" size="16" class="text-emerald-400" />
              <span>Key Features & Functional Highlights</span>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="(feature, idx) in selectedProject?.features"
                :key="idx"
                class="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/10"
              >
                <Icon name="carbon:checkmark-filled" size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                <span class="text-xs sm:text-sm text-slate-200 leading-relaxed">{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- Tech Stack Badges -->
          <div v-if="selectedProject?.technologies?.length">
            <h3 class="text-sm font-mono uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
              <Icon name="carbon:terminal" size="16" class="text-cyan-400" />
              <span>Built With</span>
            </h3>
            <div class="flex flex-wrap gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <span
                v-for="tech in selectedProject?.technologies"
                :key="tech"
                class="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Live Preview Link Bar -->
          <div v-if="selectedProject?.liveUrl" class="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Icon name="carbon:link" size="20" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-mono uppercase text-blue-300">Live URL</p>
                <p class="text-xs font-mono text-slate-300 truncate max-w-xs sm:max-w-md">{{ selectedProject.liveUrl }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="copyToClipboard(selectedProject?.liveUrl)"
                class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Icon :name="copied ? 'carbon:checkmark' : 'carbon:copy'" size="14" :class="copied ? 'text-emerald-400' : 'text-slate-400'" />
                <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
              </button>

              <a
                :href="selectedProject.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-shimmer-primary px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch Live</span>
                <Icon name="carbon:arrow-up-right" size="14" />
              </a>
            </div>
          </div>

        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-between w-full">
          <a
            v-if="selectedProject?.link"
            :href="selectedProject.link"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-glass-secondary px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-2"
          >
            <Icon name="line-md:github" size="18" />
            <span>View Source Code</span>
          </a>
          <span v-else></span>

          <UButton
            color="neutral"
            variant="outline"
            size="md"
            @click="closeModal"
            class="rounded-xl px-5 cursor-pointer text-slate-300 hover:text-white"
          >
            Close
          </UButton>
        </div>
      </template>
    </UModal>

  </section>
</template>
