import {PoolClient} from "pg";
import {CreateJourneyInput, JourneyModel, UpdateJourneyInput} from "~~/server/model/journey.model";

export const createJourney = async (
    client: PoolClient,
    data: CreateJourneyInput
): Promise<number | undefined> => {
    const sql = `
        INSERT INTO journeys (title, company, location, start_date, end_date, key_responsibilities, description,
                              attachments, is_current)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
    `
    const values = [
        data.title,
        data.company,
        data.location || null,
        data.start_date,
        data.end_date || null,
        data.key_responsibilities,
        data.description || null,
        data.attachments || null,
        data.is_current,
    ]

    const result = await client.query<Partial<JourneyModel>>(sql, values)
    return result.rows[0]?.id
}

export const updateJourney = async (
    client: PoolClient,
    data: UpdateJourneyInput
): Promise<boolean> => {
    const sql = `
        UPDATE journeys
        SET title                = $1,
            company              = $2,
            location             = $3,
            start_date           = $4,
            end_date             = $5,
            key_responsibilities = $6,
            description          = $7,
            attachments          = $8,
            is_current           = $9
        WHERE id = $10
    `
    const values = [
        data.title,
        data.company,
        data.location || null,
        data.start_date,
        data.end_date || null,
        data.key_responsibilities,
        data.description || null,
        data.attachments || null,
        data.is_current,
        data.id,
    ]
    const result = await client.query(sql, values)
    return (result.rowCount ?? 0) > 0
}

export const deleteJourney = async (
    client: PoolClient,
    id: number
): Promise<boolean> => {
    const sql = `
        DELETE
        FROM journeys
        WHERE id = $1
    `
    const values = [id]

    const result = await client.query(sql, values)
    return (result.rowCount ?? 0) > 0
}

export const getJourneyById = async (
    client: PoolClient,
    id: number
): Promise<JourneyModel | null> => {
    const sql = `
        SELECT j.id,
               j.title,
               j.company,
               j.location,
               j.start_date,
               j.end_date,
               j.key_responsibilities,
               j.description,
               j.attachments,
               j.is_current,
               j.created_at,
               j.updated_at,
               ARRAY_AGG(s.id) FILTER (WHERE s.id IS NOT NULL) AS id_skills
        FROM journeys j
                 LEFT JOIN journey_skills js ON j.id = js.journey_id
                 LEFT JOIN skills s ON js.skill_id = s.id
        WHERE j.id = $1
        GROUP BY j.id
    `
    const values = [id]

    const result = await client.query<JourneyModel>(sql, values)
    return result.rows[0] || null
}

export const getJourneysByCursor = async (
    client: PoolClient,
    limit: number,
    cursor?: number,
    search?: string
): Promise<{ journeys: JourneyModel[]; has_next: boolean }> => {
    let sql = `
        SELECT j.id,
               j.title,
               j.company,
               j.location,
               j.start_date,
               j.end_date,
               j.key_responsibilities,
               j.description,
               j.attachments,
               j.is_current,
               j.created_at,
               j.updated_at,
               ARRAY_AGG(s.id) FILTER (WHERE s.id IS NOT NULL) AS id_skills
        FROM journeys j
                 LEFT JOIN journey_skills js ON j.id = js.journey_id
                 LEFT JOIN skills s ON js.skill_id = s.id
        WHERE 1 = 1
    `
    const values: any[] = []
    let paramIndex = 1

    if (search) {
        sql += ` AND (j.title ILIKE $${paramIndex} OR j.company ILIKE $${paramIndex})`
        values.push(`%${search}%`)
        paramIndex++
    }

    if (cursor) {
        sql += ` AND j.id < $${paramIndex}`
        values.push(cursor)
        paramIndex++
    }

    sql += ` GROUP BY j.id
        ORDER BY j.id DESC
        LIMIT $${paramIndex}`
    values.push(limit + 1)

    const result = await client.query<JourneyModel>(sql, values)

    const has_next = result.rows.length > limit
    const journeys = result.rows.slice(0, limit)

    return {journeys, has_next}
}

export const linkSkillToJourney = async (
    client: PoolClient,
    journeyId: number,
    skillIds: number[]
): Promise<boolean> => {
    // Delete existing links
    await client.query('DELETE FROM journey_skills WHERE journey_id = $1', [journeyId])

    if (skillIds.length === 0) {
        return true
    }

    // Insert new links
    const values = skillIds.map((skillId, index) => `(${journeyId}, $${index + 1})`).join(',')
    const sql = `INSERT INTO journey_skills (journey_id, skill_id)
                 VALUES ${values}`

    const result = await client.query(sql, skillIds)
    return (result.rowCount ?? 0) > 0
}

export const getAllJourneys = async (
    client: PoolClient,
): Promise<JourneyModel[]> => {
    const sql = `
        SELECT j.id,
               j.title,
               j.company,
               j.location,
               j.start_date,
               j.end_date,
               j.key_responsibilities,
               j.description,
               j.attachments,
               j.is_current,
               j.created_at,
               j.updated_at,
               ARRAY_AGG(s.id) FILTER (WHERE s.id IS NOT NULL) AS id_skills
        FROM journeys j
                 LEFT JOIN journey_skills js ON j.id = js.journey_id
                 LEFT JOIN skills s ON js.skill_id = s.id
        GROUP BY j.id
        ORDER BY j.id DESC
    `
    const result = await client.query<JourneyModel>(sql)

    return result.rows
}
