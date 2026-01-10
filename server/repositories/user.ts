import type {PoolClient} from "pg";
import type {UserModel} from "~~/server/model/user";

export const getUserByEmail = async (client: PoolClient, email: string): Promise<UserModel | null> => {
    const query = `
        SELECT id, email, name
        FROM users
        WHERE email = $1 LIMIT 1
    `;
    const values = [email];

    const res = await client.query<UserModel>(query, values);
    if (res.rows.length === 0) {
        return null;
    }
    return res.rows[0] || null;
}
