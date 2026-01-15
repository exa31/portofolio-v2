<script setup lang="ts">
import {ref} from 'vue'

interface Experience {
  id: number
  company: string
  position: string
  period: string
  description: string
  logo: string
  responsibilities: string[]
  technologies: string[]
  attachment: string | null
}

defineProps<{
  experiences: Experience[]
}>()

const isOpen = ref(false)
const selectedExperience = ref<Experience | null>(null)

const openModal = (experience: Experience) => {
  selectedExperience.value = experience
  isOpen.value = true
}
</script>

<template>
  <section id="work" class="py-24 bg-linear-to-b from-[#071026] to-[#071023]">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-16">
        <p class="text-primary text-sm font-semibold mb-2 flex items-center justify-center gap-2">
          <Icon name="material-symbols:timeline" size="16"/>
          MY JOURNEY BEGINS HERE
        </p>
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Professional Journey</h2>
        <p class="text-white/60 max-w-2xl mx-auto">
          A timeline of building scalable solutions, solving complex problems, and continuous professional growth in the
          tech industry.
        </p>
      </div>

      <!-- Timeline -->
      <div class="max-w-4xl mx-auto px-0 sm:px-4">
        <div class="relative">
          <!-- Timeline line -->
          <div
              class="absolute left-8 sm:left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-primary/50 to-transparent"/>

          <!-- Timeline items -->
          <div class="space-y-6 sm:space-y-8">
            <div
                v-for="(experience) in experiences"
                :key="experience.id"
                class="relative pl-20 sm:pl-24"
            >
              <!-- Timeline dot -->
              <div class="absolute left-0 w-16 h-16 flex items-center justify-center">
                <div
                    class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center backdrop-blur-sm">
                  <Icon name="carbon:star" size="18" class="sm:hidden text-primary"/>
                  <Icon name="carbon:star" size="24" class="hidden sm:block text-primary"/>
                </div>
              </div>

              <!-- Card -->
              <div
                  class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                  @click="openModal(experience)"
              >
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-4">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg sm:text-xl font-bold text-white group-hover:text-primary transition-colors">
                      {{ experience.position }}
                    </h3>
                    <p class="text-primary text-xs sm:text-sm font-medium mt-1">{{ experience.company }}</p>
                  </div>
                  <span class="text-xs sm:text-sm text-white/50 flex-shrink-0">{{ experience.period }}</span>
                </div>

                <p class="text-white/70 mb-4">{{ experience.description }}</p>

                <!-- Technologies -->
                <div class="flex flex-wrap gap-2">
                  <span
                      v-for="tech in experience.technologies.slice(0, 3)"
                      :key="tech"
                      class="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {{ tech }}
                  </span>
                  <span
                      v-if="experience.technologies.length > 3"
                      class="px-3 py-1 rounded-full text-xs font-medium text-white/50"
                  >
                    +{{ experience.technologies.length - 3 }} more
                  </span>
                </div>

                <!-- Click indicator -->
                <div
                    class="flex items-center gap-2 mt-4 text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Details</span>
                  <Icon name="carbon:arrow-right" size="16"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Experience Details Modal -->
    <UModal v-model:open="isOpen"
            :ui="{content:'w-full max-w-5xl'}">
      <template #title>
        <h2 class="text-2xl sm:text-4xl font-black text-white mb-1 sm:mb-2 wrap-break-word">
          {{ selectedExperience?.position }}</h2>
      </template>
      <template #description>
        <p class="text-xs sm:text-sm text-white/50">{{ selectedExperience?.company }}</p>
      </template>
      <!-- Body -->
      <template #body>
        <div class="overflow-y-auto flex-1">
          <div class="mx-auto px-4 sm:px-8 py-8 sm:py-16">
            <div class="space-y-12 sm:space-y-16">
              <!-- Company Info Box -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div
                    class="group bg-linear-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-4 sm:p-6 hover:border-primary/50 hover:from-primary/20 hover:to-primary/10 transition-all duration-300">
                  <div class="flex items-center justify-between mb-3">
                    <p class="text-xs text-white/60 uppercase font-bold tracking-widest">Duration</p>
                    <Icon name="carbon:calendar" size="18"
                          class="sm:w-5 sm:h-5 text-primary/60 group-hover:text-primary transition-colors"/>
                  </div>
                  <p class="text-lg sm:text-xl text-primary font-black">{{ selectedExperience?.period }}</p>
                  <p class="text-xs text-white/40 mt-2">Employment Period</p>
                </div>
                <div
                    class="group bg-linear-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-4 sm:p-6 hover:border-primary/50 hover:from-primary/20 hover:to-primary/10 transition-all duration-300">
                  <div class="flex items-center justify-between mb-3">
                    <p class="text-xs text-white/60 uppercase font-bold tracking-widest">Responsibilities</p>
                    <Icon name="carbon:task-approved" size="18"
                          class="sm:w-5 sm:h-5 text-primary/60 group-hover:text-primary transition-colors"/>
                  </div>
                  <p class="text-2xl sm:text-3xl text-primary font-black">{{
                      selectedExperience?.responsibilities.length
                    }}</p>
                  <p class="text-xs text-white/40 mt-2">Key Tasks</p>
                </div>
                <div
                    class="group bg-linear-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-4 sm:p-6 hover:border-primary/50 hover:from-primary/20 hover:to-primary/10 transition-all duration-300">
                  <div class="flex items-center justify-between mb-3">
                    <p class="text-xs text-white/60 uppercase font-bold tracking-widest">Technologies</p>
                    <Icon name="carbon:code" size="18"
                          class="sm:w-5 sm:h-5 text-primary/60 group-hover:text-primary transition-colors"/>
                  </div>
                  <p class="text-2xl sm:text-3xl text-primary font-black">{{
                      selectedExperience?.technologies.length
                    }}</p>
                  <p class="text-xs text-white/40 mt-2">Tools Used</p>
                </div>
              </div>

              <!-- Description -->
              <div>
                <div class="flex items-center gap-3 mb-4 sm:mb-6">
                  <div class="w-2 h-8 bg-linear-to-b from-primary to-primary/50 rounded-full"></div>
                  <h3 class="text-xl sm:text-2xl font-black text-white">About This Role</h3>
                </div>
                <div class="bg-linear-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-4 sm:p-10">
                  <p class="text-white/85 leading-relaxed text-sm sm:text-lg">{{ selectedExperience?.description }}</p>
                </div>
              </div>

              <!-- Key Responsibilities -->
              <div>
                <div class="flex items-center gap-3 mb-4 sm:mb-6">
                  <div class="w-2 h-8 bg-linear-to-b from-primary to-primary/50 rounded-full"></div>
                  <h3 class="text-xl sm:text-2xl font-black text-white">Key Responsibilities</h3>
                </div>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                  <li
                      v-for="(responsibility, idx) in selectedExperience?.responsibilities"
                      :key="idx"
                      class="flex items-start gap-3 sm:gap-4 p-3 sm:p-6 rounded-xl bg-linear-to-r from-white/10 via-white/5 to-transparent border border-white/15 hover:border-primary/50 hover:from-primary/20 hover:via-primary/10 transition-all duration-300 group cursor-default"
                  >
                    <Icon name="carbon:checkmark-filled" size="20"
                          class="sm:w-6 sm:h-6 text-primary shrink-0 mt-0.5 sm:mt-1 group-hover:scale-125 transition-transform"/>
                    <span class="text-white/85 group-hover:text-white transition-colors text-sm sm:text-base">{{
                        responsibility
                      }}</span>
                  </li>
                </ul>
              </div>

              <!-- Technologies -->
              <div>
                <div class="flex items-center gap-3 mb-4 sm:mb-6">
                  <div class="w-2 h-8 bg-linear-to-b from-primary to-primary/50 rounded-full"></div>
                  <h3 class="text-xl sm:text-2xl font-black text-white">Technology Stack</h3>
                </div>
                <div
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-8 bg-linear-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl">
                  <span
                      v-for="tech in selectedExperience?.technologies"
                      :key="tech"
                      class="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-primary bg-primary/15 border border-primary/40 rounded-lg hover:bg-primary/30 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-center cursor-default group hover:scale-105 truncate"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Footer -->
      <template #footer>
        <div class="px-4 sm:px-8 py-4 sm:py-6 flex w-full justify-end gap-2 sm:gap-3">
          <UButton
              v-if="selectedExperience?.attachment"
              :to="selectedExperience?.attachment"
              target="_blank"
              external
              color="primary"
              size="lg"
              class="bg-primary text-white hover:brightness-110 font-bold rounded-lg text-sm sm:text-base"
          >
            <template #leading>
              <Icon name="carbon:document-download" size="18" class="sm:w-5 sm:h-5"/>
            </template>
            Download Certificate
          </UButton>
          <UButton
              color="neutral"
              variant="outline"
              size="lg"
              @click="isOpen = false"
              class="shrink-0 hover:bg-white/10 cursor-pointer font-semibold rounded-lg px-4 sm:px-6 text-sm sm:text-base"
          >
            Close
          </UButton>
        </div>
      </template>
    </UModal>
  </section>
</template>

<style scoped>
/* Smooth animations */
.group {
  @apply transition-all duration-300;
}
</style>

