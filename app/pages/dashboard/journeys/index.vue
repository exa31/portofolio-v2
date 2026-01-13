<script setup lang="ts">
import {ref} from 'vue'
import type {Journey} from "~/types/journey";
import {useToastCustom} from "~/composables/useToastCustom";

definePageMeta({
  layout: 'dashboard',
  breadCrumb: [
    {title: 'Work'}
  ]
})

const {
  hasMore,
  cursor,
  journeys,
  fetchJourneys,
  isLoading,
  deleteJourney
} = useJourney()

const searchQuery = ref('')
const canLoadMore = ref(false)
const toast = useToastCustom()
const viewMode = ref<'grid' | 'list'>('grid')
const {debounce} = useDebounce()
const isSearching = ref(false)

// Fetch initial journeys on SSR/CSR
const {data} = await useAsyncData('journeys', async () => {
  return await fetchJourneys(false, '')
})

// Watch for search changes and reset
watch([searchQuery], () => {
  debounce(
      "search-journeys",
      async (query: string) => {
        isSearching.value = true
        cursor.value = null
        canLoadMore.value = false
        try {
          await fetchJourneys(false, query)
        } finally {
          isSearching.value = false
          canLoadMore.value = true
        }
      }, 500,
      searchQuery.value
  )
}, {immediate: false})

// Load more on client side only (infinite scroll)
const scrollTriggerRef = ref<HTMLElement>()

// Intersection Observer setup (client-side only)
const setupIntersectionObserver = () => {
  if (import.meta.server || !scrollTriggerRef.value) return

  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore.value && !isLoading.value && canLoadMore.value && !isSearching.value) {
            fetchJourneys(true, searchQuery.value)
          }
        })
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
  )

  observer.observe(scrollTriggerRef.value)

  onUnmounted(() => {
    observer.disconnect()
  })
}

// Setup observer on client-side only
if (import.meta.client) {
  onMounted(() => {
    if (data.value) {
      journeys.value = data.value.data
      hasMore.value = data.value.has_next

      if (data.value.data.length > 0) {
        cursor.value = data.value.data.at(-1)!.id as any
      }
    }
    canLoadMore.value = true
    setupIntersectionObserver()
  })
}

const getStatusColor = (isCurrent: boolean) => {
  if (isCurrent) {
    return 'bg-green-500/20 text-green-400 border-green-500/40'
  }
  return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
}

const getStatusText = (isCurrent: boolean) => {
  return isCurrent ? 'Current' : 'Past'
}

const formatDateRange = (startDate: string, endDate?: string) => {
  const start = new Date(startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})
  if (!endDate) return `${start} - Present`
  const end = new Date(endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})
  return `${start} - ${end}`
}

const openJourney = (journey: Journey) => {
  navigateTo(`/dashboard/journeys/${journey.id}`)
}

const deleteJourneyHandler = async (id: number) => {
  toast.showConfirmationToast(
      'Delete Journey',
      'Are you sure you want to delete this journey? This action cannot be undone.',
      async () => {
        const success = await deleteJourney(id)
        if (success) {
          cursor.value = null
          canLoadMore.value = false
          try {
            await fetchJourneys(false, '')
          } finally {
            canLoadMore.value = true
            isSearching.value = false
          }
        }
      }
  )
}
</script>

