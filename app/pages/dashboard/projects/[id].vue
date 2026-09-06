<script setup lang="ts">
import {computed, ref} from 'vue'
import type {Project, ProjectPreviewInput} from "~/types/project";
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

// Preview images state (Feature gallery)
const previewItems = ref<ProjectPreviewInput[]>([])
const previewFileInputRef = ref<HTMLInputElement | null>(null)

const triggerPreviewFileInput = () => {
  previewFileInputRef.value?.click()
}

const handlePreviewUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  const maxSize = 5 * 1024 * 1024

  Array.from(files).forEach((file) => {
    if (!file.type.startsWith('image/')) {
      toast.showErrorToast('Invalid File', `${file.name} is not an image file`)
      return
    }
    if (file.size > maxSize) {
      toast.showErrorToast('File Too Large', `${file.name} exceeds 5MB limit`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      previewItems.value.push({
        id: crypto.randomUUID(),
        file: file,
        previewUrl: e.target?.result as string,
        title: '',
        caption: ''
      })
    }
    reader.readAsDataURL(file)
  })

  target.value = ''
}

const removePreviewItem = (index: number) => {
  previewItems.value.splice(index, 1)
}

const initPreviewItems = (project: Project) => {
  if (project.preview_images && Array.isArray(project.preview_images)) {
    previewItems.value = project.preview_images.map((img) => ({
      id: crypto.randomUUID(),
      url: img.url,
      previewUrl: img.url,
      title: img.title || '',
      caption: img.caption || ''
    }))
  } else {
    previewItems.value = []
  }
}

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
    {title: 'Detail'}
  ]
})
const {data: projectData} = await useAsyncData(`project-${route.params.id}`, async () => {
  return await fetchProjectById(projectId.value)
})

