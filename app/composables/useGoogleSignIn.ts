import {ref} from 'vue'

export const useGoogleSignIn = () => {
    const router = useRouter()
    const config = useRuntimeConfig()
    const googleClientId = config.public.googleClientId
    const clientUrl = config.public.clientUrl || window.location.origin

    // Error state untuk di-share ke component
    const signInError = ref<string | null>(null)

    // Validate Google Client ID
    const validateGoogleConfig = () => {
        if (!googleClientId || googleClientId.trim() === '') {
            signInError.value = 'Google Client ID is not configured. Please set NUXT_PUBLIC_GOOGLE_CLIENT_ID or GOOGLE_CLIENT_ID environment variable.'
            console.error('[Google Auth]', signInError.value)
            return false
        }
        if (!(window as any).google) {
            signInError.value = 'Google OAuth library failed to load'
            console.error('[Google Auth]', signInError.value)
            return false
        }
        return true
    }

    // Initialize Google Sign-In with pop-up
    const initGoogleSignIn = async () => {
        try {
            if (!validateGoogleConfig()) {
                return false
            }

            // Initialize Google Accounts library with dynamic redirect_uri
            const redirectUri = `${clientUrl}/`
            console.log('[Google Auth] Initializing with Client ID:', googleClientId)
            console.log('[Google Auth] Redirect URI:', redirectUri)

            ;(window as any).google.accounts.oauth2.initCodeClient(
                {
                    client_id: googleClientId,
                    scope: 'email profile openid',
                    ux_mode: 'popup',
                    callback: handleGoogleSignInResponse,
                    redirect_uri: redirectUri,
                }
            ).requestCode()

            return true
        } catch (error) {
            signInError.value = error instanceof Error ? error.message : 'Failed to initialize Google Sign-In'
            console.error('[Google Auth] Error:', signInError.value, error)
            return false
        }
    }

    // Handle Google Sign-In response
    const handleGoogleSignInResponse = async (response: any) => {
        try {
            const credential = response.code

            if (!credential) {
                signInError.value = 'No credential received from Google'
                console.error('[Google Auth] No credential:', response)
                return
            }

            console.log('[Google Auth] Received authorization code, sending to backend...')

            // Send auth code to your backend
            const result = await $fetch('/api/users/login', {
                method: 'POST',
                credentials: 'include',
                body: {
                    code: credential,
                },
            }) as any

            if (!result?.data?.access_token) {
                signInError.value = result?.message || 'Failed to authenticate with Google'
                console.error('[Google Auth] Auth failed:', result)
                return
            }

            // Store the access token using useCookie for better SSR compatibility
            const token = useCookie('token', {
                maxAge: 86400, // 1 day
                path: '/',
                sameSite: 'lax',
                secure: import.meta.env.PROD,
            });
            token.value = result.data.access_token;

            console.log('[Google Auth] Successfully authenticated, token stored')

            // Backend sets httpOnly cookies automatically
            // Redirect to dashboard
            signInError.value = null
            await router.push('/dashboard')
        } catch (error) {
            signInError.value = error instanceof Error ? error.message : 'Google sign-in failed'
            console.error('[Google Auth] Error:', signInError.value, error)
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

