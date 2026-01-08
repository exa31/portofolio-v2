<script setup lang="ts">
import {ref} from 'vue'

definePageMeta({
  layout: 'dashboard'
})

interface BlogPost {
  id: number
  title: string
  excerpt: string
  category: string
  status: 'Draft' | 'Published' | 'Archived'
  views: number
  createdAt: string
  updatedAt: string
  image: string
}

const blogPosts = ref<BlogPost[]>([
  {
    id: 1,
    title: 'Getting Started with Vue 3 Composition API',
    excerpt: 'Learn the fundamentals of Vue 3 Composition API and how to structure your components.',
    category: 'Vue.js',
    status: 'Published',
    views: 1243,
    createdAt: '2025-12-15',
    updatedAt: '2 days ago',
    image: '/images/hero.png'
  },
  {
    id: 2,
    title: 'Building Scalable Node.js Applications',
    excerpt: 'Best practices for designing and building scalable backend applications with Node.js.',
    category: 'Backend',
    status: 'Published',
    views: 856,
    createdAt: '2025-12-10',
    updatedAt: '1 week ago',
    image: '/images/hero.png'
  },
  {
    id: 3,
    title: 'TypeScript Tips and Tricks',
    excerpt: 'Advanced TypeScript techniques to improve code quality and developer experience.',
    category: 'TypeScript',
    status: 'Draft',
    views: 0,
    createdAt: '2025-12-20',
    updatedAt: '3 days ago',
    image: '/images/hero.png'
  },
  {
    id: 4,
    title: 'Mastering Tailwind CSS',
    excerpt: 'Complete guide to using Tailwind CSS for rapid UI development.',
    category: 'CSS',
    status: 'Published',
    views: 2341,
    createdAt: '2025-11-20',
    updatedAt: '3 weeks ago',
    image: '/images/hero.png'
  }
])

const searchQuery = ref('')
const selectedStatus = ref('All')
const viewMode = ref<'grid' | 'list'>('list')

const filteredPosts = computed(() => {
  return blogPosts.value.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'All' || post.status === selectedStatus.value
    return matchesSearch && matchesStatus
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

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Vue.js': 'bg-green-500/10 text-green-400 border-green-500/30',
    'Backend': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'TypeScript': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    'CSS': 'bg-pink-500/10 text-pink-400 border-pink-500/30'
  }
  return colors[category] || 'bg-white/10 text-white/70 border-white/20'
}
</script>

<template>
  <div class="p-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-4xl font-black text-white mb-2">Blog Posts</h1>
        <p class="text-white/60">Create and manage your blog articles. Share your knowledge with the community.</p>
      </div>

      <!-- Create New Button -->
      <button
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all whitespace-nowrap">
        <Icon name="carbon:add" size="20"/>
        Create New Post
      </button>
    </div>

    <!-- Filters Section -->
    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="relative lg:col-span-2">
          <Icon name="carbon:search" size="20"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"/>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search blog posts..."
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
      </div>

      <!-- View Toggle & Count -->
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <p class="text-sm text-white/60">{{ filteredPosts.length }} posts found</p>
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
          v-for="post in filteredPosts"
          :key="post.id"
          class="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer flex flex-col"
      >
        <!-- Image -->
        <div class="relative h-48 bg-white/5 overflow-hidden">
          <NuxtImg
              :src="post.image"
              :alt="post.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <!-- Status Badge -->
          <div class="absolute top-4 right-4">
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', getStatusColor(post.status)]">
              {{ post.status }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 flex-1 flex flex-col">
          <!-- Category -->
          <span
              :class="['px-3 py-1 rounded-full text-xs font-semibold border inline-block w-fit mb-3', getCategoryColor(post.category)]">
            {{ post.category }}
          </span>

          <!-- Title -->
          <h3 class="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {{ post.title }}
          </h3>

          <!-- Excerpt -->
          <p class="text-sm text-white/60 mb-4 line-clamp-2 flex-1">{{ post.excerpt }}</p>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-white/50">
            <span>{{ post.updatedAt }}</span>
            <span>{{ post.views }} views</span>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-3">
      <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-primary/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      >
        <!-- Thumbnail -->
        <div class="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
          <NuxtImg
              :src="post.image"
              :alt="post.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h3 class="text-base font-bold text-white group-hover:text-primary transition-colors">
              {{ post.title }}
            </h3>
            <span
                :class="['px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0', getStatusColor(post.status)]">
              {{ post.status }}
            </span>
          </div>
          <p class="text-sm text-white/60 mb-2 line-clamp-1">{{ post.excerpt }}</p>
          <div class="flex items-center gap-3 text-xs text-white/50">
            <span :class="['px-2 py-0.5 rounded border', getCategoryColor(post.category)]">{{ post.category }}</span>
            <span>{{ post.views }} views</span>
            <span>Updated {{ post.updatedAt }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 flex-shrink-0">
          <button class="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-white/50 hover:text-primary transition-all">
            <Icon name="carbon:pen" size="16"/>
          </button>
          <button class="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
            <Icon name="carbon:trash-can" size="16"/>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPosts.length === 0" class="flex flex-col items-center justify-center py-20">
      <Icon name="carbon:document-blank" size="64" class="text-white/20 mb-6"/>
      <h3 class="text-xl font-bold text-white mb-2">No blog posts found</h3>
      <p class="text-white/60 text-center mb-6">Try adjusting your search or filter criteria</p>
      <button
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all">
        <Icon name="carbon:add" size="20"/>
        Create Your First Post
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>

