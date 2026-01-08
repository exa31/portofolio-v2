<script setup lang="ts">
import {ref} from 'vue'

definePageMeta({
  layout: 'dashboard'
})

interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  status: 'Unread' | 'Read' | 'Replied'
  receivedAt: string
  avatar: string
}

const messages = ref<Message[]>([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Project Collaboration Inquiry',
    message: 'Hi Eka, I\'m interested in collaborating on a web development project. Can we discuss the details?',
    status: 'Unread',
    receivedAt: '2 hours ago',
    avatar: 'https://via.placeholder.com/40'
  },
  {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    subject: 'Job Opportunity',
    message: 'We have an exciting full-stack developer position available. Would you be interested in discussing this opportunity?',
    status: 'Unread',
    receivedAt: '5 hours ago',
    avatar: 'https://via.placeholder.com/40'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    subject: 'Portfolio Feedback',
    message: 'Great work on your portfolio! I really liked your projects. Keep up the good work!',
    status: 'Read',
    receivedAt: '1 day ago',
    avatar: 'https://via.placeholder.com/40'
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma@example.com',
    subject: 'Technical Consultation',
    message: 'I would like to consult with you about some technical challenges in our current project.',
    status: 'Read',
    receivedAt: '2 days ago',
    avatar: 'https://via.placeholder.com/40'
  },
  {
    id: 5,
    name: 'Alex Brown',
    email: 'alex@example.com',
    subject: 'Follow-up Discussion',
    message: 'Thanks for your previous response. I have a few more questions I\'d like to discuss.',
    status: 'Replied',
    receivedAt: '3 days ago',
    avatar: 'https://via.placeholder.com/40'
  }
])

const selectedMessage = ref<Message | null>(null)
const isDetailOpen = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('All')

const filteredMessages = computed(() => {
  return messages.value.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'All' || msg.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Unread':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/40'
    case 'Read':
      return 'bg-white/10 text-white/70 border-white/20'
    case 'Replied':
      return 'bg-green-500/20 text-green-400 border-green-500/40'
    default:
      return 'bg-white/10 text-white/70'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Unread':
      return 'material-symbols:mark-email-unread'
    case 'Read':
      return 'mdi:email-open'
    case 'Replied':
      return 'carbon:send-filled'
    default:
      return 'material-symbols:mail-rounded'
  }
}

const openMessage = (message: Message) => {
  selectedMessage.value = message
  isDetailOpen.value = true
}

