import type {PoolClient} from "pg";
import type {TokenModel} from "~~/server/model/token";

export const saveRefreshToken = async (client: PoolClient, {userId, tokenHash, expiresAt}: {
    userId: string,
    tokenHash: string,
    expiresAt: Date
}) => {
    const query = `
        INSERT INTO tokens (user_id, token, expires_at)
        VALUES ($1, $2, $3)
    `;
    const values = [userId, tokenHash, expiresAt.toISOString()];

    await client.query(query, values);
}

export const findByHash = async (client: PoolClient, tokenHash: string): Promise<TokenModel | null> => {
    const query = `
        SELECT token
        FROM tokens
        WHERE token = $1
          AND expires_at > NOW() LIMIT 1
    `;
    const values = [tokenHash];

    const res = await client.query<TokenModel>(query, values);
    if (res.rows.length === 0) {
        throw new Error('token_not_found');
    }
    return res.rows[0] || null;
}

export const updateToken = async (client: PoolClient, tokenHash: string, expiresAt: Date): Promise<boolean> => {
    const query = `
        UPDATE tokens
        SET token      = $1,
            expires_at = $2
        WHERE token = $3
    `

    const values = [tokenHash, expiresAt.toISOString(), tokenHash];

    const res = await client.query(query, values);
    return (res.rowCount || 0) > 0;
}

export const deleteToken = async (client: PoolClient, tokenHash: string): Promise<boolean> => {
    const query = `
        DELETE
        FROM tokens
        WHERE token = $1
    `;

    const values = [tokenHash];

    const res = await client.query(query, values);
    return (res.rowCount || 0) > 0;
}