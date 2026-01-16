import * as repository from "~~/server/repositories/settings.repository";
import {H3Event} from "h3";
import {UpdateProfileSettingsInput, UpdateSocialLinksInput} from "~~/server/model/settings.model";
import {withTransaction} from "~~/server/db/postgres";
import {HttpError} from "~~/server/errors/HttpError";
import {get, set} from "~~/server/db/redis";

export const getUserSettings = async (event: H3Event,) => {
    return withTransaction(
        async (client) => {

            const cacheSetting = await get(`user_settings`);

            if (cacheSetting) {
                return sendSuccess(event, JSON.parse(cacheSetting), "User settings retrieved successfully", "user_settings_retrieved");
            }

            const settings = await repository.getUserSettings(client,);
            if (!settings) {
                throw new HttpError(404, 'USER_NOT_FOUND', 'User not found');
            }
            await set(`user_settings`, JSON.stringify(settings));
            return sendSuccess(event, settings, "User settings retrieved successfully", "user_settings_retrieved");
        }
    )
}

export const updateProfileSettings = async (event: H3Event, data: UpdateProfileSettingsInput) => {
    return withTransaction(
        async (client) => {
            const user = await repository.getUserSettings(client);
            if (!user) {
                throw new HttpError(404, 'USER_NOT_FOUND', 'User not found');
            }

            const ok = await repository.updateProfileSettings(client, data);
            if (!ok) {
                throw new HttpError(500, 'PROFILE_UPDATE_FAILED', 'Failed to update profile settings');
            }

            const updatedSettings = await repository.getUserSettings(client,);

            await set(`user_settings`, JSON.stringify(updatedSettings));

            return sendSuccess(
                event,
                updatedSettings,
                "Profile settings updated successfully",
                "profile_updated",
                200
            )
        }
    )
}

export const updateSocialLinks = async (event: H3Event, data: UpdateSocialLinksInput) => {
    return withTransaction(
        async (client) => {
            const user = await repository.getUserSettings(client);
            if (!user) {
                throw new HttpError(404, 'USER_NOT_FOUND', 'User not found');
            }

            const ok = await repository.updateSocialLinks(client, data);
            if (!ok) {
                throw new HttpError(500, 'SOCIAL_LINKS_UPDATE_FAILED', 'Failed to update social links');
            }

            const updatedSettings = await repository.getUserSettings(client);

            await set(`user_settings`, JSON.stringify(updatedSettings));

            return sendSuccess(
                event,
                updatedSettings,
                "Social links updated successfully",
                "social_links_updated",
                200
            )
        }
    )
}

