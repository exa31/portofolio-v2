import {HttpError} from "~~/server/errors/HttpError";
import {createJourneySchema} from "~~/server/model/journey.model";
import {createJourney} from "~~/server/services/journey.service";
import z from "zod";
import {withAuth} from "~~/server/utils/withAuth";

export default withAuth(async (event) => {
    const parsed = await readValidatedBody(event, body => createJourneySchema.safeParse(body))

    if (!parsed.success) {
        const errors = z.treeifyError(parsed.error).properties
        throw new HttpError(400, 'INVALID_INPUT', 'The request body is invalid', errors)
    }

    return await createJourney(event, parsed.data)
})

