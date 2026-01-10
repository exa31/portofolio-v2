import {verifyAccessToken} from '~~/server/utils/jwt'
import {HttpError} from '~~/server/errors/HttpError'
import type {EventHandler, EventHandlerRequest, H3Event} from 'h3'

export const withAuth = <T extends EventHandlerRequest, D>(
    handler?: EventHandler<T, D>
): EventHandler<T, D> => {
    return defineEventHandler<T>(async (event: H3Event) => {
        try {
            // 1️⃣ Ambil token dari header
            const authHeader = getHeader(event, 'authorization') ?? ''
            let token: string | null = null

            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7).trim()
            }

            // 2️⃣ Fallback ke cookie
            if (!token) {
                token = getCookie(event, 'access_token') ?? null
            }

            if (!token) {
                throw new HttpError(401, 'missing_token', 'Access token is missing')
            }

            // 3️⃣ Verify JWT
            let payload: any
            try {
                payload = verifyAccessToken(token)
            } catch {
                throw new HttpError(401, 'invalid_token', 'Access token is invalid')
            }

            // 4️⃣ Attach ke context (SOURCE OF TRUTH)
            event.context.user = {
                id: payload.sub,
                email: payload.email,
                raw: payload,
            }

            // 5️⃣ Lanjut ke handler kalau ada
            if (handler) {
                return handler(event)
            }
        } catch (err: any) {
            if (err instanceof HttpError) {
                throw err
            }
            console.error("[error]:", err)
            throw new HttpError(500, 'internal_server_error', 'Internal server error')
        }
    })
}
