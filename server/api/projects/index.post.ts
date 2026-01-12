import z from "zod";
import {HttpError} from "~~/server/errors/HttpError";
import {createProject} from "~~/server/services/project.service";
import {formatNuxtFormData} from "~~/server/utils/common";
import {createProjectSchema} from "~~/server/model/project.model";

export default withAuth(async (event) => {
    const formData = await readMultipartFormData(event)

    if (!formData) {
        throw new HttpError(400, 'NO_FORM_DATA', 'No form data provided');
    }

    const body = formatNuxtFormData(formData, ["id_skills"]);

    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid request data', z.treeifyError(parsed.error).properties);
    }

    const projectData = parsed.data;

    return await createProject(event, projectData);
})