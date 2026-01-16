<script setup lang="ts">

import type {UserSettingsModel} from "~/types/settings";

defineProps<{
  user?: UserSettingsModel | null
}>()

</script>

<template>
  <section class="py-10" aria-label="Hero section">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <!-- Left Column -->
        <div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6" data-aos="fade-right">
            Hi, I'm
            <span class="bg-linear-to-r from-blue-600 via-sky-400 to-white bg-clip-text text-transparent">
              Eka</span>.<br/>
            Full-Stack<br/>
            Engineer.
          </h1>

          <p class="text-white/70 max-w-xl mb-8" data-aos="fade-right" data-aos-delay="100">
            I build end-to-end digital products — from modern web interfaces and scalable backend systems
            to cross-platform mobile applications.
            <br/><br/>
            Experienced in Frontend, Backend, and Mobile development with a strong focus on performance,
            clean architecture, and real-world production needs.
          </p>

          <nav class="flex gap-4 mb-8" data-aos="fade-right" data-aos-delay="200" aria-label="Primary navigation">
            <a href="#project"
               class="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg shadow hover:brightness-105"
               aria-label="View my projects">
              View Projects
            </a>
            <a href="#contact"
               class="inline-flex items-center justify-center border border-white/10 text-white/90 px-6 py-3 rounded-lg hover:bg-white/5"
               aria-label="Contact me">
              Contact Me
            </a>
          </nav>

          <div data-aos="fade-right" data-aos-delay="300">
            <p class="text-xs text-white/50 mb-3">CONNECT WITH ME</p>
            <nav class="flex gap-3" aria-label="Social media links">
              <a aria-label="Visit my Github profile"
                 :href="user?.github_profile ?? 'https://github.com'"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/6">
                <Icon name="line-md:github" size="28"
                      class="text-white/50 hover:text-white/70 duration-300 transition-colors"/>
              </a>

              <a aria-label="Visit my LinkedIn profile"
                 :href="user?.linkedin_profile ?? 'https://www.linkedin.com'"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/6">
                <Icon name="jam:linkedin" size="28"
                      class="text-white/50 hover:text-white/70 duration-300 transition-colors"/>
              </a>

              <a aria-label="Send me an email"
                 :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${user?.email}&su=Job%20Opportunity&body=Hi%20Eka,%0A%0AI'm%20interested%20in%20working%20with%20you.`"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/6">
                <Icon name="material-symbols:alternate-email" size="28"
                      class="text-white/50 hover:text-white/70 duration-300 transition-colors"/>
              </a>
            </nav>
          </div>
        </div>

        <!-- Right Column (Card) -->
        <div class="flex justify-center rounded-2xl md:justify-end relative" data-aos="fade-left" data-aos-delay="200">
          <!-- Glow -->
          <div
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
           max-w-125 max-h-125 w-full h-full
           bg-linear-to-tr from-blue-500/40 via-indigo-500/30 to-purple-500/20
           blur-3xl rounded-full">
          </div>

          <!-- Card -->
          <div
              class="relative z-10 w-full max-w-xl
              rounded-2xl
           bg-linear-to-br from-[#071028]/40 via-transparent to-transparent
            border border-white/5 shadow-lg">

            <div class="flex gap-3 p-3">
              <div class="w-5 h-5 rounded-full bg-red-500"></div>
              <div class="w-5 h-5 rounded-full bg-yellow-500"></div>
              <div class="w-5 h-5 rounded-full bg-green-500"></div>
            </div>

            <NuxtImg class="w-full rounded-b-xl" src="/images/hero.webp"/>
          </div>
        </div>
      </div>

      <div class="mt-10 py-8 flex justify-center">
        <div class="flex flex-col items-center gap-3 text-white/40">
          <span class="text-[10px] tracking-[0.3em]">SCROLL</span>

          <div class="w-6 h-10 border border-white/30 rounded-full flex justify-center">
            <div class="w-1 h-2 bg-white/50 rounded-full mt-2 animate-scroll-dot"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-scroll-dot {
  animation: scroll-dot 1.8s infinite;
}

@keyframes scroll-dot {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateY(12px);
    opacity: 0;
  }
}
</style>

