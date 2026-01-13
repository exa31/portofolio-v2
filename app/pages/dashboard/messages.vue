<script setup lang="ts">
import {ref} from 'vue'
import type {Message} from "~/types/message";
import {useToastCustom} from "~/composables/useToastCustom";

definePageMeta({
  layout: 'dashboard',
  breadCrumb: [
    {title: 'Messages'}
  ]
})

const {
  fetchMessages,
  updateMessageStatus,
  deleteMessage,
  messages,
  isLoading,
  cursor,
  hasMore,
} = useMessage()

const toast = useToastCustom()
const selectedMessage = ref<Message | null>(null)
const isDetailOpen = ref(false)
const selectedStatus = ref<'unread' | 'read'>('unread')
const canLoadMore = ref(false)

// Fetch initial messages on SSR/CSR
const {data} = await useAsyncData(`messages-${selectedStatus.value}`, async () => {
  return await fetchMessages(false, selectedStatus.value)
})


// Watch for status changes
watch([selectedStatus], async () => {
  cursor.value = null
  canLoadMore.value = false
  try {
    await fetchMessages(false, selectedStatus.value)
  } finally {
    canLoadMore.value = true
  }
}, {immediate: false})

const scrollTriggerRef = ref<HTMLElement>()

// Intersection Observer setup (client-side only)
const setupIntersectionObserver = () => {
  if (import.meta.server || !scrollTriggerRef.value) return

  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore.value && !isLoading.value && canLoadMore.value) {
            fetchMessages(true, selectedStatus.value)
          }
        })
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
  )

  observer.observe(scrollTriggerRef.value)

  onUnmounted(() => {
    observer.disconnect()
  })
}

// Setup observer on client-side only
if (import.meta.client) {
  onMounted(() => {
    if (data.value) {
      messages.value = data.value.data
      hasMore.value = data.value.has_next

      if (data.value.data.length > 0) {
        cursor.value = data.value.data.at(-1)!.id as any
      }
    }
    canLoadMore.value = true
    setupIntersectionObserver()
  })
}

const openMessage = (message: Message) => {
  selectedMessage.value = message
  // Mark as read if unread
  if (message.status === 'unread') {
    updateMessageStatus(message.id!, 'read')
  }
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'unread':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/40'
    case 'read':
      return 'bg-white/10 text-white/70 border-white/20'
    default:
      return 'bg-white/10 text-white/70'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'unread':
      return 'material-symbols:mark-email-unread'
    case 'read':
      return 'mdi:email-open'
    default:
      return 'material-symbols:mail-rounded'
  }
}

const deleteMessageHandler = async (messageId: string) => {
  toast.showConfirmationToast(
      'Delete Message',
      'Are you sure you want to delete this message? This action cannot be undone.',
      async () => {
        const success = await deleteMessage(messageId)
        if (success) {
          closeDetail()
          cursor.value = null
          canLoadMore.value = false
          try {
            await fetchMessages(false, selectedStatus.value)
          } finally {
            canLoadMore.value = true
          }
        }
      }
  )
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
}
</script>

<template>
  <div class="p-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-black text-white mb-2">Messages</h1>
      <p class="text-white/60">Manage and respond to messages from visitors and potential clients.</p>
    </div>

    <!-- Status Tabs -->
    <div class="flex gap-2 mb-8 border-b border-white/10">
      <button
          @click="selectedStatus = 'unread'"
          :class="[
            'px-6 py-3 font-semibold transition-all border-b-2',
            selectedStatus === 'unread'
              ? 'text-primary border-primary'
              : 'text-white/60 border-transparent hover:text-white/80'
          ]"
      >
        <div class="flex items-center gap-2">
          <Icon name="material-symbols:mark-email-unread" size="18"/>
          Unread
        </div>
      </button>
      <button
          @click="selectedStatus = 'read'"
          :class="[
            'px-6 py-3 font-semibold transition-all border-b-2',
            selectedStatus === 'read'
              ? 'text-primary border-primary'
              : 'text-white/60 border-transparent hover:text-white/80'
          ]"
      >
        <div class="flex items-center gap-2">
          <Icon name="mdi:email-open" size="18"/>
          Read
        </div>
      </button>
    </div>

    <!-- Messages List -->
    <div class="space-y-3 mb-8">
      <!-- Skeleton Loading -->
      <div v-if="isLoading && messages.length === 0" v-for="i in 5" :key="`skeleton-${i}`"
           class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 animate-pulse">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-full bg-white/10 shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-5 bg-white/10 rounded w-1/3"></div>
            <div class="h-4 bg-white/10 rounded w-1/2"></div>
            <div class="h-4 bg-white/10 rounded w-full"></div>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div
          v-for="message in messages"
          :key="message.id"
          @click="openMessage(message)"
          class="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
          :class="message.status === 'unread' ? 'border-blue-500/30 bg-blue-500/5' : ''"
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
                  :class="['px-3 py-1 rounded-full text-xs font-semibold border shrink-0 flex items-center gap-1', getStatusColor(message.status || 'read')]">
                <Icon :name="getStatusIcon(message.status || 'read')" size="14"/>
                {{ message.status?.charAt(0).toUpperCase() + message.status?.slice(1) }}
              </span>
            </div>
            <p class="text-sm text-white/60 mb-1">{{ message.email }}</p>
            <p class="text-sm font-semibold text-white mb-2">{{ message.subject }}</p>
            <p class="text-sm text-white/70 line-clamp-2 mb-3">{{ message.message }}</p>
            <p class="text-xs text-white/40">{{ formatDate(message.created_at || '') }}</p>
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
    <div v-if="messages.length === 0 && !isLoading" class="flex flex-col items-center justify-center py-20">
      <Icon name="carbon:email" size="48" class="text-white/30 mb-4"/>
      <h3 class="text-xl font-bold text-white mb-2">No messages</h3>
      <p class="text-white/60 text-center">You don't have any {{ selectedStatus }} messages yet</p>
    </div>

    <!-- Scroll Trigger for Infinite Scroll (Load More) -->
    <div ref="scrollTriggerRef" class="h-10 flex items-center justify-center">
      <div v-if="isLoading && messages.length > 0 && canLoadMore"
           class="flex items-center gap-2 text-white/60 text-sm">
        <Icon name="carbon:loading" size="16" class="animate-spin"/>
        <p>Loading more messages...</p>
      </div>
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
                      {{ selectedMessage?.status?.charAt(0).toUpperCase() + selectedMessage?.status?.slice(1) }}
                    </span>
                  </div>
                  <div class="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p class="text-xs text-white/60 mb-2">Received</p>
                    <p class="text-white font-semibold">{{ formatDate(selectedMessage?.created_at || '') }}</p>
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
          <button
              @click="deleteMessageHandler(selectedMessage?.id || '')"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-all border border-red-500/40">
            <Icon name="carbon:trash-can" size="18"/>
            Delete
          </button>
          <button
              @click="closeDetail"
              class="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 font-semibold transition-all">
            Close
          </button>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
</style>

