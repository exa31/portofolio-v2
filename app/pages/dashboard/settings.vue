<script setup lang="ts">
import {computed, ref} from 'vue'
import {useToastCustom} from "~/composables/useToastCustom";

definePageMeta({
  layout: 'dashboard',
  breadCrumb: [
    {title: 'Settings'}
  ]
})

const {
  fetchSettings,
  updateProfileSettings,
  updateSocialLinks,
  isLoading,
  isSaving,
} = useSettings()

const toast = useToastCustom()

const profileForm = ref({
  name: '',
  email: '',
  location: '',
  open_to_opportunities: false
})

const socialLinksForm = ref({
  github_profile: '',
  linkedin_profile: ''
})

const originalData = ref({
  name: '',
  email: '',
  location: '',
  open_to_opportunities: false,
  github_profile: '',
  linkedin_profile: ''
})

// Fetch settings on SSR/CSR
const {data: settingsData} = await useAsyncData('user-settings', async () => {
  return await fetchSettings()
})

// Watch data changes
watch(settingsData, (newData) => {
  if (newData) {
    profileForm.value = {
      name: newData.name,
      email: newData.email,
      location: newData.location || '',
      open_to_opportunities: newData.open_to_opportunities
    }

    socialLinksForm.value = {
      github_profile: newData.github_profile || '',
      linkedin_profile: newData.linkedin_profile || ''
    }

    originalData.value = {
      name: newData.name,
      email: newData.email,
      location: newData.location || '',
      open_to_opportunities: newData.open_to_opportunities,
      github_profile: newData.github_profile || '',
      linkedin_profile: newData.linkedin_profile || ''
    }
  }
}, {immediate: true})

const profileHasChanges = computed(() => {
  return profileForm.value.name !== originalData.value.name ||
      profileForm.value.email !== originalData.value.email ||
      profileForm.value.location !== originalData.value.location ||
      profileForm.value.open_to_opportunities !== originalData.value.open_to_opportunities
})

const socialLinksHaveChanges = computed(() => {
  return socialLinksForm.value.github_profile !== originalData.value.github_profile ||
      socialLinksForm.value.linkedin_profile !== originalData.value.linkedin_profile
})

const saveProfile = async () => {
  if (!profileHasChanges.value) {
    toast.showInfoToast("Info", "No changes to save")
    return
  }

  const result = await updateProfileSettings({
    name: profileForm.value.name,
    email: profileForm.value.email,
    location: profileForm.value.location || null,
    open_to_opportunities: profileForm.value.open_to_opportunities
  })

  if (result) {
    originalData.value = {
      ...originalData.value,
      name: result.name,
      email: result.email,
      location: result.location || '',
      open_to_opportunities: result.open_to_opportunities,
    }
  }
}

const saveSocialLinks = async () => {
  if (!socialLinksHaveChanges.value) {
    toast.showInfoToast("Info", "No changes to save")
    return
  }

  const result = await updateSocialLinks({
    github_profile: socialLinksForm.value.github_profile || null,
    linkedin_profile: socialLinksForm.value.linkedin_profile || null
  })

  if (result) {
    originalData.value = {
      ...originalData.value,
      github_profile: result.github_profile || '',
      linkedin_profile: result.linkedin_profile || ''
    }
  }
}
</script>

<template>
  <div class="p-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-black text-white mb-2">Settings</h1>
      <p class="text-white/60">Manage your profile and social links.</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !settingsData" class="flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p class="text-white/60 text-sm">Loading settings...</p>
    </div>

    <!-- Content -->
    <div v-else class="space-y-8">
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
            <label class="block text-sm font-semibold text-white mb-2">Full Name</label>
            <input
                v-model="profileForm.name"
                type="text"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Email Address</label>
            <input
                v-model="profileForm.email"
                type="email"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Location</label>
            <input
                v-model="profileForm.location"
                type="text"
                placeholder="e.g. San Francisco, CA"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- Open to Work -->
          <div class="flex items-center gap-3">
            <input
                v-model="profileForm.open_to_opportunities"
                type="checkbox"
                id="openToWork"
                class="w-5 h-5 rounded accent-primary cursor-pointer"
            />
            <label for="openToWork" class="text-sm text-white font-medium">Open to Work Opportunities</label>
          </div>

          <!-- Save Button -->
          <button
              @click="saveProfile"
              :disabled="isSaving || !profileHasChanges"
              class="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Icon v-if="isSaving" name="icon-park-outline:loading-four" size="16" class="animate-spin"/>
            <Icon v-else name="carbon:save" size="20"/>
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
          <!-- GitHub -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Icon name="carbon:logo-github" size="16"/>
              GitHub Profile URL
            </label>
            <input
                v-model="socialLinksForm.github_profile"
                type="url"
                placeholder="https://github.com/username"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- LinkedIn -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Icon name="carbon:logo-linkedin" size="16"/>
              LinkedIn Profile URL
            </label>
            <input
                v-model="socialLinksForm.linkedin_profile"
                type="url"
                placeholder="https://linkedin.com/in/username"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <!-- Save Button -->
          <button
              @click="saveSocialLinks"
              :disabled="isSaving || !socialLinksHaveChanges"
              class="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Icon v-if="isSaving" name="icon-park-outline:loading-four" size="16" class="animate-spin"/>
            <Icon v-else name="carbon:save" size="20"/>
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

