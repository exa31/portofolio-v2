import {loginRequestModel} from "~~/server/model/user";
import {HttpError} from "~~/server/errors/HttpError";
import z from "zod";
import {loginWithGoogle} from "~~/server/services/user";
import {handleError} from "~~/server/utils/handleError";

export default handleError(async (event) => {
    const body = await readBody(event);
    if (!body || typeof body !== 'object') {
        throw new HttpError(400, 'INVALID_REQUEST', 'Request body is required');
    }

    const parsed = loginRequestModel.safeParse(body);

    if (!parsed.success) {
        throw new HttpError(400, 'INVALID_REQUEST', 'Invalid request body', z.treeifyError(parsed.error)
        );
    }

    return await loginWithGoogle(event, parsed.data.token_id)
});
