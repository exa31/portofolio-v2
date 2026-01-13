<script setup lang="ts">
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  // Add your form submission logic here
  setTimeout(() => {
    isSubmitting.value = false
    // Reset form
    formData.value = {name: '', email: '', subject: '', message: ''}
  }, 1000)
}
</script>

<template>
  <section id="contact" class=" bg-linear-to-b min-h-196.25 py-24 from-[#071026] to-[#071023]">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- Left Column -->
        <div class="space-y-8">
          <div>
            <p class="text-primary text-sm font-semibold mb-2 flex items-center gap-2">
              <Icon name="carbon:email" size="16"/>
              GET IN TOUCH
            </p>
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Let's build something together.</h2>
            <p class="text-white/60 text-lg leading-relaxed">
              Have a project in mind, looking to hire, or just want to chat about the latest tech? I'm currently open to
              new opportunities and collaborations.
            </p>
          </div>

          <!-- Contact Info Cards -->
          <div class="space-y-4">
            <!-- Email Card -->
            <div
                class="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-all duration-300">
              <div class="flex items-start gap-4">
                <div
                    class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon name="carbon:email" size="24" class="text-primary"/>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-white/50 font-semibold mb-1">MAIL ME AT</p>
                  <p class="text-white font-medium">jane.dev@example.com</p>
                  <button
                      class="text-primary text-sm hover:text-primary/80 transition-colors mt-2 flex items-center gap-1">
                    <Icon name="carbon:copy" size="14"/>
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <!-- Location Card -->
            <div
                class="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-all duration-300">
              <div class="flex items-start gap-4">
                <div
                    class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon name="carbon:location" size="24" class="text-primary"/>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-white/50 font-semibold mb-1">BASED IN</p>
                  <p class="text-white font-medium">Tegal, Indonesia</p>
                  <div class="flex items-center gap-2 mt-2">
                    <div class="w-2 h-2 rounded-full bg-green-500"></div>
                    <span class="text-xs text-white/50">Currently Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Contact Form -->
        <div
            class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Name & Email Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-white/70 font-medium mb-2">Name</label>
                <input
                    v-model="formData.name"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm text-white/70 font-medium mb-2">Email</label>
                <input
                    v-model="formData.email"
                    type="email"
                    placeholder="jane@example.com"
                    required
                    class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
                />
              </div>
            </div>

            <!-- Subject -->
            <div>
              <label class="block text-sm text-white/70 font-medium mb-2">Subject</label>
              <input
                  v-model="formData.subject"
                  type="text"
                  placeholder="What is this regarding?"
                  required
                  class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
              />
            </div>

            <!-- Message -->
            <div>
              <label class="block text-sm text-white/70 font-medium mb-2">Message</label>
              <textarea
                  v-model="formData.message"
                  rows="6"
                  placeholder="Tell me about your project or inquiry..."
                  required
                  class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all resize-none"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full px-6 py-4 rounded-lg bg-linear-to-r from-primary via-blue-600 to-primary text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon v-if="!isSubmitting" name="carbon:send-filled" size="20"/>
              <span v-if="isSubmitting">Sending...</span>
              <span v-else>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>

