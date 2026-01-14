import {HttpError} from "~~/server/errors/HttpError";
import {updateSocialLinksSchema} from "~~/server/model/settings.model";
import {updateSocialLinks} from "~~/server/services/settings.service";
import {withAuth} from "~~/server/utils/withAuth";
import z from "zod";

export default withAuth(async (event) => {
    const userId = event.context.user.id! as string
    const parsed = await readValidatedBody(event, body => updateSocialLinksSchema.safeParse(body))

    if (!parsed.success) {
        const errors = z.treeifyError(parsed.error)
        throw new HttpError(400, 'INVALID_INPUT', 'The request body is invalid', errors)
    }

    return await updateSocialLinks(event, userId, parsed.data)
})

