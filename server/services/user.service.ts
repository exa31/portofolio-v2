import {OAuth2Client} from "google-auth-library";
import {useAppConfig} from '~~/server/utils/config';
import {withTransaction} from "~~/server/db/postgres";
import {getUserByEmail} from "~~/server/repositories/user.repository";
import {HttpError} from "~~/server/errors/HttpError";
import {isRefreshTokenRotatingSoon, signAccessToken, signRefreshToken, verifyRefreshToken} from "~~/server/utils/jwt";
import * as repository from "~~/server/repositories/token.repository";
import {hashToSha256} from "~~/server/utils/hash";
import {del, set} from "~~/server/db/redis";
import type {H3Event} from "h3";
import {sendSuccess} from "~~/server/utils/response";

const Config = useAppConfig();

const googleClient = new OAuth2Client({
    client_id: Config.googleClientId,
    client_secret: Config.googleClientSecret,
});

export const loginWithGoogle = async (event: H3Event, idToken: string) => {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: Config.googleClientId,
    });
    const payload = ticket.getPayload();

    if (!payload) {
        throw new HttpError(401, 'INVALID_GOOGLE_TOKEN', 'Failed to verify Google ID token');
    }

    return withTransaction(
        async (client) => {
            const existingUser = await getUserByEmail(client, payload.email!);
            if (!existingUser) {
                throw new HttpError(404, 'USER_NOT_FOUND', 'User with this email does not exist');
            }

            const accessToken = signAccessToken(existingUser.name, existingUser.email, existingUser.id);
            const {
                token: refreshToken,
                expiresAt
            } = signRefreshToken(existingUser.id, existingUser.name, existingUser.email);

            await repository.saveRefreshToken(client, {
                userId: existingUser.id,
                tokenHash: hashToSha256(refreshToken),
                expiresAt
            })

            await set(`user_refresh_token:${refreshToken}`, JSON.stringify(existingUser))

            setCookie(
                event,
                'refresh_token',
                refreshToken,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/api',
                    expires: expiresAt,
                }
            )

            return sendSuccess(event, {
                access_token: accessToken,
                refresh_token: refreshToken,
                refresh_expires_at: expiresAt,
            }, "Login successful", "LOGIN_SUCCESS", 200);
        }
    )
}

export const loginByEmail = async (event: H3Event, email: string,) => {
    return withTransaction(
        async (client) => {
            const existingUser = await getUserByEmail(client, email!);
            if (!existingUser) {
                throw new HttpError(404, 'USER_NOT_FOUND', 'User with this email does not exist');
            }

            const accessToken = signAccessToken(existingUser.name, existingUser.email, existingUser.id);
            const {
                token: refreshToken,
                expiresAt
            } = signRefreshToken(existingUser.id, existingUser.name, existingUser.email);

            await repository.saveRefreshToken(client, {
                userId: existingUser.id,
                tokenHash: hashToSha256(refreshToken),
                expiresAt
            })

            await set(`user_refresh_token:${refreshToken}`, JSON.stringify(existingUser))

            setCookie(
                event,
                'refresh_token',
                refreshToken,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/api',
                    expires: expiresAt,
                }
            )

            return sendSuccess(event, {
                access_token: accessToken,
                refresh_token: refreshToken,
                refresh_expires_at: expiresAt,
            }, "Login successful", "LOGIN_SUCCESS", 200);
        }
    )
}

export const refreshToken = async (event: H3Event, oldRefreshToken: string) => {
    return withTransaction(
        async (client) => {
            // verify refresh token
            const {sub: userId, name, email} = verifyRefreshToken(oldRefreshToken);

            const isActiveRefreshToken = await repository.findByHash(client, hashToSha256(oldRefreshToken));

            if (!isActiveRefreshToken) {
                throw new HttpError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired');
            }

            const refreshTokenNeedRotation = isRefreshTokenRotatingSoon(isActiveRefreshToken.expires_at);

            const accessToken = signAccessToken(name, email, userId!);

            if (!refreshTokenNeedRotation) {
                return sendSuccess(event, {
                    access_token: accessToken,
                    refresh_token: oldRefreshToken,
                    refresh_expires_at: isActiveRefreshToken.expires_at,
                }, "Token refreshed successfully", "TOKEN_REFRESHED", 200);
            }

            const {
                token: newRefreshToken,
                expiresAt
            } = signRefreshToken(userId!, name, email);

            await repository.updateToken(client, hashToSha256(oldRefreshToken), expiresAt, hashToSha256(newRefreshToken));
            await del(`user_refresh_token:${refreshToken}`)
            await set(`user_refresh_token:${refreshToken}`, JSON.stringify({id: userId}))

            setCookie(
                event,
                'refresh_token',
                newRefreshToken,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/api',
                    expires: expiresAt,
                }
            )

            return sendSuccess(event, {
                access_token: accessToken,
                refresh_token: newRefreshToken,
                refresh_expires_at: expiresAt,
            }, "Token refreshed successfully", "TOKEN_REFRESHED", 200);
        }
    )
}