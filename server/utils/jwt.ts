import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {useAppConfig} from '~~/server/utils/config';

const Config = useAppConfig();
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? 30);
const REFRESH_ROTATE_THRESHOLD_DAYS = Number(process.env.REFRESH_ROTATE_THRESHOLD_DAYS ?? 7);

function getJwtSecret() {
    const secret = process.env.JWT_SECRET ?? Config.jwtSecret;
    if (!secret) throw new Error('JWT_SECRET not set');
    return secret;
}

export function signAccessToken(name: string, email: string, userId: string): string {
    const secret = getJwtSecret();
    return jwt.sign({name, email, sub: userId}, secret, {algorithm: 'HS256', expiresIn: ACCESS_TOKEN_EXPIRES_IN});
}

export function verifyAccessToken(token: string) {
    const secret = getJwtSecret();
    const payload = jwt.verify(token, secret) as any;
    if (payload?.typ && payload.typ !== 'access') throw new Error('invalid_token_type');
    return payload;
}

export function signRefreshToken(userId: string, name: string, email: string): { token: string; expiresAt: Date } {
    const secret = getJwtSecret();
    const jti = crypto.randomBytes(16).toString('hex');
    const expiresInSeconds = REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60; // seconds
    const options: jwt.SignOptions = {algorithm: 'HS256', expiresIn: expiresInSeconds};
    const token = jwt.sign({sub: userId, name, email, typ: 'refresh', jti}, secret, options);
    const decoded = jwt.decode(token) as any;
    const exp = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    return {token, expiresAt: exp};
}

export function verifyRefreshJwt(token: string) {
    const secret = getJwtSecret();
    let payload: any;
    try {
        payload = jwt.verify(token, secret) as any;
    } catch (err) {
        throw new Error('invalid_refresh_token');
    }

    // ensure token type is refresh
    if (payload?.typ !== 'refresh') throw new Error('invalid_refresh_type');
    return payload;
}
