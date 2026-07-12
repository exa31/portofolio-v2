export const shorthands = undefined;

export const up = (pgm) => {
    pgm.sql(`CREATE EXTENSION IF NOT EXISTS vector`);

    pgm.createTable('document_chunks', {
        id: { type: 'serial', notNull: true, primaryKey: true },
        content: { type: 'text', notNull: true },
        metadata: { type: 'jsonb', notNull: true },
        embedding: { type: 'vector(768)' },
        created_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
    });

    pgm.sql(`
        CREATE INDEX idx_document_chunks_embedding
        ON document_chunks
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100)
    `);
};

export const down = (pgm) => {
    pgm.dropTable('document_chunks');
};
