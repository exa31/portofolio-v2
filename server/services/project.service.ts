import * as repository from "~~/server/repositories/project.repository";
import {H3Event} from "h3";
import type {CreateProjectInput, UpdateProjectInput} from "~~/server/model/project.model";
import {withTransaction} from "~~/server/db/postgres";
import {HttpError} from "~~/server/errors/HttpError";
import {del, get, set} from "~~/server/db/redis";
import {getMinioClient} from "~~/server/lib/minio";

export const createProject = async (event: H3Event, body: CreateProjectInput) => {
    return withTransaction(
        async (client) => {
            const minioClient = getMinioClient();
            const namaFile = `portofolio/${Date.now()}-${crypto.randomUUID()}`;
            body.url = minioClient.getPublicUrl("project", namaFile);

            const projectId = await repository.createProject(client, body);
            if (!projectId) {
                throw new HttpError(500, 'PROJECT_CREATION_FAILED', 'Failed to create project');
            }
            const ok = await repository.createProjectSkillRelation(client, projectId, body.id_skills)
            if (!ok) {
                throw new HttpError(500, 'PROJECT_SKILL_RELATION_CREATION_FAILED', 'Failed to create project-skill relation');
            }

            const projects = await repository.getAllProjects(client);
            await del('projects:all'); // Invalidate cached projects list
            await set('projects:all', JSON.stringify(projects)); // Update cache with new projects list

            await minioClient.uploadFile("project", namaFile, body.image.data, body.image.contentType || "application/octet-stream");

            return sendSuccess(
                event,
                {project_id: projectId},
                "Project created successfully",
                "project_created",
                201
            )
        }
    )
}

export const getProjectsNoPagination = async (event: H3Event) => {
    return withTransaction(
        async (client) => {
            const cachedProjects = await get(
                'projects:all'
            )
            if (cachedProjects) {
                const projects = JSON.parse(cachedProjects);
                return sendSuccess(event, {data: projects}, "Projects retrieved successfully", "projects_retrieved");
            }

            const projects = await repository.getAllProjects(client);
            await set('projects:all', JSON.stringify(projects)); // Cache the projects list

            return sendSuccess(event, {data: projects}, "Projects retrieved successfully", "projects_retrieved");
        }
    )
}

export const getProjectsByCursor = async (event: H3Event, limit: number, cursor?: number, search?: string) => {
    return withTransaction(
        async (client) => {
            const projects = await repository.getProjectCursorPagination(client, limit, search, cursor);
            return sendSuccess(event, {
                data: projects,
                has_next: projects.length === limit
            }, "Projects retrieved successfully", "projects_retrieved");
        }
    )
}

export const updateProject = async (event: H3Event, data: UpdateProjectInput) => {
    return withTransaction(
        async (client) => {

            const minioClient = getMinioClient();

            const project = await repository.getProjectById(client, data.id);
            if (!project) {
                throw new HttpError(404, 'PROJECT_NOT_FOUND', 'Project not found');
            }

            const namaFile = `portofolio/${Date.now()}-${crypto.randomUUID()}`;
            if (data.image) {
                data.url = minioClient.getPublicUrl("project", namaFile);
            } else {
                data.url = project.preview_image;
            }

            console.log("Updated project data:", data);

            const ok = await repository.updateProject(client, data);
            if (!ok) {
                throw new HttpError(500, 'PROJECT_UPDATE_FAILED', 'Failed to update project');
            }

            const okRelation = await repository.deleteProjectSkillRelation(client, data.id);
            if (!okRelation) {
                throw new HttpError(500, 'PROJECT_SKILL_RELATION_DELETION_FAILED', 'Failed to delete project-skill relation');
            }

            const okNewRelation = await repository.createProjectSkillRelation(client, data.id, data.id_skills || []);
            if (!okNewRelation) {
                throw new HttpError(500, 'PROJECT_SKILL_RELATION_CREATION_FAILED', 'Failed to create project-skill relation');
            }

            const projects = await repository.getAllProjects(client);
            await del('projects:all'); // Invalidate cached projects list
            await set('projects:all', JSON.stringify(projects)); // Update cache with new projects list

            if (data.image) await minioClient.uploadFile("project", namaFile, data.image.data, data.image.contentType || "application/octet-stream");

            return sendSuccess(
                event,
                null,
                "Project updated successfully",
                "project_updated"
            )
        }
    )
}

export const deleteProject = async (event: H3Event, id: number) => {
    return withTransaction(
        async (client) => {
            const minioClient = getMinioClient();

            const project = await repository.getProjectById(client, id);
            if (!project) {
                throw new HttpError(404, 'PROJECT_NOT_FOUND', 'Project not found');
            }

            const ok = await repository.deleteProject(client, id);
            if (!ok) {
                throw new HttpError(500, 'PROJECT_DELETION_FAILED', 'Failed to delete project');
            }

            const projects = await repository.getAllProjects(client);
            await del('projects:all'); // Invalidate cached projects list
            await set('projects:all', JSON.stringify(projects)); // Update cache with new projects list

            if (project.preview_image) {
                const objectName = extractObjectName(project.preview_image);
                if (objectName) {
                    await minioClient.deleteFile("project", objectName);
                }
            }

            return sendSuccess(
                event,
                null,
                "Project deleted successfully",
                "project_deleted"
            )
        }
    )
}

function extractObjectName(url: string): string | null {
    try {
        const parsed = new URL(url)

        // /project/portofolio/xxx.png
        const pathname = parsed.pathname

        const prefix = '/project/'
        if (!pathname.startsWith(prefix)) return null

        return pathname.replace(prefix, '')
    } catch {
        return null
    }
}


export const getProjectById = async (event: H3Event, id: number) => {
    return withTransaction(
        async (client) => {
            const project = await repository.getProjectById(client, id);
            if (!project) {
                throw new HttpError(404, 'PROJECT_NOT_FOUND', 'Project not found');
            }

            return sendSuccess(event, project, "Project retrieved successfully", "project_retrieved");
        }
    )
}