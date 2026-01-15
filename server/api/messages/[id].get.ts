import {HttpError} from "~~/server/errors/HttpError";
import {getMessageById} from "~~/server/services/message.service";
import {handleError} from "~~/server/utils/handleError";

export default handleError(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw new HttpError(400, 'INVALID_ID', 'The ID is invalid');
    }

    return await getMessageById(event, id)
})

