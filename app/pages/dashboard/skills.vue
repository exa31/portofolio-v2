<script setup lang="ts">
import {computed, ref} from 'vue'
import type {Skill} from "~/types/skill";

definePageMeta({
  layout: 'dashboard'
})

const breadCrumbStore = useBreadCrumbStore()
const {hasMore, cursor, skills, fetchSkills, isLoading,} = useSkill()
const searchQuery = ref('')
const canLoadMore = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)

const formData = ref<Skill>({
  id: 0,
  name: '',
  icon: 'mdi:code',
  color: 'blue',
})

// Fetch initial skills on SSR/CSR
const {pending, data} = await useAsyncData('skills', async () => {
  return await fetchSkills(false, '')
})

// Watch for search/filter changes and reset
watch([searchQuery], () => {
  cursor.value = null
  hasMore.value = true
  fetchSkills(false, searchQuery.value)
}, {immediate: false})

// Load more on client side only (infinite scroll)
const scrollTriggerRef = ref<HTMLElement>()

const filteredSkills = computed(() => {
  return skills.value
})

// Intersection Observer setup (client-side only)
const setupIntersectionObserver = () => {
  // Guard untuk SSR
  if (import.meta.server || !scrollTriggerRef.value) return

  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore.value && !isLoading.value && canLoadMore.value) {
            fetchSkills(true, searchQuery.value) // Load more
          }
        })
      },
      {
        root: null,
        rootMargin: '100px', // Trigger 100px before reaching bottom
        threshold: 0.1,
      }
  )

  observer.observe(scrollTriggerRef.value)

  // Cleanup
  onUnmounted(() => {
    observer.disconnect()
  })
}

// Setup observer on client-side only
if (import.meta.client) {
  onMounted(() => {
    if (data.value) {
      skills.value = data.value.data
      hasMore.value = data.value.has_next

      if (data.value.data.length > 0) {
        cursor.value = data.value.data.at(-1)!.id.toString()
      }
    }
    canLoadMore.value = true
    setupIntersectionObserver()
  })
}

const openCreateModal = () => {
  isEditMode.value = false
  formData.value = {
    id: 0,
    name: '',
    icon: 'mdi:code',
    color: 'blue',
  }
  showModal.value = true
}

const openEditModal = (skill: Skill) => {
  isEditMode.value = true
  formData.value = {...skill}
  showModal.value = true
}

const saveSkill = () => {
  if (!formData.value.name.trim()) {
    alert('Skill name is required')
    return
  }

  if (isEditMode.value) {
    const index = skills.value.findIndex(s => s.id === formData.value.id)
    if (index !== -1) {
      skills.value[index] = formData.value
    }
  } else {
    formData.value.id = Math.max(...skills.value.map(s => s.id), 0) + 1
    skills.value.push({...formData.value})
  }

  showModal.value = false
}

const deleteSkill = (id: number) => {
  if (confirm('Are you sure you want to delete this skill?')) {
    skills.value = skills.value.filter(s => s.id !== id)
  }
}

const closeModal = () => {
  showModal.value = false
}
breadCrumbStore.setBreadCrumb([
  {title: 'Skills'}
])
</script>

