import {HttpError} from '~~/server/errors/HttpError'
import type {EventHandler, EventHandlerRequest, H3Event} from 'h3'

export const handleError = <T extends EventHandlerRequest, D>(
    handler?: EventHandler<T, D>
): EventHandler<T, D> => {
    return defineEventHandler<T>(async (event: H3Event) => {
        try {
            if (!handler) {
                setResponseStatus(event, 500)
                return {
                    status: 500,
                    code: 'internal_error',
                    message: 'No handler provided',
                    data: null,
                    timestamp: new Date().toISOString(),
                }
            }
            return await handler(event)
        } catch (err: any) {
            if (err instanceof HttpError) {
                setResponseStatus(event, err.status)
                return {
                    status: err.status,
                    code: err.code ?? 'error',
                    message: err.message,
                    data: err.data ?? null,
                    timestamp: new Date().toISOString(),
                }
            }
            console.error("[error]:", err)
            setResponseStatus(event, 500)
            return {
                status: 500,
                code: 'internal_error',
                message: 'Internal server error',
                data: null,
                timestamp: new Date().toISOString(),
            }
        }
    })
}
