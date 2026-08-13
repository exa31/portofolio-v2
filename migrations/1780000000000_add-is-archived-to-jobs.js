export const shorthands = undefined;

export const up = (pgm) => {
    pgm.addColumn('job_listings', {
        is_archived: {
            type: 'boolean',
            notNull: true,
            default: false
        }
    });
    pgm.createIndex('job_listings', 'is_archived');
};

export const down = (pgm) => {
    pgm.dropIndex('job_listings', 'is_archived');
    pgm.dropColumn('job_listings', 'is_archived');
};
