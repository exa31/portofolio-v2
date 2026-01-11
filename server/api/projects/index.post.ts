import z from "zod";
import {HttpError} from "~~/server/errors/HttpError";
import {createProjectSchema} from "~~/server/model/project.model";
import {createProject} from "~~/server/services/project.service";

export default withAuth(async (event) => {
    const parsed = await readValidatedBody(event, body => createProjectSchema.safeParse(body))


    if (!parsed.success) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid request data', z.treeifyError(parsed.error).properties);
    }

    const projectData = parsed.data;

    return await createProject(event, projectData);
})