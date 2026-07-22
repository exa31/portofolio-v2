export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('job_applications', {
        id: {type: 'uuid', notNull: true, primaryKey: true, default: pgm.func('gen_random_uuid()')},
        user_id: {type: 'uuid', notNull: true, references: 'users(id)', onDelete: 'CASCADE'},
        company_name: {type: 'varchar(255)', notNull: true},
        position: {type: 'varchar(255)', notNull: true},
        hr_email: {type: 'varchar(255)', notNull: true},
        job_description: {type: 'text'},
        job_link: {type: 'varchar(500)'},
        email_subject: {type: 'text'},
        email_body: {type: 'text'},
        email_reasoning: {type: 'text'},
        status: {type: 'varchar(20)', notNull: true, default: 'draft'},
        sent_at: {type: 'timestamp with time zone'},
        created_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')},
        updated_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')},
    });

    pgm.createTable('application_attachments', {
        id: {type: 'uuid', notNull: true, primaryKey: true, default: pgm.func('gen_random_uuid()')},
        application_id: {type: 'uuid', notNull: true, references: 'job_applications(id)', onDelete: 'CASCADE'},
        file_name: {type: 'varchar(255)', notNull: true},
        file_url: {type: 'text', notNull: true},
        file_size: {type: 'integer'},
        mime_type: {type: 'varchar(100)'},
        created_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')},
    });

    pgm.createTable('gmail_tokens', {
        id: {type: 'uuid', notNull: true, primaryKey: true, default: pgm.func('gen_random_uuid()')},
        user_id: {type: 'uuid', notNull: true, unique: true, references: 'users(id)', onDelete: 'CASCADE'},
        email: {type: 'varchar(255)'},
        refresh_token: {type: 'text'},
        access_token: {type: 'text'},
        expires_at: {type: 'timestamp with time zone'},
        created_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')},
        updated_at: {type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp')},
    });
};

export const down = (pgm) => {
    pgm.dropTable('application_attachments');
    pgm.dropTable('gmail_tokens');
    pgm.dropTable('job_applications');
};
