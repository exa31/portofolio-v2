<script setup lang="ts">
import {ref} from 'vue'
import {useToastCustom} from "~/composables/useToastCustom";
import type {Project} from "~/types/project";
import {useProject} from "~/composables/useProject";

definePageMeta({
  layout: 'dashboard',
  breadCrumb: [
    {title: 'Projects', url: '/dashboard/projects'},
    {title: 'Create New Project'}
  ],
})


// Skill interface is inferred from API response

interface FormErrors {
  name?: string
  description?: string
  image?: string
  features?: string
  technologies?: string
  repo_url?: string
  live_url?: string

  [key: string]: string | undefined
}

const toast = useToastCustom()
const {
  fetchSkills,
} = useSkill()
const {isSaving, createProject} = useProject()

// Form state
const formData = ref<Project>({
  name: '',
  description: '',
  status: true,
  image: null,
  features: [''],
  technologies: [],
  repo_url: '',
  live_url: '',
  start_date: '',
  end_date: ''
})

const errors = ref<FormErrors>({})
const imagePreview = ref<string>('')
const fileInputRef = ref<HTMLInputElement | null>(null)

// Fetch initial skills on SSR/CSR
const {data} = await useAsyncData('skills', async () => {
  const res = await fetchSkills(false, '', false)
  return res.data
})

const allSkills = computed(
    () => data.value?.filter(
        (skill) => !formData.value.technologies?.includes(skill.id)
    ) || []
)

