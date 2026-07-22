import {withAuth} from "~~/server/utils/withAuth";
import {HttpError} from "~~/server/errors/HttpError";
import {chat} from "~~/server/services/application.service";
import z from "zod";

const chatSchema = z.object({
    application_id: z.string().min(1),
    message: z.string().min(1),
});

export default withAuth(async (event) => {
    const body = await readBody(event);
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid request data', z.treeifyError(parsed.error).properties);
    }

    return await chat(event, parsed.data.application_id, parsed.data.message);
});
