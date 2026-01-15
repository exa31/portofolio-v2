import {HttpError} from "~~/server/errors/HttpError";
import {deleteJourney} from "~~/server/services/journey.service";
import {withAuth} from "~~/server/utils/withAuth";

export default withAuth(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id || isNaN(Number(id))) {
        throw new HttpError(400, 'INVALID_ID', 'The ID is invalid');
    }

    return await deleteJourney(event, Number(id))
})

