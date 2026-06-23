const { pool } = require('../config/db');
const { ROLE_PERMISSIONS } = require('../config/permissions');

async function getUserPermissionOverrides(userId) {
  try {
    const [rows] = await pool.query(
      'SELECT permission_key, granted FROM user_permissions WHERE user_id = ?',
      [userId]
    );
    return Object.fromEntries(rows.map((r) => [r.permission_key, r.granted === 1]));
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return {};
    throw err;
  }
}

async function getUserPermissions(userId, role) {
  const base = ROLE_PERMISSIONS[role];
  if (!base) return null;

  const overrides = await getUserPermissionOverrides(userId);

  return {
    role: base.role,
    label: base.label,
    description: base.description,
    permissions: base.permissions.map((p) => ({
      ...p,
      granted: Object.prototype.hasOwnProperty.call(overrides, p.key) ? overrides[p.key] : p.granted,
      overridden: Object.prototype.hasOwnProperty.call(overrides, p.key),
    })),
  };
}

async function hasUserPermission(userId, role, permissionKey) {
  const data = await getUserPermissions(userId, role);
  const perm = data?.permissions.find((p) => p.key === permissionKey);
  return perm?.granted === true;
}

async function saveUserPermissions(userId, permissions, adminId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM user_permissions WHERE user_id = ?', [userId]);

    for (const { key, granted } of permissions) {
      await conn.query(
        'INSERT INTO user_permissions (user_id, permission_key, granted, updated_by) VALUES (?, ?, ?, ?)',
        [userId, key, granted ? 1 : 0, adminId]
      );
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

module.exports = {
  getUserPermissions,
  hasUserPermission,
  saveUserPermissions,
  getUserPermissionOverrides,
};
