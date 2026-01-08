<script setup lang="ts">
import {ref} from 'vue'

const isSidebarOpen = ref(false)

const user = {
  name: 'Alex Morgan',
  role: 'Full-Stack Developer',
  avatar: 'https://via.placeholder.com/150'
}

const menuItems = [
  {name: 'Dashboard', icon: 'carbon:dashboard', href: '/dashboard'},
  {name: 'Projects', icon: 'carbon:folder-open', href: '/dashboard/projects'},
  {name: 'Blog Posts', icon: 'carbon:document-blank', href: '/dashboard/blog'},
  {name: 'Messages', icon: 'carbon:email', href: '/dashboard/messages'},
  {name: 'Analytics', icon: 'carbon:chart-bar', href: '/dashboard/analytics'},
]

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

// Generate initials from name
const getInitials = (name: string): string => {
  return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
}

// Generate consistent color based on name
const getAvatarColor = (name: string) => {
  const colors = [
    {from: '#3b82f6', to: '#2563eb'},  // blue
    {from: '#a855f7', to: '#9333ea'},  // purple
    {from: '#ec4899', to: '#db2777'},  // pink
    {from: '#10b981', to: '#059669'},  // green
    {from: '#f97316', to: '#ea580c'},  // orange
    {from: '#ef4444', to: '#dc2626'},  // red
    {from: '#06b6d4', to: '#0891b2'},  // cyan
    {from: '#6366f1', to: '#4f46e5'}   // indigo
  ]

  // Create consistent hash from name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % colors.length
  return colors[index]
}

// Get avatar background style
const getAvatarStyle = (name: string) => {
  const color = getAvatarColor(name)
  return {
    background: `linear-gradient(135deg, ${color!.from} 0%, ${color!.to} 100%)`
  }
}
</script>

<template>
  <div class="flex h-screen bg-[#0a0f1a]">
    <!-- Sidebar - Desktop (hidden on mobile) -->
    <aside
        class="w-64 bg-[#0f1520] border-r border-white/10 flex-col h-screen overflow-y-auto fixed left-0 top-0 bottom-0 hidden lg:flex z-40">
      <!-- Logo -->
      <div class="p-6 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center border border-white/5">
            <Icon name="carbon:terminal" size="24" class="text-primary"/>
          </div>
          <span class="font-bold text-white text-lg">Eka Dev.</span>
        </div>
      </div>

      <!-- User Profile -->
      <div class="p-6 border-b border-white/10">
        <div class="flex items-center gap-3 mb-4">
          <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              :style="getAvatarStyle(user.name)">
            {{ getInitials(user.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-semibold text-sm truncate">{{ user.name }}</p>
            <p class="text-white/50 text-xs truncate">{{ user.role }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <NuxtLink
            v-for="item in menuItems"
            :key="item.href"
            :to="item.href"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all duration-300 group"
            active-class="bg-primary/10 text-primary"
        >
          <Icon :name="item.icon" size="20" class="group-hover:scale-110 transition-transform"/>
          <span class="text-sm font-medium">{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-white/10 space-y-2">
        <NuxtLink
            to="/dashboard/settings"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
        >
          <Icon name="carbon:settings" size="20"/>
          <span>Settings</span>
        </NuxtLink>
        <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium">
          <Icon name="carbon:logout" size="20"/>
          <span>Log Out</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Sidebar Overlay -->
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-show="isSidebarOpen"
          class="fixed inset-0 bg-black/50 lg:hidden z-30"
          @click="closeSidebar"
      ></div>
    </Transition>

    <!-- Sidebar - Mobile (slide in from left) -->
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
    >
      <aside
          v-show="isSidebarOpen"
          class="w-64 bg-[#0f1520] border-r border-white/10 flex flex-col h-screen overflow-y-auto fixed left-0 top-0 bottom-0 lg:hidden z-40"
      >
        <!-- Logo -->
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center border border-white/5">
              <Icon name="carbon:terminal" size="24" class="text-primary"/>
            </div>
            <span class="font-bold text-white text-lg">Eka Dev.</span>
          </div>
          <button @click="closeSidebar"
                  class="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all lg:hidden">
            <Icon name="carbon:close" size="20"/>
          </button>
        </div>

        <!-- User Profile -->
        <div class="p-6 border-b border-white/10">
          <div class="flex items-center gap-3 mb-4">
            <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                :style="getAvatarStyle(user.name)">
              {{ getInitials(user.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold text-sm truncate">{{ user.name }}</p>
              <p class="text-white/50 text-xs truncate">{{ user.role }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NuxtLink
              v-for="item in menuItems"
              :key="item.href"
              :to="item.href"
              @click="closeSidebar"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all duration-300 group"
              active-class="bg-primary/10 text-primary"
          >
            <Icon :name="item.icon" size="20" class="group-hover:scale-110 transition-transform"/>
            <span class="text-sm font-medium">{{ item.name }}</span>
          </NuxtLink>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-white/10 space-y-2">
          <NuxtLink
              to="/dashboard/settings"
              @click="closeSidebar"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
          >
            <Icon name="carbon:settings" size="20"/>
            <span>Settings</span>
          </NuxtLink>
          <button
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium">
            <Icon name="carbon:logout" size="20"/>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col ml-0 lg:ml-64 h-screen">
      <!-- Top Navigation Bar -->
      <header class="h-16 border-b border-white/10 bg-[#0f1520] flex items-center px-4 lg:px-8">
        <!-- Mobile Menu Button -->
        <button
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-all mr-4"
        >
          <Icon name="carbon:menu" size="24"/>
        </button>

        <div class="flex-1 flex items-center gap-4">
          <div class="flex items-center gap-2 text-white/50 text-sm">
            <NuxtLink to="/dashboard" class="hover:text-white transition-colors">Dashboard</NuxtLink>
            <Icon name="carbon:chevron-right" size="16" class="hidden sm:block"/>
            <slot name="breadcrumb">
              <span class="hidden sm:inline">Page</span>
            </slot>
          </div>
        </div>

        <!-- Top Right Actions -->
        <div class="flex items-center gap-2 lg:gap-4">
          <button class="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all">
            <Icon name="carbon:notification" size="20"/>
          </button>
          <button class="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all">
            <Icon name="carbon:user-avatar" size="20"/>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>

