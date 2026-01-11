<script setup lang="ts">
import {computed, ref} from 'vue'

definePageMeta({
  layout: 'dashboard'
})

interface Project {
  id: number
  name: string
  description?: string
  image: string
  status: boolean // true = Published, false = Draft
  features: string[] // Key features
  technologies?: number[] // Skill IDs, bukan names
  repo_url?: string // GitHub link
  live_url?: string // Live demo link
  start_date?: string
  end_date?: string
  created_at?: string
  updated_at?: string
}

interface Skill {
  id: number
  name: string
  icon: string
  color: string
}

const route = useRoute()
const router = useRouter()
const breadCrumbStore = useBreadCrumbStore()

const projectId = computed(() => parseInt(route.params.id as string))
const isEditMode = ref(false)
const isSaving = ref(false)

// Skills state
const allSkills = ref<Skill[]>([])
const isLoadingSkills = ref(true)

// Image upload state
const imagePreview = ref<string>('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const allProjects: Project[] = [
  {
    id: 1,
    name: 'SaaS Analytics Dashboard',
    description: 'A comprehensive analytics platform for SaaS businesses featuring real-time data visualization, custom reports, and predictive analytics. Built with modern tech stack to handle large datasets efficiently.',
    status: true,
    image: '/images/hero.png',
    features: ['Real-time Data Visualization', 'Custom Reports', 'Predictive Analytics', 'Multi-tenant Support'],
    technologies: [1, 2, 3, 4, 5],
    repo_url: 'https://github.com/example/saas-analytics',
    live_url: 'https://saas-analytics-demo.com',
    start_date: '2023-06-01',
    end_date: '2023-12-15',
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z'
  },
  {
    id: 2,
    name: 'FinTech Mobile App',
    description: 'Secure mobile banking application allowing users to transfer funds, pay bills, and manage investments with military-grade encryption. Features real-time notifications and multi-factor authentication.',
    status: false,
    image: '/images/hero.png',
    features: ['Fund Transfers', 'Bill Payments', 'Investment Management', 'Real-time Notifications', '2FA Security'],
    technologies: [6, 7, 8],
    repo_url: 'https://github.com/example/fintech-app',
    start_date: '2023-11-01',
    created_at: '2023-11-01T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  },
  {
    id: 3,
    name: 'Node.js API Gateway',
    description: 'High-performance microservices gateway handling authentication, rate limiting, and request routing. Supports WebSocket connections and real-time data streaming.',
    status: true,
    image: '/images/hero.png',
    features: ['JWT Authentication', 'Rate Limiting', 'Request Routing', 'WebSocket Support', 'Real-time Streaming'],
    technologies: [4, 9, 10, 5],
    repo_url: 'https://github.com/example/api-gateway',
    live_url: 'https://api-gateway-demo.com',
    start_date: '2023-03-01',
    end_date: '2023-09-30',
    created_at: '2023-03-01T00:00:00Z',
    updated_at: '2023-09-30T00:00:00Z'
  },
  {
    id: 4,
    name: 'Legacy CRM System',
    description: 'Internal customer relationship management tool built for a logistics company. Manages customer interactions, sales pipelines, and provides analytics on customer behavior.',
    status: false,
    image: '/images/hero.png',
    features: ['Customer Management', 'Sales Pipeline', 'Analytics Dashboard', 'Email Integration'],
    technologies: [2, 5, 9],
    repo_url: 'https://github.com/example/crm-system',
    start_date: '2022-01-01',
    end_date: '2023-06-30',
    created_at: '2022-01-01T00:00:00Z',
    updated_at: '2023-06-30T00:00:00Z'
  },
  {
    id: 5,
    name: 'E-Commerce Storefront',
    description: 'Modern e-commerce frontend with cart functionality, Stripe integration, and inventory management. Fully responsive design with excellent performance.',
    status: false,
    image: '/images/hero.png',
    features: ['Shopping Cart', 'Payment Integration', 'Inventory Management', 'Responsive Design', 'Product Search'],
    technologies: [1, 8, 2, 7],
    repo_url: 'https://github.com/example/ecommerce',
    start_date: '2023-10-01',
    created_at: '2023-10-01T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  },
  {
    id: 6,
    name: 'Auth System v2',
    description: 'A reusable authentication library with support for OAuth2, JWT, and session-based authentication. Includes password reset, email verification, and 2FA support.',
    status: true,
    image: '/images/hero.png',
    features: ['OAuth2 Support', 'JWT Authentication', 'Password Reset', 'Email Verification', '2FA Support'],
    technologies: [1, 4, 5, 9],
    repo_url: 'https://github.com/example/auth-system',
    live_url: 'https://auth-system-docs.com',
    start_date: '2023-07-01',
    end_date: '2024-01-10',
    created_at: '2023-07-01T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  }
]

const currentProject = ref<Project | null>(null)
const formData = ref<Project | null>(null)

// Fetch project on mount
onMounted(() => {
  const project = allProjects.find(p => p.id === projectId.value)
  if (project) {
    currentProject.value = project
    formData.value = {...project}
    breadCrumbStore.setBreadCrumb([
      {title: 'Projects'},
      {title: project.name}
    ])
  } else {
    navigateTo('/dashboard/projects')
  }

  // Fetch skills
  fetchSkills()
})

const fetchSkills = async () => {
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
}

const toggleEditMode = () => {
  if (isEditMode.value) {
    // Cancel edit
    formData.value = {...currentProject.value!}
    isEditMode.value = false
  } else {
    // Enter edit mode
    isEditMode.value = true
  }
}

const saveProject = async () => {
  if (!formData.value) return

  isSaving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update current project
    currentProject.value = {...formData.value}
    isEditMode.value = false

    // Show success toast (if available)
    console.log('Project updated successfully')
  } catch (error) {
    console.error('Failed to save project:', error)
  } finally {
    isSaving.value = false
  }
}

const deleteProject = async () => {
  if (!confirm('Are you sure you want to delete this project?')) return

  try {
    // Simulate API call
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000))

    // Redirect to projects list
    navigateTo('/dashboard/projects')
  } catch (error) {
    console.error('Failed to delete project:', error)
  }
}

