import { jobRepository } from '../repositories/job.repository';
import type { GetJobsQuery } from '../model/job.model';

export const jobService = {
    async getJobs(query: GetJobsQuery) {
        return jobRepository.getJobs(query);
    },

    async getStats() {
        return jobRepository.getStats();
    },

    async archiveJobs(ids: string[]) {
        return jobRepository.archiveJobs(ids);
    }
};
