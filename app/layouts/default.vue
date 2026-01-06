<script setup lang="ts">

</script>

<template>
  <main class="from-[#071026] via-[#071423] to-[#071023] text-white min-h-screen bg-linear-to-br">
    <!-- Header -->
    <header class="container mx-auto px-6 py-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center border border-white/5">
          <Icon name="material-symbols-light:terminal" size="28" class="text-primary"/>
        </div>
        <span class="font-semibold">Eka Dev.</span>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm text-white/70">
        <a href="#about" class="hover:text-white duration-300 transition-all">About</a>
        <a href="#stack" class="hover:text-white duration-300 transition-all">Projects</a>
        <a href="#work" class="hover:text-white duration-300 transition-all">Skills</a>
        <a href="#contact" class="hover:text-white duration-300 transition-all">Contact</a>
       
      </nav>

      <!-- mobile menu placeholder -->
      <button class="md:hidden text-white/70">Menu</button>
    </header>
    <slot></slot>
  </main>
</template>

<style scoped>

</style>