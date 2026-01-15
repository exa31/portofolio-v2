import {del} from "~~/server/db/redis"
import {sendSuccess} from "~~/server/utils/response"
import {withTransaction} from "~~/server/db/postgres";
import {deleteToken} from "~~/server/repositories/token.repository";
import {handleError} from "~~/server/utils/handleError";

export default handleError(async (event) => {
    try {
        // Get user ID dari token
        const userId = event.context.user.id

        await withTransaction(
            async (client) => {
                // Hapus refresh token dari database jika disimpan di sana
                // Delete refresh token dari Redis
                if (userId) {
                    const refreshToken = getCookie(event, 'refresh_token')
                    await deleteToken(
                        client,
                        hashToSha256(refreshToken || '')
                    )
                    if (refreshToken) {
                        await del(`user_refresh_token:${refreshToken}`)
                    }
                }
            }
        )

        // Clear cookies di client
        deleteCookie(event, 'access_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/api'
        })

        deleteCookie(event, 'refresh_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/api'
        })

        deleteCookie(event, 'token', {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/'
        })

        return sendSuccess(event, null, 'Logout successful', 'LOGOUT_SUCCESS', 200)
    } catch (error) {
        console.error('Logout error:', error)
        return sendSuccess(event, null, 'Logout successful', 'LOGOUT_SUCCESS', 200)
    }
})

