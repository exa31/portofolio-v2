import { query } from "../db/postgres";
import type { GetJobsQuery, JobListing } from "../model/job.model";

export const jobRepository = {
  async getJobs(params: GetJobsQuery) {
    const { page, limit, source, search, sort, status } = params;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE is_relevant = true";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (status === 'active') {
      whereClause += " AND is_archived = false";
    } else if (status === 'archived') {
      whereClause += " AND is_archived = true";
    }

    if (source) {
      whereClause += ` AND source = $${paramIndex}`;
      queryParams.push(source);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR company ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const orderBy =
      sort === "score"
        ? "relevance_score DESC, created_at DESC"
        : "created_at DESC";

    const sql = `
            SELECT id, source, source_job_id, title, company, company_logo, location, salary,
                   job_type, experience, description, job_url, apply_url, posted_at, deadline,
                   relevance_score, relevance_reason, is_relevant, scraped_at, created_at, updated_at
            FROM job_listings
            ${whereClause}
            ORDER BY ${orderBy}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
    queryParams.push(limit, offset);

    const countSql = `SELECT COUNT(*) FROM job_listings ${whereClause}`;
    const countParams = queryParams.slice(0, paramIndex - 1);

    const [results, countResult] = await Promise.all([
      query(sql, queryParams),
      query(countSql, countParams),
    ]);

    return {
      data: results.rows as JobListing[],
      total: parseInt(countResult.rows[0].count, 10),
    };
  },

  async getStats() {
    const totalSql = `SELECT COUNT(*) FROM job_listings WHERE is_relevant = true`;
    const bySourceSql = `SELECT source, COUNT(*) FROM job_listings WHERE is_relevant = true GROUP BY source`;
    const lastScrapedSql = `SELECT MAX(finished_at) as last_scraped FROM scrape_runs`;

    const [totalRes, bySourceRes, lastScrapedRes] = await Promise.all([
      query(totalSql),
      query(bySourceSql),
      query(lastScrapedSql),
    ]);

    return {
      total: parseInt(totalRes.rows[0].count, 10),
      bySource: bySourceRes.rows.reduce(
        (acc, row) => {
          acc[row.source] = parseInt(row.count, 10);
          return acc;
        },
        {} as Record<string, number>,
      ),
      lastScraped: lastScrapedRes.rows[0].last_scraped,
    };
  },

  async archiveJobs(ids: string[]) {
    if (ids.length === 0) return;
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
    const sql = `UPDATE job_listings SET is_archived = true WHERE id IN (${placeholders})`;
    await query(sql, ids);
  },
};
