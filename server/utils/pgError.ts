import {HttpError} from '~~/server/errors/HttpError'
import {UNIQUE_CONSTRAINT_FIELD_MAP} from '~~/server/constants/pgConstraints'

export function formatPgError(err: any): never {
    // UNIQUE VIOLATION
    if (err?.code === '23505') {
        const field =
            UNIQUE_CONSTRAINT_FIELD_MAP[err.constraint] ?? null

        throw new HttpError(
            409,
            'DUPLICATE_RESOURCE',
            `Duplicate resource${field ? `: ${field}` : ''}`,
            {field, constraint: err.constraint}
        )
    }

    throw new HttpError(
        500,
        'DATABASE_ERROR',
        'Database error'
    )
}
