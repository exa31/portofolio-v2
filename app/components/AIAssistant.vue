<script setup lang="ts">
import {onMounted, ref} from 'vue'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  isHtml?: boolean
  timestamp: Date
}

const isOpen = ref(false)
const isMinimized = ref(false)
const messages = ref<Message[]>([
  {
    id: '1',
    type: 'assistant',
    content: 'Hi there! 👋 I\'m an AI assistant for this portfolio. Ask me anything about the stack, experience, or projects!',
    timestamp: new Date()
  }
])

const userInput = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement>()
const {sendMessage: callAI, loadChatHistory} = useAIChat()

const predefinedQuestions = [
  'What\'s your tech stack?',
  'Are you open to work?',
  'Can you show me a recent project?'
]

onMounted(() => {
  // Load chat history from localStorage if available
  if (import.meta.client) {
    const history = loadChatHistory()
    if (history.length > 0) {
      const loadedMessages = history.map(msg => ({
        id: String(msg.timestamp),
        type: msg.role as 'user' | 'assistant',
        content: msg.content,
        isHtml: msg.role === 'assistant',
        timestamp: new Date(msg.timestamp)
      }))
      messages.value = [messages.value[0]!, ...loadedMessages]

      setTimeout(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      }, 0)
    }
  }
})

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: userInput.value,
    timestamp: new Date()
  }

  const prompt = userMessage.content
  messages.value.push(userMessage)
  userInput.value = ''
  isLoading.value = true

  // Scroll to bottom
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }, 0)

  try {
    // Call Gemini API via composable
    const response = await callAI(prompt)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response || 'Sorry, I couldn\'t generate a response. Please try again.',
      isHtml: true,
      timestamp: new Date()
    }
    messages.value.push(assistantMessage)
  } catch (error) {
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Sorry, I encountered an error. Please try again later.',
      timestamp: new Date()
    }
    messages.value.push(assistantMessage)
  } finally {
    isLoading.value = false

    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }, 0)
  }
}

const askQuestion = (question: string) => {
  userInput.value = question
  sendMessage()
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    isMinimized.value = false
  }
}

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
}
</script>

<template>
  <!-- AI Assistant Button -->
  <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-1000 flex flex-col items-end gap-4">
    <!-- Chat Window -->
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div
          v-show="isOpen && !isMinimized"
          class="mb-4 w-[calc(100vw-2rem)] sm:w-96 max-w-96 bg-linear-to-br from-[#0f1520] to-[#071026] border border-white/10 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden flex flex-col"
          style="max-height: calc(100vh - 8rem); height: min(600px, calc(100vh - 8rem))"
      >
        <!-- Header -->
        <div class="bg-linear-to-r from-primary via-blue-600 to-primary p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <Icon name="carbon:asleep-filled" size="20" class="text-white"/>
            </div>
            <div>
              <p class="text-white font-bold text-sm">AI Assistant</p>
              <p class="text-white/80 text-xs">Eka's Portfolio</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
                @click="toggleMinimize"
                class="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
            >
              <Icon name="carbon:subtract" size="18"/>
            </button>
            <button
                @click="toggleChat"
                class="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
            >
              <Icon name="carbon:close" size="18"/>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div
            ref="messagesContainer"
            class="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f1520]"
        >
          <div
              v-for="message in messages"
              :key="message.id"
              :class="[
                'flex gap-3 animate-fadeIn',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              ]"
          >
            <!-- Assistant Message -->
            <div v-if="message.type === 'assistant'" class="flex gap-3 max-w-[85%] sm:max-w-xs">
              <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Icon name="carbon:asleep-filled" size="16" class="text-primary"/>
              </div>
              <div v-if="message.isHtml"
                   class="bg-white/10 border border-white/20 rounded-lg p-3 text-white/90 text-sm leading-relaxed prose prose-invert max-w-none"
                   v-html="message.content"></div>
              <div v-else
                   class="bg-white/10 border border-white/20 rounded-lg p-3 text-white/90 text-sm leading-relaxed">
                {{ message.content }}
              </div>
            </div>

            <!-- User Message -->
            <div v-else class="flex gap-3 max-w-[85%] sm:max-w-xs justify-end">
              <div class="bg-primary text-white rounded-lg p-3 text-sm leading-relaxed">
                {{ message.content }}
              </div>
              <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Icon name="carbon:user" size="16" class="text-primary"/>
              </div>
            </div>
          </div>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Icon name="carbon:asleep-filled" size="16" class="text-primary"/>
            </div>
            <div class="bg-white/10 border border-white/20 rounded-lg p-3 flex gap-1">
              <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>

        <!-- Suggested Questions (show only if few messages) -->
        <div v-if="messages.length <= 1 && !isLoading"
             class="px-4 py-3 border-t border-white/10 space-y-2 bg-[#0a0f1a]">
          <p class="text-xs text-white/50 px-2">Quick questions:</p>
          <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2">
            <button
                v-for="(question, idx) in predefinedQuestions"
                :key="idx"
                @click="askQuestion(question)"
                class="w-full sm:flex-1 sm:min-w-fit px-3 py-2 text-xs rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all"
            >
              {{ question }}
            </button>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-3 sm:p-4 border-t border-white/10 bg-[#0a0f1a]">
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <input
                v-model="userInput"
                type="text"
                placeholder="Ask a follow-up question..."
                class="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all text-sm"
            />
            <button
                type="submit"
                :disabled="isLoading"
                class="px-3 sm:px-4 py-2 rounded-lg bg-primary text-white hover:brightness-110 disabled:opacity-50 transition-all"
            >
              <Icon name="carbon:send-filled" size="18"/>
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Minimized Header -->
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
    >
      <div
          v-show="isOpen && isMinimized"
          class="mb-4 w-[calc(100vw-2rem)] sm:w-80 max-w-80 bg-linear-to-r from-primary via-blue-600 to-primary border border-white/10 rounded-xl shadow-lg shadow-primary/20 p-4 cursor-pointer hover:shadow-xl hover:shadow-primary/30 transition-all"
          @click="toggleMinimize"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <Icon name="carbon:asleep-filled" size="20" class="text-white"/>
            </div>
            <div>
              <p class="text-white font-bold text-sm">AI Assistant</p>
              <p class="text-white/80 text-xs">Click to expand</p>
            </div>
          </div>
          <Icon name="carbon:chevron-up" size="20" class="text-white"/>
        </div>
      </div>
    </Transition>

    <!-- Main Chat Button -->
    <button
        @click="toggleChat"
        :class="[
          'w-12 h-12 sm:w-14 sm:h-14 rounded-full cursor-pointer shadow-lg transition-all duration-300 flex items-center justify-center text-white font-bold text-2xl hover:scale-110',
          'bg-linear-to-br from-primary via-blue-600 to-primary hover:shadow-xl hover:shadow-primary/40'
        ]"
    >
      <Icon v-if="!isOpen" name="material-symbols:smart-toy" size="24"/>
      <Icon v-else name="material-symbols:keyboard-arrow-down" size="24"/>
    </button>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Custom scrollbar untuk messages */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(30, 127, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(30, 127, 255, 0.5);
}
</style>

