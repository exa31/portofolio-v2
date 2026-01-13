import {useToastCustom} from "~/composables/useToastCustom";
import type {Project, ProjectsResponse} from "~/types/project";

export const useProject = () => {
    const projects = ref<Array<Project>>([])
    const isLoading = ref<boolean>(false)
    const isSaving = ref<boolean>(false)
    const cursor = ref<number | null>(null)
    const {$axios} = useNuxtApp()
    const toast = useToastCustom()
    const hasMore = ref<boolean>(true)

    const fetchProjects = async (loadMore = false, searchQuery: string, pagination: boolean = true): Promise<ProjectsResponse> => {
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

            const response = await $axios.get <BaseResponse<ProjectsResponse>>('/api/projects', {params})
            const body = response.data

            // Ensure body.data exists - return default instead of throwing so we handle it gracefully
            if (!body || !body.data) {
                console.error('Invalid response from server', body)
                return {
                    data: [],
                    has_next: false,
                }
            }

            if (loadMore) {
                projects.value.push(...body.data.data)
            } else {
                projects.value = body.data.data
            }

            hasMore.value = body.data.has_next

            if (body.data.data.length > 0) {
                const last = body.data.data.at(-1)
                cursor.value = last && last.id != null ? last.id : null
            }

            return body.data
        } catch (error) {
            console.error('Failed to fetch skills:', error)

            // RETURN DEFAULT
            return {
                data: [],
                has_next: false,
            }
        } finally {
            isLoading.value = false
        }
    }

    const fetchProjectById = async (projectId: number): Promise<Project | null> => {
        isLoading.value = true
        try {
            const response = await $axios.get<BaseResponse<Project>>(`/api/projects/${projectId}`)
            const body = response.data

            if (!body || !body.data) {
                console.error('Invalid response from server', body)
                return null
            }

            return body.data
        } catch (error) {
            console.error('Failed to fetch project by ID:', error)
            return null
        } finally {
            isLoading.value = false
        }
    }

    const createProject = async (projectData: Project): Promise<boolean> => {
        isSaving.value = true
        const loadingToast = toast.showLoadingToast("Creating Project", "Please wait while the project is being created.")
        try {
            // Filter out empty values from form data
            const filteredData: Record<string, any> = {}

            // Always include required fields
            filteredData.name = projectData.name
            filteredData.description = projectData.description
            filteredData.image = projectData.image
            filteredData.status = projectData.status
            filteredData.features = projectData.features.filter((f: string) => f.trim()) // Filter empty features
            filteredData.id_skills = projectData.technologies // Map technologies to id_skills for backend

            // Conditionally include optional fields only if they have values
            if (projectData.start_date?.trim()) {
                filteredData.start_date = projectData.start_date
            }
            if (projectData.end_date?.trim()) {
                filteredData.end_date = projectData.end_date
            }
            if (projectData.repo_url?.trim()) {
                filteredData.repo_url = projectData.repo_url
            }
            if (projectData.live_url?.trim()) {
                filteredData.live_url = projectData.live_url
            }

            const res = await $axios.post<BaseResponse<null>>('/api/projects', filteredData, {
                headers: {'Content-Type': 'multipart/form-data'},
            })
            toast.updateToast(loadingToast.id, "Success", "Project created successfully!", "success", 4000)
            return Boolean(res.data.success)
        } catch (e) {
            console.error('Failed to create project', e)
            const errorMessage = getErrorMessageAxios(e)
            toast.updateToast(loadingToast.id, "Error", `Failed to create project: ${errorMessage}`, "error", 6000)
            return false
        } finally {
            isSaving.value = false
        }
    }

    const updateProject = async (projectData: Project): Promise<boolean> => {
        isSaving.value = true
        const loadingToast = toast.showLoadingToast("Updating Project", "Please wait while the project is being updated.")
        try {
            // Filter out empty values from form data
            const filteredData: Record<string, any> = {}

            // Always include required fields
            filteredData.name = projectData.name
            filteredData.id = projectData.id
            filteredData.description = projectData.description
            filteredData.image = projectData.image
            filteredData.status = projectData.status
            filteredData.features = projectData.features.filter((f: string) => f.trim()) // Filter empty features
            filteredData.id_skills = projectData.id_skills // Map technologies to id_skills for backend

            // Conditionally include optional fields only if they have values
            if (projectData.start_date?.trim()) {
                filteredData.start_date = projectData.start_date
            }
            if (projectData.end_date?.trim()) {
                filteredData.end_date = projectData.end_date
            }
            if (projectData.repo_url?.trim()) {
                filteredData.repo_url = projectData.repo_url
            }
            if (projectData.live_url?.trim()) {
                filteredData.live_url = projectData.live_url
            }

            const res = await $axios.put<BaseResponse<null>>(`/api/projects`, filteredData, {
                headers: {'Content-Type': 'multipart/form-data'},
            })
            toast.updateToast(loadingToast.id, "Success", "Project updated successfully!", "success", 4000)
            return Boolean(res.data.success)
        } catch (e) {
            console.error('Failed to update project', e)
            const errorMessage = getErrorMessageAxios(e)
            toast.updateToast(loadingToast.id, "Error", `Failed to update project: ${errorMessage}`, "error", 6000)
            return false
        } finally {
            isSaving.value = false
        }
    }

    const deleteProject = async (projectId: number): Promise<boolean> => {
        isSaving.value = true
        const loadingToast = toast.showLoadingToast("Deleting Project", "Please wait while the project is being deleted.")
        try {
            const res = await $axios.delete<BaseResponse<null>>(`/api/projects/${projectId}`)
            toast.updateToast(loadingToast.id, "Success", "Project deleted successfully!", "success", 4000)
            return Boolean(res.data.success)
        } catch (e) {
            console.error('Failed to delete project', e)
            const errorMessage = getErrorMessageAxios(e)
            toast.updateToast(loadingToast.id, "Error", `Failed to delete project: ${errorMessage}`, "error", 6000)
            return false
        } finally {
            isSaving.value = false
        }
    }

    return {
        projects,
        isLoading,
        cursor,
        isSaving,
        hasMore,
        fetchProjects,
        createProject,
        fetchProjectById,
        updateProject,
        deleteProject,
    }
}