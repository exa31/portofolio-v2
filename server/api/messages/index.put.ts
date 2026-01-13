import {HttpError} from "~~/server/errors/HttpError";
import {updateMessageStatusSchema} from "~~/server/model/message.model";
import {updateMessageStatus} from "~~/server/services/message.service";
import z from "zod";

export default defineEventHandler(async (event) => {

    const parsed = await readValidatedBody(event, body => updateMessageStatusSchema.safeParse(body))

    if (!parsed.success) {
        const errors = z.treeifyError(parsed.error).properties
        throw new HttpError(400, 'INVALID_INPUT', 'The request body is invalid', errors)
    }

    return await updateMessageStatus(event, parsed.data)
})

