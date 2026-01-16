<script setup lang="ts">

import type {UserSettingsModel} from "~/types/settings";

defineProps<
    {
      user?: UserSettingsModel | null
    }
>()

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const {createMessage, isSaving} = useMessage()

const submitForm = async () => {
  try {
    const success = await createMessage({
      name: formData.value.name,
      email: formData.value.email,
      subject: formData.value.subject,
      message: formData.value.message,
    })

    if (success) {
      // Reset form after successful submission
      formData.value = {name: '', email: '', subject: '', message: ''}
    }
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}
</script>

<template>
  <section id="contact" class=" bg-linear-to-b min-h-196.25 py-24 from-[#071026] to-[#071023]"
           aria-labelledby="contact-heading">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- Left Column -->
        <div class="space-y-8" data-aos="fade-right">
          <header data-aos="fade-up" data-aos-delay="100">
            <p class="text-primary text-sm font-semibold mb-2 flex items-center gap-2">
              <Icon name="carbon:email" size="16"/>
              GET IN TOUCH
            </p>
            <h2 id="contact-heading" class="text-4xl md:text-5xl font-bold text-white mb-4">Let's build something
              together.</h2>
            <p class="text-white/60 text-lg leading-relaxed">
              Have a project in mind, looking to hire, or just want to chat about the latest tech? I'm currently open to
              new opportunities and collaborations.
            </p>
          </header>

          <!-- Contact Info Cards -->
          <address class="space-y-4 not-italic" data-aos="fade-up" data-aos-delay="200">
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
                  <a :href="`mailto:${user?.email || ''}`"
                     class="text-white font-medium hover:text-primary transition-colors">{{
                      user?.email || ''
                    }}</a>
                  <button
                      class="text-primary text-sm hover:text-primary/80 transition-colors mt-2 flex items-center gap-1"
                      aria-label="Copy email to clipboard">
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
                  <p class="text-white font-medium">{{
                      user?.location
                    }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <template v-if="user?.open_to_opportunities">

                      <div class="w-2 h-2 rounded-full bg-green-500" aria-hidden="true"></div>
                      <span class="text-xs text-white/50">Currently Available</span>
                    </template>
                    <template v-else>
                      <div class="w-2 h-2 rounded-full bg-red-500" aria-hidden="true"></div>
                      <span class="text-xs text-white/50">Not Available</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </address>
        </div>

        <!-- Right Column - Contact Form -->
        <div
            class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300"
            data-aos="fade-left">
          <form @submit.prevent="submitForm" class="space-y-6" aria-label="Contact form">
            <!-- Name & Email Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-aos="fade-up" data-aos-delay="300">
              <div>
                <label for="contact-name" class="block text-sm text-white/70 font-medium mb-2">Name</label>
                <input
                    id="contact-name"
                    v-model="formData.name"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    aria-required="true"
                    class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
                />
              </div>
              <div>
                <label for="contact-email" class="block text-sm text-white/70 font-medium mb-2">Email</label>
                <input
                    id="contact-email"
                    v-model="formData.email"
                    type="email"
                    placeholder="jane@example.com"
                    required
                    aria-required="true"
                    class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
                />
              </div>
            </div>

            <!-- Subject -->
            <div data-aos="fade-up" data-aos-delay="400">
              <label for="contact-subject" class="block text-sm text-white/70 font-medium mb-2">Subject</label>
              <input
                  id="contact-subject"
                  v-model="formData.subject"
                  type="text"
                  placeholder="What is this regarding?"
                  required
                  aria-required="true"
                  class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
              />
            </div>

            <!-- Message -->
            <div data-aos="fade-up" data-aos-delay="500">
              <label for="contact-message" class="block text-sm text-white/70 font-medium mb-2">Message</label>
              <textarea
                  id="contact-message"
                  v-model="formData.message"
                  rows="6"
                  placeholder="Tell me about your project or inquiry..."
                  required
                  aria-required="true"
                  class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all resize-none"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                :disabled="isSaving"
                :aria-busy="isSaving"
                class="w-full px-6 py-4 rounded-lg bg-linear-to-r from-primary via-blue-600 to-primary text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-aos="fade-up"
                data-aos-delay="600"
            >
              <Icon v-if="!isSaving" name="carbon:send-filled" size="20" aria-hidden="true"/>
              <span v-if="isSaving">Sending...</span>
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