<template>
  <div class="p-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-4xl font-black text-white mb-2">Manage Work Experience</h1>
        <p class="text-white/60">Track and showcase your professional journey and career milestones.</p>
      </div>

      <!-- Add New Journey Button -->
      <button
          @click="navigateTo('/dashboard/journeys/new')"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all whitespace-nowrap">
        <Icon name="carbon:add" size="20"/>
        Add Experience
      </button>
    </div>

    <!-- Filters Section -->
    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
      <div class="flex items-center gap-4">
        <!-- Search -->
        <div class="relative flex-1">
          <Icon name="carbon:search" size="20"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"/>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title or company..."
              class="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
          />
        </div>

        <!-- View Mode Toggle -->
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
      <!-- Skeleton Loading -->
      <div v-if="isSearching || isLoading" v-for="i in 6" :key="`skeleton-${i}`"
           class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 animate-pulse">
        <div class="space-y-3">
          <div class="h-6 bg-white/10 rounded w-3/4"></div>
          <div class="h-4 bg-white/10 rounded w-full"></div>
          <div class="h-4 bg-white/10 rounded w-2/3"></div>
          <div class="flex gap-2 mt-4">
            <div class="h-6 bg-white/10 rounded w-20"></div>
            <div class="h-6 bg-white/10 rounded w-20"></div>
          </div>
          <div class="pt-4 border-t border-white/10 flex justify-between">
            <div class="h-4 bg-white/10 rounded w-1/3"></div>
            <div class="flex gap-2">
              <div class="w-8 h-8 bg-white/10 rounded"></div>
              <div class="w-8 h-8 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Journeys -->
      <div
          v-for="journey in journeys"
          @click="openJourney(journey)"
          :key="journey.id"
          v-else
          class="group flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer p-6"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-bold text-white group-hover:text-primary transition-colors">
              {{ journey.title }}
            </h3>
            <p class="text-sm text-white/60">{{ journey.company }}</p>
            <p v-if="journey.location" class="text-xs text-white/40">{{ journey.location }}</p>
          </div>
          <span
              :class="['px-3 py-1 rounded-full text-xs font-semibold border shrink-0', getStatusColor(journey.is_current)]">
            {{ getStatusText(journey.is_current) }}
          </span>
        </div>

        <!-- Date Range -->
        <p class="text-xs text-white/50 mb-4">{{ formatDateRange(journey.start_date, journey.end_date) }}</p>

        <!-- Description -->
        <p class="text-sm text-white/60 mb-4 line-clamp-2">{{ journey.description }}</p>

        <!-- Responsibilities -->
        <div class="mb-4 grow">
          <p class="text-xs font-semibold text-white/70 mb-2">Key Responsibilities:</p>
          <ul class="space-y-1">
            <li v-for="(resp, idx) in journey.key_responsibilities.slice(0, 2)" :key="idx"
                class="text-xs text-white/50 line-clamp-1">• {{ resp }}
            </li>
            <li v-if="journey.key_responsibilities.length > 2" class="text-xs text-white/40">
              +{{ journey.key_responsibilities.length - 2 }} more
            </li>
          </ul>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-4 border-t border-white/10">
          <div></div>
          <div class="flex gap-2">
            <button
                @click.stop="openJourney(journey)"
                class="p-2 rounded-lg cursor-pointer bg-white/5 hover:bg-primary/20 text-white/50 hover:text-primary transition-all">
              <Icon name="carbon:pen" size="16"/>
            </button>
            <button
                @click.stop="deleteJourneyHandler(journey.id || 0)"
                class="p-2 rounded-lg cursor-pointer bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
              <Icon name="carbon:trash-can" size="16"/>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-3">
      <!-- Skeleton Loading -->
      <div v-if="isSearching" v-for="i in 6" :key="`skeleton-${i}`"
           class="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg animate-pulse">
        <div class="flex-1 min-w-0 space-y-2">
          <div class="h-5 bg-white/10 rounded w-1/3"></div>
          <div class="h-4 bg-white/10 rounded w-1/2"></div>
          <div class="h-4 bg-white/10 rounded w-2/5"></div>
        </div>
        <div class="text-right shrink-0 space-y-2">
          <div class="h-6 bg-white/10 rounded w-20"></div>
          <div class="flex gap-2">
            <div class="w-8 h-8 bg-white/10 rounded"></div>
            <div class="w-8 h-8 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Journeys -->
      <div
          v-for="journey in journeys"
          :key="journey.id"
          @click="openJourney(journey)"
          v-else
          class="group flex items-center justify-between gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-primary/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      >
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h3 class="text-base font-bold text-white group-hover:text-primary transition-colors">
              {{ journey.title }}
            </h3>
            <span
                :class="['px-3 py-1 rounded-full text-xs font-semibold border shrink-0', getStatusColor(journey.is_current)]">
              {{ getStatusText(journey.is_current) }}
            </span>
          </div>
          <p class="text-sm text-white/60 mb-1">{{ journey.company }}
            <span v-if="journey.location" class="text-white/40"> • {{ journey.location }}</span>
          </p>
          <p class="text-xs text-white/50">{{ formatDateRange(journey.start_date, journey.end_date) }}</p>
        </div>

        <!-- Meta -->
        <div class="shrink-0 flex gap-2">
          <button
              @click.stop="openJourney(journey)"
              class="p-2 rounded-lg cursor-pointer bg-white/5 hover:bg-primary/20 text-white/50 hover:text-primary transition-all">
            <Icon name="carbon:pen" size="16"/>
          </button>
          <button
              @click.stop="deleteJourneyHandler(journey.id || 0)"
              class="p-2 rounded-lg cursor-pointer bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
            <Icon name="carbon:trash-can" size="16"/>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="journeys.length === 0" class="flex flex-col items-center justify-center py-20">
      <Icon name="carbon:inbox-empty" size="64" class="text-white/20 mb-6"/>
      <h3 class="text-xl font-bold text-white mb-2">No work experience found</h3>
      <p class="text-white/60 text-center mb-6">Start by adding your first work experience</p>
      <button
          @click="navigateTo('/dashboard/journeys/new')"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all">
        <Icon name="carbon:add" size="20"/>
        Add Your First Experience
      </button>
    </div>

    <!-- Loading Indicator (Initial Load) -->
    <div v-if="isLoading && journeys.length === 0 && !isSearching"
         class="flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p class="text-white/60 text-sm">Loading journeys...</p>
    </div>

    <!-- Scroll Trigger for Infinite Scroll (Load More) -->
    <div ref="scrollTriggerRef" class="h-10 flex items-center justify-center">
      <div v-if="isLoading && journeys.length > 0 && !isSearching && canLoadMore"
           class="flex items-center gap-2 text-white/60 text-sm">
        <Icon name="icon-park-outline:loading-four" size="16" class="animate-spin"/>
        <p>Loading more journeys...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

