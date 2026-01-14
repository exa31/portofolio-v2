import type {DashboardStats} from '~/types/dashboard'

export const useDashboardStats = () => {
    const {$axios} = useNuxtApp()
    const stats = ref<DashboardStats | null>(null)
    const isLoading = ref(false)

    const fetchStats = async (): Promise<DashboardStats | null> => {
        isLoading.value = true
        try {
            const response = await $axios.get<BaseResponse<DashboardStats>>('/api/dashboard/stats')
            const body = response.data

            if (!body || !body.data) {
                console.error('Invalid response from server', body)
                return null
            }

            stats.value = body.data
            return body.data
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error)
            return null
        } finally {
            isLoading.value = false
        }
    }

    return {
        stats: readonly(stats),
        isLoading: readonly(isLoading),
        fetchStats
    }
}

