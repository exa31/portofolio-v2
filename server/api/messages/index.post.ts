import {HttpError} from "~~/server/errors/HttpError";
import {createMessageSchema} from "~~/server/model/message.model";
import {createMessage} from "~~/server/services/message.service";
import z from "zod";
import {withAuth} from "~~/server/utils/withAuth";

export default withAuth(async (event) => {
    const parsed = await readValidatedBody(event, body => createMessageSchema.safeParse(body))

    if (!parsed.success) {
        const errors = z.treeifyError(parsed.error).properties
        throw new HttpError(400, 'INVALID_INPUT', 'The request body is invalid', errors)
    }

    return await createMessage(event, parsed.data)
})

