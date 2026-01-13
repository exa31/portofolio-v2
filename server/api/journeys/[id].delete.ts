import {HttpError} from "~~/server/errors/HttpError";
import {deleteJourney} from "~~/server/services/journey.service";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id || isNaN(Number(id))) {
        throw new HttpError(400, 'INVALID_ID', 'The ID is invalid');
    }

    return await deleteJourney(event, Number(id))
})

