export default defineNuxtRouteMiddleware((to) => {
    if (!to.path.startsWith('/dashboard')) return

    let token: string | null = null

    if (import.meta.server) {
        const headers = useRequestHeaders(['cookie'])
        token = headers.cookie?.match(/token=([^;]+)/)?.[1] || null
    }

    if (import.meta.client) {
        const match = document.cookie.match(/token=([^;]+)/)
        token = match?.[1] || null
    }

    if (!token) return navigateTo('/login')
})
