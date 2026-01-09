import type {H3Event} from 'h3'
import {setResponseStatus} from 'h3'

export type BaseResponse<T = any> = {
    message: string
    success: boolean
    data: T | null
    timestamp: string
}

export function createBaseResponse<T>(
    message: string,
    success: boolean,
    data?: T | null
): BaseResponse<T> {
    return {
        message,
        success,
        data: data ?? null,
        timestamp: new Date().toISOString(),
    }
}

export function sendSuccess<T>(
    event: H3Event,
    data?: T,
    message = 'OK',
    status = 200
) {
    setResponseStatus(event, status)
    return createBaseResponse(message, true, data)
}

export function sendError(
    event: H3Event,
    status = 500,
    message = 'error',
    data?: any
) {
    setResponseStatus(event, status)
    return createBaseResponse(message, false, data)
}
