<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  breadCrumb: []
})


const stats = [
  {
    label: 'Total Projects',
    value: '12',
    icon: 'carbon:folder-open',
    color: 'from-blue-500 to-blue-600'
  },
  {
    label: 'Published',
    value: '8',
    icon: 'pepicons-pop:checkmark-circle-filled',
    color: 'from-green-500 to-green-600'
  },
  {
    label: 'In Draft',
    value: '3',
    icon: 'carbon:document-add',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    label: 'Total Views',
    value: '2.4K',
    icon: 'carbon:view',
    color: 'from-purple-500 to-purple-600'
  }
]

const recentProjects = [
  {
    id: 1,
    title: 'SaaS Analytics Dashboard',
    status: 'Published',
    views: 324,
    updatedAt: '2 days ago'
  },
  {
    id: 2,
    title: 'E-Commerce Storefront',
    status: 'Draft',
    views: 0,
    updatedAt: '1 week ago'
  },
  {
    id: 3,
    title: 'Node.js API Gateway',
    status: 'Published',
    views: 512,
    updatedAt: '3 weeks ago'
  }
]
</script>

<template>
  <div class="p-8">
    <!-- Welcome Section -->
    <div class="mb-12">
      <h1 class="text-4xl font-black text-white mb-2">Welcome back, Eka! 👋</h1>
      <p class="text-white/60">Here's what's happening with your portfolio today.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div
          v-for="stat in stats"
          :key="stat.label"
          class="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 overflow-hidden"
      >
        <!-- Background gradient -->
        <div
            :class="['absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-5 transition-opacity', stat.color]"></div>

        <!-- Content -->
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-4">
            <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', `bg-linear-to-br ${stat.color}`]">
              <Icon :name="stat.icon" size="24" class="text-white"/>
            </div>
            <Icon name="carbon:arrow-up-right" size="20"
                  class="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
          </div>

          <p class="text-3xl font-black text-white mb-1">{{ stat.value }}</p>
          <p class="text-sm text-white/60">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Projects Section -->
    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white">Recent Projects</h2>
          <p class="text-sm text-white/60 mt-1">Your latest updates</p>
        </div>
        <NuxtLink to="/dashboard/projects"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-primary hover:bg-primary/10 transition-colors text-sm font-semibold">
          View All
          <Icon name="carbon:arrow-right" size="16"/>
        </NuxtLink>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
          <tr class="border-b border-white/10">
            <th class="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Project</th>
            <th class="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Status</th>
            <th class="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Views</th>
            <th class="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Updated</th>
            <th class="text-right px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="project in recentProjects"
              :key="project.id"
              class="border-b border-white/10 hover:bg-white/5 transition-colors"
          >
            <td class="px-6 py-4">
              <p class="font-semibold text-white">{{ project.title }}</p>
            </td>
            <td class="px-6 py-4">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold border',
                  project.status === 'Published'
                    ? 'bg-green-500/20 text-green-400 border-green-500/40'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                ]">
                  {{ project.status }}
                </span>
            </td>
            <td class="px-6 py-4 text-white/80">{{ project.views }}</td>
            <td class="px-6 py-4 text-white/60 text-sm">{{ project.updatedAt }}</td>
            <td class="px-6 py-4 text-right">
              <button class="text-primary hover:text-primary/80 transition-colors">
                <Icon name="carbon:pen" size="18"/>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

