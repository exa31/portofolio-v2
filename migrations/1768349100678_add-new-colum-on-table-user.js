/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    // Add new column table 'users'
    pgm.addColumn('users', {
        location: {type: 'varchar(255)', notNull: false, default: null},
        open_to_opportunities: {type: 'boolean', notNull: true, default: false},
        github_profile: {type: 'varchar(255)', notNull: false, default: null},
        linkedin_profile: {type: 'varchar(255)', notNull: false, default: null},
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // Remove columns from table 'users'
    pgm.dropColumn('users', 'location');
    pgm.dropColumn('users', 'open_to_opportunities');
    pgm.dropColumn('users', 'github_profile');
    pgm.dropColumn('users', 'linkedin_profile');
};
