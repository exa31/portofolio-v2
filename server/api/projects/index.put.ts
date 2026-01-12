import {HttpError} from "~~/server/errors/HttpError";
import z from "zod";
import {updateProjectSchema} from "~~/server/model/project.model";
import {updateProject} from "~~/server/services/project.service";
import {formatNuxtFormData} from "~~/server/utils/common";

export default withAuth(async (event) => {
    const formData = await readMultipartFormData(event)

    if (!formData) {
        throw new HttpError(400, 'NO_FORM_DATA', 'No form data provided');
    }

    const body = formatNuxtFormData(formData, ["id_skills", "features"]);

    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid request data', z.treeifyError(parsed.error).properties);
    }

    const projectData = parsed.data;

    return await updateProject(event, projectData);
})