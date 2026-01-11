import {HttpError} from "~~/server/errors/HttpError";
import z from "zod";
import {updateProjectSchema} from "~~/server/model/project.model";
import {updateProject} from "~~/server/services/project.service";

export default withAuth(async (event) => {
    const parsed = await readValidatedBody(event, body => updateProjectSchema.safeParse(body))


    if (!parsed.success) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid request data', z.treeifyError(parsed.error).properties);
    }

    const projectData = parsed.data;

    return await updateProject(event, projectData);
})