// Validation function for URLs
const isValidUrl = (url: string): boolean => {
  if (!url) return true // Empty URL is allowed (optional field)
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Validation function
const validateForm = (): boolean => {
  const newErrors: FormErrors = {}

  if (!formData.value.name?.trim()) {
    newErrors.name = 'Project name is required'
  }

  if (!formData.value.description?.trim()) {
    newErrors.description = 'Description is required'
  }

  if (!formData.value.image && !imagePreview.value) {
    newErrors.image = 'Please upload a project image'
  }

  const emptyFeatures = formData.value.features.filter(f => !f.trim())
  if (emptyFeatures.length > 0) {
    newErrors.features = `Please fill in all features or remove empty ones`
  }

  if (!formData.value.technologies || formData.value.technologies.length === 0) {
    newErrors.technologies = 'Please select at least one technology'
  }

  // Validate URLs if provided
  if (formData.value.repo_url && !isValidUrl(formData.value.repo_url)) {
    newErrors.repo_url = 'Please enter a valid GitHub URL'
  }

  if (formData.value.live_url && !isValidUrl(formData.value.live_url)) {
    newErrors.live_url = 'Please enter a valid live URL'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const clearError = (field: string) => {
  delete errors.value[field]
}

const addSkill = (skillId: number | null) => {
  if (skillId && !formData.value.technologies?.includes(skillId)) {
    if (!formData.value.technologies) {
      formData.value.technologies = []
    }
    formData.value.technologies.push(skillId)
  }
}

const removeSkill = (skillId: number) => {
  if (formData.value.technologies) {
    const index = formData.value.technologies.indexOf(skillId)
    if (index > -1) {
      formData.value.technologies.splice(index, 1)
    }
  }
}

const getSkillName = (skillId: number): string => {
  const skill = data.value?.find(s => s.id === skillId)
  return skill?.name || 'Unknown'
}

const getSkillIcon = (skillId: number): string => {
  const skill = data.value?.find(s => s.id === skillId)
  return skill?.icon || 'carbon:code'
}

const addFeature = () => {
  formData.value.features.push('')
  clearError('features')
}

const removeFeature = (index: number) => {
  formData.value.features.splice(index, 1)
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.showErrorToast('Error', 'Please upload a valid image file')
    return
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    toast.showErrorToast('Error', 'Image size should not exceed 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    formData.value.image = file
    imagePreview.value = e.target?.result as string
    clearError('image')
  }
  reader.onerror = () => {
    toast.showErrorToast('Error', 'Failed to read the image file')
  }
  reader.readAsDataURL(file)
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const saveProject = async () => {
  if (!validateForm()) {
    toast.showErrorToast('Error', 'Please fix the errors above')
    return
  }

  const success = await createProject(formData.value)
  if (success) navigateTo('/dashboard/projects')
}

const goBack = () => {
  navigateTo('/dashboard/projects')
}
</script>

<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-4xl font-black text-white mb-2">Create New Project</h1>
        <p class="text-white/60">Add a new project to your portfolio</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
            @click="goBack"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/20"
        >
          <Icon name="carbon:arrow-left" size="20"/>
          Back
        </button>

        <button
            @click="saveProject"
            :disabled="isSaving"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all disabled:opacity-50"
        >
          <Icon v-if="isSaving" name="carbon:loading" size="20" class="animate-spin"/>
          <Icon v-else name="carbon:save" size="20"/>
          {{ isSaving ? 'Creating...' : 'Create Project' }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Image Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4"
             :class="errors.image ? 'border-red-500/50' : ''">
          <div>
            <label class="block text-sm font-semibold text-white mb-2">
              Project Image
              <span class="text-red-400">*</span>
            </label>
            <div class="flex gap-3">
              <button
                  @click="triggerFileInput"
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all"
              >
                <Icon name="carbon:cloud-upload" size="20"/>
                Choose Image
              </button>
              <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
              />
              <span v-if="imagePreview" class="inline-flex items-center text-sm text-green-400">
                <Icon name="carbon:checkmark-filled" size="16" class="mr-1"/>
                Image selected
              </span>
              <span v-else class="inline-flex items-center text-sm text-white/60">
                <Icon name="carbon:close" size="16" class="mr-1"/>
                No image selected
              </span>
            </div>
            <!-- Error Message -->
            <div v-if="errors.image" class="mt-2 flex items-center gap-2 text-red-400 text-sm">
              <Icon name="carbon:warning-alt" size="16"/>
              {{ errors.image }}
            </div>
          </div>

          <!-- Image Preview -->
          <div v-if="imagePreview" class="relative h-96 bg-white/10 rounded-lg overflow-hidden border border-white/20">
            <img
                :src="imagePreview"
                alt="Project preview"
                class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Description Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4"
             :class="errors.name || errors.description ? 'border-red-500/50' : ''">
          <div>
            <label class="block text-sm font-semibold text-white mb-2">
              Project Name
              <span class="text-red-400">*</span>
            </label>
            <input
                v-model="formData.name"
                @input="clearError('name')"
                type="text"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border transition-all text-white placeholder:text-white/40 focus:outline-none"
                :class="errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-primary/50'"
                placeholder="e.g., SaaS Analytics Dashboard"
            />
            <!-- Error Message -->
            <div v-if="errors.name" class="mt-2 flex items-center gap-2 text-red-400 text-sm">
              <Icon name="carbon:warning-alt" size="16"/>
              {{ errors.name }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-white mb-2">
              Short Description
              <span class="text-red-400">*</span>
            </label>
            <input
                v-model="formData.description"
                @input="clearError('description')"
                type="text"
                placeholder="A brief description of your project..."
                class="w-full px-4 py-2 rounded-lg bg-white/10 border transition-all text-white placeholder:text-white/40 focus:outline-none"
                :class="errors.description ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-primary/50'"
            />
            <!-- Error Message -->
            <div v-if="errors.description" class="mt-2 flex items-center gap-2 text-red-400 text-sm">
              <Icon name="carbon:warning-alt" size="16"/>
              {{ errors.description }}
            </div>
          </div>
        </div>

        <!-- Status Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <label class="block text-sm font-semibold text-white mb-3">Status</label>
          <USelectMenu
              v-model="formData.status"
              :items="[
                { value: false, label: 'Draft' },
                { value: true, label: 'Published' }
              ]"
              option-attribute="label"
              value-key="value"
              placeholder="Select status..."
              class="w-full"
          />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Technologies/Skills Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white">Technologies Used</h3>
          </div>

          <!-- Skills Dropdown using Nuxt UI -->
          <div class="mb-4">
            <label class="block text-xs font-semibold text-white/80 mb-2">Select Skills</label>
            <USelectMenu
                :model-value="null"
                :items="allSkills"
                value-key="id"
                label-key="name"
                placeholder="Choose a skill..."
                @update:model-value="addSkill"
                class="w-full"
            />
          </div>

          <!-- Selected Skills -->
          <div v-if="formData.technologies && formData.technologies.length > 0" class="space-y-2">
            <p class="text-xs text-white/60 mb-3">Selected Technologies:</p>
            <div
                v-for="skillId in formData.technologies"
                :key="skillId"
                class="flex items-center justify-between p-3 rounded-lg bg-primary/20 border border-primary/30"
            >
              <div class="flex items-center gap-2 flex-1">
                <Icon
                    :name="getSkillIcon(skillId)"
                    size="18"
                    class="text-primary"
                />
                <span class="text-sm font-medium text-white">{{ getSkillName(skillId) }}</span>
              </div>
              <button
                  @click="removeSkill(skillId)"
                  class="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all"
                  type="button"
              >
                <Icon name="carbon:trash-can" size="16"/>
              </button>
            </div>
          </div>


          <div v-else class="text-center py-6">
            <p class="text-sm text-white/50">No skills selected yet</p>
          </div>
          <div v-if="errors.technologies" class="mt-3 flex items-center gap-2 text-red-400 text-sm">
            <Icon name="carbon:warning-alt" size="16"/>
            {{ errors.technologies }}
          </div>
        </div>

        <!-- Features Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
             :class="errors.features ? 'border-red-500/50' : ''">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white">Key Features</h3>
            <button
                @click="addFeature"
                class="p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-all"
                type="button"
            >
              <Icon name="carbon:add" size="16"/>
            </button>
          </div>

          <div class="space-y-2">
            <div
                v-for="index in formData.features.length"
                :key="index - 1"
                class="flex gap-2"
            >
              <input
                  v-model="formData.features[index - 1]"
                  @input="clearError('features')"
                  type="text"
                  placeholder="e.g., Real-time updates"
                  class="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all text-sm"
              />
              <button
                  v-if="formData.features.length > 1"
                  @click="removeFeature(index - 1)"
                  class="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all"
                  type="button"
              >
                <Icon name="carbon:trash-can" size="16"/>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errors.features" class="mt-3 flex items-center gap-2 text-red-400 text-sm">
            <Icon name="carbon:warning-alt" size="16"/>
            {{ errors.features }}
          </div>
        </div>

        <!-- Links Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-3">
          <h3 class="text-lg font-bold text-white mb-4">Links</h3>
          <div>
            <label class="block text-xs font-semibold text-white/80 mb-1.5">GitHub Link</label>
            <input
                v-model="formData.repo_url"
                @input="clearError('repo_url')"
                type="url"
                placeholder="https://github.com/..."
                class="w-full px-3 py-2 rounded-lg bg-white/10 border transition-all text-white placeholder:text-white/40 focus:outline-none text-sm"
                :class="errors.repo_url ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-primary/50'"
            />
            <div v-if="errors.repo_url" class="mt-2 flex items-center gap-2 text-red-400 text-sm">
              <Icon name="carbon:warning-alt" size="16"/>
              {{ errors.repo_url }}
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-white/80 mb-1.5">Live Link</label>
            <input
                v-model="formData.live_url"
                @input="clearError('live_url')"
                type="url"
                placeholder="https://example.com"
                class="w-full px-3 py-2 rounded-lg bg-white/10 border transition-all text-white placeholder:text-white/40 focus:outline-none text-sm"
                :class="errors.live_url ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-primary/50'"
            />
            <div v-if="errors.live_url" class="mt-2 flex items-center gap-2 text-red-400 text-sm">
              <Icon name="carbon:warning-alt" size="16"/>
              {{ errors.live_url }}
            </div>
          </div>
        </div>

        <!-- Timeline Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-3">
          <h3 class="text-lg font-bold text-white mb-4">Timeline</h3>
          <div>
            <label class="block text-xs font-semibold text-white/80 mb-1.5">Start Date</label>
            <input
                v-model="formData.start_date"
                type="date"
                class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50 transition-all text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-white/80 mb-1.5">End Date</label>
            <input
                v-model="formData.end_date"
                type="date"
                class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50 transition-all text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

