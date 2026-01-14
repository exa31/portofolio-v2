import {useToastCustom} from "~/composables/useToastCustom";
import type {UserSettingsModel} from "~~/server/model/settings.model";

export const useSettings = () => {
    const {$axios} = useNuxtApp()
    const toast = useToastCustom()
    const isLoading = ref(false)
    const isSaving = ref(false)

    const fetchSettings = async (): Promise<UserSettingsModel | null> => {
        isLoading.value = true
        try {
            const response = await $axios.get<BaseResponse<UserSettingsModel>>('/api/settings')
            const body = response.data

            if (!body || !body.data) {
                console.error('Invalid response from server', body)
                return null
            }

            return body.data
        } catch (error) {
            console.error('Failed to fetch settings:', error)
            toast.showErrorToast("Error", "Failed to load settings")
            return null
        } finally {
            isLoading.value = false
        }
    }

    const updateProfileSettings = async (profileData: {
        name: string
        email: string
        location?: string | null
        open_to_opportunities: boolean
    }): Promise<UserSettingsModel | null> => {
        isSaving.value = true
        const loadingToast = toast.showLoadingToast("Updating Profile", "Please wait while your profile is being updated.")
        try {
            const response = await $axios.put<BaseResponse<UserSettingsModel>>('/api/settings/profile', profileData)
            const body = response.data

            if (!body || !body.data) {
                console.error('Invalid response from server', body)
                toast.updateToast(
                    loadingToast.id,
                    "Error",
                    "Failed to update profile",
                    "error",
                    5000
                )
                return null
            }

            toast.updateToast(
                loadingToast.id,
                "Success",
                "Profile updated successfully!",
                "success",
                3000
            )
            return body.data
        } catch (error) {
            console.error('Failed to update profile:', error)
            toast.updateToast(
                loadingToast.id,
                "Error",
                "Failed to update profile",
                "error",
                5000
            )
            return null
        } finally {
            isSaving.value = false
        }
    }

    const updateSocialLinks = async (socialData: {
        github_profile?: string | null
        linkedin_profile?: string | null
    }): Promise<UserSettingsModel | null> => {
        isSaving.value = true
        const loadingToast = toast.showLoadingToast("Updating Social Links", "Please wait while your social links are being updated.")
        try {
            const response = await $axios.put<BaseResponse<UserSettingsModel>>('/api/settings/social-links', socialData)
            const body = response.data

            if (!body || !body.data) {
                console.error('Invalid response from server', body)
                toast.updateToast(
                    loadingToast.id,
                    "Error",
                    "Failed to update social links",
                    "error",
                    5000
                )
                return null
            }

            toast.updateToast(
                loadingToast.id,
                "Success",
                "Social links updated successfully!",
                "success",
                3000
            )
            return body.data
        } catch (error) {
            console.error('Failed to update social links:', error)
            toast.updateToast(
                loadingToast.id,
                "Error",
                "Failed to update social links",
                "error",
                5000
            )
            return null
        } finally {
            isSaving.value = false
        }
    }

    return {
        isLoading,
        isSaving,
        fetchSettings,
        updateProfileSettings,
        updateSocialLinks,
    }
}