const allSkills = computed(
    () => skillsData.value?.filter(
        (skill) => !formData.value?.id_skills?.includes(skill.id)
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

  if (!formData.value?.id_skills || formData.value.id_skills.length === 0) {
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
  if (skillId && !formData.value?.id_skills?.includes(skillId)) {
    if (!formData.value) return
    if (!formData.value.id_skills) {
      formData.value.id_skills = []
    }
    formData.value.id_skills.push(skillId)
  }
}

const removeSkill = (skillId: number) => {
  if (formData.value?.id_skills) {
    const index = formData.value.id_skills.indexOf(skillId)
    if (index > -1) {
      formData.value.id_skills.splice(index, 1)
    }
  }
}

const getSkillName = (skillId: number): string => {
  const skill = skillsData.value?.find(s => s.id === skillId)
  return skill?.name || 'Unknown'
}

const getSkillIcon = (skillId: number): string => {
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
    toast.showErrorToast('Error', 'Please select an image file')
    return
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    toast.showErrorToast('Error', 'File size must be less than 5MB')
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

const toggleEditMode = () => {
  if (isEditMode.value) {
    // Cancel edit
    formData.value = {...currentProject.value!}
    imagePreview.value = currentProject.value?.preview_image as string || ''
    initPreviewItems(currentProject.value!)
    errors.value = {}
    isEditMode.value = false
  } else {
    // Enter edit mode
    isEditMode.value = true
  }
}

const saveProject = async () => {
  if (!validateForm() || !formData.value) return toast.showErrorToast('Error', 'Please fix the errors in the form before saving.')

  formData.value.id = projectId.value
  const success = await updateProject(formData.value, previewItems.value)
  if (success) {
    const updated = await fetchProjectById(projectId.value)
    if (updated) {
      currentProject.value = {
        ...updated,
        start_date: parseDateForInput(updated.start_date),
        end_date: parseDateForInput(updated.end_date)
      }
      formData.value = {
        ...updated,
        start_date: parseDateForInput(updated.start_date),
        end_date: parseDateForInput(updated.end_date)
      }
      imagePreview.value = updated.preview_image as string || ''
      initPreviewItems(updated)
    }
    isEditMode.value = false
  }
}

const deleteProjectHandler = async () => {
  toast.showConfirmationToast(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      async () => {
        const success = await deleteProject(projectId.value)
        if (success) {
          router.push('/dashboard/projects')
        }
      },
  )
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
      currentProject.value = {
        ...projectData.value,
        start_date: parseDateForInput(projectData.value.start_date),
        end_date: parseDateForInput(projectData.value.end_date)
      }
      formData.value = {
        ...projectData.value,
        start_date: parseDateForInput(projectData.value.start_date),
        end_date: parseDateForInput(projectData.value.end_date)
      }
      imagePreview.value = projectData.value.preview_image as string || ''
      initPreviewItems(projectData.value)
    } else {
      navigateTo('/dashboard/projects')
    }
  })
}
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

          <!-- Feature Gallery & Screenshots Section -->
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-bold text-white">Feature Gallery & Screenshots</h3>
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    {{ isEditMode ? previewItems.length : (currentProject?.preview_images?.length || 0) }} {{ (isEditMode ? previewItems.length : (currentProject?.preview_images?.length || 0)) === 1 ? 'Preview' : 'Previews' }}
                  </span>
                </div>
                <p class="text-xs text-white/50 mt-0.5">Deep-dive feature screenshots displayed in the portfolio showcase modal.</p>
              </div>

              <!-- Add button in Edit Mode -->
              <div v-if="isEditMode">
                <button
                    @click="triggerPreviewFileInput"
                    type="button"
                    class="inline-flex cursor-pointer items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition-all"
                >
                  <Icon name="carbon:add-alt" size="16" class="text-blue-400"/>
                  Add Screenshots
                </button>
                <input
                    ref="previewFileInputRef"
                    type="file"
                    accept="image/*"
                    multiple
                    @change="handlePreviewUpload"
                    class="hidden"
                />
              </div>
            </div>

            <!-- View Mode -->
            <div v-if="!isEditMode">
              <div v-if="currentProject?.preview_images?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                    v-for="(img, idx) in currentProject.preview_images"
                    :key="idx"
                    class="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5"
                >
                  <div class="relative h-44 rounded-lg overflow-hidden border border-white/10 bg-slate-900">
                    <img
                        :src="img.url"
                        :alt="img.title || `Preview ${idx + 1}`"
                        class="w-full h-full object-cover"
                    />
                    <span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono text-white/80">
                      #{{ idx + 1 }}
                    </span>
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-white">{{ img.title || 'Untitled Screenshot' }}</h4>
                    <p v-if="img.caption" class="text-xs text-white/60 mt-0.5 leading-relaxed">{{ img.caption }}</p>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                <Icon name="carbon:images" size="32" class="text-white/20 mx-auto mb-2"/>
                <p class="text-sm text-white/50">No feature screenshots uploaded for this project yet.</p>
                <p class="text-xs text-white/30 mt-1">Click "Edit Project" above to upload feature screenshots.</p>
              </div>
            </div>

            <!-- Edit Mode -->
            <div v-else>
              <div
                  v-if="previewItems.length === 0"
                  @click="triggerPreviewFileInput"
                  class="border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-xl p-8 text-center cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03]"
              >
                <div class="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
                  <Icon name="carbon:images" size="20"/>
                </div>
                <p class="text-sm font-medium text-white/80">No feature screenshots added yet</p>
                <p class="text-xs text-white/40 mt-1">Click here to select images to showcase in the modal deep-dive viewer.</p>
              </div>

              <div v-else class="space-y-3">
                <div
                    v-for="(item, idx) in previewItems"
                    :key="item.id || idx"
                    class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
                >
                  <!-- Thumbnail Preview -->
                  <div class="relative w-full sm:w-36 h-24 rounded-lg overflow-hidden border border-white/10 bg-slate-900 shrink-0">
                    <img
                        :src="item.previewUrl"
                        :alt="item.title || `Screenshot ${idx + 1}`"
                        class="w-full h-full object-cover"
                    />
                    <span class="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white/80">
                      #{{ idx + 1 }}
                    </span>
                  </div>

                  <!-- Inputs: Title & Caption -->
                  <div class="flex-1 w-full space-y-2">
                    <div>
                      <input
                          v-model="item.title"
                          type="text"
                          placeholder="Screenshot Title (e.g. Analytics Dashboard, Mobile UI)"
                          class="w-full px-3 py-1.5 text-xs rounded-lg bg-white/10 border border-white/15 focus:border-blue-500/50 text-white placeholder:text-white/40 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <input
                          v-model="item.caption"
                          type="text"
                          placeholder="Brief caption/description of this feature..."
                          class="w-full px-3 py-1.5 text-xs rounded-lg bg-white/10 border border-white/15 focus:border-blue-500/50 text-white placeholder:text-white/40 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <!-- Delete Action -->
                  <button
                      @click="removePreviewItem(idx)"
                      type="button"
                      class="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all cursor-pointer shrink-0 self-end sm:self-center"
                      title="Remove screenshot"
                  >
                    <Icon name="carbon:trash-can" size="18"/>
                  </button>
                </div>
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

