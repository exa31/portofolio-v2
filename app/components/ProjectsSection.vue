<script setup lang="ts">
defineProps<{
  projects: any[]
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
  <section id="work" class="py-20">
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

        <!-- Filter Buttons -->
        <div class="flex flex-wrap gap-2 sm:justify-end">
          <button
              class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium transition hover:brightness-110">
            All Work
          </button>
          <button
              class="px-4 py-2 rounded-lg bg-white/5 text-white/70 text-sm font-medium border border-white/10 transition hover:bg-white/10">
            React
          </button>
          <button
              class="px-4 py-2 rounded-lg bg-white/5 text-white/70 text-sm font-medium border border-white/10 transition hover:bg-white/10">
            Node.js
          </button>
          <button
              class="px-4 py-2 rounded-lg bg-white/5 text-white/70 text-sm font-medium border border-white/10 transition hover:bg-white/10">
            Python
          </button>
          <button
              class="px-4 py-2 rounded-lg bg-white/5 text-white/70 text-sm font-medium border border-white/10 transition hover:bg-white/10">
            UI/UX
          </button>
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

      <!-- Load more button -->
      <div class="flex justify-center">
        <button
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 text-white/70 font-semibold hover:bg-white/5 transition-all">
          <span>Load More Projects</span>
          <Icon name="tabler:chevron-down" size="20"/>
        </button>
      </div>
    </div>
  </section>

  <!-- Project Modal -->
  <UModal v-model:open="isModalOpen">
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">{{ selectedProject?.title }}</h2>
        <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1 text-white/50 hover:text-white"
            @click="isModalOpen = false"
        />
      </div>
    </template>

    <template #body>
      <!-- Content Area -->
      <div class="overflow-y-auto flex-1 p-6">
        <!-- Project Details -->
        <div class="space-y-6">
          <!-- Image -->
          <div class="relative h-64 bg-linear-to-b from-primary/20 to-transparent rounded-xl overflow-hidden">
            <NuxtImg
                :src="selectedProject?.image"
                :alt="selectedProject?.title"
                class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/30"></div>
          </div>

          <!-- Tech Stack -->
          <div>
            <h3 class="text-sm font-bold text-white/50 uppercase mb-3">Tech Stack</h3>
            <div class="flex flex-wrap gap-2">
              <span
                  v-for="tech in selectedProject?.technologies"
                  :key="tech"
                  class="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 border border-primary/30 rounded-lg"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Overview -->
          <div>
            <h3 class="text-lg font-bold text-white mb-3">Project Overview</h3>
            <p class="text-white/70 leading-relaxed">{{ selectedProject?.details }}</p>
          </div>

          <!-- Key Features -->
          <div>
            <h3 class="text-lg font-bold text-white mb-3">Key Features</h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li
                  v-for="feature in selectedProject?.features"
                  :key="feature"
                  class="flex items-center gap-3 text-white/70"
              >
                <Icon name="tabler:check" size="20" class="text-primary shrink-0"/>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Live Preview Tab -->
        <div>
          <div v-if="selectedProject?.liveUrl" class="space-y-6">
            <!-- Preview Info -->
            <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
              <Icon name="tabler:info-circle" size="18" class="text-blue-300 shrink-0 mt-0.5"/>
              <p class="text-sm text-blue-300">
                Aplikasi live akan dibuka di tab baru untuk pengalaman terbaik.
              </p>
            </div>

            <!-- URL Display with Copy -->
            <div class="relative rounded-xl overflow-hidden bg-black/40 border border-white/10 p-4">
              <div class="flex items-center gap-3">
                <Icon name="tabler:link" size="24" class="text-primary"/>
                <div class="flex-1">
                  <p class="text-xs text-white/50 uppercase mb-1">Live Application URL</p>
                  <p class="text-sm text-white/70 break-all">{{ selectedProject?.liveUrl }}</p>
                </div>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-clipboard-document"
                    size="sm"
                    class="text-white/50 hover:text-white"
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
                size="lg"
                class="bg-primary hover:brightness-110"
            >
              <template #leading>
                <Icon name="tabler:external-link" size="20"/>
              </template>
              Buka Aplikasi Live
            </UButton>
          </div>

          <div v-else class="text-center py-12">
            <Icon name="tabler:world-off" size="48" class="text-white/20 mx-auto mb-3"/>
            <p class="text-white/50">Live preview belum tersedia untuk project ini</p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-3">
        <UButton
            :to="selectedProject?.link"
            target="_blank"
            external
            block
            color="primary"
            size="lg"
            class="flex-1 bg-primary"
        >
          <template #leading>
            <Icon name="tabler:brand-github" size="20"/>
          </template>
          View on GitHub
        </UButton>
        <UButton
            color="neutral"
            variant="outline"
            size="lg"
            @click="closeModal"
        >
          Close
        </UButton>
      </div>
    </template>
  </UModal>
</template>

