-- Run if database already exists without user_permissions table
USE synapse_health_ai;

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
);
