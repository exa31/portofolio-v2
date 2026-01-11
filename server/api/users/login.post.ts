import {loginRequestModel} from "~~/server/model/user.model";
import {HttpError} from "~~/server/errors/HttpError";
import z from "zod";
import {loginWithGoogle} from "~~/server/services/user.service";
import {handleError} from "~~/server/utils/handleError";

export default handleError(async (event) => {
    const parsed = await readValidatedBody(event, body => loginRequestModel.safeParse(body));

    if (!parsed.success) {
        throw new HttpError(400, 'INVALID_REQUEST', 'Invalid request body', z.treeifyError(parsed.error).properties);
    }

    return await loginWithGoogle(event, parsed.data.code)
});
