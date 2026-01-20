<script setup lang="ts">
const currentYear = new Date().getFullYear()

const handleScrollToTop = () => {
  window.scrollTo({top: 0, behavior: 'smooth'})
}

</script>

<template>
  <footer class="bg-linear-to-b from-[#0a0f1a] to-[#050810] border-t border-white/10">
    <div class="container mx-auto px-6">
      <!-- Footer Content -->
      <div class="py-12 flex flex-col sm:flex-row items-center justify-between gap-8" data-aos="fade-up">
        <!-- Brand Section -->
        <div class="flex flex-col items-center sm:items-start gap-4" data-aos="fade-right" data-aos-delay="100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center border border-white/5">
              <Icon name="material-symbols-light:terminal" size="24" class="text-primary"/>
            </div>
            <span class="font-bold text-lg text-white">Eka Dev.</span>
          </div>
        </div>

        <!-- Copyright & Links -->
        <div class="text-center sm:text-right" data-aos="fade-left" data-aos-delay="100">
          <p class="text-white/60 text-sm mb-3">
            <span class="font-semibold text-white">© {{ currentYear }} Eka Dev.</span>
            <span class="mx-2">•</span>
            Built with
            <span class="text-primary font-semibold">Vue.js</span> &
            <span class="text-primary font-semibold">Nuxt</span>
          </p>
          <div class="flex items-center justify-center sm:justify-end gap-4 text-sm">
            <NuxtLink to="/privacy" class="text-white/60 hover:text-primary transition-colors">
              Privacy
            </NuxtLink>
            <div class="h-1 w-1 rounded-full bg-white/20"></div>
            <NuxtLink to="/terms" class="text-white/60 hover:text-primary transition-colors">
              Terms
            </NuxtLink>
            <div class="h-1 w-1 rounded-full bg-white/20"></div>
            <a href="#contact" class="text-primary hover:text-primary/80 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>

      <!-- Back to Top Button -->
      <div class="py-4 border-t border-white/10 flex justify-center">
        <button
            @click="handleScrollToTop"
            aria-label="Scroll to top of page"
            class="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all duration-300 group"
        >
          <Icon name="carbon:arrow-up" size="18" class="group-hover:scale-110 transition-transform"/>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
</style>