<template>
  <div class="p-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-4xl font-black text-white mb-2">Skills Management</h1>
        <p class="text-white/60">Create and manage your technical skills. Showcase your expertise and experience.</p>
      </div>

      <!-- Create New Button -->
      <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all whitespace-nowrap">
        <Icon name="carbon:add" size="20"/>
        Add Skill
      </button>
    </div>

    <!-- Filters Section -->
    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
      <div class="grid grid-cols-1 gap-4">
        <!-- Search -->
        <div class="relative">
          <Icon name="carbon:search" size="20"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"/>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search skills..."
              class="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
          />
        </div>
      </div>

      <!-- Count -->
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <p class="text-sm text-white/60">{{ filteredSkills.length }} skills found</p>
      </div>
    </div>

    <!-- Skills Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div
          v-for="skill in filteredSkills"
          :key="skill.id"
          class="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 flex flex-col"
      >
        <!-- Icon & Name -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4 flex-1">
            <div
                class="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <Icon :name="skill.icon" size="24" class="text-white/80 group-hover:text-primary transition-colors"/>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-bold text-white group-hover:text-primary transition-colors">{{ skill.name }}</h3>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4 border-t border-white/10 mt-auto">
          <button
              @click="openEditModal(skill)"
              class="flex-1 py-2 rounded-lg bg-white/5 hover:bg-primary/20 text-white/70 hover:text-primary transition-all font-medium text-sm flex items-center justify-center gap-2"
          >
            <Icon name="carbon:pen" size="16"/>
            Edit
          </button>
          <button
              @click="deleteSkill(skill.id)"
              class="flex-1 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all font-medium text-sm flex items-center justify-center gap-2"
          >
            <Icon name="carbon:trash-can" size="16"/>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Infinite Scroll Trigger & Loading -->
    <div class="flex flex-col items-center justify-center py-8">
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="flex flex-col items-center gap-4">
        <div class="w-8 h-8 border-4 border-white/20 border-t-primary rounded-full animate-spin"></div>
        <p class="text-white/60 text-sm">Loading more skills...</p>
      </div>

      <!-- No More Data -->
      <div v-else-if="filteredSkills.length > 0 && !hasMore" class="text-center">
        <Icon name="carbon:checkmark-filled" size="32" class="text-green-400 mb-2 mx-auto"/>
        <p class="text-white/60 text-sm">No more skills to load</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredSkills.length === 0" class="text-center py-12">
        <Icon name="carbon:skill-level" size="64" class="text-white/20 mb-6 mx-auto"/>
        <h3 class="text-xl font-bold text-white mb-2">No skills found</h3>
        <p class="text-white/60 text-center mb-6">Try adjusting your search or filter criteria</p>
        <button
            @click="openCreateModal"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all"
        >
          <Icon name="carbon:add" size="20"/>
          Add Your First Skill
        </button>
      </div>

      <!-- Scroll Trigger Element (for intersection observer) -->
      <div ref="scrollTriggerRef" class="h-1 w-full"></div>
    </div>

    <!-- Add/Edit Modal -->
    <UModal v-model:open="showModal">
      <!-- Title -->
      <template #title>
        <h2 class="text-2xl sm:text-3xl font-black text-white">
          {{ isEditMode ? 'Edit Skill' : 'Add New Skill' }}
        </h2>
      </template>

      <!-- Description -->
      <template #description>
        <p class="text-sm text-white/60">
          {{ isEditMode ? 'Update skill information' : 'Create a new technical skill' }}
        </p>
      </template>

      <!-- Body -->
      <template #body>
        <div class="space-y-4">
          <!-- Skill Name -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Skill Name *</label>
            <input
                v-model="formData.name"
                type="text"
                placeholder="e.g., React, Node.js, Docker"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- Icon -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Icon Name</label>
            <input
                v-model="formData.icon"
                type="text"
                placeholder="e.g., mdi:react, mdi:nodejs"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- Color -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">
              Color Theme
            </label>

            <div class="flex items-center gap-3">
              <input
                  v-model="formData.color"
                  type="color"
                  class="w-12 h-10 rounded-lg cursor-pointer border border-white/20 bg-transparent"
              />

              <input
                  v-model="formData.color"
                  type="text"
                  placeholder="#3B82F6"
                  class="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Footer -->
      <template #footer>
        <div class="flex w-full gap-3">
          <UButton
              color="neutral"
              variant="outline"
              size="lg"
              @click="closeModal"
              class="flex-1 hover:bg-white/10 cursor-pointer font-semibold rounded-lg"
          >
            Cancel
          </UButton>
          <UButton
              color="primary"
              size="lg"
              @click="saveSkill"
              class="flex-1 bg-primary text-white hover:brightness-110 font-semibold rounded-lg"
          >
            {{ isEditMode ? 'Update Skill' : 'Add Skill' }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
</style>

