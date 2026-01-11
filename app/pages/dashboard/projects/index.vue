<script setup lang="ts">
import {ref} from 'vue'

definePageMeta({
  layout: 'dashboard'
})

interface Project {
  id: number
  title: string
  description: string
  status: 'Draft' | 'Published' | 'Archived'
  image: string
  technologies: string[]
  updatedAt: string
  link?: string
}

const breadCrumbStore = useBreadCrumbStore()
const projects = ref<Project[]>([
  {
    id: 1,
    title: 'SaaS Analytics Dashboard',
    description: 'A comprehensive analytics platform for SaaS businesses featuring real-time...',
    status: 'Published',
    image: '/images/hero.png',
    technologies: ['React', 'Tailwind', 'D3.js'],
    updatedAt: '2 days ago',
    link: 'https://github.com'
  },
  {
    id: 2,
    title: 'FinTech Mobile App',
    description: 'Secure mobile banking application allowing users to transfer funds, pay...',
    status: 'Draft',
    image: '/images/hero.png',
    technologies: ['React Native', 'Firebase'],
    updatedAt: '1 week ago',
    link: 'https://github.com'
  },
  {
    id: 3,
    title: 'Node.js API Gateway',
    description: 'High-performance microservices gateway handling authentication, rat...',
    status: 'Published',
    image: '/images/hero.png',
    technologies: ['Node.js', 'Express', 'Redis'],
    updatedAt: '3 weeks ago',
    link: 'https://github.com'
  },
  {
    id: 4,
    title: 'Legacy CRM System',
    description: 'Internal customer relationship management tool built for a logistics...',
    status: 'Archived',
    image: '/images/hero.png',
    technologies: ['Vue.js', 'PostgreSQL'],
    updatedAt: '2 months ago',
    link: 'https://github.com'
  },
  {
    id: 5,
    title: 'E-Commerce Storefront',
    description: 'Modern e-commerce frontend with cart functionality, stripe integration...',
    status: 'Draft',
    image: '/images/hero.png',
    technologies: ['Next.js', 'Stripe'],
    updatedAt: '1 week ago',
    link: 'https://github.com'
  },
  {
    id: 6,
    title: 'Auth System v2',
    description: 'A reusable authentication library with support for OAuth2, JWT and session...',
    status: 'Published',
    image: '/images/hero.png',
    technologies: ['TypeScript', 'OAuth2'],
    updatedAt: '3 days ago',
    link: 'https://github.com'
  }
])

const searchQuery = ref('')
const selectedStatus = ref('All')
const selectedTech = ref('All')
const viewMode = ref<'grid' | 'list'>('grid')

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'All' || project.status === selectedStatus.value
    const matchesTech = selectedTech.value === 'All' || project.technologies.includes(selectedTech.value)
    return matchesSearch && matchesStatus && matchesTech
  })
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Published':
      return 'bg-green-500/20 text-green-400 border-green-500/40'
    case 'Draft':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
    case 'Archived':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
    default:
      return 'bg-white/10 text-white/70'
  }
}

const openProject = (project: Project) => {
  // Navigate to edit page
  navigateTo(`/dashboard/projects/${project.id}`)
}

const deleteProjectHandler = async (id: number) => {
  if (confirm('Are you sure you want to delete this project?')) {
    // Simulate API call
    const index = projects.value.findIndex(p => p.id === id)
    if (index > -1) {
      projects.value.splice(index, 1)
    }
  }
}

breadCrumbStore.setBreadCrumb([
  {title: 'Projects'}
])
</script>

