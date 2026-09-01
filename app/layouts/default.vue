<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const isMobileMenuOpen = ref(false)
const activeSection = ref('#')
const isScrolled = ref(false)

const navItems = [
  { name: 'About', href: '#about', icon: 'carbon:user-avatar' },
  { name: 'Skills', href: '#stack', icon: 'carbon:code' },
  { name: 'Journey', href: '#work', icon: 'carbon:milestone' },
  { name: 'Projects', href: '#project', icon: 'carbon:application-web' },
  { name: 'Contact', href: '#contact', icon: 'carbon:email' }
]

const sectionOrder = ['#about', '#stack', '#work', '#project', '#contact']

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const updateActiveSection = () => {
  isScrolled.value = window.scrollY > 20

  let found = false
  for (const sectionId of sectionOrder) {
    const element = document.querySelector<HTMLElement>(sectionId)
    if (!element) continue

    const rect = element.getBoundingClientRect()
    if (rect.top <= 200 && rect.bottom > 80) {
      activeSection.value = sectionId
      found = true
      break
    }
  }

  if (!found && window.scrollY < 200) {
    activeSection.value = ''
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})
</script>

<template>
  <div class="min-h-screen bg-[#030712] text-slate-100 relative overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
    <!-- Ambient Background Lighting Orbs -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden gpu-layer">
      <!-- Top blue/indigo aurora -->
      <div class="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[350px] sm:w-[800px] h-[300px] sm:h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-500/10 to-transparent blur-[60px] sm:blur-[120px] rounded-full gpu-layer"></div>
      <!-- Right cyan glow -->
      <div class="absolute top-[30%] -right-[150px] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-cyan-500/8 blur-[60px] sm:blur-[140px] rounded-full gpu-layer"></div>
      <!-- Left violet glow -->
      <div class="absolute top-[60%] -left-[150px] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-purple-600/8 blur-[60px] sm:blur-[140px] rounded-full gpu-layer"></div>
      <!-- Cyber grid overlay -->
      <div class="absolute inset-0 cyber-grid-pattern opacity-40"></div>
    </div>

    <!-- Header / Floating Island Navbar (Fixed) -->
    <header class="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 px-4 sm:px-6 py-3 sm:py-4 pointer-events-none">
      <div class="container mx-auto max-w-6xl pointer-events-auto">
        <div 
          class="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-full transition-all duration-300"
          :class="isScrolled 
            ? 'bg-[#0b1329]/85 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80' 
            : 'bg-[#0f172a]/60 backdrop-blur-lg border border-white/10 shadow-lg shadow-black/40'"
        >
          <!-- Brand Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 shrink-0 group">
            <div class="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div class="w-full h-full bg-[#070d1a] rounded-[11px] flex items-center justify-center">
                <Icon name="material-symbols-light:terminal" size="22" class="text-blue-400 group-hover:scale-110 transition-transform duration-300"/>
              </div>
            </div>
            <div class="flex flex-col">
              <span class="font-heading font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                Eka Dev<span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              </span>
              <span class="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-wider uppercase -mt-1">Full-Stack</span>
            </div>
          </NuxtLink>

          <!-- Desktop Navigation Dock -->
          <nav class="hidden md:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-full backdrop-blur-md">
            <NuxtLink
              v-for="item in navItems"
              :key="item.href"
              :to="item.href"
              class="relative px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 flex items-center gap-1.5"
              :class="activeSection === item.href
                ? 'text-white bg-blue-600/30 border border-blue-500/30 shadow-sm shadow-blue-500/20 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'"
            >
              <Icon :name="item.icon" size="15" :class="activeSection === item.href ? 'text-blue-400' : 'text-slate-400'"/>
              {{ item.name }}
            </NuxtLink>
          </nav>

          <!-- Desktop Right CTA -->
          <div class="hidden md:flex items-center gap-3">
            <a
              href="#contact"
              class="btn-shimmer-primary px-4 py-2 rounded-full text-xs font-semibold tracking-wide text-white flex items-center gap-2"
            >
              <span>Get in Touch</span>
              <Icon name="carbon:send-alt" size="14" />
            </a>
          </div>

          <!-- Mobile Menu Toggle Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-200"
            aria-label="Toggle navigation menu"
          >
            <div class="relative w-5 h-4">
              <span
                class="absolute left-0 block w-full h-0.5 bg-current rounded-full transition-all duration-300"
                :class="isMobileMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'"
              ></span>
              <span
                class="absolute left-0 block w-full h-0.5 bg-current rounded-full transition-all duration-300"
                :class="isMobileMenuOpen ? 'opacity-0 translate-x-2' : 'top-1/2 -translate-y-1/2'"
              ></span>
              <span
                class="absolute left-0 block w-full h-0.5 bg-current rounded-full transition-all duration-300"
                :class="isMobileMenuOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-0'"
              ></span>
            </div>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Backdrop -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="isMobileMenuOpen"
        class="md:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-40"
        @click="closeMobileMenu"
      ></div>
    </Transition>

    <!-- Mobile Menu Drawer (Slide Down) -->
    <Transition
      enter-active-class="transition duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="opacity-0 -translate-y-6 scale-98"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-6 scale-98"
    >
      <nav
        v-show="isMobileMenuOpen"
        class="md:hidden fixed top-20 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <div class="bg-[#0b1329]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 overflow-hidden">
          <div class="flex flex-col gap-1.5">
            <NuxtLink
              v-for="item in navItems"
              :key="item.href"
              :to="item.href"
              @click="closeMobileMenu"
              class="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between"
              :class="activeSection === item.href
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'"
            >
              <div class="flex items-center gap-3">
                <Icon :name="item.icon" size="18" :class="activeSection === item.href ? 'text-blue-400' : 'text-slate-400'"/>
                <span>{{ item.name }}</span>
              </div>
              <Icon name="carbon:chevron-right" size="16" class="text-slate-500"/>
            </NuxtLink>

            <div class="pt-3 mt-2 border-t border-white/10">
              <a
                href="#contact"
                @click="closeMobileMenu"
                class="btn-shimmer-primary w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
              >
                <span>Let's Talk</span>
                <Icon name="carbon:send-alt" size="16"/>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </Transition>

    <!-- Main Content -->
    <main class="relative z-10 pt-20 sm:pt-24">
      <slot></slot>
    </main>
  </div>
</template>