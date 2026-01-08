<script setup lang="ts">
import {ref} from 'vue'

definePageMeta({
  layout: 'dashboard'
})

const profileForm = ref({
  name: 'Alex Morgan',
  email: 'alex@example.com',
  location: 'San Francisco, CA',
  openToWork: true
})

const socialLinksForm = ref([
  {platform: 'GitHub', url: 'https://github.com/exa31', icon: 'carbon:logo-github'},
  {platform: 'LinkedIn', url: 'https://linkedin.com/in/eka-nazhifan', icon: 'carbon:logo-linkedin'},
  {platform: 'Twitter', url: 'https://twitter.com', icon: 'carbon:logo-twitter'},
  {platform: 'Email', url: 'mailto:ekaaa.jobs@gmail.com', icon: 'carbon:email'}
])

const settingsForm = ref({
  emailNotifications: true,
  messageNotifications: true,
  marketingEmails: false,
  publicProfile: true,
  showAnalytics: true
})

const isSaving = ref(false)
const saveMessage = ref('')

const saveProfile = async () => {
  isSaving.value = true
  saveMessage.value = ''

  // Simulate API call
  setTimeout(() => {
    isSaving.value = false
    saveMessage.value = 'Profile updated successfully!'
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  }, 1000)
}

const removeSocialLink = (index: number) => {
  socialLinksForm.value.splice(index, 1)
}

const saveSocialLinks = async () => {
  isSaving.value = true
  saveMessage.value = ''

  // Simulate API call
  setTimeout(() => {
    isSaving.value = false
    saveMessage.value = 'Social links updated successfully!'
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  }, 1000)
}

const saveSettings = async () => {
  isSaving.value = true
  saveMessage.value = ''

  // Simulate API call
  setTimeout(() => {
    isSaving.value = false
    saveMessage.value = 'Settings updated successfully!'
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  }, 1000)
}
</script>

<template>
  <div class="p-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-black text-white mb-2">Settings</h1>
      <p class="text-white/60">Manage your profile, and social links.</p>
    </div>

    <!-- Success Message -->
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="saveMessage"
           class="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 flex items-center gap-2">
        <Icon name="carbon:checkmark-filled" size="20"/>
        {{ saveMessage }}
      </div>
    </Transition>

    <!-- Settings Sections -->
    <div class="space-y-8">
      <!-- Profile Settings -->
      <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 class="text-2xl font-bold text-white flex items-center gap-3">
            <Icon name="carbon:user" size="24" class="text-primary"/>
            Profile Settings
          </h2>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Full Name</label>
            <input
                v-model="profileForm.name"
                type="text"
                class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Email Address</label>
            <input
                v-model="profileForm.email"
                type="email"
                class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Location</label>
            <input
                v-model="profileForm.location"
                type="text"
                placeholder="e.g. San Francisco, CA"
                class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- Open to Work -->
          <div class="flex items-center gap-3">
            <input
                v-model="profileForm.openToWork"
                type="checkbox"
                id="openToWork"
                class="w-5 h-5"
            />
            <label for="openToWork" class="text-sm text-white font-medium">Open to Work Opportunities</label>
          </div>

          <!-- Save Button -->
          <button
              @click="saveProfile"
              :disabled="isSaving"
              class="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Icon name="carbon:save" size="20"/>
            {{ isSaving ? 'Saving...' : 'Save Profile' }}
          </button>
        </div>
      </div>

      <!-- Social Links -->
      <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 class="text-2xl font-bold text-white flex items-center gap-3">
            <Icon name="carbon:share" size="24" class="text-primary"/>
            Social Links
          </h2>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4">
          <div v-for="(link, index) in socialLinksForm" :key="index" class="flex gap-4">
            <!-- Platform -->
            <div class="flex-1">
              <input
                  v-model="link.platform"
                  type="text"
                  placeholder="e.g. LinkedIn, GitHub"
                  class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
              />
            </div>

            <!-- URL -->
            <div class="flex-1">
              <input
                  v-model="link.url"
                  type="url"
                  placeholder="https://..."
                  class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
              />
            </div>

            <!-- Delete Button -->
            <button
                @click="removeSocialLink(index)"
                class="px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
            >
              <Icon name="carbon:trash-can" size="20"/>
            </button>
          </div>

          <!-- Save Button -->
          <button
              @click="saveSocialLinks"
              :disabled="isSaving"
              class="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Icon name="carbon:save" size="20"/>
            {{ isSaving ? 'Saving...' : 'Save Social Links' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="checkbox"] {
  accent-color: #135bec;
}
</style>

