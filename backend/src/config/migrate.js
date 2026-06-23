const { pool } = require('./db');

async function runMigrations() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_permissions (
        id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id         INT UNSIGNED NOT NULL,
        permission_key  VARCHAR(100) NOT NULL,
        granted         TINYINT(1) NOT NULL DEFAULT 1,
        updated_by      INT UNSIGNED,
        updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
        UNIQUE KEY uk_user_permission (user_id, permission_key),
        INDEX idx_user_permissions_user (user_id)
      )
    `);

    const [cols] = await pool.query(
      "SHOW COLUMNS FROM users LIKE 'is_blocked'"
    );
    if (!cols.length) {
      await pool.query(
        'ALTER TABLE users ADD COLUMN is_blocked TINYINT(1) NOT NULL DEFAULT 0 AFTER is_active'
      );
    }

    console.log('[DB] Migrations applied successfully');
  } catch (err) {
    console.warn('[DB] Migration warning:', err.message);
  }
}

module.exports = { runMigrations };
