import {handleError} from "~~/server/utils/handleError";
import {HttpError} from "~~/server/errors/HttpError";
import {refreshToken} from "~~/server/services/user.service";

export default handleError(async (event) => {
    let oldRefreshToken: string | undefined
    oldRefreshToken = getCookie(event, 'refresh_token')

    if (!oldRefreshToken) {
        const body = await readBody(event)
        oldRefreshToken = body.refresh_token
    }

    if (!oldRefreshToken) {
        throw new HttpError(401, 'missing_refresh_token', 'Refresh token missing')
    }
    return await refreshToken(event, oldRefreshToken);
});
