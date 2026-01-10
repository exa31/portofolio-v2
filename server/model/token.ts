import z from 'zod';
import jwt from "jsonwebtoken";

export const tokenModel = z.object({
    token: z.string(),
    expires_at: z.date(),
})

export type TokenModel = z.infer<typeof tokenModel>;

export interface TokenPayload extends jwt.JwtPayload {
    typ: 'access' | 'refresh';
    email: string;
    name: string;
}