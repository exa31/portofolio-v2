<script setup lang="ts">
import type { UserSettingsModel } from "~/types/settings";

defineProps<{
  user?: UserSettingsModel | null;
}>();

const quickPills = [
  { label: 'Vue / Nuxt 3', icon: 'logos:vue' },
  { label: 'Go / Node.js', icon: 'logos:go' },
  { label: 'Cloud / K8s', icon: 'logos:kubernetes' },
  { label: 'PostgreSQL', icon: 'logos:postgresql' }
];
</script>

<template>
  <section class="relative pt-6 pb-20 md:pt-12 md:pb-28 overflow-hidden" aria-label="Hero section">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        <!-- Left Column (Text & CTAs) -->
        <div class="lg:col-span-7 flex flex-col items-start z-10">
          
          <!-- Availability Badge -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, ease: 'easeOut' }"
          >
            <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-950/60 border border-blue-500/30 backdrop-blur-md mb-6 shadow-lg shadow-blue-500/10">
              <span class="relative flex h-2.5 w-2.5">
                <span class="radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span class="text-xs font-mono font-medium tracking-wide text-blue-200">
                {{ user?.open_to_opportunities ? 'Available for New Projects & Roles' : 'Full Stack Developer & Engineer' }}
              </span>
            </div>
          </Motion>

          <!-- Main Headline -->
          <Motion
            :initial="{ opacity: 0, y: 25 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, ease: 'easeOut', delay: 0.15 }"
          >
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.1] mb-6 text-white">
              Hi, I'm <span class="text-gradient-primary">Eka</span>.<br />
              Architecting <span class="text-gradient-cyan">Scalable</span><br class="hidden sm:inline" />
              Systems & Web Apps.
            </h1>
          </Motion>

          <!-- Subtitle / Bio -->
          <Motion
            :initial="{ opacity: 0, y: 25 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, ease: 'easeOut', delay: 0.3 }"
          >
            <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mb-8 font-light">
              Full-Stack Software Engineer bridging resilient backend microservices, high-performance web platforms, and mobile experiences. Focused on clean architecture, cloud scalability, and production excellence.
            </p>
          </Motion>

          <!-- Interactive CTAs -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, ease: 'easeOut', delay: 0.45 }"
            class="w-full sm:w-auto"
          >
            <div class="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#project"
                class="btn-shimmer-primary px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide text-white inline-flex items-center justify-center gap-2.5 shadow-xl group cursor-pointer w-full sm:w-auto"
                aria-label="View featured projects"
              >
                <span>Explore Projects</span>
                <Icon name="carbon:arrow-right" size="18" class="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#contact"
                class="btn-glass-secondary px-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide text-slate-200 hover:text-white inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                aria-label="Get in touch"
              >
                <Icon name="carbon:chat" size="18" class="text-blue-400" />
                <span>Contact Me</span>
              </a>
            </div>
          </Motion>

          <!-- Social Links & Quick Stack Pills -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, ease: 'easeOut', delay: 0.6 }"
            class="pt-4 border-t border-white/[0.08] w-full max-w-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <!-- Social Dock -->
            <div class="flex items-center gap-2.5">
              <span class="text-xs font-mono text-slate-400 uppercase mr-1">Connect:</span>
              
              <a
                :href="user?.github_profile ?? 'https://github.com'"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                aria-label="GitHub Profile"
              >
                <Icon name="line-md:github" size="20" />
              </a>

              <a
                :href="user?.linkedin_profile ?? 'https://www.linkedin.com'"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                aria-label="LinkedIn Profile"
              >
                <Icon name="jam:linkedin" size="20" />
              </a>

              <a
                :href="`mailto:${user?.email ?? 'contact@eka-dev.cloud'}`"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                aria-label="Send an Email"
              >
                <Icon name="carbon:email" size="20" />
              </a>
            </div>

            <!-- Quick Pill Highlights -->
            <div class="hidden sm:flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                Go • Vue • K8s
              </span>
            </div>
          </Motion>

        </div>

        <!-- Right Column (Futuristic IDE Showcase & Glass Card) -->
        <div class="lg:col-span-5 relative flex justify-center lg:justify-end">
          
          <Motion
            :initial="{ opacity: 0, scale: 0.92, y: 30 }"
            :animate="{ opacity: 1, scale: 1, y: 0 }"
            :transition="{ duration: 0.9, ease: 'easeOut', delay: 0.35 }"
            class="relative w-full max-w-lg"
          >
            <!-- Ambient Glow behind card -->
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-indigo-500/20 to-cyan-500/30 rounded-3xl blur-2xl opacity-75"></div>

            <!-- Main IDE Card -->
            <div class="relative rounded-2xl bg-[#090e1a]/90 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden">
              
              <!-- macOS Window Header Bar -->
              <div class="px-4 py-3 bg-[#0c1322] border-b border-white/10 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm"></div>
                  <div class="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
                  <div class="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm"></div>
                </div>

                <!-- Active file tab -->
                <div class="px-3 py-1 rounded-md bg-[#131c31] border border-white/10 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <Icon name="carbon:code" size="13" class="text-blue-400" />
                  <span>developer.config.ts</span>
                </div>

                <div class="flex items-center gap-1 text-slate-500">
                  <Icon name="carbon:overflow-menu-horizontal" size="16" />
                </div>
              </div>

              <!-- Hero Visual / Live Code Interface -->
              <div class="p-4 sm:p-6 space-y-4">
                <!-- Profile Banner Snippet -->
                <div class="relative rounded-xl overflow-hidden border border-white/10 shadow-lg group">
                  <NuxtImg
                    class="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Eka Developer Portfolio Preview"
                    src="/images/hero.webp"
                    loading="eager"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-[#090e1a]/40 to-transparent"></div>
                  
                  <!-- Floating live badge over image -->
                  <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-[#0b1329]/80 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span class="text-xs font-mono text-white font-medium">Production Ready</span>
                    </div>
                    <span class="text-[10px] font-mono text-slate-400">99.9% Uptime</span>
                  </div>
                </div>

                <!-- Interactive Code Snippet Mock -->
                <div class="bg-[#050914] rounded-xl p-3.5 border border-white/5 font-mono text-xs leading-relaxed text-slate-300">
                  <div class="flex items-center justify-between text-[10px] text-slate-500 mb-2 border-b border-white/5 pb-1.5">
                    <span>// Quick Skills Overview</span>
                    <span class="text-emerald-400 font-semibold">ONLINE</span>
                  </div>
                  <p class="text-blue-400"><span class="text-purple-400">const</span> engineer = {</p>
                  <p class="pl-4 text-slate-300">role: <span class="text-emerald-300">'Full Stack & Cloud Engineer'</span>,</p>
                  <p class="pl-4 text-slate-300">core: [<span class="text-amber-300">'Vue'</span>, <span class="text-amber-300">'Go'</span>, <span class="text-amber-300">'Node'</span>, <span class="text-amber-300">'K8s'</span>],</p>
                  <p class="pl-4 text-slate-300">passion: <span class="text-emerald-300">'Scalability & Fluid UX'</span></p>
                  <p class="text-blue-400">};</p>
                </div>

                <!-- Floating Tech Badges -->
                <div class="grid grid-cols-2 gap-2 pt-1">
                  <div 
                    v-for="pill in quickPills" 
                    :key="pill.label"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-slate-300"
                  >
                    <Icon :name="pill.icon" size="16" />
                    <span>{{ pill.label }}</span>
                  </div>
                </div>
              </div>

            </div>
          </Motion>

        </div>

      </div>

      <!-- Scroll Indicator -->
      <div class="mt-16 flex justify-center">
        <a 
          href="#about"
          class="flex flex-col items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group cursor-pointer"
          aria-label="Scroll to About section"
        >
          <span class="text-[10px] font-mono tracking-[0.25em] uppercase font-medium">Scroll to explore</span>
          <div class="w-5 h-9 rounded-full border border-white/20 group-hover:border-blue-400/50 flex justify-center p-1 transition-colors">
            <div class="w-1 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          </div>
        </a>
      </div>

    </div>
  </section>
</template>