const closeDetail = () => {
  isDetailOpen.value = false
  selectedMessage.value = null
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
  <div class="p-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-black text-white mb-2">Messages</h1>
      <p class="text-white/60">Manage and respond to messages from visitors and potential clients.</p>
    </div>

    <!-- Filters Section -->
    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="relative lg:col-span-2">
          <Icon name="carbon:search" size="20"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"/>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, email, or subject..."
              class="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
          />
        </div>

        <!-- Status Filter -->
        <div class="relative">
          <select
              v-model="selectedStatus"
              class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
          >
            <option value="All">Status: All</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
            <option value="Replied">Replied</option>
          </select>
          <Icon name="carbon:chevron-down" size="16"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none"/>
        </div>
      </div>

      <!-- Count -->
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <p class="text-sm text-white/60">{{ filteredMessages.length }} messages</p>
      </div>
    </div>

    <!-- Messages List -->
    <div class="space-y-3">
      <div
          v-for="message in filteredMessages"
          :key="message.id"
          @click="openMessage(message)"
          class="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
          :class="message.status === 'Unread' ? 'border-blue-500/30 bg-blue-500/5' : ''"
      >
        <div class="flex items-start gap-4">
          <!-- Avatar with Initials -->
          <div
              class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
              :style="getAvatarStyle(message.name)">
            {{ getInitials(message.name) }}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-base font-bold text-white group-hover:text-primary transition-colors">
                {{ message.name }}
              </h3>
              <span
                  :class="['px-3 py-1 rounded-full text-xs font-semibold border shrink-0 flex items-center gap-1', getStatusColor(message.status)]">
                <Icon :name="getStatusIcon(message.status)" size="14"/>
                {{ message.status }}
              </span>
            </div>
            <p class="text-sm text-white/60 mb-1">{{ message.email }}</p>
            <p class="text-sm font-semibold text-white mb-2">{{ message.subject }}</p>
            <p class="text-sm text-white/70 line-clamp-2 mb-3">{{ message.message }}</p>
            <p class="text-xs text-white/40">{{ message.receivedAt }}</p>
          </div>

          <!-- Action -->
          <button
              class="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-white/50 hover:text-primary transition-all shrink-0">
            <Icon name="carbon:arrow-right" size="18"/>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredMessages.length === 0" class="flex flex-col items-center justify-center py-20">
      <Icon name="carbon:inbox-empty" size="64" class="text-white/20 mb-6"/>
      <h3 class="text-xl font-bold text-white mb-2">No messages found</h3>
      <p class="text-white/60 text-center">Try adjusting your search or filter criteria</p>
    </div>

    <!-- Message Detail Modal -->
    <UModal v-model:open="isDetailOpen">
      <!-- Hidden Title for Accessibility -->
      <template #title>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-3">
            <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
                :style="getAvatarStyle(selectedMessage?.name || '')">
              {{ getInitials(selectedMessage?.name || '') }}
            </div>
            <div>
              <h2 class="text-2xl sm:text-3xl font-black text-white">{{ selectedMessage?.name }}</h2>
              <p class="text-xs sm:text-sm text-white/50">{{ selectedMessage?.email }}</p>
            </div>
          </div>
        </div>
      </template>

      <template #description>
        <p class="text-sm font-semibold text-white">{{ selectedMessage?.subject }}</p>
      </template>

      <!-- Body -->
      <template #body>
        <div class="overflow-y-auto flex-1">
          <div class="mx-auto px-4 sm:px-8 py-8 sm:py-12">
            <div class="space-y-8">
              <!-- Message Content -->
              <div>
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Icon name="solar:letter-opened-bold" size="20" class="text-primary"/>
                  Message Content
                </h3>
                <div class="bg-white/5 border border-white/10 rounded-lg p-6">
                  <p class="text-white/85 leading-relaxed whitespace-pre-wrap">{{ selectedMessage?.message }}</p>
                </div>
              </div>

              <!-- Sender Details -->
              <div>
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Icon name="carbon:user" size="20" class="text-primary"/>
                  Sender Details
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p class="text-xs text-white/60 mb-2">Name</p>
                    <p class="text-white font-semibold">{{ selectedMessage?.name }}</p>
                  </div>
                  <div class="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p class="text-xs text-white/60 mb-2">Email</p>
                    <p class="text-white font-semibold break-all">{{ selectedMessage?.email }}</p>
                  </div>
                  <div class="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p class="text-xs text-white/60 mb-2">Status</p>
                    <span
                        :class="['px-3 py-1 rounded-full text-xs font-semibold border inline-flex items-center gap-1', getStatusColor(selectedMessage?.status || '')]">
                      <Icon :name="getStatusIcon(selectedMessage?.status || '')" size="14"/>
                      {{ selectedMessage?.status }}
                    </span>
                  </div>
                  <div class="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p class="text-xs text-white/60 mb-2">Received</p>
                    <p class="text-white font-semibold">{{ selectedMessage?.receivedAt }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Footer -->
      <template #footer>
        <div class="px-4 sm:px-8 py-4 sm:py-6 flex w-full justify-end gap-2 sm:gap-3">
          <UButton
              :to="`mailto:${selectedMessage?.email}?subject=Re: ${selectedMessage?.subject}`"
              color="primary"
              size="lg"
              class="bg-primary text-white hover:brightness-110 font-bold rounded-lg text-sm sm:text-base"
          >
            <template #leading>
              <Icon name="carbon:send-filled" size="18" class="sm:w-5 sm:h-5"/>
            </template>
            Reply
          </UButton>
          <UButton
              color="neutral"
              variant="outline"
              size="lg"
              @click="closeDetail"
              class="shrink-0 hover:bg-white/10 cursor-pointer font-semibold rounded-lg px-4 sm:px-6 text-sm sm:text-base"
          >
            Close
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
</style>

