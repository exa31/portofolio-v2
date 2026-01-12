import {PoolClient} from "pg";
import {CreateProjectInput, ProjectModel, UpdateProjectInput} from "~~/server/model/project.model";

export const createProject = async (
    client: PoolClient,
    data: CreateProjectInput
): Promise<number | undefined> => {
    const sql = `
        INSERT INTO projects ( name, image, description, start_date, end_date, status, features, live_url
                             , repo_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
    `
    const values = [
        data.name,
        data.url,
        data.description,
        data.start_date,
        data.end_date,
        data.status,
        data.features,
        data.live_url,
        data.repo_url,
    ]

    const result = await client.query<Partial<ProjectModel>>(sql, values)
    return result.rows[0]?.id
}

export const updateProject = async (
    client: PoolClient,
    data: UpdateProjectInput
): Promise<boolean> => {
    const sql = `
        UPDATE projects
        SET name        = $1,
            image       = $2,
            description = $3,
            start_date  = $4,
            end_date    = $5,
            status      = $6,
            features    = $7,
            live_url    = $8,
            repo_url    = $9
        WHERE id = $10
    `
    const values = [
        data.name,
        data.url,
        data.description,
        data.start_date,
        data.end_date,
        data.status,
        data.features,
        data.live_url,
        data.repo_url,
        data.id,
    ]
    const result = await client.query(sql, values)
    return (result.rowCount ?? 0) > 0
}

export const deleteProject = async (
    client: PoolClient,
    id: number
): Promise<boolean> => {
    const sql = `
        DELETE
        FROM projects
        WHERE id = $1
    `
    const values = [id]

    const result = await client.query(sql, values)
    return (result.rowCount ?? 0) > 0
}

export const getProjectById = async (
    client: PoolClient,
    id: number
): Promise<ProjectModel | null> => {
    const sql = `
        SELECT p.id,
               p.name,
               p.image,
               p.description,
               p.start_date,
               p.end_date,
               p.status,
               p.features,
               p.live_url,
               p.repo_url,
               p.created_at,
               ARRAY_AGG(s.name) AS skills
        FROM projects p
                 JOIN project_skills ps ON p.id = ps.project_id
                 JOIN skills s ON ps.skill_id = s.id
        WHERE p.id = $1
        GROUP BY p.id
    `
    const values = [id]

    const result = await client.query(sql, values)
    return result.rows[0] || null
}

export const getProjectCursorPagination = async (
    client: PoolClient,
    limit: number,
    search?: string,
    cursor?: number
): Promise<ProjectModel[]> => {
    let sql = `
        SELECT p.id,
               p.name,
               p.image,
               p.description,
               p.start_date,
               p.end_date,
               p.status,
               p.features,
               p.live_url,
               p.repo_url,
               p.created_at,
               ARRAY_AGG(s.name)
        FROM projects p
                 JOIN project_skills ps ON ps.project_id = p.id
                 JOIN skills s ON s.id = ps.skill_id
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


    sql += `
    GROUP BY p.id       
     ORDER BY id ASC LIMIT $${values.length + 1}
     `
    values.push(limit)

    const result = await client.query(sql, values)
    return result.rows
}

export const getAllProjects = async (
    client: PoolClient
): Promise<ProjectModel[]> => {
    const sql = `
        SELECT p.id,
               p.name,
               p.image,
               p.description,
               p.start_date,
               p.end_date,
               p.status,
               p.features,
               p.live_url,
               p.repo_url,
               p.created_at,
               ARRAY_AGG(s.name) AS skills
        FROM projects p
                 JOIN project_skills ps on p.id = ps.project_id
                 JOIN skills s on ps.skill_id = s.id
        GROUP BY p.id
        ORDER BY p.name ASC
    `
    const result = await client.query(sql)
    return result.rows
}