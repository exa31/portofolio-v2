// plugins/axios.ts
import axios, {AxiosError, type AxiosInstance} from 'axios'

export default defineNuxtPlugin((nuxtApp) => {

    const config = useRuntimeConfig()

    // ✅ AMAN: dipanggil di dalam plugin
    const headers = import.meta.server
        ? useRequestHeaders(['cookie'])
        : {}

    // Use useCookie for consistent cookie handling
    const tokenCookie = useCookie('token', {
        maxAge: 86400, // 1 day
        path: '/',
        sameSite: 'lax',
        secure: import.meta.env.PROD,
    })

    const api: AxiosInstance = axios.create({
        baseURL: config.public.apiBaseUrl,
        withCredentials: true,
    })

    let isRefreshing = false
    let refreshPromise: Promise<void> | null = null

    // =========================
    // REQUEST INTERCEPTOR
    // =========================
    api.interceptors.request.use((config) => {
        // SSR: forward cookie
        if (import.meta.server) {
            config.withCredentials = true
            if (headers.cookie) {
                config.headers = config.headers || {}
                config.headers.Cookie = headers.cookie
            }
        } else {
            // Client: Authorization
            const token = tokenCookie.value
            if (token) {
                config.headers = config.headers || {}
                config.headers.Authorization = `Bearer ${token}`
            }
        }

        return config
    })

    // =========================
    // RESPONSE INTERCEPTOR
    // =========================
    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest: any = error.config

            if (
                error.response?.status !== 401 ||
                originalRequest?._retry ||
                originalRequest?.url?.includes('/api/users/refresh')
            ) {
                return Promise.reject(error)
            }

            originalRequest._retry = true

            try {
                if (!isRefreshing) {
                    isRefreshing = true

                    refreshPromise = api
                        .post('/api/users/refresh', {}, {
                            withCredentials: true,
                        })
                        .then((res) => {
                            tokenCookie.value = res.data.data.access_token
                        })
                        .finally(() => {
                            isRefreshing = false
                        })
                }

                await refreshPromise

                const token = tokenCookie.value
                if (token) {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                }

                // 🔁 retry request asli
                return api(originalRequest)
            } catch (err) {
                if (import.meta.client) {
                    navigateTo('/login')
                }
                return Promise.reject(err)
            }
        }
    )

    return {
        provide: {
            axios: api,
        },
    }
})
