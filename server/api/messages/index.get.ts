import {paginationSchemaQuery} from "~~/server/utils/common";
import {HttpError} from "~~/server/errors/HttpError";
import z from "zod";
import {getMessagesByCursor} from "~~/server/services/message.service";
import {withAuth} from "~~/server/utils/withAuth";

export default withAuth(async (event) => {
    const parsed = await getValidatedQuery(event, query => paginationSchemaQuery.extend({
        status: z.enum(["unread", "read"])
    }).safeParse(query));

    if (!parsed.success) {
        throw new HttpError(400, 'INVALID_QUERY', 'The query parameters are invalid');
    }

    const query = parsed.data

    const limit = query.limit ? query.limit : 20
    const cursor = query.cursor ? query.cursor : undefined
    const status = query.status as 'unread' | 'read'

    return await getMessagesByCursor(event, limit, status, cursor)
})

