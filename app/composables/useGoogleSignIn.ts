import {ref} from 'vue'
import Cookie from "~/utils/cookie";

export const useGoogleSignIn = () => {
    const {$loadGoogleOAuth} = useNuxtApp()
    const router = useRouter()
    const config = useRuntimeConfig()
    const googleClientId = config.public.googleClientId

    // Error state untuk di-share ke component
    const signInError = ref<string | null>(null)

    // Initialize Google Sign-In with pop-up
    const initGoogleSignIn = async () => {
        try {
            await $loadGoogleOAuth()

            if (!(window as any).google) {
                signInError.value = 'Google OAuth library failed to load'
                console.error(signInError.value)
                return false
            }

            // Initialize Google Accounts library
            console.log(googleClientId)
            ;(window as any).google.accounts.oauth2.initCodeClient(
                {
                    client_id: googleClientId,
                    scope: 'email profile openid',
                    ux_mode: 'popup',
                    callback: handleGoogleSignInResponse,
                    redirect_uri: 'http://localhost:3000',
                }
            ).requestCode()

            return true
        } catch (error) {
            signInError.value = error instanceof Error ? error.message : 'Failed to initialize Google Sign-In'
            console.error(signInError.value, error)
            return false
        }
    }

    // Handle Google Sign-In response
    const handleGoogleSignInResponse = async (response: any) => {
        try {
            const credential = response.code

            if (!credential) {
                signInError.value = 'No credential received from Google'
                console.error(signInError.value)
                return
            }

            // Send ID token to your backend
            const result = await $fetch('/api/users/login', {
                method: 'POST',
                credentials: 'include',
                body: {
                    code: credential,
                },

            }) as any

            if (!result?.data?.access_token) {
                signInError.value = 'Failed to authenticate with Google'
                console.error(signInError.value, result)
                return
            }

            // Store the access token as needed (e.g., in a cookie or local storage)
            Cookie.set('token', result.data.access_token, 1) // 1 day expiry

            // Backend sets httpOnly cookies automatically
            // Just redirect to dashboard
            signInError.value = null
            await router.push('/dashboard')
        } catch (error) {
            signInError.value = error instanceof Error ? error.message : 'Google sign-in failed'
            console.error('Google sign-in error:', error)
        }
    }

    // Trigger Google Sign-In pop-up using prompt
    const signInWithGooglePopup = () => {
        if ((window as any).google?.accounts?.id) {
            // Show the One Tap UI with pop-up mode
            ;(window as any).google.accounts.id.prompt((notification: any) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    console.log('One Tap not displayed, user can click button to sign in')
                }
            })
        }
    }

    // Alternative: Render a button for manual click
    const renderGoogleSignInButton = (containerId: string) => {
        if ((window as any).google?.accounts?.id) {
            const element = document.getElementById(containerId)
            if (element) {
                ;(window as any).google.accounts.id.renderButton(element, {
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                })
            }
        }
    }

    return {
        initGoogleSignIn,
        signInWithGooglePopup,
        renderGoogleSignInButton,
        signInError,
    }
}

