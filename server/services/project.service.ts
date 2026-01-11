import * as repository from "~~/server/repositories/project.repository";
import * as repositorySkill from "~~/server/repositories/skill.repository";
import {H3Event} from "h3";
import {CreateProjectInput, UpdateProjectInput} from "~~/server/model/project.model";
import {withTransaction} from "~~/server/db/postgres";
import {HttpError} from "~~/server/errors/HttpError";
import {del, get, set} from "~~/server/db/redis";

export const createProject = async (event: H3Event, body: CreateProjectInput) => {
    return withTransaction(
        async (client) => {
            const projectId = await repository.createProject(client, body);
            if (!projectId) {
                throw new HttpError(500, 'PROJECT_CREATION_FAILED', 'Failed to create project');
            }
            const ok = await repositorySkill.createProjectSkillRelation(client, projectId, body.id_skills)
            if (!ok) {
                throw new HttpError(500, 'PROJECT_SKILL_RELATION_CREATION_FAILED', 'Failed to create project-skill relation');
            }

            const projects = await repository.getAllProjects(client);
            await del('projects:all'); // Invalidate cached projects list
            await set('projects:all', JSON.stringify(projects)); // Update cache with new projects list

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
            const project = await repository.getProjectById(client, data.id);
            if (!project) {
                throw new HttpError(404, 'PROJECT_NOT_FOUND', 'Project not found');
            }

            const ok = await repository.updateProject(client, data);
            if (!ok) {
                throw new HttpError(500, 'PROJECT_UPDATE_FAILED', 'Failed to update project');
            }

            const okRelation = await repositorySkill.deleteProjectSkillRelation(client, data.id);
            if (!okRelation) {
                throw new HttpError(500, 'PROJECT_SKILL_RELATION_DELETION_FAILED', 'Failed to delete project-skill relation');
            }

            const okNewRelation = await repositorySkill.createProjectSkillRelation(client, data.id, data.id_skills || []);
            if (!okNewRelation) {
                throw new HttpError(500, 'PROJECT_SKILL_RELATION_CREATION_FAILED', 'Failed to create project-skill relation');
            }

            const projects = await repository.getAllProjects(client);
            await del('projects:all'); // Invalidate cached projects list
            await set('projects:all', JSON.stringify(projects)); // Update cache with new projects list

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
            const project = await repository.getProjectById(client, id);
            if (!project) {
                throw new HttpError(404, 'PROJECT_NOT_FOUND', 'Project not found');
            }

            const ok = await repository.deleteProject(client, id);
            if (!ok) {
                throw new HttpError(500, 'PROJECT_DELETION_FAILED', 'Failed to delete project');
            }

            const okRelation = await repositorySkill.deleteProjectSkillRelation(client, id);
            if (!okRelation) {
                throw new HttpError(500, 'PROJECT_SKILL_RELATION_DELETION_FAILED', 'Failed to delete project-skill relation');
            }

            const projects = await repository.getAllProjects(client);
            await del('projects:all'); // Invalidate cached projects list
            await set('projects:all', JSON.stringify(projects)); // Update cache with new projects list

            return sendSuccess(
                event,
                null,
                "Project deleted successfully",
                "project_deleted"
            )
        }
    )
}

export const getProjectById = async (event: H3Event, id: number) => {
    return withTransaction(
        async (client) => {
            const project = await repository.getProjectById(client, id);
            if (!project) {
                throw new HttpError(404, 'PROJECT_NOT_FOUND', 'Project not found');
            }

            return sendSuccess(event, {data: project}, "Project retrieved successfully", "project_retrieved");
        }
    )
}