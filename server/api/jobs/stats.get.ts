import { jobService } from '../../services/job.service';
import { withAuth } from '~~/server/utils/withAuth';
import { sendSuccess } from '~~/server/utils/response';

export default withAuth(async (event) => {
    const stats = await jobService.getStats();
    return sendSuccess(event, stats, 'Successfully fetched job stats', 'job_stats_fetched');
});
