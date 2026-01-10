import {HttpError} from "~~/server/errors/HttpError";
import {createSkillSchema} from "~~/server/model/skill.model";
import {createSkills} from "~~/server/services/skill.service";

export default withAuth(async (event) => {
    const parsed = await readValidatedBody(event, body => createSkillSchema.safeParse(body))


    if (!parsed.success) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid request data', parsed.error.flatten().fieldErrors);
    }

    const skillData = parsed.data;

    return await createSkills(event, skillData.data);
})