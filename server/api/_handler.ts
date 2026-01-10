import {HttpError} from '~~/server/errors/HttpError'
import {handleError} from "~~/server/utils/handleError";

export default handleError((event) => {
    throw new HttpError(
        404,
        'api_not_found',
        `API route ${event.path} not found`
    )
})
