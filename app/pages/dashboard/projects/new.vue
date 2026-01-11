<script setup lang="ts">
import {ref} from 'vue'

definePageMeta({
  layout: 'dashboard'
})

interface Project {
  id?: number
  name: string
  description?: string
  image: string
  status: boolean // true = Published, false = Draft
  features: string[]
  technologies?: number[] // Skill IDs, bukan names
  repo_url?: string
  live_url?: string
  start_date?: string
  end_date?: string
}

interface Skill {
  id: number
  name: string
  icon: string
  color: string
}

const router = useRouter()
const breadCrumbStore = useBreadCrumbStore()
const isSaving = ref(false)

// Skills state
const allSkills = ref<Skill[]>([])
const isLoadingSkills = ref(true)

const formData = ref<Project>({
  name: '',
  description: '',
  status: false,
  image: '',
  features: [''],
  technologies: [],
  repo_url: '',
  live_url: '',
  start_date: '',
  end_date: ''
})

const addSkill = (skillId: number) => {
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
  const skill = allSkills.value.find(s => s.id === skillId)
  return skill?.name || 'Unknown'
}

const addFeature = () => {
  if (!formData.value.features.includes('')) {
    formData.value.features.push('')
  }
}

const removeFeature = (index: number) => {
  formData.value.features.splice(index, 1)
}

const imagePreview = ref<string>('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    alert('File size must be less than 5MB')
    return
  }

  try {
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)

    // Upload to server
    const formDataToUpload = new FormData()
    formDataToUpload.append('file', file)

    // Upload and get URL from API
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formDataToUpload
    }) as any

    if (response?.url) {
      formData.value.image = response.url
    }

    console.log('File uploaded:', file.name)
  } catch (error) {
    console.error('Error uploading image:', error)
    alert('Failed to upload image')
  }
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const clearImage = () => {
  imagePreview.value = ''
  formData.value.image = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const saveProject = async () => {
  // Use imagePreview if file was uploaded, otherwise use URL input
  if (imagePreview.value && !formData.value.image) {
    formData.value.image = imagePreview.value
  }

  if (!formData.value.name || !formData.value.description || !formData.value.image) {
    alert('Please fill in all required fields and upload an image')
    return
  }

  isSaving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In real app, you would save to API
    console.log('Project created:', formData.value)

    // Redirect back to projects list
    navigateTo('/dashboard/projects')
  } catch (error) {
    console.error('Failed to create project:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  navigateTo('/dashboard/projects')
}

// Fetch skills on mounted
onMounted(async () => {
  try {
    const response = await $fetch('/api/skills', {
      method: 'GET'
    }) as any

    if (response?.data) {
      allSkills.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error fetching skills:', error)
    allSkills.value = []
  } finally {
    isLoadingSkills.value = false
  }
})

breadCrumbStore.setBreadCrumb([
  {title: 'Projects'},
  {title: 'Create New Project'}
])
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
          <Icon name="carbon:save" size="20"/>
          {{ isSaving ? 'Creating...' : 'Create Project' }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Image Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Project Image *</label>
            <div class="flex gap-3">
              <button
                  @click="triggerFileInput"
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all"
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
                <Icon name="carbon:checkmark" size="16" class="mr-1"/>
                Image selected
              </span>
              <button
                  v-if="imagePreview || formData.image"
                  @click="clearImage"
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 font-semibold hover:bg-red-600/30 transition-all border border-red-600/40"
              >
                <Icon name="carbon:trash-can" size="16"/>
                Clear
              </button>
            </div>
          </div>

          <!-- Image Preview -->
          <div v-if="imagePreview" class="relative h-48 bg-white/10 rounded-lg overflow-hidden border border-white/20">
            <img
                :src="imagePreview"
                alt="Project preview"
                class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Description Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Project Name *</label>
            <input
                v-model="formData.name"
                type="text"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                placeholder="e.g., SaaS Analytics Dashboard"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Short Description *</label>
            <input
                v-model="formData.description"
                type="text"
                placeholder="A brief description of your project..."
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <!-- Status Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <label class="block text-sm font-semibold text-white mb-2">Status</label>
          <select
              v-model="formData.status"
              @change="(e) => formData.status = (e.target as HTMLSelectElement).value === 'true'"
              class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50 transition-all"
          >
            <option :value="false">Draft</option>
            <option :value="true">Published</option>
          </select>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Technologies/Skills Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white">Technologies Used</h3>
          </div>

          <!-- Skills Dropdown -->
          <div v-if="!isLoadingSkills" class="mb-4">
            <label class="block text-xs font-semibold text-white/80 mb-2">Select Skills</label>
            <select
                @change="(e) => addSkill(parseInt((e.target as HTMLSelectElement).value))"
                :value="''"
                class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50 transition-all text-sm"
            >
              <option value="">Choose a skill...</option>
              <option
                  v-for="skill in allSkills.filter(s => !formData.technologies?.includes(s.id))"
                  :key="skill.id"
                  :value="skill.id"
              >
                {{ skill.name }}
              </option>
            </select>
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
                    :name="allSkills.find(s => s.id === skillId)?.icon || 'carbon:code'"
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
        </div>

        <!-- Features Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
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
        </div>

        <!-- Links Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-3">
          <h3 class="text-lg font-bold text-white mb-4">Links</h3>
          <div>
            <label class="block text-xs font-semibold text-white/80 mb-1.5">GitHub Link</label>
            <input
                v-model="formData.repo_url"
                type="url"
                placeholder="https://github.com/..."
                class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-white/80 mb-1.5">Live Link</label>
            <input
                v-model="formData.live_url"
                type="url"
                placeholder="https://example.com"
                class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all text-sm"
            />
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

