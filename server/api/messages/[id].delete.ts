import {HttpError} from "~~/server/errors/HttpError";
import {deleteMessage} from "~~/server/services/message.service";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw new HttpError(400, 'INVALID_ID', 'The ID is invalid');
    }

    return await deleteMessage(event, id)
})

