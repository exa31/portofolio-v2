import {ref} from 'vue'
import type {Skill, SkillsResponse} from "~/types/skill";
import {useToastCustom} from "~/composables/useToastCustom";
import {isFetchErrorWithBody} from "~/utils/handleError";

interface ValidationError {
    field: string
    message: string
}

export const useSkill = () => {
    const skills = ref<Array<Skill>>([])
    const isLoading = ref<boolean>(false)
    const isSaving = ref<boolean>(false)
    const cursor = ref<string | null>(null)
    const {$apiFetch} = useNuxtApp()
    const toast = useToastCustom()
    const hasMore = ref<boolean>(true)

    const fetchSkills = async (loadMore = false, searchQuery: string): Promise<SkillsResponse> => {
        isLoading.value = true
        try {
            const query: Record<string, any> = {
                search: searchQuery || undefined,
                pagination: true,
                limit: 12,
            }

            if (loadMore && cursor.value) {
                query.cursor = cursor.value
            }

            const response = await $fetch<BaseResponse<SkillsResponse>>('/api/skills', {
                query: Object.fromEntries(
                    Object.entries(query).filter(([, v]) => v !== undefined)
                ),
            })

            if (loadMore) {
                skills.value.push(...response.data!.data)
            } else {
                skills.value = response.data!.data
            }

            hasMore.value = response.data!.has_next

            if (response.data!.data.length > 0) {
                cursor.value = response.data!.data.at(-1)!.id.toString()
            }

            return response.data!
        } catch (error) {
            console.error('Failed to fetch skills:', error)

            // ✅ RETURN DEFAULT (INI KUNCI)
            return {
                data: [],
                has_next: false,
            }
        } finally {
            isLoading.value = false
        }
    }

    // Create multiple skills
    const createMultipleSkills = async (skillsList: Skill[]): Promise<boolean> => {
        isSaving.value = true
        const loadingToast = toast.showLoadingToast('Creating Skills', 'Please wait while the skills are being created.')
        try {
            const response = await $apiFetch<BaseResponse<null>>('/api/skills', {
                method: 'POST',
                body: {data: skillsList},
            })

            if (response.success) {
                toast.updateToast(loadingToast.id, 'Success', 'Skills created successfully.', 'success', 4000)
                // Optionally, you can refresh the skills list or append the new skills
                await fetchSkills(false, '')
                return true
            } else {
                toast.updateToast(loadingToast.id, 'Error', response.message || 'Failed to create skills.', 'error', 6000)
                return false
            }
        } catch (error) {
            console.error('Failed to create skills:', error)
            let errorMessage = 'An unexpected error occurred.'

            if (isFetchErrorWithBody<BaseResponse>(error)) {
                console.error('API Error:', error._data)
                errorMessage = error._data.message
            }

            toast.updateToast(
                loadingToast.id,
                'Error',
                errorMessage,
                'error',
                6000
            )
            return false
        } finally {
            isSaving.value = false
        }
    }

    const updateSkill = async (skill: Skill): Promise<boolean> => {
        isSaving.value = true
        const loadingToast = toast.showLoadingToast('Updating Skill', 'Please wait while the skill is being updated.')
        try {
            const response = await $apiFetch<BaseResponse<null>>(`/api/skills`, {
                method: 'PUT',
                body: skill,
            })

            if (response.success) {
                toast.updateToast(loadingToast.id, 'Success', 'Skill updated successfully.', 'success', 4000)
                // Optionally, you can refresh the skills list or update the specific skill
                await fetchSkills(false, '')
                return true
            } else {
                toast.updateToast(loadingToast.id, 'Error', response.message || 'Failed to update skill.', 'error', 6000)
                return false
            }
        } catch (error) {
            console.error('Failed to update skill:', error)
            let errorMessage = 'An unexpected error occurred.'

            if (isFetchErrorWithBody<BaseResponse>(error)) {
                console.error('API Error:', error._data)
                errorMessage = error._data.message
            }

            toast.updateToast(
                loadingToast.id,
                'Error',
                errorMessage,
                'error',
                6000
            )
            return false
        } finally {
            isSaving.value = false
        }
    }

    const deleteSkill = async (skillId: number): Promise<boolean> => {
        isSaving.value = true
        const loadingToast = toast.showLoadingToast('Deleting Skill', 'Please wait while the skill is being deleted.')
        try {
            const response = await $apiFetch<BaseResponse<null>>(`/api/skills/${skillId}`, {
                method: 'DELETE',
            })

            if (response.success) {
                toast.updateToast(loadingToast.id, 'Success', 'Skill deleted successfully.', 'success', 4000)
                // Optionally, you can refresh the skills list
                await fetchSkills(false, '')
                return true
            } else {
                toast.updateToast(loadingToast.id, 'Error', response.message || 'Failed to delete skill.', 'error', 6000)
                return false
            }
        } catch (error) {
            console.error('Failed to delete skill:', error)
            let errorMessage = 'An unexpected error occurred.'

            if (isFetchErrorWithBody<BaseResponse>(error)) {
                console.error('API Error:', error._data)
                errorMessage = error._data.message
            }

            toast.updateToast(
                loadingToast.id,
                'Error',
                errorMessage,
                'error',
                6000
            )
            return false
        } finally {
            isSaving.value = false
        }
    }


    return {
        skills,
        isLoading,
        isSaving,
        cursor,
        updateSkill,
        hasMore,
        fetchSkills,
        createMultipleSkills, deleteSkill
    }
}