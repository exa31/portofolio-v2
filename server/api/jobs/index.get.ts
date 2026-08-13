import { getJobsQuerySchema } from "../../model/job.model";
import { jobService } from "../../services/job.service";
import { withAuth } from "~~/server/utils/withAuth";
import { HttpError } from "~~/server/errors/HttpError";
import { sendSuccess } from "~~/server/utils/response";

export default withAuth(async (event) => {
  const query = getQuery(event);
  const parsedQuery = getJobsQuerySchema.safeParse(query);

  if (!parsedQuery.success) {
    throw new HttpError(
      400,
      "INVALID_QUERY",
      "The query parameters are invalid",
    );
  }

  const result = await jobService.getJobs(parsedQuery.data);

  return sendSuccess(
    event,
    {
      data: result.data,
      pagination: {
        page: parsedQuery.data.page,
        limit: parsedQuery.data.limit,
        total: result.total,
      },
    },
    "Successfully fetched jobs",
    "jobs_fetched",
  );
});
