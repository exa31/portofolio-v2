// plugins/apiFetch.ts
export default defineNuxtPlugin(() => {
    let isRefreshing = false
    let refreshPromise: Promise<void> | null = null

    const apiFetch = $fetch.create({
        credentials: 'include',


        async onRequest({options}) {
            // SSR: forward cookie dari request browser
            if (import.meta.server) {
                options.headers = {
                    ...options.headers,
                    ...useRequestHeaders(['cookie']),
                }
            }
        },

        async onResponseError({request, options, response}): Promise<void> {
            if (response.status !== 401) {
                throw response
            }

            // ❌ jangan refresh kalau request refresh itu sendiri
            if (request.toString().includes('/api/auth/refresh')) {
                throw response
            }

            try {
                // 🔁 single-flight refresh
                if (!isRefreshing) {
                    isRefreshing = true

                    refreshPromise = $fetch('/api/auth/refresh', {
                        method: 'POST',
                        credentials: 'include',
                    }).then(() => {
                        isRefreshing = false
                    }).catch((err) => {
                        isRefreshing = false
                        throw err
                    })
                }

                await refreshPromise

                // 🔁 retry request awal
                return apiFetch(request, {
                    ...options,
                    method: options.method as
                        | 'GET'
                        | 'POST'
                        | 'PUT'
                        | 'PATCH'
                        | 'DELETE'
                })
            } catch (err) {
                // ❌ refresh gagal → logout
                if (import.meta.client) {
                    navigateTo('/login')
                }

                throw err
            }
        },
    })

    return {
        provide: {
            apiFetch,
        },
    }
})
