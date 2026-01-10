import z from "zod";
import {HttpError} from "~~/server/errors/HttpError";
import {deleteSkill} from "~~/server/services/skill.service";

export default withAuth(async (event) => {
    const query = getRouterParam(event, 'id')

    const ok = z.string().refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        {message: 'ID must be a positive number'}
    ).transform((val) => Number(val)).safeParse(query);
    
    if (!ok.success) {
        throw new HttpError(
            400, 'invalid_id', 'The provided ID is not a valid number.', z.date(ok.error)
        )
    }

    const skillId = ok.data;

    return await deleteSkill(event, skillId);
});