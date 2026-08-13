import { handleError } from '~~/server/utils/handleError';
import { sendSuccess } from '~~/server/utils/response';
import { HttpError } from '~~/server/errors/HttpError';
import { verifyAccessToken } from '~~/server/utils/jwt';

export default handleError(async (event) => {
  // This endpoint can be triggered manually to wake up the worker
  const secret = getHeader(event, "x-worker-secret");
  const config = useRuntimeConfig();

  let isAuthenticated = false;
  if (secret === config.jobWorkerSecret) {
    isAuthenticated = true;
  } else {
    const authHeader = getHeader(event, 'authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : getCookie(event, 'token') || '';
    if (token) {
      try {
        if (verifyAccessToken(token)) {
          isAuthenticated = true;
        }
      } catch (err) {
        // Token verification failed (e.g. expired)
      }
    }
  }

  if (!isAuthenticated) {
    throw new HttpError(401, 'UNAUTHORIZED', 'Unauthorized worker trigger');
  }

  try {
    const body = await readBody(event).catch(() => ({}));
    const limit = body?.limit ? Number(body.limit) : undefined;

    const response = await $fetch(`${config.jobWorkerUrl}/run`, {
      method: "POST",
      headers: {
        "x-worker-secret": config.jobWorkerSecret as string,
      },
      body: { limit },
    });

    return sendSuccess(event, response, "Worker refresh triggered successfully", "worker_refresh");
  } catch (error: any) {
    throw new HttpError(error.response?.status || 500, 'WORKER_ERROR', error.data || error.message || 'Failed to trigger worker');
  }
});
