import {PoolClient} from "pg";
import {UpdateProfileSettingsInput, UpdateSocialLinksInput, UserSettingsModel} from "~~/server/model/settings.model";

export const getUserSettings = async (
    client: PoolClient,
    userId: string
): Promise<UserSettingsModel | null> => {
    const sql = `
        SELECT id,
               name,
               email,
               location,
               open_to_opportunities,
               github_profile,
               linkedin_profile,
               created_at,
               updated_at
        FROM users
        WHERE id = $1
    `
    const values = [userId]

    const result = await client.query<UserSettingsModel>(sql, values)
    return result.rows[0] || null
}

export const updateProfileSettings = async (
    client: PoolClient,
    userId: string,
    data: UpdateProfileSettingsInput
): Promise<boolean> => {
    const sql = `
        UPDATE users
        SET name                  = $1,
            email                 = $2,
            location              = $3,
            open_to_opportunities = $4,
            updated_at            = CURRENT_TIMESTAMP
        WHERE id = $5
    `
    const values = [
        data.name,
        data.email,
        data.location || null,
        data.open_to_opportunities,
        userId,
    ]

    const result = await client.query(sql, values)
    return (result.rowCount ?? 0) > 0
}

export const updateSocialLinks = async (
    client: PoolClient,
    userId: string,
    data: UpdateSocialLinksInput
): Promise<boolean> => {
    const sql = `
        UPDATE users
        SET github_profile   = $1,
            linkedin_profile = $2,
            updated_at       = CURRENT_TIMESTAMP
        WHERE id = $3
    `
    const values = [
        data.github_profile || null,
        data.linkedin_profile || null,
        userId,
    ]

    const result = await client.query(sql, values)
    return (result.rowCount ?? 0) > 0
}

