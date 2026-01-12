<script setup lang="ts">
import {ref} from 'vue'

definePageMeta({
  layout: 'dashboard',
  breadCrumb: [
    {title: 'Analytics'}
  ]
})

const stats = [
  {
    label: 'Total Visitors',
    value: '12.5K',
    icon: 'carbon:user',
    change: '+12%',
    color: 'from-blue-500 to-blue-600'
  },
  {
    label: 'Page Views',
    value: '45.3K',
    icon: 'carbon:view',
    change: '+24%',
    color: 'from-green-500 to-green-600'
  },
  {
    label: 'Bounce Rate',
    value: '32%',
    icon: 'carbon:exit',
    change: '-8%',
    color: 'from-purple-500 to-purple-600'
  },
  {
    label: 'Avg. Duration',
    value: '3m 42s',
    icon: 'carbon:time',
    change: '+15%',
    color: 'from-orange-500 to-orange-600'
  }
]

const timeRange = ref('30days')

const trafficData = [
  {day: 'Mon', visitors: 240, views: 420},
  {day: 'Tue', visitors: 320, views: 480},
  {day: 'Wed', visitors: 280, views: 450},
  {day: 'Thu', visitors: 400, views: 550},
  {day: 'Fri', visitors: 350, views: 500},
  {day: 'Sat', visitors: 290, views: 420},
  {day: 'Sun', visitors: 310, views: 460}
]

const topPages = [
  {path: '/', title: 'Home', views: 5240, bounce: '28%'},
  {path: '/projects', title: 'Projects', views: 3840, bounce: '32%'},
  {path: '/about', title: 'About', views: 2150, bounce: '38%'},
  {path: '/blog', title: 'Blog', views: 1820, bounce: '45%'},
  {path: '/contact', title: 'Contact', views: 1240, bounce: '52%'}
]

const topReferrers = [
  {source: 'Direct', visits: 3200, percentage: 35},
  {source: 'Google', visits: 2840, percentage: 31},
  {source: 'LinkedIn', visits: 1560, percentage: 17},
  {source: 'GitHub', visits: 920, percentage: 10},
  {source: 'Twitter', visits: 640, percentage: 7}
]
</script>

<template>
  <div class="p-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-4xl font-black text-white mb-2">Analytics</h1>
        <p class="text-white/60">Track your portfolio performance and visitor insights.</p>
      </div>

      <!-- Time Range Selector -->
      <div class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
        <button
            v-for="option in [
              { value: '7days', label: '7 Days' },
              { value: '30days', label: '30 Days' },
              { value: '90days', label: '90 Days' }
            ]"
            :key="option.value"
            @click="timeRange = option.value"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              timeRange === option.value
                ? 'bg-primary text-white'
                : 'text-white/70 hover:text-white'
            ]"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
          v-for="stat in stats"
          :key="stat.label"
          class="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 overflow-hidden"
      >
        <!-- Background gradient -->
        <div
            :class="['absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity', stat.color]"></div>

        <!-- Content -->
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-4">
            <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', `bg-gradient-to-br ${stat.color}`]">
              <Icon :name="stat.icon" size="24" class="text-white"/>
            </div>
            <span
                class="px-2 py-1 rounded-full text-xs font-semibold text-green-400 bg-green-500/20 border border-green-500/40">
              {{ stat.change }}
            </span>
          </div>

          <p class="text-3xl font-black text-white mb-1">{{ stat.value }}</p>
          <p class="text-sm text-white/60">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Traffic Chart -->
      <div class="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 class="text-2xl font-bold text-white mb-6">Traffic Overview</h2>

        <!-- Simple Bar Chart Visualization -->
        <div class="space-y-4">
          <div v-for="data in trafficData" :key="data.day" class="space-y-2">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-white">{{ data.day }}</span>
              <span class="text-xs text-white/60">{{ data.views }} views</span>
            </div>
            <div class="flex gap-2">
              <div class="flex-1">
                <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-primary rounded-full" :style="{width: (data.visitors / 400) * 100 + '%'}"></div>
                </div>
              </div>
              <div class="flex-1">
                <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full" :style="{width: (data.views / 550) * 100 + '%'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-primary"></div>
            <span class="text-white/70">Visitors</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
            <span class="text-white/70">Views</span>
          </div>
        </div>
      </div>

      <!-- Top Referrers -->
      <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 class="text-2xl font-bold text-white mb-6">Top Referrers</h2>

        <div class="space-y-4">
          <div v-for="referrer in topReferrers" :key="referrer.source" class="space-y-2">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-white">{{ referrer.source }}</span>
              <span class="text-xs text-white/60">{{ referrer.visits }}</span>
            </div>
            <div class="h-2 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full" :style="{width: referrer.percentage + '%'}"></div>
            </div>
            <div class="text-xs text-white/50 text-right">{{ referrer.percentage }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Pages Table -->
    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <div class="p-6 border-b border-white/10">
        <h2 class="text-2xl font-bold text-white">Top Pages</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
          <tr class="border-b border-white/10">
            <th class="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Page</th>
            <th class="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Views</th>
            <th class="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Bounce Rate
            </th>
            <th class="text-right px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Trend</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="page in topPages" :key="page.path"
              class="border-b border-white/10 hover:bg-white/5 transition-colors">
            <td class="px-6 py-4">
              <div>
                <p class="font-semibold text-white">{{ page.title }}</p>
                <p class="text-xs text-white/50 font-mono">{{ page.path }}</p>
              </div>
            </td>
            <td class="px-6 py-4 text-white/80">{{ page.views }}</td>
            <td class="px-6 py-4 text-white/80">{{ page.bounce }}</td>
            <td class="px-6 py-4 text-right">
              <Icon name="carbon:trending-up" size="18" class="text-green-400"/>
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

