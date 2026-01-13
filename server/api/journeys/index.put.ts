import {HttpError} from "~~/server/errors/HttpError";
import {updateJourneySchema} from "~~/server/model/journey.model";
import {updateJourney} from "~~/server/services/journey.service";
import z from "zod";

export default defineEventHandler(async (event) => {
    const parsed = await readValidatedBody(event, body => updateJourneySchema.safeParse(body))


    if (!parsed.success) {
        const errors = z.treeifyError(parsed.error).properties
        throw new HttpError(400, 'INVALID_INPUT', 'The request body is invalid', errors)
    }

    return await updateJourney(event, parsed.data)
})

