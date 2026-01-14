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
  uploadCV,
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

const cvFile = ref<File | null>(null)
const cvFileName = ref('')
const cvUrl = ref<string>('')
const showCVModal = ref(false)

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

    cvUrl.value = newData.cv_url || ''

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

const handleCVFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    const file = files[0]
    // Validate file type (PDF only)
    if (file!.type !== 'application/pdf') {
      toast.showErrorToast("Error", "Only PDF files are allowed")
      return
    }
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file!.size > maxSize) {
      toast.showErrorToast("Error", "File size must be less than 5MB")
      return
    }
    cvFile.value = file!
    cvFileName.value = file!.name
  }
}

const uploadCVFile = async () => {
  if (!cvFile.value) {
    toast.showErrorToast("Error", "Please select a file")
    return
  }

  const result = await uploadCV(cvFile.value)
  if (result) {
    cvUrl.value = result
    cvFile.value = null
    cvFileName.value = ''
    // Reset file input
    const fileInput = document.querySelector('#cvFileInput') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }
}

const openCVModal = () => {
  showCVModal.value = true
}

const closeCVModal = () => {
  showCVModal.value = false
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

      <!-- CV Upload -->
      <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 class="text-2xl font-bold text-white flex items-center gap-3">
            <Icon name="carbon:document" size="24" class="text-primary"/>
            CV/Resume
          </h2>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4">
          <!-- Current CV Preview -->
          <div v-if="cvUrl" class="bg-white/5 border border-white/10 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <Icon name="carbon:document-pdf" size="24" class="text-red-400"/>
                <div>
                  <p class="text-sm font-semibold text-white">Current CV</p>
                  <p class="text-xs text-white/50">PDF Document</p>
                </div>
              </div>
              <a
                  :href="cvUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-2 rounded-lg bg-primary hover:brightness-110 text-white text-xs font-medium transition-all flex items-center gap-1"
              >
                <Icon name="carbon:download" size="16"/>
                Download
              </a>
              <button
                  @click="openCVModal"
                  class="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all flex items-center gap-1"
              >
                <Icon name="carbon:view" size="16"/>
                Preview
              </button>
            </div>
          </div>

          <!-- CV File Input -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Upload CV (PDF)</label>
            <div class="flex items-center gap-3">
              <input
                  id="cvFileInput"
                  type="file"
                  accept=".pdf"
                  @change="handleCVFileSelect"
                  class="hidden"
              />
              <label
                  for="cvFileInput"
                  class="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white cursor-pointer hover:bg-white/15 transition-all flex items-center gap-2"
              >
                <Icon name="carbon:cloud-upload" size="20"/>
                <span>{{ cvFileName || 'Choose PDF file...' }}</span>
              </label>
              <span class="text-xs text-white/50">Max 5MB</span>
            </div>
            <p class="text-xs text-white/40 mt-2">PDF files only. Maximum size: 5MB</p>
          </div>

          <!-- Upload Button -->
          <button
              @click="uploadCVFile"
              :disabled="isSaving || !cvFile"
              class="w-full px-6 py-3 rounded-lg bg-primary cursor-pointer text-white font-semibold hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Icon v-if="isSaving" name="icon-park-outline:loading-four" size="16" class="animate-spin"/>
            <Icon v-else name="carbon:upload" size="20"/>
            {{ isSaving ? 'Uploading...' : 'Upload CV' }}
          </button>
        </div>
      </div>
    </div>

    <!-- CV Preview Modal -->
    <div v-if="showCVModal && cvUrl"
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <!-- Modal Container -->
      <div
          class="bg-[#0a1628] border border-white/10 rounded-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div class="flex items-center gap-3">
            <Icon name="carbon:document-pdf" size="24" class="text-red-400"/>
            <div>
              <h3 class="text-xl font-bold text-white">CV Preview</h3>
              <p class="text-xs text-white/50">PDF Document</p>
            </div>
          </div>
          <button
              @click="closeCVModal"
              class="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <Icon name="carbon:close" size="24" class="text-white/70 hover:text-white"/>
          </button>
        </div>

        <!-- PDF Viewer (Object) -->
        <div class="flex-1 overflow-hidden bg-white/5">
          <object
              :data="cvUrl"
              type="application/pdf"
              class="w-full h-full"
          >
            <!-- Fallback jika object tidak support -->
            <div class="flex flex-col items-center justify-center h-full gap-4 p-6">
              <Icon name="carbon:document-pdf" size="48" class="text-red-400/50"/>
              <div class="text-center">
                <p class="text-white mb-2">Cannot display PDF in browser</p>
                <p class="text-white/50 text-sm mb-4">Please download the file to view it</p>
                <a
                    :href="cvUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:brightness-110 text-white font-medium rounded-lg transition-all"
                >
                  <Icon name="carbon:download" size="16"/>
                  Download PDF
                </a>
              </div>
            </div>
          </object>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between p-4 border-t border-white/10 bg-white/5">
          <p class="text-xs text-white/50">PDF Preview</p>
          <div class="flex gap-2">
            <a
                :href="cvUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:brightness-110 text-white text-sm font-medium rounded-lg transition-all"
            >
              <Icon name="carbon:download" size="16"/>
              Download
            </a>
            <button
                @click="closeCVModal"
                class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all"
            >
              Close
            </button>
          </div>
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

