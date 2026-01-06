<script setup lang="ts">
</script>

<template>
  <section id="stack" class="py-20">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-5xl lg:text-6xl font-black mb-3 leading-tight">Skills & Tech Stack</h2>
        <p class="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          A comprehensive overview of my technical ecosystem. From frontend architecture to backend scalability,
          explore the tools I use to build modern web solutions
        </p>
      </div>

      <!-- Tech Stack Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <!-- React -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:react" size="40" class="text-blue-400"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">React</span>
        </div>

        <!-- Node.js -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:nodejs" size="40" class="text-green-400"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">Node.js</span>
        </div>

        <!-- TypeScript -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-600/30 hover:bg-blue-600/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:language-typescript" size="40" class="text-blue-500"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">TypeScript</span>
        </div>

        <!-- Next.js -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-gray-300/30 hover:bg-gray-300/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-gray-300/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:nextjs" size="40" class="text-gray-300"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">Next.js</span>
        </div>

        <!-- AWS -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:aws" size="40" class="text-orange-400"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">AWS</span>
        </div>

        <!-- Tailwind CSS -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:tailwind" size="40" class="text-cyan-400"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">Tailwind CSS</span>
        </div>

        <!-- Docker -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:docker" size="40" class="text-blue-400"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">Docker</span>
        </div>

        <!-- GraphQL -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:graphql" size="40" class="text-pink-400"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">GraphQL</span>
        </div>

        <!-- Figma -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:figma" size="40" class="text-purple-400"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">Figma</span>
        </div>

        <!-- PostgreSQL -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-600/30 hover:bg-blue-600/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:database" size="40" class="text-blue-500"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">PostgreSQL</span>
        </div>

        <!-- MongoDB -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-green-600/30 hover:bg-green-600/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-green-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:leaf" size="40" class="text-green-500"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">MongoDB</span>
        </div>

        <!-- Redis -->
        <div
            class="group relative bg-[#1a2332] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300 cursor-pointer min-h-45">
          <div
              class="w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:redis" size="40" class="text-red-400"/>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white">Redis</span>
        </div>
      </div>
    </div>
  </section>
</template>

