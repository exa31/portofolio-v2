<script setup lang="ts">
import {computed, ref} from 'vue'

definePageMeta({
  layout: 'dashboard'
})

interface Skill {
  id: number
  name: string
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Tools' | 'Other'
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  icon: string
  color: string
  yearsOfExperience: number
}

const skills = ref<Skill[]>([
  {
    id: 1,
    name: 'React',
    category: 'Frontend',
    proficiency: 'Expert',
    icon: 'mdi:react',
    color: 'blue',
    yearsOfExperience: 5
  },
  {
    id: 2,
    name: 'Vue.js',
    category: 'Frontend',
    proficiency: 'Advanced',
    icon: 'mdi:vuejs',
    color: 'green',
    yearsOfExperience: 4
  },
  {
    id: 3,
    name: 'TypeScript',
    category: 'Frontend',
    proficiency: 'Expert',
    icon: 'mdi:language-typescript',
    color: 'blue',
    yearsOfExperience: 3
  },
  {
    id: 4,
    name: 'Node.js',
    category: 'Backend',
    proficiency: 'Advanced',
    icon: 'mdi:nodejs',
    color: 'green',
    yearsOfExperience: 4
  },
  {
    id: 5,
    name: 'Tailwind CSS',
    category: 'Frontend',
    proficiency: 'Expert',
    icon: 'mdi:tailwind',
    color: 'cyan',
    yearsOfExperience: 3
  }
])

const searchQuery = ref('')
const selectedCategory = ref('All')
const showModal = ref(false)
const isEditMode = ref(false)
const formData = ref<Skill>({
  id: 0,
  name: '',
  category: 'Frontend',
  proficiency: 'Intermediate',
  icon: 'mdi:code',
  color: 'blue',
  yearsOfExperience: 1
})

const filteredSkills = computed(() => {
  return skills.value.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All' || skill.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const categoryColors: Record<string, string> = {
  'Frontend': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Backend': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'DevOps': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  'Tools': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  'Other': 'bg-gray-500/10 text-gray-400 border-gray-500/30'
}

const proficiencyColors: Record<string, string> = {
  'Beginner': 'bg-gray-500/20 text-gray-400 border-gray-500/40',
  'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  'Advanced': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  'Expert': 'bg-green-500/20 text-green-400 border-green-500/40'
}

const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Tools', 'Other']

const openCreateModal = () => {
  isEditMode.value = false
  formData.value = {
    id: 0,
    name: '',
    category: 'Frontend',
    proficiency: 'Intermediate',
    icon: 'mdi:code',
    color: 'blue',
    yearsOfExperience: 1
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
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <!-- Category Filter -->
        <div class="relative">
          <select
              v-model="selectedCategory"
              class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat === 'All' ? 'Category: All' : cat }}
            </option>
          </select>
          <Icon name="carbon:chevron-down" size="16"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none"/>
        </div>
      </div>

      <!-- Count -->
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <p class="text-sm text-white/60">{{ filteredSkills.length }} skills found</p>
      </div>
    </div>

    <!-- Skills Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="skill in filteredSkills"
          :key="skill.id"
          class="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 flex flex-col"
      >
        <!-- Icon & Name -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4 flex-1">
            <div
                class="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <Icon :name="skill.icon" size="24" class="text-white/80 group-hover:text-primary transition-colors"/>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-bold text-white group-hover:text-primary transition-colors">{{ skill.name }}</h3>
              <p class="text-sm text-white/50 mt-1">{{ skill.yearsOfExperience }} years experience</p>
            </div>
          </div>
        </div>

        <!-- Badges -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', categoryColors[skill.category]]">
            {{ skill.category }}
          </span>
          <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', proficiencyColors[skill.proficiency]]">
            {{ skill.proficiency }}
          </span>
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

    <!-- Empty State -->
    <div v-if="filteredSkills.length === 0" class="flex flex-col items-center justify-center py-20">
      <Icon name="carbon:skill-level" size="64" class="text-white/20 mb-6"/>
      <h3 class="text-xl font-bold text-white mb-2">No skills found</h3>
      <p class="text-white/60 text-center mb-6">Try adjusting your search or filter criteria</p>
      <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all">
        <Icon name="carbon:add" size="20"/>
        Add Your First Skill
      </button>
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

          <!-- Category -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Category *</label>
            <select
                v-model="formData.category"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="DevOps">DevOps</option>
              <option value="Tools">Tools</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Proficiency -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Proficiency Level *</label>
            <select
                v-model="formData.proficiency"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <!-- Years of Experience -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Years of Experience *</label>
            <input
                v-model.number="formData.yearsOfExperience"
                type="number"
                min="0"
                max="50"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- Icon -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Icon Name (MDI)</label>
            <input
                v-model="formData.icon"
                type="text"
                placeholder="e.g., mdi:react, mdi:nodejs"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- Color -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Color Theme</label>
            <select
                v-model="formData.color"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="cyan">Cyan</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
              <option value="pink">Pink</option>
            </select>
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

