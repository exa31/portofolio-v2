import {useToastCustom} from "~/composables/useToastCustom";
import type {Journey, JourneysResponse} from "~/types/journey";

export const useJourney = () => {
    const journeys = ref<Array<Journey>>([])
    const isLoading = ref<boolean>(false)
    const isSaving = ref<boolean>(false)
    const cursor = ref<number | null>(null)
    const {$axios} = useNuxtApp()
    const toast = useToastCustom()
    const hasMore = ref<boolean>(true)

    const fetchJourneys = async (loadMore = false, searchQuery: string, pagination: boolean = true): Promise<JourneysResponse> => {
        isLoading.value = true
        try {
            const query: Record<string, any> = {
                search: searchQuery || undefined,
                pagination: pagination,
                limit: 12,
            }

            if (loadMore && cursor.value) {
                query.cursor = cursor.value
            }

            const params = Object.fromEntries(
                Object.entries(query).filter(([, v]) => v !== undefined)
            )

            const response = await $axios.get<BaseResponse<JourneysResponse>>('/api/journeys', {params})
            const body = response.data

            if (!body || !body.data) {
                console.error('Invalid response from server', body)
                return {
                    data: [],
                    has_next: false,
                }
            }

            if (loadMore) {
                journeys.value.push(...body.data.data)
            } else {
                journeys.value = body.data.data
            }

            hasMore.value = body.data.has_next

            if (body.data.data.length > 0) {
                const last = body.data.data.at(-1)
                cursor.value = last && last.id != null ? last.id : null
            }

            return body.data
        } catch (error) {
            console.error('Failed to fetch journeys:', error)
            return {
                data: [],
                has_next: false,
            }
        } finally {
            isLoading.value = false
        }
    }

    const fetchJourneyById = async (journeyId: number): Promise<Journey | null> => {
        isLoading.value = true
        try {
            const response = await $axios.get<BaseResponse<Journey>>(`/api/journeys/${journeyId}`)
            const body = response.data

            if (!body || !body.data) {
                console.error('Invalid response from server', body)
                return null
            }

            return body.data
        } catch (error) {
            console.error('Failed to fetch journey by ID:', error)
            return null
        } finally {
            isLoading.value = false
        }
    }

    const createJourney = async (journeyData: Journey): Promise<boolean> => {
        isSaving.value = true
        const loadingToast = toast.showLoadingToast("Creating Journey", "Please wait while the journey is being created.")
        try {
            const filteredData: Record<string, any> = {}

            filteredData.title = journeyData.title
            filteredData.company = journeyData.company
            filteredData.start_date = journeyData.start_date
            filteredData.is_current = journeyData.is_current
            filteredData.key_responsibilities = journeyData.key_responsibilities.filter((r: string) => r.trim())

            if (journeyData.location) {
                filteredData.location = journeyData.location
            }
            if (journeyData.end_date) {
                filteredData.end_date = journeyData.end_date
            }
            if (journeyData.is_current) {
                filteredData.end_date = null
            }
            if (journeyData.description) {
                filteredData.description = journeyData.description
            }
            if (journeyData.attachments) {
                filteredData.attachments = journeyData.attachments
            }
            if (journeyData.id_skills && journeyData.id_skills.length > 0) {
                filteredData.id_skills = journeyData.id_skills
            }

            const response = await $axios.post<BaseResponse<Journey>>('/api/journeys', filteredData)

            if (response.status === 201) {
                toast.updateToast(loadingToast.id, "Success", "Journey created successfully!", "success", 3000)
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to create journey:', error)
            const errorMessage = getErrorMessageAxios(error)
            toast.updateToast(loadingToast.id, "Error", `Failed to create journey: ${errorMessage}`, "error", 5000)
            return false
        } finally {
            isSaving.value = false
        }
    }

    const updateJourney = async (journeyData: Journey): Promise<boolean> => {
        isSaving.value = true
        const loadingToast = toast.showLoadingToast("Updating Journey", "Please wait while the journey is being updated.")
        try {
            const filteredData: Record<string, any> = {}

            filteredData.id = journeyData.id
            filteredData.title = journeyData.title
            filteredData.company = journeyData.company
            filteredData.start_date = journeyData.start_date
            filteredData.is_current = journeyData.is_current
            filteredData.key_responsibilities = journeyData.key_responsibilities.filter((r: string) => r.trim())

            if (journeyData.location) {
                filteredData.location = journeyData.location
            }
            if (journeyData.end_date) {
                filteredData.end_date = journeyData.end_date
            }
            if (journeyData.is_current) {
                filteredData.end_date = null
            }
            if (journeyData.description) {
                filteredData.description = journeyData.description
            }
            if (journeyData.attachments) {
                filteredData.attachments = journeyData.attachments
            }
            if (journeyData.id_skills && journeyData.id_skills.length > 0) {
                filteredData.id_skills = journeyData.id_skills
            }

            const response = await $axios.put<BaseResponse<Journey>>('/api/journeys', filteredData)

            if (response.status === 200) {
                toast.updateToast(loadingToast.id, "Success", "Journey updated successfully!", "success", 3000)
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to update journey:', error)
            const errorMessage = getErrorMessageAxios(error)
            toast.updateToast(loadingToast.id, "Error", `Failed to update journey: ${errorMessage}`, "error", 5000)
            return false
        } finally {
            isSaving.value = false
        }
    }

    const deleteJourney = async (id: number): Promise<boolean> => {
        const loadingToast = toast.showLoadingToast("Deleting Journey", "Please wait while the journey is being deleted.")
        try {
            const response = await $axios.delete<BaseResponse<void>>(`/api/journeys/${id}`)

            if (response.status === 200) {
                toast.updateToast(loadingToast.id, "Success", "Journey deleted successfully!", "success", 3000)
                journeys.value = journeys.value.filter(j => j.id !== id)
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to delete journey:', error)
            const errorMessage = getErrorMessageAxios(error)
            toast.updateToast(loadingToast.id, "Error", `Failed to delete journey: ${errorMessage}`, "error", 5000)
            return false
        }
    }

    return {
        journeys,
        isLoading,
        isSaving,
        cursor,
        hasMore,
        fetchJourneys,
        fetchJourneyById,
        createJourney,
        updateJourney,
        deleteJourney,
    }
}

