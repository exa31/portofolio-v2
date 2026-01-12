import {paginationSchemaQuery} from "~~/server/utils/common";
import {HttpError} from "~~/server/errors/HttpError";

import z from "zod";
import {getProjectsByCursor, getProjectsNoPagination} from "~~/server/services/project.service";

export default defineEventHandler(async (event) => {
    const parsed = await getValidatedQuery(event, query => paginationSchemaQuery.extend({
        search: z.string().optional()
    }).safeParse(query));

    if (!parsed.success) {
        throw new HttpError(400, 'INVALID_QUERY', 'The query parameters are invalid');
    }

    const query = parsed.data


    if (!query.pagination) {
        return await getProjectsNoPagination(event)
    }

    const limit = query.limit ? query.limit : 10
    const cursor = query.cursor ? query.cursor : undefined
    const search = query.search ? query.search : undefined

    return await getProjectsByCursor(event, limit, cursor, search)
})