<template>
  <div class="p-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-4xl font-black text-white mb-2">Manage Projects</h1>
        <p class="text-white/60">Create, update, and manage your portfolio projects. Keep your best work front and
          center.</p>
      </div>

      <!-- Add New Project Button -->
      <button
          @click="navigateTo('/dashboard/projects/new')"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all whitespace-nowrap">
        <Icon name="carbon:add" size="20"/>
        Add New Project
      </button>
    </div>

    <!-- Filters Section -->
    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="relative lg:col-span-2">
          <Icon name="carbon:search" size="20"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"/>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search projects by name, client, or stack..."
              class="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
          />
        </div>

        <!-- Status Filter -->
        <div class="relative">
          <select
              v-model="selectedStatus"
              class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
          >
            <option value="All">Status: All</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
          <Icon name="carbon:chevron-down" size="16"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none"/>
        </div>

        <!-- Tech Stack Filter -->
        <div class="relative">
          <select
              v-model="selectedTech"
              class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
          >
            <option value="All">Tech Stack: All</option>
            <option value="React">React</option>
            <option value="Vue.js">Vue.js</option>
            <option value="Node.js">Node.js</option>
            <option value="TypeScript">TypeScript</option>
          </select>
          <Icon name="carbon:chevron-down" size="16"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none"/>
        </div>
      </div>

      <!-- View Mode Toggle -->
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <p class="text-sm text-white/60">{{ filteredProjects.length }} projects found</p>
        <div class="flex gap-2">
          <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded-lg transition-all',
                viewMode === 'grid'
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
              ]"
          >
            <Icon name="carbon:grid" size="20"/>
          </button>
          <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded-lg transition-all',
                viewMode === 'list'
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
              ]"
          >
            <Icon name="carbon:list" size="20"/>
          </button>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="project in filteredProjects"
          :key="project.id"
          @click="openProject(project)"
          class="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
      >
        <!-- Image -->
        <div class="relative h-48 bg-white/5 overflow-hidden">
          <NuxtImg
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <!-- Status Badge -->
          <div class="absolute top-4 right-4">
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', getStatusColor(project.status)]">
              {{ project.status }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Title -->
          <h3 class="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
            {{ project.title }}
          </h3>

          <!-- Description -->
          <p class="text-sm text-white/60 mb-4 line-clamp-2">{{ project.description }}</p>

          <!-- Technologies -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
                v-for="tech in project.technologies"
                :key="tech"
                class="px-2 py-1 text-xs font-medium bg-primary/15 text-primary border border-primary/30 rounded group-hover:bg-primary/25 transition-colors"
            >
              {{ tech }}
            </span>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 border-t border-white/10">
            <span class="text-xs text-white/50">Updated {{ project.updatedAt }}</span>
            <div class="flex gap-2">
              <button
                  @click.stop="openProject(project)"
                  class="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-white/50 hover:text-primary transition-all">
                <Icon name="carbon:pen" size="16"/>
              </button>
              <button
                  @click.stop="deleteProjectHandler(project.id)"
                  class="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                <Icon name="carbon:trash-can" size="16"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-3">
      <div
          v-for="project in filteredProjects"
          :key="project.id"
          @click="openProject(project)"
          class="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-primary/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      >
        <!-- Image Thumbnail -->
        <div class="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-white/5">
          <NuxtImg
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h3 class="text-base font-bold text-white group-hover:text-primary transition-colors">
              {{ project.title }}
            </h3>
            <span
                :class="['px-3 py-1 rounded-full text-xs font-semibold border shrink-0', getStatusColor(project.status)]">
              {{ project.status }}
            </span>
          </div>
          <p class="text-sm text-white/60 mb-2 line-clamp-1">{{ project.description }}</p>
          <div class="flex flex-wrap gap-1">
            <span
                v-for="tech in project.technologies.slice(0, 3)"
                :key="tech"
                class="px-2 py-0.5 text-xs font-medium bg-primary/15 text-primary border border-primary/30 rounded"
            >
              {{ tech }}
            </span>
            <span v-if="project.technologies.length > 3" class="text-xs text-white/40">
              +{{ project.technologies.length - 3 }} more
            </span>
          </div>
        </div>

        <!-- Meta -->
        <div class="text-right shrink-0">
          <p class="text-xs text-white/50 mb-3">Updated {{ project.updatedAt }}</p>
          <div class="flex gap-2">
            <button
                @click.stop="openProject(project)"
                class="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-white/50 hover:text-primary transition-all">
              <Icon name="carbon:pen" size="16"/>
            </button>
            <button
                @click.stop="deleteProjectHandler(project.id)"
                class="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
              <Icon name="carbon:trash-can" size="16"/>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProjects.length === 0" class="flex flex-col items-center justify-center py-20">
      <Icon name="carbon:inbox-empty" size="64" class="text-white/20 mb-6"/>
      <h3 class="text-xl font-bold text-white mb-2">No projects found</h3>
      <p class="text-white/60 text-center mb-6">Try adjusting your search or filter criteria</p>
      <button
          @click="navigateTo('/dashboard/projects/new')"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all">
        <Icon name="carbon:add" size="20"/>
        Create Your First Project
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>

