exports.up = (pgm) => {
  pgm.addColumns('users', {
    job_notifications_enabled: {
      type: 'boolean',
      default: true,
      notNull: true,
    }
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', ['job_notifications_enabled']);
};
