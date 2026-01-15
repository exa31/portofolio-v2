export const useAIChat = () => {
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const {$axios} = useNuxtApp()

    // Chat history persistence
    const STORAGE_KEY = 'ai_chat_history'

    const loadChatHistory = (): Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }> => {
        if (import.meta.client) {
            try {
                const stored = localStorage.getItem(STORAGE_KEY)
                return stored ? JSON.parse(stored) : []
            } catch (err) {
                console.error('Failed to load chat history:', err)
                return []
            }
        }
        return []
    }

    const saveChatHistory = (messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>) => {
        if (import.meta.client) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
            } catch (err) {
                console.error('Failed to save chat history:', err)
            }
        }
    }

    const clearChatHistory = () => {
        if (import.meta.client) {
            try {
                localStorage.removeItem(STORAGE_KEY)
            } catch (err) {
                console.error('Failed to clear chat history:', err)
            }
        }
    }

    const sendMessage = async (prompt: string): Promise<string | null> => {
        isLoading.value = true
        error.value = null

        try {
            const {data} = await $axios.post<BaseResponse<string>>('/api/ai/chat', {
                prompt,
            })

            if (!data?.data) {
                error.value = 'No response from AI'
                return null
            }

            // Save to localStorage
            const history = loadChatHistory()
            history.push(
                {role: 'user', content: prompt, timestamp: Date.now()},
                {role: 'assistant', content: data.data, timestamp: Date.now()}
            )
            saveChatHistory(history)

            return data.data
        } catch (err: any) {
            const message = err?.data?.message || err?.message || 'Failed to get AI response'
            error.value = message
            console.error('[useAIChat] Error:', message)
            return null
        } finally {
            isLoading.value = false
        }
    }

    return {
        isLoading: readonly(isLoading),
        error: readonly(error),
        sendMessage,
        loadChatHistory,
        saveChatHistory,
        clearChatHistory,
    }
}