const addFeature = () => {
  if (formData.value && !formData.value.features.includes('')) {
    formData.value.features.push('')
  }
}

const removeFeature = (index: number) => {
  if (formData.value) {
    formData.value.features.splice(index, 1)
  }
}

const addSkill = (skillId: number) => {
  if (skillId && formData.value && !formData.value?.technologies?.includes(skillId)) {
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
  const skill = allSkills.value.find(s => s.id === skillId)
  return skill?.name || 'Unknown'
}

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
      formData.value!.image = response.url
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
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
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
</script>

<template>
  <div class="p-8">
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
            @click="deleteProject"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600/20 text-red-400 font-semibold hover:bg-red-600/30 transition-all border border-red-600/40"
        >
          <Icon name="carbon:trash-can" size="20"/>
          Delete
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-if="currentProject && formData" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Image Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div v-if="!isEditMode" class="relative h-96 bg-white/5 overflow-hidden">
            <NuxtImg
                :src="currentProject.image"
                :alt="currentProject.name"
                class="w-full h-full object-cover"
            />
            <!-- Status Badge -->
            <div class="absolute top-6 right-6">
              <span
                  :class="['px-4 py-2 rounded-full text-sm font-semibold border', getStatusColor(currentProject.status)]">
                {{ getStatusText(currentProject.status) }}
              </span>
            </div>
          </div>

          <div v-else class="p-6 space-y-4">
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
                    v-if="imagePreview"
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
            <div v-if="imagePreview"
                 class="relative h-48 bg-white/10 rounded-lg overflow-hidden border border-white/20">
              <img
                  :src="imagePreview"
                  alt="Project preview"
                  class="w-full h-full object-cover"
              />
            </div>

            <!-- Current Image Display -->
            <div v-else-if="formData.image"
                 class="relative h-48 bg-white/10 rounded-lg overflow-hidden border border-white/20">
              <NuxtImg
                  :src="formData.image"
                  :alt="formData.name"
                  class="w-full h-full object-cover"
              />
              <p class="text-xs text-white/60 mt-2">Current image (upload new to replace)</p>
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div v-if="!isEditMode">
            <h3 class="text-lg font-bold text-white mb-4">About This Project</h3>
            <p class="text-white/70 leading-relaxed">{{ currentProject.description }}</p>
          </div>
          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-white mb-2">Project Name *</label>
              <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-white mb-2">Description *</label>
              <textarea
                  v-model="formData.description"
                  rows="6"
                  class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all resize-none"
                  placeholder="Write a detailed description of your project..."
              ></textarea>
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

          <div v-if="!isEditMode" class="space-y-2">
            <div
                v-for="skillId in currentProject.technologies"
                :key="skillId"
                class="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20"
            >
              <Icon
                  :name="allSkills.find(s => s.id === skillId)?.icon || 'carbon:code'"
                  size="16"
                  class="text-primary"
              />
              <span class="text-sm font-medium text-white">{{ getSkillName(skillId) }}</span>
            </div>
            <div v-if="!currentProject.technologies || currentProject.technologies.length === 0"
                 class="text-center py-4">
              <p class="text-sm text-white/50">No technologies selected</p>
            </div>
          </div>

          <!-- Skills Dropdown for Edit Mode -->
          <div v-else class="space-y-4">
            <div>
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
              <p class="text-xs text-white/60 mb-2">Selected Technologies:</p>
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

          <div v-if="!isEditMode" class="space-y-2">
            <div
                v-for="(feature, idx) in currentProject.features"
                :key="idx"
                class="flex items-start gap-3 p-2.5 rounded-lg bg-white/5 border border-white/10"
            >
              <Icon name="carbon:checkmark" size="16" class="text-green-400 mt-1 shrink-0"/>
              <p class="text-sm text-white/80">{{ feature }}</p>
            </div>
          </div>

          <div v-else class="space-y-2">
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
                  @click="removeFeature(index - 1)"
                  class="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all"
                  type="button"
              >
                <Icon name="carbon:trash-can" size="16"/>
              </button>
            </div>
          </div>
        </div>
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 class="text-lg font-bold text-white mb-4">Links</h3>

          <div v-if="!isEditMode" class="space-y-3">
            <a
                v-if="currentProject.repo_url"
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
                v-if="currentProject.live_url"
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

          <div v-else class="space-y-3">
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
        </div>

        <!-- Timeline Section -->
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 class="text-lg font-bold text-white mb-4">Timeline</h3>

          <div v-if="!isEditMode" class="space-y-3">
            <div>
              <p class="text-xs text-white/50 mb-1">Start Date</p>
              <p class="text-sm font-semibold text-white">
                {{ currentProject.start_date ? new Date(currentProject.start_date).toLocaleDateString() : 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-xs text-white/50 mb-1">End Date</p>
              <p class="text-sm font-semibold text-white">
                {{ currentProject.end_date ? new Date(currentProject.end_date).toLocaleDateString() : 'Ongoing' }}
              </p>
            </div>
          </div>

          <div v-else class="space-y-3">
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
  </div>
</template>

<style scoped>
</style>

