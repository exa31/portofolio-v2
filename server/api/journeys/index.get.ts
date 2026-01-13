import {paginationSchemaQuery} from "~~/server/utils/common";
import {HttpError} from "~~/server/errors/HttpError";
import z from "zod";
import {getJourneysByCursor, getJourneysNoPagination} from "~~/server/services/journey.service";

export default defineEventHandler(async (event) => {
    const parsed = await getValidatedQuery(event, query => paginationSchemaQuery.extend({
        search: z.string().optional()
    }).safeParse(query));

    if (!parsed.success) {
        throw new HttpError(400, 'INVALID_QUERY', 'The query parameters are invalid');
    }

    const query = parsed.data

    if (!query.pagination) {
        return await getJourneysNoPagination(event)
    }

    const limit = query.limit ? query.limit : 10
    const cursor = query.cursor ? query.cursor : undefined
    const search = query.search ? query.search : undefined

    return await getJourneysByCursor(event, limit, cursor, search)
})

