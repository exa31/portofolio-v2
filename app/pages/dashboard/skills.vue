<script setup lang="ts">
import {computed, ref} from 'vue'
import type {Skill} from "~/types/skill";
import {useToastCustom} from "~/composables/useToastCustom";

definePageMeta({
  layout: 'dashboard',
  breadCrumb: [
    {
      title: 'Skills'
    }
  ]
})

const {
  hasMore,
  cursor,
  skills,
  fetchSkills,
  isLoading,
  isSaving,
  createMultipleSkills, updateSkill, deleteSkill
} = useSkill()

const searchQuery = ref('')
const canLoadMore = ref(false)
const toast = useToastCustom()
const showModal = ref(false)
const {debounce} = useDebounce()
const isEditMode = ref(false)
const errorsMessages = ref<{
  name: string
  icon: string
  color: string
}[]>([])

const formData = ref<Skill>({
  id: 0,
  name: '',
  icon: 'mdi:code',
  color: '#001eff',
})

// Multiple skills form data
const formDataList = ref<Skill[]>([
  {
    id: 0,
    name: '',
    icon: 'mdi:code',
    color: '#001eff',
  }
])

// Fetch initial skills on SSR/CSR
const {data} = await useAsyncData('skills', async () => {
  return await fetchSkills(false, '')
})

