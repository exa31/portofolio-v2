<script setup lang="ts">
import type { UserSettingsModel } from "~/types/settings";
import { ref } from 'vue'

const props = defineProps<{
  user?: UserSettingsModel | null;
}>()

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const emailCopied = ref(false)
const submitSuccess = ref(false)

const { createMessage, isSaving } = useMessage()

const copyEmail = () => {
  const email = props.user?.email || 'contact@eka-dev.cloud'
  navigator.clipboard.writeText(email)
  emailCopied.value = true
  setTimeout(() => {
    emailCopied.value = false
  }, 2000)
}

const submitForm = async () => {
  try {
    const success = await createMessage({
      name: formData.value.name,
      email: formData.value.email,
      subject: formData.value.subject,
      message: formData.value.message,
    })

    if (success) {
      formData.value = { name: '', email: '', subject: '', message: '' }
      submitSuccess.value = true
      setTimeout(() => {
        submitSuccess.value = false
      }, 5000)
    }
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}
</script>

<template>
  <section id="contact" class="py-24 relative overflow-hidden" aria-labelledby="contact-heading">
    <!-- Ambient background aura -->
    <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
        
        <!-- Left Column: Contact Channels & Info (5 cols) -->
        <Motion
          :initial="{ opacity: 0, x: -30 }"
          :while-in-view="{ opacity: 1, x: 0 }"
          :viewport="{ once: true, amount: 0.2 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="lg:col-span-5 space-y-6"
        >
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
              <Icon name="carbon:chat" size="14" />
              <span>GET IN TOUCH</span>
            </div>
            
            <h2 id="contact-heading" class="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight mb-4">
              Let's Build Something <span class="text-gradient-cyan">Remarkable</span>.
            </h2>
            
            <p class="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
              Have an ambitious project, an engineering challenge, or a full-time role? I'm always open to discussing new opportunities and strategic collaborations.
            </p>
          </div>

          <!-- Contact Cards -->
          <div class="space-y-3.5">
            <!-- Email Card -->
            <div class="glass-panel-interactive rounded-2xl p-5 group flex items-start justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Icon name="carbon:email" size="22" />
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] font-mono uppercase text-slate-400">Direct Email</p>
                  <a
                    :href="`mailto:${user?.email || 'contact@eka-dev.cloud'}`"
                    class="text-sm font-semibold text-white hover:text-blue-400 transition-colors truncate block"
                  >
                    {{ user?.email || 'contact@eka-dev.cloud' }}
                  </a>
                  <p class="text-[11px] text-slate-500 mt-0.5">Quick response guaranteed</p>
                </div>
              </div>

              <button
                @click="copyEmail"
                class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-slate-300 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                aria-label="Copy email"
              >
                <Icon :name="emailCopied ? 'carbon:checkmark' : 'carbon:copy'" size="13" :class="emailCopied ? 'text-emerald-400' : 'text-slate-400'" />
                <span>{{ emailCopied ? 'Copied' : 'Copy' }}</span>
              </button>
            </div>

            <!-- Location & Availability Card -->
            <div class="glass-panel-interactive rounded-2xl p-5 flex items-start gap-4">
              <div class="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Icon name="carbon:location" size="22" />
              </div>
              <div>
                <p class="text-[10px] font-mono uppercase text-slate-400">Location & Timezone</p>
                <p class="text-sm font-semibold text-white">{{ user?.location || 'Indonesia (GMT+7)' }}</p>
                <div class="flex items-center gap-2 mt-1.5">
                  <span class="relative flex h-2 w-2">
                    <span class="radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span class="text-xs text-slate-400 font-mono">Available for Remote Worldwide</span>
                </div>
              </div>
            </div>

            <!-- Response Guarantee Badge -->
            <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
              <Icon name="carbon:flash" size="20" class="text-amber-400 shrink-0" />
              <p class="text-xs text-slate-400">
                Typically responds within <strong class="text-slate-200">24 hours</strong>.
              </p>
            </div>
          </div>
        </Motion>

        <!-- Right Column: Interactive Contact Form (7 cols) -->
        <Motion
          :initial="{ opacity: 0, x: 30 }"
          :while-in-view="{ opacity: 1, x: 0 }"
          :viewport="{ once: true, amount: 0.2 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="lg:col-span-7"
        >
          <div class="rounded-3xl bg-[#090e1a]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative">
            
            <!-- Success Message Toast Banner -->
            <div
              v-if="submitSuccess"
              class="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-sm animate-fadeIn"
            >
              <Icon name="carbon:checkmark-filled" size="20" class="text-emerald-400 shrink-0" />
              <span>Thank you! Your message has been sent successfully. I'll get back to you soon.</span>
            </div>

            <form @submit.prevent="submitForm" class="space-y-4" aria-label="Contact submission form">
              
              <!-- Name & Email Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="contact-name" class="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Your Name <span class="text-blue-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    v-model="formData.name"
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    required
                    class="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all"
                  />
                </div>

                <div>
                  <label for="contact-email" class="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Email Address <span class="text-blue-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    v-model="formData.email"
                    type="email"
                    placeholder="alex@company.com"
                    required
                    class="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all"
                  />
                </div>
              </div>

              <!-- Subject -->
              <div>
                <label for="contact-subject" class="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Subject / Inquiry Type <span class="text-blue-400">*</span>
                </label>
                <input
                  id="contact-subject"
                  v-model="formData.subject"
                  type="text"
                  placeholder="e.g. Full-Time Opportunity / Project Consultation"
                  required
                  class="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all"
                />
              </div>

              <!-- Message -->
              <div>
                <label for="contact-message" class="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Message <span class="text-blue-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  v-model="formData.message"
                  rows="5"
                  placeholder="Describe your vision, timeline, or job opportunity..."
                  required
                  class="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all resize-none"
                ></textarea>
              </div>

              <!-- Submit Action Button -->
              <button
                type="submit"
                :disabled="isSaving"
                class="btn-shimmer-primary w-full py-4 rounded-xl font-semibold text-sm tracking-wide text-white flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                <Icon v-if="isSaving" name="icon-park-outline:loading-four" size="18" class="animate-spin" />
                <Icon v-else name="carbon:send-alt" size="18" class="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                <span>{{ isSaving ? 'Sending Message...' : 'Send Message' }}</span>
              </button>

            </form>
          </div>
        </Motion>

      </div>
    </div>
  </section>
</template>
