// plugins/apiFetch.ts
import Cookie from "~/utils/cookie";

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
            } else {
                // Client: tambah Authorization header
                const token = Cookie.get('token')
                if (token) {
                    options.headers.set('Authorization', `Bearer ${token}`)
                }
            }
        },

        async onResponseError({request, options, response}): Promise<void> {
            if (response.status !== 401) {
                throw response
            }

            // ❌ jangan refresh kalau request refresh itu sendiri
            if (request.toString().includes('/api/users/refresh')) {
                throw response
            }

            try {
                // 🔁 single-flight refresh
                if (!isRefreshing) {
                    isRefreshing = true

                    refreshPromise = $fetch<BaseResponse<{
                        access_token: string
                    }>>('/api/users/refresh', {
                        method: 'POST',
                        credentials: 'include',
                    }).then((data) => {
                        isRefreshing = false
                        // simpan token baru di cookie
                        Cookie.set('token', data.data!.access_token, 1) // 1 day expiry
                    }).catch((err) => {
                        isRefreshing = false
                        throw err
                    })
                }

                await refreshPromise

                const newToken = Cookie.get('token')
                if (newToken) {
                    options.headers.set('Authorization', `Bearer ${newToken}`)
                }

                // 🔁 retry request awal
                return await apiFetch(request, {
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
