<script setup lang="ts">
</script>

<template>
  <section id="about" class="py-20">
    <div class="container mx-auto px-6">
      <div class="mb-12">
        <h2 class="text-5xl lg:text-6xl font-black mb-3 leading-tight">About Me</h2>
        <p class="text-lg text-white/50 mb-6 leading-relaxed max-w-lg">
          Architecting the future of web and mobile applications with scalable, cloud-native solutions.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <!-- Left: Image Card -->
        <div class="relative flex justify-center lg:justify-start order-2 lg:order-1">
          <div class="relative w-full max-w-sm">
            <!-- Card -->
            <NuxtImg src="/images/about.png" alt="Profile" class="h-full rounded-xl w-full"/>

            <!-- Status Badge -->
            <div class="absolute -top-4 right-2 z-20">
              <div
                  class="inline-flex items-center gap-2 bg-gray-800 border border-white/10 text-white px-5 py-3 rounded-lg shadow-lg">
                <div class="relative">
                  <!-- Glow ring -->
                  <span class="absolute inset-0 rounded-full bg-green-500/70 blur-md animate-ping"></span>
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

        <!-- Right: Content -->
        <div class="text-white order-1 lg:order-2 pt-8 lg:pt-0">
          <!-- Badge -->
          <div
              class="inline-flex items-center gap-2 bg-[#0b2a35] text-sky-300 px-3 py-1 rounded-full text-[10px] uppercase mb-6 font-medium">
            <Icon name="material-symbols-light:stars" size="24" class="text-sky-400"/>
            PROBLEM SOLVER
          </div>

          <!-- Main Heading -->
          <h3 class="text-4xl lg:text-5xl font-black leading-tight mb-8 max-w-2xl">
            Bridging <span
              class="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-600">Backend Logic</span>
            with <span
              class="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400">Frontend Magic.</span>
          </h3>

          <!-- Description -->
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

          <!-- Stats Row -->
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

          <!-- Core Competencies -->
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
              <Icon name="material-symbols:download" size="20"/>
            </a>
            <div class="mt-4">
              <NuxtLink to="#contact"
                        class="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium px-6 py-3 rounded-lg transition">
                <span>Get in Touch</span>
                <Icon name="material-symbols:arrow-forward-ios" size="16"/>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

