export const shorthands = undefined;

export const up = (pgm) => {
    pgm.addColumn('projects', {
        preview_images: {
            type: 'jsonb',
            notNull: true,
            default: '[]'
        }
    });
};

export const down = (pgm) => {
    pgm.dropColumn('projects', 'preview_images');
};
