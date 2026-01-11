import {H3Event} from "h3";
import {CreateSkillsInput, UpdateSkillInput} from "~~/server/model/skill.model";
import {withTransaction} from "~~/server/db/postgres";
import * as repository from "~~/server/repositories/skill.repository";
import {HttpError} from "~~/server/errors/HttpError";
import {del, get, set} from "~~/server/db/redis";
import {sendSuccess} from "~~/server/utils/response";

export const createSkills = async (event: H3Event, body: CreateSkillsInput) => {
    return withTransaction(
        async (client) => {
            const ok = await repository.createSkillsBulk(client, body);
            if (!ok) {
                throw new HttpError(500, 'SKILL_CREATION_FAILED', 'Failed to create skills');
            }

            const skills = await repository.getAllSkills(client);

            await del('skills:all'); // Invalidate cached skills list
            await set('skills:all', JSON.stringify(skills)); // Update cache with new skills list

            return sendSuccess(
                event,
                null,
                "Skills created successfully",
                "skills_created",
                201
            )
        }
    )
}

export const getSkillsNoPagination = async (event: H3Event) => {
    return withTransaction(
        async (client) => {
            const cachedSkills = await get(
                'skills:all'
            )
            if (cachedSkills) {
                const skills = JSON.parse(cachedSkills);
                return sendSuccess(event, {data: skills}, "Skills retrieved successfully", "skills_retrieved");
            }

            const skills = await repository.getAllSkills(client);
            await set('skills:all', JSON.stringify(skills)); // Cache the skills list

            return sendSuccess(event, {data: skills}, "Skills retrieved successfully", "skills_retrieved");
        }
    )
}

export const getSkillsByCursor = async (event: H3Event, limit: number, cursor?: number, search?: string) => {
    return withTransaction(
        async (client) => {
            const skills = await repository.getSkillCursorPagination(client, limit, search, cursor);
            return sendSuccess(event, {
                data: skills,
                has_next: skills.length === limit
            }, "Skills retrieved successfully", "skills_retrieved");
        }
    )
}

export const updateSkill = async (event: H3Event, data: UpdateSkillInput) => {
    return withTransaction(
        async (client) => {
            const skill = await repository.getSkillById(client, data.id);
            if (!skill) {
                throw new HttpError(404, 'SKILL_NOT_FOUND', 'Skill not found');
            }

            const ok = await repository.updateSkill(client, data.id, data);

            if (!ok) {
                throw new HttpError(500, 'SKILL_UPDATE_FAILED', 'Failed to update skill');
            }

            await del('skills:all');
            await set('skills:all', JSON.stringify(await repository.getAllSkills(client)));

            return sendSuccess(event, null, "Skill updated successfully", "skill_updated");
        }
    )
}

export const deleteSkill = async (event: H3Event, id: number) => {
    return withTransaction(
        async (client) => {
            const skill = await repository.getSkillById(client, id);
            if (!skill) {
                throw new HttpError(404, 'SKILL_NOT_FOUND', 'Skill not found');
            }

            const ok = await repository.deleteSkill(client, id);
            if (!ok) {
                throw new HttpError(500, 'SKILL_DELETION_FAILED', 'Failed to delete skill');
            }

            await del('skills:all');
            await set('skills:all', JSON.stringify(await repository.getAllSkills(client)));

            return sendSuccess(event, null, "Skill deleted successfully", "skill_deleted");
        }
    )
}