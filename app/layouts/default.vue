<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'

const isMobileMenuOpen = ref(false)
const activeSection = ref('#')

const navItems = [
  {name: 'About', href: '#about'},
  {name: 'Projects', href: '#work'},
  {name: 'Skills', href: '#stack'},
  {name: 'Contact', href: '#contact'}
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Update active section based on scroll position
const updateActiveSection = () => {
  const sections = ['#about', '#work', '#stack', '#contact']

  for (const sectionId of sections) {
    const element = document.querySelector(sectionId)
    if (element) {
      const rect = element.getBoundingClientRect()
      // Check if section is in viewport (with 100px offset from top for sticky header)
      if (rect.top <= 150 && rect.bottom > 0) {
        activeSection.value = sectionId
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveSection)
  // Initial check
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
        <nav class="hidden md:flex items-center gap-8 text-sm text-white/70">
          <NuxtLink
              v-for="item in navItems"
              :key="item.href"
              :to="item.href"
              class="hover:text-white duration-300 transition-all relative group scroll-smooth"
              :class="{'text-primary': activeSection === item.href}"
          >
            {{ item.name }}
            <span
                class="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300"
                :class="activeSection === item.href ? 'w-full' : 'w-0 group-hover:w-full'"
            ></span>
          </NuxtLink>
        </nav>

        <!-- Mobile Menu Button -->
        <button
            @click="toggleMobileMenu"
            class="md:hidden text-white/70 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
        >
          <Icon v-if="!isMobileMenuOpen" name="carbon:menu" size="24"/>
          <Icon v-else name="carbon:close" size="24"/>
        </button>
      </div>
    </header>

    <!-- Mobile Menu -->
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
    >
      <nav
          v-show="isMobileMenuOpen"
          class="md:hidden fixed top-20 left-0 right-0 bg-[#0f1520] border-b border-white/10 rounded-lg shadow-lg z-40 mx-4"
      >
        <div class="flex flex-col p-4 space-y-2">
          <NuxtLink
              v-for="item in navItems"
              :key="item.href"
              :to="item.href"
              @click="closeMobileMenu"
              class="px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
              :class="activeSection === item.href ? 'bg-primary/20 text-primary border-l-2 border-primary' : ''"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </nav>
    </Transition>

    <!-- Content -->
    <slot></slot>
  </main>
</template>

<style scoped>

</style>