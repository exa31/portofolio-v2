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
    pgm.sql(`
        INSERT INTO users (id, name, email)
        VALUES ('1e7b8f9c-3c4d-4e5f-8a9b-0c1d2e3f4a5b', 'Moh. Eka Syafrino Nazhifan', 'bloodsuker18@gmail.com')

    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DELETE
        FROM users
        WHERE id = '1e7b8f9c-3c4d-4e5f-8a9b-0c1d2e3f4a5b';
    `);
};
