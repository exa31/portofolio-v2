import {HttpError} from "~~/server/errors/HttpError";
import {updateSkillSchema} from "~~/server/model/skill.model";
import {updateSkill} from "~~/server/services/skill.service";
import z from "zod";

export default withAuth(async (event) => {
    const parsed = await readValidatedBody(event, body => updateSkillSchema.safeParse(body))

    if (!parsed.success) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid request data', z.treeifyError(parsed.error).properties);
    }

    const skillData = parsed.data;

    return await updateSkill(event, skillData);
})