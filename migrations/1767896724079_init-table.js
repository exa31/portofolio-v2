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
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";    
    `)

    // Create enum types (idempotent)
    pgm.sql(`DO $$
 BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_status') THEN
     CREATE TYPE message_status AS ENUM ('unread','read','archived');
   END IF;
 END
 $$;`);

    // users
    pgm.createTable('users', {
        id: {type: 'uuid', notNull: true, primaryKey: true, default: pgm.func('gen_random_uuid()')},
        name: {type: 'varchar(255)', notNull: true},
        email: {type: 'varchar(255)', notNull: true, unique: true},
        password: {type: 'varchar(255)', notNull: true},
        created_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')},
        updated_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')}
    })

    // skills
    pgm.createTable('skills', {
        id: {type: 'serial', notNull: true, primaryKey: true},
        name: {type: 'varchar(100)', notNull: true, unique: true},
        color: {type: 'varchar(100)', notNull: true},
        icon: {type: 'varchar(100)'},
        created_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')},
        updated_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')}
    })

    // projects
    pgm.createTable('projects', {
        id: {type: 'serial', notNull: true, primaryKey: true},
        name: {type: 'varchar(255)', notNull: true},
        image: {type: 'varchar(255)', notNull: true},
        description: {type: 'text'},
        start_date: {type: 'date'},
        end_date: {type: 'date'},
        status: {type: 'boolean', notNull: true, default: false},
        features: {type: 'text[]', notNull: true},
        live_url: {type: 'varchar(255)'},
        repo_url: {type: 'varchar(255)'},
        created_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')},
        updated_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')}
    })

    // project_skills
    pgm.createTable('project_skills', {
        id: {type: 'serial', notNull: true, primaryKey: true},
        project_id: {
            type: 'integer',
            notNull: true,
            references: 'projects(id)',
            onDelete: 'CASCADE'
        },
        skill_id: {
            type: 'integer',
            notNull: true,
            references: 'skills(id)',
            onDelete: 'CASCADE'
        },
    })

    // Ensure a skill is linked to a project only once
    pgm.addConstraint('project_skills', 'project_skills_project_id_skill_id_unique', {
        unique: ['project_id', 'skill_id']
    });

    // Journey
    pgm.createTable('journeys', {
        id: {type: 'serial', notNull: true, primaryKey: true},
        title: {type: 'varchar(255)', notNull: true},
        company: {type: 'varchar(255)', notNull: true},
        location: {type: 'varchar(255)'},
        start_date: {type: 'date', notNull: true},
        end_date: {type: 'date'},
        key_responsibilities: {type: 'text[]', notNull: true},
        description: {type: 'text'},
        attachments: {type: 'varchar(255)'},
        is_current: {type: 'boolean', notNull: true, default: false},
        created_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')},
        updated_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')}
    })

    // Journey Skills
    pgm.createTable('journey_skills', {
        id: {type: 'serial', notNull: true, primaryKey: true},
        journey_id: {
            type: 'integer',
            notNull: true,
            references: 'journeys(id)',
            onDelete: 'CASCADE'
        },
        skill_id: {
            type: 'integer',
            notNull: true,
            references: 'skills(id)',
            onDelete: 'CASCADE'
        },
    })

    // Ensure a skill is linked to a journey only once
    pgm.addConstraint('journey_skills', 'journey_skills_journey_id_skill_id_unique', {
        unique: ['journey_id', 'skill_id']
    });

    // message
    pgm.createTable('messages', {
        id: {type: 'uuid', notNull: true, primaryKey: true, default: pgm.func('gen_random_uuid()')},
        name: {type: 'varchar(255)', notNull: true},
        email: {type: 'varchar(255)', notNull: true},
        subject: {type: 'varchar(255)', notNull: true},
        message: {type: 'text', notNull: true},
        status: {type: 'message_status', notNull: true, default: pgm.func("'unread'::message_status")},
        created_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')},
        deleted_at: {type: 'timestamp with time zone'}
    });

    // daily_unique_visitors
    pgm.createTable('daily_unique_visitors', {
        day: {type: 'date', primaryKey: true},
        count: {type: 'int', notNull: true, default: 0},
    })


};


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('daily_unique_visitors');
    pgm.dropTable('messages');
    pgm.dropTable('journey_skills');
    pgm.dropTable('journeys');
    pgm.dropTable('project_skills');
    pgm.dropTable('projects');
    pgm.dropTable('skills');
    pgm.dropTable('users');

    pgm.sql(`DROP TYPE IF EXISTS message_status;`);
};
