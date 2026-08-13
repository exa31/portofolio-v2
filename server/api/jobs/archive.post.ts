import { handleError } from '~~/server/utils/handleError';
import { sendSuccess } from '~~/server/utils/response';
import { jobService } from '~~/server/services/job.service';
import { HttpError } from '~~/server/errors/HttpError';
import { withAuth } from '~~/server/utils/withAuth';
import { archiveJobsSchema } from '~~/server/model/job.model';

export default withAuth(handleError(async (event) => {
  const body = await readBody(event);
  const parsedBody = archiveJobsSchema.safeParse(body);

  if (!parsedBody.success) {
    throw new HttpError(400, 'BAD_REQUEST', 'Request body is invalid');
  }

  await jobService.archiveJobs(parsedBody.data.ids);

  return sendSuccess(event, null, `${parsedBody.data.ids.length} jobs have been archived`, 'jobs_archived');
}));
