import {OAuth2Client} from "google-auth-library";
import {useAppConfig} from '~~/server/utils/config';
import {withTransaction} from "~~/server/db/postgres";
import {getUserByEmail} from "~~/server/repositories/user";
import {HttpError} from "~~/server/errors/HttpError";
import {signAccessToken, signRefreshToken} from "~~/server/utils/jwt";
import {saveRefreshToken} from "~~/server/repositories/token";
import {hashToSha256} from "~~/server/utils/hash";
import {set} from "~~/server/db/redis";
import type {H3Event} from "h3";
import {sendSuccess} from "~~/server/utils/response";

const Config = useAppConfig();

const googleClient = new OAuth2Client({
    client_id: Config.googleClientId,
    client_secret: Config.googleClientSecret,
});

const EXPIRATION_SECONDS = 30 * 24 * 60 * 60; // 2 hours

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

            await saveRefreshToken(client, {
                userId: existingUser.id,
                tokenHash: hashToSha256(refreshToken),
                expiresAt
            })

            await set(`user_refresh_token:${refreshToken}`, JSON.stringify(existingUser), EXPIRATION_SECONDS)

            return sendSuccess(event, {
                access_token: accessToken,
                refresh_token: refreshToken,
                refresh_expires_at: expiresAt,
            }, "Login successful", "LOGIN_SUCCESS", 200);
        }
    )
}