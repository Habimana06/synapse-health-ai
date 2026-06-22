const ROLE_PERMISSIONS = {
  patient: {
    role: 'patient',
    label: 'Patient',
    description: 'Personal health portal with AI assistance',
    permissions: [
      { key: 'view_dashboard', label: 'View personal dashboard', granted: true },
      { key: 'manage_profile', label: 'Manage health profile', granted: true },
      { key: 'view_prescriptions', label: 'View own prescriptions', granted: true },
      { key: 'symptom_analyzer', label: 'Use AI symptom analyzer', granted: true },
      { key: 'health_risk', label: 'Health risk assessment', granted: true },
      { key: 'ai_chat', label: 'Multilingual AI chat', granted: true },
      { key: 'pharmacy_search', label: 'Search pharmacies & medicines', granted: true },
      { key: 'create_prescription', label: 'Create prescriptions', granted: false },
      { key: 'manage_users', label: 'Manage system users', granted: false },
    ],
  },
  doctor: {
    role: 'doctor',
    label: 'Doctor',
    description: 'Clinical portal for patient care and prescriptions',
    permissions: [
      { key: 'view_dashboard', label: 'View doctor dashboard', granted: true },
      { key: 'view_patients', label: 'Access patient records', granted: true },
      { key: 'create_prescription', label: 'Create prescriptions', granted: true },
      { key: 'add_lab_results', label: 'Add laboratory results', granted: true },
      { key: 'add_medical_history', label: 'Record medical history', granted: true },
      { key: 'ai_drug_recommend', label: 'AI drug recommendations', granted: true },
      { key: 'view_prescriptions', label: 'View own prescriptions', granted: true },
      { key: 'manage_inventory', label: 'Manage pharmacy inventory', granted: false },
      { key: 'manage_users', label: 'Manage system users', granted: false },
    ],
  },
  pharmacist: {
    role: 'pharmacist',
    label: 'Pharmacist',
    description: 'Pharmacy inventory and prescription dispensing',
    permissions: [
      { key: 'view_dashboard', label: 'View pharmacy dashboard', granted: true },
      { key: 'manage_inventory', label: 'Update medicine inventory', granted: true },
      { key: 'dispense_prescription', label: 'Dispense prescriptions', granted: true },
      { key: 'view_demand', label: 'View demand trends', granted: true },
      { key: 'view_prescriptions', label: 'View pending prescriptions', granted: true },
      { key: 'create_prescription', label: 'Create prescriptions', granted: false },
      { key: 'view_patients', label: 'Full patient records', granted: false },
      { key: 'manage_users', label: 'Manage system users', granted: false },
    ],
  },
  admin: {
    role: 'admin',
    label: 'Administrator',
    description: 'Full system administration and analytics',
    permissions: [
      { key: 'view_dashboard', label: 'View admin dashboard', granted: true },
      { key: 'manage_users', label: 'Create, edit, delete, block users', granted: true },
      { key: 'manage_pharmacies', label: 'Manage pharmacies', granted: true },
      { key: 'manage_hospitals', label: 'Manage hospitals', granted: true },
      { key: 'manage_medicines', label: 'Manage medicine catalog', granted: true },
      { key: 'view_analytics', label: 'Healthcare analytics & reports', granted: true },
      { key: 'create_staff', label: 'Create doctors & pharmacists', granted: true },
      { key: 'system_settings', label: 'System configuration', granted: true },
    ],
  },
};

function getPermissions(role) {
  return ROLE_PERMISSIONS[role] || null;
}

function hasPermission(role, permissionKey) {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  const p = perms.permissions.find((x) => x.key === permissionKey);
  return p?.granted === true;
}

module.exports = { ROLE_PERMISSIONS, getPermissions, hasPermission };
