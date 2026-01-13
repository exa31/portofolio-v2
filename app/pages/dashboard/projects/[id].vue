<script setup lang="ts">
import {computed, ref} from 'vue'
import type {Project} from "~/types/project";
import {useToastCustom} from "~/composables/useToastCustom";
import {useProject} from "~/composables/useProject";
import {useSkill} from "~/composables/useSkill";
import {formatDate, parseDateForInput} from "~/utils";


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

const route = useRoute()
const router = useRouter()
const breadCrumbStore = useBreadCrumbStore()
const toast = useToastCustom()
const {fetchSkills} = useSkill()
const {isSaving, fetchProjectById, updateProject, deleteProject} = useProject()

const projectId = computed(() => parseInt(route.params.id as string))
const isEditMode = ref(false)

// Form state
const formData = ref<Project | null>(null)
const currentProject = ref<Project | null>(null)
const errors = ref<FormErrors>({})
const imagePreview = ref<string>('')
const fileInputRef = ref<HTMLInputElement | null>(null)

// Fetch initial skills on SSR/CSR
const {data: skillsData} = await useAsyncData('edit-skills', async () => {
  const res = await fetchSkills(false, '', false)
  return res.data
})

// Fetch project data on SSR/CSR
definePageMeta({
  layout: 'dashboard',
  breadCrumb: [
    {title: 'Projects', link: '/dashboard/projects'},
    {title: 'loading...'}
  ]
})
const {data: projectData} = await useAsyncData(`project-${route.params.id}`, async () => {
  return await fetchProjectById(projectId.value)
})

const allSkills = computed(
    () => skillsData.value?.filter(
        (skill) => !formData.value?.technologies?.includes(skill.id)
    ) || []
)