// Watch for search/filter changes and reset
watch([searchQuery], () => {
  debounce(
      "search-skills",
      (query: string) => {
        cursor.value = null
        canLoadMore.value = false
        fetchSkills(false, query).then(
            () => {
              canLoadMore.value = true
            }
        )
      }, 500,
      searchQuery.value
  )
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

const saveSkill = () => {
  if (isEditMode.value) {
    handleUpdateSkill()
  } else {
    saveMultipleSkills()
  }
}

const openCreateModal = () => {
  isEditMode.value = false
  formDataList.value = [
    {
      id: 0,
      name: '',
      icon: '',
      color: '#001eff',
    }
  ]
  errorsMessages.value = []
  showModal.value = true
}

const addMoreSkillForm = () => {
  formDataList.value.push({
    id: 0,
    name: '',
    icon: '',
    color: '#001eff',
  })
}

const removeSkillForm = (index: number) => {
  if (formDataList.value.length > 1) {
    formDataList.value.splice(index, 1)
  }
}

const openEditModal = (skill: Skill) => {
  isEditMode.value = true
  formData.value = {...skill}
  errorsMessages.value = []
  showModal.value = true
}

const validateSkillItem = (skill: Skill): boolean => {
  let isValid = true

  const errorMessagesTemp = {
    name: '',
    icon: '',
    color: '',
  }
  // Validate Name
  if (!skill.name || skill.name.trim() === '') {
    errorMessagesTemp.name = 'Name is required'
    isValid = false
  }

  // Validate Icon
  if (!skill.icon || skill.icon.trim() === '') {
    errorMessagesTemp.icon = 'Icon is required'
    isValid = false
  }

  // Validate Color
  if (!skill.color || skill.color.trim() === '') {
    errorMessagesTemp.color = 'Color is required'
    isValid = false
  }

  // Store errors
  errorsMessages.value.push(errorMessagesTemp)

  return isValid
}

const handleUpdateSkill = async () => {
  // Reset validation errors
  if (isSaving.value) return
  errorsMessages.value = []

  // Validate formData
  const isValid = validateSkillItem(formData.value)
  if (!isValid) {
    return
  }

  const success = await updateSkill(formData.value)
  if (success) {
    closeModal()
  }
}

const saveMultipleSkills = async () => {
  // Reset validation errors
  if (isSaving.value) return
  errorsMessages.value = []

  // Validate all items
  const validSkills: Skill[] = []
  let hasErrors = false

  for (let i = 0; i < formDataList.value.length; i++) {
    const skill = formDataList.value[i]

    // Validate semua item, jangan skip yang kosong
    if (!validateSkillItem(skill!)) {
      hasErrors = true
    } else {
      // Hanya tambah ke validSkills jika benar-benar valid
      validSkills.push(skill!)
    }
  }

  // Check if at least one valid skill exists
  if (validSkills.length === 0) {
    return
  }

  // If there are validation errors, don't proceed
  if (hasErrors) {
    return
  }

  const success = await createMultipleSkills(validSkills)
  if (success) {
    closeModal()
  }
}

const deleteSkillHandler = async (skillId: number) => {
  toast.showConfirmationToast(
      'Delete Skill',
      'Are you sure you want to delete this skill? This action cannot be undone.',
      async () => {
        await deleteSkill(skillId)
      },
  )
}

const closeModal = () => {
  showModal.value = false
  errorsMessages.value = []
}

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
          class="inline-flex items-center cursor-pointer gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all whitespace-nowrap">
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
    </div>

    <!-- Skills Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div
          v-for="skill in filteredSkills"
          :key="skill.id"
          class="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-300 flex flex-col
         hover:border-(--skill-color)"
          :style="{ '--skill-color': skill.color }"
      >
        <!-- Icon & Name -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4 flex-1">
            <!-- Icon wrapper -->
            <div
                class="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0
             transition-colors
             group-hover:bg-[color-mix(in_srgb,var(--skill-color)_20%,transparent)]"
            >
              <Icon
                  :name="skill.icon"
                  size="24"
                  class="text-white/80 transition-colors
               group-hover:text-(--skill-color)"
              />
            </div>

            <!-- Skill name -->
            <div class="flex-1 min-w-0">
              <h3
                  class="text-lg font-bold text-white transition-colors
               group-hover:text-(--skill-color)"
              >
                {{ skill.name }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4 border-t border-white/10 mt-auto">
          <button
              @click="openEditModal(skill)"
              class="flex-1 py-2 cursor-pointer rounded-lg bg-white/5 hover:bg-primary/20 text-white/70 hover:text-primary transition-all font-medium text-sm flex items-center justify-center gap-2"
          >
            <Icon name="carbon:pen" size="16"/>
            Edit
          </button>
          <button
              @click="deleteSkillHandler(skill.id)"
              class="flex-1 py-2 cursor-pointer rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all font-medium text-sm flex items-center justify-center gap-2"
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
          {{ isEditMode ? 'Edit Skill' : 'Add New Skills' }}
        </h2>
      </template>

      <!-- Description -->
      <template #description>
        <p class="text-sm text-white/60">
          {{ isEditMode ? 'Update skill information' : 'Create one or more technical skills' }}
        </p>
      </template>

      <!-- Body -->
      <template #body>
        <!-- Edit Mode - Single Skill Form -->
        <div v-if="isEditMode" class="space-y-4">
          <!-- Skill Name -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Skill Name *</label>
            <input
                v-model="formData.name"
                type="text"
                placeholder="e.g., React, Node.js, Docker"
                :class="[
                  'w-full px-4 py-2 rounded-lg bg-white/10 border text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 transition-all',
                  errorsMessages[0]?.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/20 focus:border-primary/50'
                ]"
            />
            <p v-if="errorsMessages[0]?.name" class="text-red-400 text-xs mt-1">{{ errorsMessages[0]?.name }}</p>
          </div>

          <!-- Icon -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Icon Name</label>
            <input
                v-model="formData.icon"
                type="text"
                placeholder="e.g., mdi:react, mdi:nodejs"
                :class="[
                  'w-full px-4 py-2 rounded-lg bg-white/10 border text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 transition-all',
                  errorsMessages[0]?.icon ? 'border-red-500/50 focus:border-red-500' : 'border-white/20 focus:border-primary/50'
                ]"
            />
            <p v-if="errorsMessages[0]?.icon" class="text-red-400 text-xs mt-1">{{ errorsMessages[0]?.icon }}</p>
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
                  :class="[
                    'w-12 h-10 rounded-lg cursor-pointer bg-transparent',
                    errorsMessages[0]?.color ? 'border-2 border-red-500' : 'border border-white/20'
                  ]"
              />

              <input
                  v-model="formData.color"
                  type="text"
                  placeholder="#3B82F6"
                  :class="[
                    'flex-1 px-4 py-2 rounded-lg bg-white/10 border text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 transition-all',
                    errorsMessages[0]?.color ? 'border-red-500/50 focus:border-red-500' : 'border-white/20 focus:border-primary/50'
                  ]"
              />
            </div>
            <p v-if="errorsMessages[0]?.color" class="text-red-400 text-xs mt-1">{{ errorsMessages[0]?.color }}</p>
          </div>
        </div>

        <!-- Create Mode - Multiple Skills Forms -->
        <div v-else class="space-y-6 max-h-96 overflow-y-auto">
          <div
              v-for="(skillItem, index) in formDataList"
              :key="index"
              class="p-4 bg-white/5 border border-white/10 rounded-lg"
              :class="errorsMessages.some(e => Object.values(e).some(msg => msg !== '')              ) ? 'border-red-500/50 bg-red-500/5' : ''"
          >
            <!-- Skill Number Badge -->
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-semibold text-white/70">Skill {{ index + 1 }}</span>
              <button
                  v-if="formDataList.length > 1"
                  @click="removeSkillForm(index)"
                  class="p-1.5 rounded-lg hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all"
                  type="button"
              >
                <Icon name="carbon:trash-can" size="16"/>
              </button>
            </div>

            <!-- Skill Name -->
            <div class="mb-3">
              <label class="block text-xs font-semibold text-white/80 mb-1.5">Skill Name *</label>
              <input
                  v-model="skillItem.name"
                  type="text"
                  placeholder="e.g., React, Node.js, Docker"
                  class="w-full px-3 py-2 rounded-lg bg-white/10 border text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-primary/50 transition-all text-sm"
                  :class="errorsMessages[index]?.name ? 'border-red-500/50' : 'border-white/20'"
              />
              <p class="text-red-400 text-xs mt-1">
                {{ errorsMessages[index]?.name }}
              </p>
            </div>

            <!-- Icon -->
            <div class="mb-3">
              <label class="block text-xs font-semibold text-white/80 mb-1.5">Icon Name *</label>
              <input
                  v-model="skillItem.icon"
                  type="text"
                  placeholder="e.g., mdi:react, mdi:nodejs"
                  class="w-full px-3 py-2 rounded-lg bg-white/10 border text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-primary/50 transition-all text-sm"
                  :class="errorsMessages[index]?.icon ? 'border-red-500/50' : 'border-white/20'"
              />
              <p
                  class="text-red-400 text-xs mt-1">
                {{ errorsMessages[index]?.icon }}
              </p>
            </div>

            <!-- Color -->
            <div>
              <label class="block text-xs font-semibold text-white/80 mb-1.5">Color Theme *</label>
              <div class="flex items-center gap-2">
                <input
                    v-model="skillItem.color"
                    type="color"
                    class="w-10 h-8 rounded-lg cursor-pointer bg-transparent border border-white/20"
                    :class="errorsMessages[index]?.color ? 'border-red-500/50' : ''"
                />
                <input
                    v-model="skillItem.color"
                    type="text"
                    placeholder="#3B82F6"
                    class="flex-1 px-3 py-2 rounded-lg bg-white/10 border text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-primary/50 transition-all text-sm"
                    :class="errorsMessages[index]?.color? 'border-red-500/50' : 'border-white/20'"
                />
              </div>
              <p
                  class="text-red-400 text-xs mt-1">
                {{ errorsMessages[index]?.color }}
              </p>
            </div>
          </div>

          <!-- Add More Button -->
          <button
              @click="addMoreSkillForm"
              type="button"
              class="w-full py-2.5 cursor-pointer rounded-lg border-2 border-dashed border-white/20 hover:border-primary/50 text-white/70 hover:text-primary transition-all font-medium flex items-center justify-center gap-2"
          >
            <Icon name="carbon:add" size="18"/>
            Add More Skill
          </button>
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
              :disabled="isSaving"
              class="flex-1 hover:bg-white/10 cursor-pointer font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </UButton>
          <UButton
              v-if="isEditMode"
              color="primary"
              size="lg"
              @click="saveSkill"
              :disabled="isSaving"
              :loading="isSaving"
              class="flex-1 bg-primary cursor-pointer text-white hover:brightness-110 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'Updating...' : 'Update Skill' }}
          </UButton>
          <UButton
              v-else
              color="primary"
              size="lg"
              @click="saveMultipleSkills"
              :disabled="isSaving"
              :loading="isSaving"
              class="flex-1 cursor-pointer bg-primary text-white hover:brightness-110 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'Adding...' : `Add ${formDataList.filter(s => s.name.trim()).length} Skill(s)` }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
</style>

