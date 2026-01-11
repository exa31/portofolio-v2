import type {FetchError} from 'ofetch'

export function isFetchErrorWithBody<T>(
    error: unknown
): error is FetchError<T> & { _data: T } {
    return (
        typeof error === 'object' &&
        error !== null &&
        '_data' in error
    )
}

