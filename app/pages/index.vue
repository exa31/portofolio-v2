<script setup lang="ts">

</script>

<template>
  <div class="  text-white">


    <!-- Hero -->
    <main class="container mx-auto px-6 py-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <!-- Left column -->
        <div>
          <span class="inline-block bg-[#0b2348] text-primary text-xs font-medium px-3 py-1 rounded-full mb-6">AVAILABLE FOR WORK</span>

          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Hi, I'm <span
              class="bg-linear-to-r from-blue-600 via-sky-400 to-white
         bg-clip-text text-transparent">
  Eka</span>.<br/>
            Full-Stack<br/> Engineer.

          </h1>

          <p class="text-white/70 max-w-xl mb-8">
            I build end-to-end digital products — from modern web interfaces and scalable backend systems
            to cross-platform mobile applications.
            <br/><br/>
            Experienced in Frontend, Backend, and Mobile development with a strong focus on performance,
            clean architecture, and real-world production needs.
          </p>

          <div class="flex gap-4 mb-8">
            <a href="#work"
               class="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg shadow hover:brightness-105">View
              Projects</a>
            <a href="#contact"
               class="inline-flex items-center justify-center border border-white/10 text-white/90 px-6 py-3 rounded-lg hover:bg-white/5">Contact
              Me</a>
          </div>

          <div>
            <p class="text-xs text-white/50 mb-3">CONNECT WITH ME</p>
            <div class="flex gap-3">
              <a aria-label="Github"
                 href="https://github.com/exa31"
                 target="_blank"
                 class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/6">
                <Icon name="line-md:github" size="28"
                      class="text-white/50 hover:text-white/70 duration-300 transition-colors"/>
              </a>

              <a aria-label="LinkedIn"
                 href="https://www.linkedin.com/in/eka-nazhifan-75b116293/"
                 target="_blank"
                 class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/6">
                <Icon name="jam:linkedin" size="28"
                      class="text-white/50 hover:text-white/70 duration-300 transition-colors"/>
              </a>

              <a aria-label="Email"
                 href="https://mail.google.com/mail/?view=cm&fs=1&to=ekaaa.jobs@gmail.com&su=Job%20Opportunity&body=Hi%20Eka,%0A%0AI'm%20interested%20in%20working%20with%20you."
                 target="_blank"
                 rel="noopener noreferrer"
                 class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/6">
                <Icon name="material-symbols:alternate-email" size="28"
                      class="text-white/50 hover:text-white/70 duration-300 transition-colors"/>
              </a>
            </div>
          </div>
        </div>

        <!-- Right column (image/card) -->
        <div class="flex justify-center rounded-2xl md:justify-end relative">
          <!-- Glow -->
          <div
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
           w-125 h-125
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

            <NuxtImg class="w-full rounded-b-xl" src="/images/hero.png"/>
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


      <!-- About slice -->
      <section id="about" class="py-20">
        <div class="container mx-auto px-6">
          <div class="mb-12">

            <h2 class="text-5xl lg:text-6xl font-black mb-3 leading-tight">About Me</h2>
            <p class="text-lg text-white/50 mb-6 leading-relaxed max-w-lg">Architecting the future of web and mobile
              applications with scalable, cloud-native solutions.</p>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <!-- Left: image card -->
            <div class="relative flex justify-center lg:justify-start order-2 lg:order-1">
              <div class="relative w-full max-w-sm">
                <!-- Card -->
                <NuxtImg src="/images/about.png" alt="Profile" class="h-full rounded-xl w-full"/>
                <!-- status badge (positioned, overlapping) -->
                <div class="absolute -top-4 right-2 z-20">
                  <div
                      class="inline-flex items-center gap-2 bg-gray-800 border border-white/10 text-white px-5 py-3 rounded-lg shadow-lg">
                    <div class="relative">
                      <!-- Glow ring -->
                      <span
                          class="absolute inset-0 rounded-full bg-green-500/70 blur-md animate-ping">
  </span>
                      <!-- Icon -->
                      <div class="relative bg-green-900 p-1 w-8 h-8 rounded-full">
                        <Icon name="weui:done2-filled" size="24" class="text-green-400"/>
                      </div>
                    </div>
                    <div>
                      <div class="text-white/50 text-xs uppercase">Status</div>
                      <div class="text-white text-md font-medium">Open to Work</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: content -->
            <div class="text-white order-1 lg:order-2 pt-8 lg:pt-0">
              <!-- badge -->
              <div
                  class="inline-flex items-center gap-2 bg-[#0b2a35] text-sky-300 px-3 py-1 rounded-full text-[10px] uppercase mb-6 font-medium">
                <Icon name="material-symbols-light:stars" size="24" class="text-sky-400"/>
                PROBLEM SOLVER
              </div>


              <!-- Main heading with gradient text -->
              <h3 class="text-4xl lg:text-5xl font-black leading-tight mb-8 max-w-2xl">
                Bridging <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-600">Backend Logic</span>
                with <span class="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400">Frontend Magic.</span>
              </h3>

              <!-- Description paragraphs -->
              <p class="text-white/60 text-sm leading-relaxed mb-6 max-w-lg">
                I don't just write code; I engineer resilient ecosystems. As a seasoned Full Stack developer, I
                seamlessly navigate between creating intuitive mobile and web interfaces and architecting powerful
                backend systems.
              </p>

              <p class="text-white/60 text-sm leading-relaxed mb-8 max-w-lg">
                My expertise extends to DevOps, where I leverage Kubernetes and CI/CD pipelines to automate deployments
                and ensure 99.9% uptime. Whether it's optimization, scalability, or user experience, I deliver solutions
                that drive growth.
              </p>

              <!-- Stats row -->
              <div class="flex gap-6 mb-8">
                <div class="flex items-center bg-[#1e2430] p-5 rounded-2xl gap-3">
                  <div>
                    <div class="text-4xl font-black text-white">5+</div>
                    <div class="text-xs text-white/50 uppercase font-medium mt-4">Years Experience</div>
                  </div>
                  <div
                      class="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Icon name="ic:baseline-access-time-filled" size="20" class="text-blue-400"/>
                  </div>
                </div>

                <div class="flex items-center bg-[#1e2430] p-5 rounded-2xl gap-3">
                  <div>
                    <div class="text-4xl font-black text-white">50+</div>
                    <div class="text-xs text-white/50 uppercase mt-4 font-medium">Projects Shipped</div>
                  </div>
                  <div
                      class="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Icon name="material-symbols:rocket-launch-rounded" size="20" class="text-blue-400"/>
                  </div>
                </div>
              </div>

              <!-- Competencies -->
              <div class="mb-8">
                <div class="text-xs uppercase text-white/50 font-bold mb-3 tracking-wide">Core Competencies</div>
                <div class="flex flex-wrap gap-3">
                  <span
                      class="inline-flex items-center gap-2 px-3 py-2 bg-[#0b2348]/60 border border-white/5 rounded-full text-xs font-medium text-white/80">
                    <Icon name="mdi:cellphone" size="12" class="text-pink-400"/>
                    Mobile Dev
                  </span>
                  <span
                      class="inline-flex items-center gap-2 px-3 py-2 bg-[#0b2348]/60 border border-white/5 rounded-full text-xs font-medium text-white/80">
                    <Icon name="mdi:web" size="12" class="text-cyan-400"/>
                    Frontend
                  </span>
                  <span
                      class="inline-flex items-center gap-2 px-3 py-2 bg-[#0b2348]/60 border border-white/5 rounded-full text-xs font-medium text-white/80">
                    <Icon name="mdi:server" size="12" class="text-green-400"/>
                    Backend
                  </span>
                  <span
                      class="inline-flex items-center gap-2 px-3 py-2 bg-[#0b2348]/60 border border-white/5 rounded-full text-xs font-medium text-white/80">
                    <Icon name="mdi:gitlab" size="12" class="text-orange-400"/>
                    CI/CD
                  </span>
                  <span
                      class="inline-flex items-center gap-2 px-3 py-2 bg-[#0b2348]/60 border border-white/5 rounded-full text-xs font-medium text-white/80">
                    <Icon name="carbon:kubernetes-pod" size="12" class="text-blue-400"/>
                    Kubernetes
                  </span>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="flex gap-3 pt-4">
                <a href="/resume.pdf"
                   class="primary-cta-btn inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition">
                  <span>Download CV</span>
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13 7h-2v10M17 13h-2v4M9 13H7v4M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </a>
                <a href="#contact"
                   class="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 transition">
                  Get in Touch
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17l10-10M17 7v10H7v-10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                          stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Anchor sections to satisfy in-page links -->
      <section id="stack" class="h-[20vh]"/>
      <section id="work" class="h-[20vh]"/>
      <section id="contact" class="h-[20vh]"/>
    </main>
  </div>
</template>

<style scoped>
/* small helper: nothing heavy here so tailwind handles layout */
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

.animate-scroll-dot {
  animation: scroll-dot 1.8s infinite;
}

/* custom visual tweaks to match the reference */
.primary-cta-btn {
  background: linear-gradient(135deg, #1e7fff 0%, #2196f3 50%, #0d47a1 100%);
  box-shadow: 0 10px 35px rgba(30, 127, 255, 0.3);
  transition: all 0.3s ease;
}

.primary-cta-btn:hover {
  box-shadow: 0 15px 45px rgba(30, 127, 255, 0.4);
  transform: translateY(-2px);
}

</style>