import {withAuth} from "~~/server/utils/withAuth";
import {HttpError} from "~~/server/errors/HttpError";
import {create} from "~~/server/services/application.service";
import {createApplicationSchema} from "~~/server/model/application.model";
import z from "zod";

export default withAuth(async (event) => {
    const body = await readBody(event);
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid request data', z.treeifyError(parsed.error).properties);
    }

    return await create(event, parsed.data);
});
