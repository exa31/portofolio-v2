import {PoolClient} from "pg";
import {CreateMessageInput, MessageModel, UpdateMessageStatusInput} from "~~/server/model/message.model";

export const createMessage = async (
    client: PoolClient,
    data: CreateMessageInput
): Promise<string | undefined> => {
    const sql = `
        INSERT INTO messages (name, email, subject, message, status)
        VALUES ($1, $2, $3, $4, 'unread'::message_status) RETURNING id
    `
    const values = [
        data.name,
        data.email,
        data.subject,
        data.message,
    ]

    const result = await client.query<Partial<MessageModel>>(sql, values)
    return result.rows[0]?.id
}

export const updateMessageStatus = async (
    client: PoolClient,
    id: string,
    data: UpdateMessageStatusInput
): Promise<boolean> => {
    const sql = `
        UPDATE messages
        SET status = $1::message_status
        WHERE id = $2 AND deleted_at IS NULL
    `
    const values = [
        data.status,
        id,
    ]
    const result = await client.query(sql, values)
    return (result.rowCount ?? 0) > 0
}

export const deleteMessage = async (
    client: PoolClient,
    id: string
): Promise<boolean> => {
    const sql = `
        UPDATE messages
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = $1
    `
    const values = [id]

    const result = await client.query(sql, values)
    return (result.rowCount ?? 0) > 0
}

export const getMessageById = async (
    client: PoolClient,
    id: string
): Promise<MessageModel | null> => {
    const sql = `
        SELECT id,
               name,
               email,
               subject,
               message,
               status,
               created_at,
               deleted_at
        FROM messages
        WHERE id = $1
          AND deleted_at IS NULL
    `
    const values = [id]

    const result = await client.query<MessageModel>(sql, values)
    return result.rows[0] || null
}

export const getMessagesByCursor = async (
    client: PoolClient,
    limit: number,
    status: 'unread' | 'read',
    cursor?: number
): Promise<{ messages: MessageModel[]; has_next: boolean }> => {
    let sql = `
        SELECT id,
               name,
               email,
               subject,
               message,
               status,
               created_at,
               deleted_at
        FROM messages
        WHERE deleted_at IS NULL
          AND status = $1::message_status
    `
    const values: any[] = [status]
    let paramIndex = 2

    if (cursor) {
        sql += ` AND created_at < (SELECT created_at FROM messages WHERE id = $${paramIndex})`
        values.push(cursor)
        paramIndex++
    }

    sql += ` ORDER BY created_at DESC
        LIMIT $${paramIndex}`
    values.push(limit + 1)

    const result = await client.query<MessageModel>(sql, values)

    const has_next = result.rows.length > limit
    const messages = result.rows.slice(0, limit)

    return {messages, has_next}
}


export const getAllMessages = async (
    client: PoolClient,
): Promise<MessageModel[]> => {
    const sql = `
        SELECT id,
               name,
               email,
               subject,
               message,
               status,
               created_at,
               deleted_at
        FROM messages
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
    `


    const result = await client.query<MessageModel>(sql)

    return result.rows
}
