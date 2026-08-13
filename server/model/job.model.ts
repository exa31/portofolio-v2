import { z } from 'zod';

export const jobListingSchema = z.object({
    id: z.string().uuid(),
    source: z.string(),
    source_job_id: z.string(),
    title: z.string(),
    company: z.string(),
    company_logo: z.string().nullable(),
    location: z.string().nullable(),
    salary: z.string().nullable(),
    job_type: z.string().nullable(),
    experience: z.string().nullable(),
    description: z.string().nullable(),
    job_url: z.string(),
    apply_url: z.string().nullable(),
    posted_at: z.date().nullable(),
    deadline: z.date().nullable(),
    relevance_score: z.number().nullable(),
    relevance_reason: z.string().nullable(),
    is_relevant: z.boolean(),
    is_archived: z.boolean(),
    scraped_at: z.date(),
    created_at: z.date(),
    updated_at: z.date(),
});

export type JobListing = z.infer<typeof jobListingSchema>;

export const getJobsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    source: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['score', 'date']).default('score'),
    status: z.enum(['active', 'archived', 'all']).default('active'),
});

export type GetJobsQuery = z.infer<typeof getJobsQuerySchema>;

export const archiveJobsSchema = z.object({
    ids: z.array(z.string().uuid()),
});

export type ArchiveJobsBody = z.infer<typeof archiveJobsSchema>;
