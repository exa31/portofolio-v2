export const shorthands = undefined;

export const up = (pgm) => {
    pgm.sql(`CREATE EXTENSION IF NOT EXISTS vector`);

    // Scraped + AI-matched job listings (powered by the jobs-worker)
    pgm.createTable('job_listings', {
        id: {
            type: 'uuid',
            notNull: true,
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        source: { type: 'varchar(50)', notNull: true },
        source_job_id: { type: 'varchar(255)', notNull: true },
        title: { type: 'varchar(500)', notNull: true },
        company: { type: 'varchar(255)', notNull: true },
        company_logo: { type: 'text' },
        location: { type: 'varchar(255)' },
        salary: { type: 'text' },
        job_type: { type: 'varchar(100)' },
        experience: { type: 'varchar(100)' },
        description: { type: 'text' },
        job_url: { type: 'text', notNull: true },
        apply_url: { type: 'text' },
        posted_at: { type: 'timestamp with time zone' },
        deadline: { type: 'timestamp with time zone' },
        raw: { type: 'jsonb' },
        // Gemini embedding (gemini-embedding-001, 3072 dims) of the job for
        // pgvector cosine search against the candidate profile embedding.
        embedding: { type: 'vector(3072)' },
        relevance_score: { type: 'numeric(5,2)' },
        relevance_reason: { type: 'text' },
        is_relevant: { type: 'boolean', notNull: true, default: false },
        scraped_at: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        created_at: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addConstraint('job_listings', 'job_listings_source_source_job_id_unique', {
        unique: ['source', 'source_job_id'],
    });

    pgm.createIndex('job_listings', 'is_relevant');
    pgm.createIndex('job_listings', ['source', 'created_at']);
    pgm.createIndex('job_listings', 'created_at');


    // Audit log for every scraper run (per source)
    pgm.createTable('scrape_runs', {
        id: {
            type: 'uuid',
            notNull: true,
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        source: { type: 'varchar(50)', notNull: true },
        status: { type: 'varchar(20)', notNull: true },
        items_found: { type: 'integer', notNull: true, default: 0 },
        items_added: { type: 'integer', notNull: true, default: 0 },
        items_skipped: { type: 'integer', notNull: true, default: 0 },
        matched_count: { type: 'integer', notNull: true, default: 0 },
        error: { type: 'text' },
        started_at: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        finished_at: { type: 'timestamp with time zone' },
    });

    // Single-row table holding the candidate's frozen "job seeker profile"
    // embedding/relevance context. Rebuilt by the worker on every run.
    pgm.createTable('job_profile', {
        id: { type: 'smallint', notNull: true, primaryKey: true, default: 1 },
        context_text: { type: 'text', notNull: true },
        embedding: { type: 'vector(3072)' },
        updated_at: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addConstraint('job_profile', 'job_profile_single_row', {
        check: 'id = 1',
    });
};

export const down = (pgm) => {
    pgm.dropTable('job_profile');
    pgm.dropTable('scrape_runs');
    pgm.dropTable('job_listings');
};