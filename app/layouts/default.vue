<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'

const isMobileMenuOpen = ref(false)
const activeSection = ref('#')

const navItems = [
  {name: 'About', href: '#about'},
  {name: 'Skills', href: '#stack'},
  {name: 'Work', href: '#work'},
  {name: 'Projects', href: '#project'},
  {name: 'Contact', href: '#contact'}
]

const sectionOrder = ['#about', '#stack', '#work', '#project', '#contact']

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const updateActiveSection = () => {
  let found = false

  for (const sectionId of sectionOrder) {
    const element = document.querySelector<HTMLElement>(sectionId)
    if (!element) continue

    const rect = element.getBoundingClientRect()

    if (rect.top <= 150 && rect.bottom > 0) {
      activeSection.value = sectionId
      found = true
      break
    }
  }

  if (!found) {
    activeSection.value = ''
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveSection, {passive: true})
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})
</script>

<template>
  <main class="from-[#071026] via-[#071423] to-[#071023] text-white min-h-screen bg-linear-to-br">
    <!-- Header -->
    <header
        class="sticky top-0 z-50 bg-linear-to-b from-[#071026] via-[#071423]/95 to-[#071023]/90 backdrop-blur-sm border-b border-white/10">
      <div class="container mx-auto px-6 py-6 flex items-center justify-between relative">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 shrink-0">
          <div class="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center border border-white/5">
            <Icon name="material-symbols-light:terminal" size="28" class="text-primary"/>
          </div>
          <span class="font-semibold">Eka Dev.</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
          <NuxtLink
              v-for="item in navItems"
              :key="item.href"
              :to="item.href"
              class="relative px-5 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300"
              :class="activeSection === item.href
                ? 'text-white bg-primary/20 shadow-sm shadow-primary/10'
                : 'text-white/50 hover:text-white/90 hover:bg-white/[0.06]'"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- Mobile Menu Button (animated) -->
        <button
            @click="toggleMobileMenu"
            class="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
        >
          <span class="sr-only">Menu</span>
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
          class="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          @click="closeMobileMenu"
      ></div>
    </Transition>

    <!-- Mobile Menu (slide down) -->
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
    >
      <nav
          v-show="isMobileMenuOpen"
          class="md:hidden fixed top-20 left-0 right-0 z-50 mx-4"
      >
        <div class="bg-[#0f1520]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex flex-col p-3">
            <NuxtLink
                v-for="item in navItems"
                :key="item.href"
                :to="item.href"
                @click="closeMobileMenu"
                class="px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center"
                :class="activeSection === item.href
                  ? 'bg-primary/15 text-primary pl-5'
                  : 'text-white/70 hover:text-white hover:bg-white/5 pl-4'"
            >
              <span class="w-1.5 h-1.5 rounded-full transition-all duration-300 shrink-0" :class="activeSection === item.href ? 'bg-primary mr-3' : 'bg-transparent mr-2'"></span>
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
      </nav>
    </Transition>

    <!-- Content -->
    <slot></slot>
  </main>
</template>

<style scoped>

</style>