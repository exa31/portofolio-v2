import {CreateSkillsInput, SkillModel, UpdateSkillInput} from "~~/server/model/skill.model";
import {PoolClient} from "pg";


export const createSkillsBulk = async (
    client: PoolClient,
    data: CreateSkillsInput
): Promise<number> => {
    if (data.length === 0) return 0

    const values: any[] = []
    const placeholders: string[] = []

    data.forEach((item, index) => {
        const baseIndex = index * 3
        placeholders.push(
            `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`
        )
        values.push(item.name, item.color, item.icon)
    })

    const sql = `
        INSERT INTO skills (name, color, icon)
        VALUES ${placeholders.join(', ')}
    `

    const result = await client.query(sql, values)
    return result.rowCount ?? 0
}

export const updateSkill = async (
    client: PoolClient,
    id: number,
    data: UpdateSkillInput
): Promise<boolean> => {
    const sql = `
        UPDATE skills
        SET name  = $1,
            color = $2,
            icon  = $3
        WHERE id = $4
    `
    const values = [data.name, data.color, data.icon, id]

    const result = await client.query(sql, values)
    return (result.rowCount ?? 0) > 0
}

export const deleteSkill = async (
    client: PoolClient,
    id: number
): Promise<boolean> => {
    const sql = `
        DELETE
        FROM skills
        WHERE id = $1
    `
    const values = [id]

    const result = await client.query(sql, values)
    return (result.rowCount ?? 0) > 0
}

export const getSkillCursorPagination = async (
    client: PoolClient,
    limit: number,
    search?: string,
    cursor?: number
): Promise<SkillModel[]> => {
    let sql = `
        SELECT id, name, color, icon, created_at
        FROM skills
    `
    const values: any[] = []

    if (cursor) {
        sql += ` WHERE id > $1`
        values.push(cursor)
    }
    if (search) {
        sql += cursor ? ` AND` : ` WHERE`
        sql += ` name ILIKE $${values.length + 1}`
        values.push(`%${search}%`)
    }

    sql += ` ORDER BY id ASC LIMIT $${values.length + 1}`
    values.push(limit)

    const result = await client.query<SkillModel>(sql, values)
    return result.rows
}

export const getAllSkills = async (
    client: PoolClient
): Promise<SkillModel[]> => {
    const sql = `
        SELECT id, name, color, icon, created_at
        FROM skills
        ORDER BY name ASC
    `
    const result = await client.query<SkillModel>(sql)
    return result.rows
}

export const getSkillById = async (
    client: PoolClient,
    id: number
): Promise<SkillModel | null> => {
    const sql = `
        SELECT id, name, color, icon, created_at
        FROM skills
        WHERE id = $1
    `
    const values = [id]

    const result = await client.query<SkillModel>(sql, values)
    return result.rows[0] ?? null
}