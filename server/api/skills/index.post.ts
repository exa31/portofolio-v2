import {HttpError} from "~~/server/errors/HttpError";
import {createSkillSchema} from "~~/server/model/skill.model";
import {createSkills} from "~~/server/services/skill.service";
import z from "zod";

export default withAuth(async (event) => {
    const parsed = await readValidatedBody(event, body => createSkillSchema.safeParse(body))


    if (!parsed.success) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid request data', z.treeifyError(parsed.error).properties);
    }

    const skillData = parsed.data;

    return await createSkills(event, skillData.data);
})