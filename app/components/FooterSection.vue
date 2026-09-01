<script setup lang="ts">
const currentYear = new Date().getFullYear()

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="relative bg-[#050914] border-t border-white/[0.08] overflow-hidden">
    <!-- Top subtle gradient highlight line -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

    <div class="container mx-auto px-4 sm:px-6 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        
        <!-- Brand & Bio -->
        <div class="flex flex-col items-center md:items-start gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-[1px]">
              <div class="w-full h-full bg-[#070d1a] rounded-[11px] flex items-center justify-center">
                <Icon name="material-symbols-light:terminal" size="20" class="text-blue-400" />
              </div>
            </div>
            <span class="font-heading font-bold text-lg text-white">Eka Dev.</span>
          </div>
          <p class="text-xs text-slate-400 font-light text-center md:text-left max-w-sm">
            Engineering scalable cloud-native architectures, web applications, and fluid cross-platform experiences.
          </p>
        </div>

        <!-- Links & Copyright -->
        <div class="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
          <div class="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-slate-400">
            <a href="#about" class="hover:text-blue-400 transition-colors">About</a>
            <a href="#stack" class="hover:text-blue-400 transition-colors">Skills</a>
            <a href="#work" class="hover:text-blue-400 transition-colors">Journey</a>
            <a href="#project" class="hover:text-blue-400 transition-colors">Projects</a>
            <NuxtLink to="/privacy" class="hover:text-blue-400 transition-colors">Privacy</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-blue-400 transition-colors">Terms</NuxtLink>
          </div>

          <p class="text-xs text-slate-500 font-mono">
            © {{ currentYear }} Eka Dev • Crafted with Vue & Nuxt
          </p>
        </div>

        <!-- Back to Top Action -->
        <div class="shrink-0">
          <button
            @click="handleScrollToTop"
            aria-label="Scroll back to top"
            class="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400 flex items-center justify-center transition-all group cursor-pointer"
          >
            <Icon name="carbon:arrow-up" size="18" class="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  </footer>
</template>
