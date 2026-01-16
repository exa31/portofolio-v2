<script setup lang="ts">

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

const selectedProject = ref<any>(null)
const isModalOpen = ref(false)

const openProjectModal = (project: any) => {
  selectedProject.value = project
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedProject.value = null
}

const copyToClipboard = (text: string | undefined) => {
  if (text) {
    navigator.clipboard.writeText(text)
  }
}
</script>

<template>
  <section id="project" class="py-20">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-6">
        <div>
          <h2 class="text-5xl lg:text-6xl font-black mb-3 leading-tight">
            Featured
            <span class="text-primary">Projects</span>
          </h2>
          <p class="text-lg text-white/50 leading-relaxed">
            A collection of applications demonstrating my technical abilities and problem-solving skills.
          </p>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div
            v-for="project in projects"
            :key="project.id"
            @click="openProjectModal(project)"
            class="group relative overflow-hidden rounded-2xl bg-[#1a2332] border border-white/5 cursor-pointer transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
        >
          <!-- Image -->
          <div class="relative h-56 bg-linear-to-b from-white/5 to-transparent overflow-hidden">
            <NuxtImg
                :src="project.image"
                :alt="project.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Title and link -->
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-xl font-bold text-white group-hover:text-primary transition-colors">
                {{ project.title }}
              </h3>
              <Icon name="tabler:external-link" size="20"
                    class="text-white/50 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"/>
            </div>

            <!-- Description -->
            <p class="text-sm text-white/60 mb-4 line-clamp-2">{{ project.shortDesc }}</p>

            <!-- Tech badges -->
            <div class="flex flex-wrap gap-2">
              <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="inline-block px-2 py-1 text-xs font-medium text-white/60 bg-white/5 border border-white/10 rounded-md group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-all"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Project Modal -->
  <UModal v-model:open="isModalOpen"
          :ui="{content:'w-full max-w-5xl',header:'px-6 sm:px-12 py-4 sm:py-8',body:'p-0',footer:'p-0'}">
    <template #title>
      <h2 class="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2 wrap-break-word">{{
          selectedProject?.title
        }}</h2>
    </template>
    <template #description>
      <p class="text-xs sm:text-sm text-white/50">Featured Project</p>
    </template>

    <template #body>
      <!-- Content Area -->
      <div class="overflow-y-auto flex-1">
        <div class="mx-auto px-4 sm:px-8 py-8 sm:py-16">
          <!-- Project Details -->
          <div class="space-y-12 sm:space-y-20">
            <!-- Image with Decorative Elements -->
            <div class="relative group">
              <div
                  class="absolute -inset-2 bg-linear-to-r from-primary/30 via-primary/10 to-primary/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div
                  class="relative h-64 sm:h-96 md:h-112.5 bg-linear-to-br from-[#1a2a3a] via-[#0f1a28] to-[#050f18] rounded-3xl overflow-hidden shadow-2xl border border-white/15">
                <NuxtImg
                    :src="selectedProject?.image"
                    :alt="selectedProject?.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
                <div
                    class="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            </div>

            <!-- Quick Info Bar -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div
                  class="group bg-linear-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-4 sm:p-6 hover:border-primary/50 hover:from-primary/20 hover:to-primary/10 transition-all duration-300">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-xs text-white/60 uppercase font-bold tracking-widest">Technologies</p>
                  <Icon name="tabler:code" size="18"
                        class="sm:w-5 sm:h-5 text-primary/60 group-hover:text-primary transition-colors"/>
                </div>
                <p class="text-2xl sm:text-3xl text-primary font-black">{{ selectedProject?.technologies.length }}</p>
                <p class="text-xs text-white/40 mt-2">Tools & Technologies</p>
              </div>
              <div
                  class="group bg-linear-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-4 sm:p-6 hover:border-primary/50 hover:from-primary/20 hover:to-primary/10 transition-all duration-300">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-xs text-white/60 uppercase font-bold tracking-widest">Features</p>
                  <Icon name="tabler:sparkles" size="18"
                        class="sm:w-5 sm:h-5 text-primary/60 group-hover:text-primary transition-colors"/>
                </div>
                <p class="text-2xl sm:text-3xl text-primary font-black">{{ selectedProject?.features.length }}</p>
                <p class="text-xs text-white/40 mt-2">Key Features</p>
              </div>
              <div
                  class="group bg-linear-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-4 sm:p-6 hover:border-green-500/50 hover:from-green-500/20 hover:to-green-500/10 transition-all duration-300">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-xs text-white/60 uppercase font-bold tracking-widest">Status</p>
                  <Icon name="tabler:circle-check-filled" size="18" class="sm:w-5 sm:h-5"
                        :class="selectedProject?.liveUrl ? 'text-green-400' : 'text-yellow-400'"/>
                </div>
                <p class="text-2xl sm:text-3xl font-black"
                   :class="selectedProject?.liveUrl ? 'text-green-400' : 'text-yellow-400'">
                  {{ selectedProject?.liveUrl ? 'Published' : 'Draft' }}</p>
                <p class="text-xs text-white/40 mt-2">{{
                    selectedProject?.liveUrl ? 'Online & Running' : 'In Portfolio'
                  }}</p>
              </div>
            </div>

            <!-- Tech Stack -->
            <div>
              <div class="flex items-center gap-3 mb-4 sm:mb-6">
                <div class="w-2 h-8 bg-linear-to-b from-primary to-primary/50 rounded-full"></div>
                <h3 class="text-xl sm:text-2xl font-black text-white">Technology Stack</h3>
              </div>
              <div
                  class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-4 sm:p-6 md:p-8 bg-linear-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl">
                <span
                    v-for="tech in selectedProject?.technologies"
                    :key="tech"
                    class="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-bold text-primary bg-primary/15 border border-primary/40 rounded-lg hover:bg-primary/30 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-center cursor-default group hover:scale-105 truncate"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- Overview -->
            <div>
              <div class="flex items-center gap-3 mb-4 sm:mb-6">
                <div class="w-2 h-8 bg-linear-to-b from-primary to-primary/50 rounded-full"></div>
                <h3 class="text-xl sm:text-2xl font-black text-white">Project Overview</h3>
              </div>
              <div class="bg-linear-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-4 sm:p-10">
                <p class="text-white/85 leading-relaxed text-sm sm:text-lg">{{ selectedProject?.details }}</p>
              </div>
            </div>

            <!-- Key Features -->
            <div>
              <div class="flex items-center gap-3 mb-4 sm:mb-6">
                <div class="w-2 h-8 bg-linear-to-b from-primary to-primary/50 rounded-full"></div>
                <h3 class="text-xl sm:text-2xl font-black text-white">Key Features</h3>
              </div>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                <li
                    v-for="feature in selectedProject?.features"
                    :key="feature"
                    class="flex items-start gap-3 sm:gap-4 p-3 sm:p-6 rounded-xl bg-linear-to-r from-white/10 via-white/5 to-transparent border border-white/15 hover:border-primary/50 hover:from-primary/20 hover:via-primary/10 transition-all duration-300 group cursor-default"
                >
                  <Icon name="tdesign:check-circle-filled" size="20"
                        class="sm:w-6 sm:h-6 text-primary shrink-0  group-hover:scale-125 transition-transform"/>
                  <span class="text-white/85 group-hover:text-white transition-colors text-sm sm:text-base">{{
                      feature
                    }}</span>
                </li>
              </ul>
            </div>

            <!-- Live Preview Section -->
            <div v-if="selectedProject?.liveUrl" class="border-t border-white/10 pt-12 sm:pt-20">
              <div class="flex items-center gap-3 mb-4 sm:mb-6">
                <div class="w-2 h-8 bg-linear-to-b from-blue-500 to-blue-500/50 rounded-full"></div>
                <h3 class="text-xl sm:text-2xl font-black text-white">Live Preview</h3>
              </div>
              <div class="space-y-4 sm:space-y-6">
                <!-- Preview Info -->
                <div
                    class="bg-linear-to-r from-blue-500/20 via-blue-500/10 to-blue-500/5 border border-blue-500/40 rounded-2xl p-4 sm:p-7 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 hover:border-blue-500/70 hover:from-blue-500/30 transition-all duration-300">
                  <Icon name="tabler:info-circle-filled" size="20" class="sm:w-6 sm:h-6 text-blue-300 shrink-0 mt-1"/>
                  <p class="text-xs sm:text-base text-blue-200 font-medium leading-relaxed">
                    Klik tombol di bawah untuk membuka aplikasi live di tab baru. Aplikasi ini siap untuk digunakan dan
                    menunjukkan hasil kerja terbaik saya.
                  </p>
                </div>

                <!-- URL Display with Copy -->
                <div
                    class="bg-linear-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-3 sm:p-7 hover:border-white/30 transition-all duration-300 group">
                  <div class="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                    <Icon name="tabler:link-check" size="20"
                          class="sm:w-7 sm:h-7 text-primary shrink-0 group-hover:scale-110 transition-transform"/>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-white/50 uppercase mb-2 font-bold tracking-widest">Live URL</p>
                      <p class="text-xs sm:text-sm text-white/70 break-all font-mono bg-black/40 rounded-lg px-3 py-2">
                        {{ selectedProject?.liveUrl }}</p>
                    </div>
                    <UButton
                        color="neutral"
                        variant="ghost"
                        icon="i-heroicons-clipboard-document"
                        size="lg"
                        class="text-white/50 hover:text-white hover:bg-white/10 shrink-0 transition-all w-full sm:w-auto"
                        @click="copyToClipboard(selectedProject?.liveUrl)"
                    />
                  </div>
                </div>

                <!-- Open Button -->
                <UButton
                    :to="selectedProject?.liveUrl"
                    target="_blank"
                    external
                    block
                    color="primary"
                    size="xl"
                    class="bg-linear-to-r from-primary text-white via-blue-600 to-primary hover:shadow-2xl hover:shadow-primary/30 w-full font-bold py-3 sm:py-4 text-sm sm:text-base"
                >
                  <template #leading>
                    <Icon name="tabler:external-link" size="18" class="sm:w-6 sm:h-6"/>
                  </template>
                  Buka Aplikasi Live
                </UButton>
              </div>
            </div>

            <!-- No Preview Available -->
            <div v-else class="border-t border-white/10 pt-12 sm:pt-20 text-center">
              <Icon name="tabler:world-off" size="48" class="sm:w-16 sm:h-16 text-white/20 mx-auto mb-4 sm:mb-6"/>
              <p class="text-white/60 font-semibold text-base sm:text-lg">Live preview belum tersedia untuk project
                ini</p>
              <p class="text-white/40 text-xs sm:text-sm mt-2">Namun Anda masih dapat melihat kode di GitHub</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="px-4 sm:px-8 py-4 sm:py-6 flex w-full justify-end gap-2 sm:gap-3">
        <UButton
            :to="selectedProject?.link"
            target="_blank"
            external
            v-if="selectedProject?.link"
            color="primary"
            size="lg"
            class="bg-primary text-white hover:brightness-110 font-bold rounded-lg text-sm sm:text-base"
        >
          <template #leading>
            <Icon name="tabler:brand-github" size="18" class="sm:w-5 sm:h-5"/>
          </template>
          View on GitHub
        </UButton>
        <UButton
            color="neutral"
            variant="outline"
            size="lg"
            @click="closeModal"
            class="shrink-0 hover:bg-white/10 cursor-pointer font-semibold rounded-lg px-4 sm:px-6 text-sm sm:text-base"
        >
          Close
        </UButton>
      </div>
    </template>
  </UModal>
</template>

