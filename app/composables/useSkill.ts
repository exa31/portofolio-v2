import {ref} from 'vue'
import type {Skill, SkillsResponse} from "~/types/skill";

export const useSkill = () => {
    const skills = ref<Array<Skill>>([])
    const isLoading = ref<boolean>(false)
    const cursor = ref<string | null>(null)
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

    return {
        skills,
        isLoading,
        cursor,
        hasMore,
        fetchSkills,
    }
}