// Validation functions
const isValidUrl = (url: string): boolean => {
  if (!url) return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const validateForm = (): boolean => {
  const newErrors: FormErrors = {}

  if (!formData.value?.name?.trim()) {
    newErrors.name = 'Project name is required'
  }

  if (!formData.value?.description?.trim()) {
    newErrors.description = 'Description is required'
  }

  if (!formData.value?.image && !imagePreview.value) {
    newErrors.image = 'Please upload a project image'
  }

  const emptyFeatures = formData.value?.features.filter(f => !f.trim()) || []
  if (emptyFeatures.length > 0) {
    newErrors.features = 'Please fill in all features or remove empty ones'
  }

  if (!formData.value?.technologies || formData.value.technologies.length === 0) {
    newErrors.technologies = 'Please select at least one technology'
  }

  if (formData.value?.repo_url && !isValidUrl(formData.value.repo_url)) {
    newErrors.repo_url = 'Please enter a valid GitHub URL'
  }

  if (formData.value?.live_url && !isValidUrl(formData.value.live_url)) {
    newErrors.live_url = 'Please enter a valid live URL'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const clearError = (field: string) => {
  delete errors.value[field]
}

const addSkill = (skillId: number | null) => {
  if (skillId && !formData.value?.technologies?.includes(skillId)) {
    if (!formData.value) return
    if (!formData.value.technologies) {
      formData.value.technologies = []
    }
    formData.value.technologies.push(skillId)
  }
}

const removeSkill = (skillId: number) => {
  if (formData.value?.technologies) {
    const index = formData.value.technologies.indexOf(skillId)
    if (index > -1) {
      formData.value.technologies.splice(index, 1)
    }
  }
}

const getSkillName = (skillId: number): string => {
  const skill = skillsData.value?.find(s => s.id === skillId)
  return skill?.name || 'Unknown'
}

const getSkillIcon = (skillId: number): string => {
  console.log('Getting icon for skill ID:', skillId, skillsData.value)
  const skill = skillsData.value?.find(s => s.id === skillId)
  return skill?.icon || 'carbon:code'
}

const addFeature = () => {
  if (formData.value) {
    formData.value.features.push('')
    clearError('features')
  }
}

const removeFeature = (index: number) => {
  if (formData.value) {
    formData.value.features.splice(index, 1)
  }
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.showErrorToast('Error', 'Please select an image file',)
    return
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    toast.showErrorToast('Error', 'File size must be less than 5MB',)
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  if (formData.value) {
    formData.value.image = file as any
  }

  clearError('image')
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const clearImage = () => {
  imagePreview.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  if (formData.value) {
    formData.value.image = null
  }
}

const toggleEditMode = () => {
  if (isEditMode.value) {
    // Cancel edit
    formData.value = {...currentProject.value!}
    imagePreview.value = currentProject.value?.preview_image as string || ''
    errors.value = {}
    isEditMode.value = false
  } else {
    // Enter edit mode
    isEditMode.value = true
  }
}

const saveProject = async () => {
  if (!validateForm() || !formData.value) return

  const loadingToast = toast.showLoadingToast("Updating Project", "Please wait...")
  try {
    const success = await updateProject(formData.value)

    if (success) {
      currentProject.value = formData.value
      isEditMode.value = false
      imagePreview.value = ''
      toast.updateToast(loadingToast.id, "Success", "Project updated successfully!", "success", 4000)
    }
  } catch (error) {
    console.error('Failed to save project', error)
    const errorMessage = getErrorMessageAxios(error)
    toast.updateToast(loadingToast.id, "Error", `Failed to update: ${errorMessage}`, "error", 6000)
  }
}

const deleteProjectHandler = async () => {
  if (!confirm('Are you sure you want to delete this project?')) return

  const loadingToast = toast.showLoadingToast("Deleting", "Please wait...")
  try {
    const success = await deleteProject(projectId.value)

    if (success) {
      toast.updateToast(loadingToast.id, "Success", "Project deleted successfully!", "success", 4000)
      await router.push('/dashboard/projects')
    }
  } catch (error) {
    console.error('Failed to delete project', error)
    const errorMessage = getErrorMessageAxios(error)
    toast.updateToast(loadingToast.id, "Error", `Failed to delete: ${errorMessage}`, "error", 6000)
  }
}

const getStatusColor = (status: boolean) => {
  return status
      ? 'bg-green-500/20 text-green-400 border-green-500/40'
      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
}

const getStatusText = (status: boolean) => {
  return status ? 'Published' : 'Draft'
}

// Initialize on mount (client-side only)
if (import.meta.client) {
  onMounted(() => {
    if (projectData.value) {
      currentProject.value = projectData.value
      formData.value = {
        ...projectData.value,
        start_date: parseDateForInput(projectData.value.start_date),
        end_date: parseDateForInput(projectData.value.end_date)
      }
      imagePreview.value = projectData.value.preview_image as string || ''
    } else {
      navigateTo('/dashboard/projects')
    }
  })
}

// Handle SSR - set initial data
watch(() => projectData.value, (newVal) => {
  if (newVal && !currentProject.value) {
    currentProject.value = newVal
    formData.value = {
      ...newVal,
      start_date: parseDateForInput(newVal.start_date),
      end_date: parseDateForInput(newVal.end_date)
    }
    breadCrumbStore.setBreadCrumb([
      {title: 'Projects', link: '/dashboard/projects'},
      {title: newVal.name}
    ])
  }
}, {immediate: true})
</script>

<template>
  <div class="p-8">
    <!-- Loading State -->
    <div v-if="!currentProject" class="flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p class="text-white/60 text-sm">Loading project...</p>
    </div>

    <!-- Content -->
    <div v-else class="w-full">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 v-if="!isEditMode" class="text-4xl font-black text-white mb-2">{{ currentProject?.name }}</h1>
          <p v-if="!isEditMode" class="text-white/60">View and manage project details</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
              v-if="!isEditMode"
              @click="toggleEditMode"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all"
          >
            <Icon name="carbon:pen" size="20"/>
            Edit Project
          </button>

          <button
              v-if="isEditMode"
              @click="toggleEditMode"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/20"
          >
            <Icon name="carbon:close" size="20"/>
            Cancel
          </button>

          <button
              v-if="isEditMode"
              @click="saveProject"
              :disabled="isSaving"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
          >
            <Icon name="carbon:save" size="20"/>
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>

          <button
              v-if="!isEditMode"
              @click="deleteProjectHandler"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600/20 text-red-400 font-semibold hover:bg-red-600/30 transition-all border border-red-600/40"
          >
            <Icon name="carbon:trash-can" size="20"/>
            Delete
          </button>
        </div>
      </div>

      <!-- Content Grid -->
      <div v-if="currentProject && formData" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image Section -->
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div v-if="!isEditMode" class="relative h-96 bg-white/5 overflow-hidden">
              <NuxtImg
                  :src="imagePreview"
                  :alt="currentProject?.name"
                  class="w-full h-full object-cover"
              />
              <!-- Status Badge -->
              <div class="absolute top-6 right-6">
                <span
                    :class="['px-4 py-2 rounded-full text-sm font-semibold border', getStatusColor(currentProject?.status)]">
                  {{ getStatusText(currentProject?.status) }}
                </span>
              </div>
            </div>

            <div v-else class="p-6 space-y-4">
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
                    No new image selected
                  </span>
                </div>
                <!-- Error Message -->
                <div v-if="errors.image" class="mt-2 flex items-center gap-2 text-red-400 text-sm">
                  <Icon name="carbon:warning-alt" size="16"/>
                  {{ errors.image }}
                </div>
              </div>

              <!-- Image Preview -->
              <div v-if="imagePreview"
                   class="relative h-96 bg-white/10 rounded-lg overflow-hidden border border-white/20">
                <img
                    :src="imagePreview"
                    alt="Project preview"
                    class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div v-if="!isEditMode">
              <h3 class="text-lg font-bold text-white mb-4">About This Project</h3>
              <p class="text-white/70 leading-relaxed">{{ currentProject?.description }}</p>
            </div>
            <div v-else class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-white mb-2">Project Name *</label>
                <input
                    v-model="formData.name"
                    @input="clearError('name')"
                    type="text"
                    class="w-full px-4 py-2 rounded-lg bg-white/10 border transition-all text-white placeholder:text-white/40 focus:outline-none text-sm"
                    :class="errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-primary/50'"
                />
                <div v-if="errors.name" class="mt-2 flex items-center gap-2 text-red-400 text-sm">
                  <Icon name="carbon:warning-alt" size="16"/>
                  {{ errors.name }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-white mb-2">Description *</label>
                <textarea
                    v-model="formData.description"
                    @input="clearError('description')"
                    rows="6"
                    class="w-full px-4 py-2 rounded-lg bg-white/10 border transition-all text-white placeholder:text-white/40 focus:outline-none resize-none text-sm"
                    :class="errors.description ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-primary/50'"
                    placeholder="Write a detailed description of your project..."
                ></textarea>
                <div v-if="errors.description" class="mt-2 flex items-center gap-2 text-red-400 text-sm">
                  <Icon name="carbon:warning-alt" size="16"/>
                  {{ errors.description }}
                </div>
              </div>
            </div>
          </div>

          <!-- Status Section -->
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div v-if="!isEditMode">
              <h3 class="text-lg font-bold text-white mb-4">Status</h3>
              <span
                  :class="['px-4 py-2 rounded-full text-sm font-semibold border inline-block', getStatusColor(currentProject.status)]">
              {{ getStatusText(currentProject.status) }}
            </span>
            </div>
            <div v-else>
              <label class="block text-sm font-semibold text-white mb-2">Status</label>
              <select
                  v-model="formData.status"
                  class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50 transition-all"
              >
                <option :value="false">Draft</option>
                <option :value="true">Published</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Technologies/Skills Section -->
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-white">Technologies Used</h3>
            </div>

            <!-- Skills Dropdown for Edit Mode -->
            <div v-if="isEditMode" class="mb-4">
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

            <!-- Display Mode -->
            <div v-if="!isEditMode" class="space-y-2">
              <div
                  v-for="skillId in currentProject?.id_skills"
                  :key="skillId"
                  class="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20"
              >
                <Icon
                    :name="getSkillIcon(skillId)"
                    size="16"
                    class="text-primary"
                />
                <span class="text-sm font-medium text-white">{{ getSkillName(skillId) }}</span>
              </div>
              <div v-if="!currentProject?.technologies || currentProject.technologies.length === 0"
                   class="text-center py-4">
                <p class="text-sm text-white/50">No technologies selected</p>
              </div>
            </div>

            <!-- Selected Skills for Edit Mode -->
            <div v-if="isEditMode && formData?.id_skills && formData.id_skills.length > 0" class="space-y-2">
              <p class="text-xs text-white/60 mb-3">Selected Technologies:</p>
              <div
                  v-for="skillId in formData.id_skills"
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

            <div v-if="isEditMode && (!formData?.technologies || formData.technologies.length === 0)"
                 class="text-center py-6">
              <p class="text-sm text-white/50">No skills selected yet</p>
            </div>
            <div v-if="errors.technologies" class="mt-3 flex items-center gap-2 text-red-400 text-sm">
              <Icon name="carbon:warning-alt" size="16"/>
              {{ errors.technologies }}
            </div>
          </div>

          <!-- Features Section -->
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-white">Key Features</h3>
              <button
                  v-if="isEditMode"
                  @click="addFeature"
                  class="p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-all"
                  type="button"
              >
                <Icon name="carbon:add" size="16"/>
              </button>
            </div>

            <!-- Display Mode -->
            <div v-if="!isEditMode" class="space-y-2">
              <div
                  v-for="(feature, idx) in currentProject?.features"
                  :key="idx"
                  class="flex items-start gap-3 p-2.5 rounded-lg bg-white/5 border border-white/10"
              >
                <Icon name="carbon:checkmark" size="16" class="text-green-400 mt-1 shrink-0"/>
                <p class="text-sm text-white/80">{{ feature }}</p>
              </div>
            </div>

            <!-- Edit Mode -->
            <div v-else class="space-y-2">
              <div
                  v-for="index in formData?.features.length"
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
                    v-if="formData && formData.features.length > 1"
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
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-3">
            <h3 class="text-lg font-bold text-white mb-4">Links</h3>

            <!-- Display Mode -->
            <div v-if="!isEditMode" class="space-y-3">
              <a
                  v-if="currentProject?.repo_url"
                  :href="currentProject.repo_url"
                  target="_blank"
                  class="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-primary/15 border border-white/10 hover:border-primary/30 transition-all"
              >
                <Icon name="mdi:github" size="20" class="text-white/70"/>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-white">GitHub Repository</p>
                  <p class="text-xs text-white/50 truncate">{{ currentProject.repo_url }}</p>
                </div>
                <Icon name="carbon:arrow-up-right" size="16" class="text-white/50"/>
              </a>

              <a
                  v-if="currentProject?.live_url"
                  :href="currentProject.live_url"
                  target="_blank"
                  class="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-primary/15 border border-white/10 hover:border-primary/30 transition-all"
              >
                <Icon name="carbon:launch" size="20" class="text-white/70"/>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-white">Live Demo</p>
                  <p class="text-xs text-white/50 truncate">{{ currentProject.live_url }}</p>
                </div>
                <Icon name="carbon:arrow-up-right" size="16" class="text-white/50"/>
              </a>
            </div>

            <!-- Edit Mode -->
            <div v-else class="space-y-3">
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
          </div>

          <!-- Timeline Section -->
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 class="text-lg font-bold text-white mb-4">Timeline</h3>

            <div v-if="!isEditMode" class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="shrink-0">
                  <Icon name="carbon:calendar" size="24" class="text-primary"/>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-white/50 mb-1">Start Date</p>
                  <p class="text-base font-semibold text-white">
                    {{ currentProject?.start_date ? formatDate(currentProject.start_date) : 'Not set' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="shrink-0">
                  <Icon name="carbon:calendar" size="24" class="text-primary"/>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-white/50 mb-1">End Date</p>
                  <p class="text-base font-semibold text-white">
                    {{ currentProject?.end_date ? formatDate(currentProject.end_date) : 'Ongoing' }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-white/80 mb-1.5">Start Date</label>
                <UInput
                    v-model="formData.start_date"
                    type="date"
                    class="w-full"
                    placeholder="Select start date"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-white/80 mb-1.5">End Date</label>
                <UInput
                    v-model="formData.end_date"
                    type="date"
                    class="w-full"
                    placeholder="Select end date"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
</style>

