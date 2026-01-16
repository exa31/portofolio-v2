import {useToastCustom} from "~/composables/useToastCustom";
import type {Message, MessagesResponse} from "~/types/message";

export const useMessage = () => {
    const messages = ref<Array<Message>>([])
    const isLoading = ref<boolean>(false)
    const isSaving = ref<boolean>(false)
    const cursor = ref<string | null>(null)
    const {$axios} = useNuxtApp()
    const toast = useToastCustom()
    const hasMore = ref<boolean>(true)

    const fetchMessages = async (loadMore = false, status: 'unread' | 'read', pagination: boolean = true): Promise<MessagesResponse> => {
        isLoading.value = true
        try {
            const query: Record<string, any> = {
                status: status,
                pagination: pagination,
                limit: 20,
            }

            if (loadMore && cursor.value) {
                query.cursor = cursor.value
            }

            const params = Object.fromEntries(
                Object.entries(query).filter(([, v]) => v !== undefined)
            )

            const response = await $axios.get<BaseResponse<MessagesResponse>>('/api/messages', {params})
            const body = response.data

            if (!body || !body.data) {
                console.error('Invalid response from server', body)
                return {
                    data: [],
                    has_next: false,
                }
            }

            if (loadMore) {
                messages.value.push(...body.data.data)
            } else {
                messages.value = body.data.data
            }

            hasMore.value = body.data.has_next

            if (body.data.data.length > 0) {
                const last = body.data.data.at(-1)
                cursor.value = last && last.id ? last.id : null
            }

            return body.data
        } catch (error) {
            console.error('Failed to fetch messages:', error)
            return {
                data: [],
                has_next: false,
            }
        } finally {
            isLoading.value = false
        }
    }

    const fetchMessageById = async (messageId: string): Promise<Message | null> => {
        isLoading.value = true
        try {
            const response = await $axios.get<BaseResponse<Message>>(`/api/messages/${messageId}`)
            const body = response.data

            if (!body || !body.data) {
                console.error('Invalid response from server', body)
                return null
            }

            return body.data
        } catch (error) {
            console.error('Failed to fetch message by ID:', error)
            return null
        } finally {
            isLoading.value = false
        }
    }

    const createMessage = async (messageData: Message): Promise<boolean> => {
        isSaving.value = true
        const loadingToast = toast.showLoadingToast("Sending Message", "Please wait while your message is being sent.")
        try {
            const filteredData: Record<string, any> = {}

            filteredData.name = messageData.name
            filteredData.email = messageData.email
            filteredData.subject = messageData.subject
            filteredData.message = messageData.message

            const response = await $axios.post<BaseResponse<Message>>('/api/messages', filteredData)

            if (response.status === 201) {
                toast.updateToast(
                    loadingToast.id,
                    "Success",
                    "Message sent successfully!",
                    "success",
                    3000
                )
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to create message:', error)
            const message = getErrorMessageAxios(error)
            toast.updateToast(
                loadingToast.id,
                "Error",
                message,
                "error",
                5000
            )
            return false
        } finally {
            isSaving.value = false
        }
    }

    const updateMessageStatus = async (id: string, status: 'unread' | 'read'): Promise<boolean> => {
        try {
            const response = await $axios.put<BaseResponse<Message>>(`/api/messages`, {status, id})

            if (response.status === 200) {
                // Update local state
                const message = messages.value.find(m => m.id === id)
                if (message) {
                    message.status = status
                }
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to update message status:', error)
            return false
        }
    }

    const deleteMessage = async (id: string): Promise<boolean> => {
        const loadingToast = toast.showLoadingToast("Deleting Message", "Please wait while the message is being deleted.")
        try {
            const response = await $axios.delete<BaseResponse<void>>(`/api/messages/${id}`)

            if (response.status === 200) {
                toast.updateToast(loadingToast.id, "Success", "Message deleted successfully!", "success", 3000)
                messages.value = messages.value.filter(m => m.id !== id)
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to delete message:', error)
            const message = getErrorMessageAxios(error)
            toast.updateToast(
                loadingToast.id,
                "Error",
                message,
                "error",
                5000
            )
            return false
        }
    }

    return {
        messages,
        isLoading,
        isSaving,
        cursor,
        hasMore,
        fetchMessages,
        fetchMessageById,
        createMessage,
        updateMessageStatus,
        deleteMessage,
    }
}

