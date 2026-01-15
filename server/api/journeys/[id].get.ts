import {HttpError} from "~~/server/errors/HttpError";
import {getJourneyById} from "~~/server/services/journey.service";
import {handleError} from "~~/server/utils/handleError";

export default handleError(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id || isNaN(Number(id))) {
        throw new HttpError(400, 'INVALID_ID', 'The ID is invalid');
    }

    return await getJourneyById(event, Number(id))
})

