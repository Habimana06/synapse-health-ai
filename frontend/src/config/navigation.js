export const PATIENT_NAV = [
  {
    group: 'Overview',
    items: [
      { to: '/patient', label: 'Dashboard', icon: '🏠', end: true, permission: 'view_dashboard' },
    ],
  },
  {
    group: 'My Health',
    items: [
      { to: '/patient/health', label: 'Health Records', icon: '📋', permission: 'manage_profile' },
      { to: '/patient/prescriptions', label: 'Prescriptions', icon: '💊', permission: 'view_prescriptions' },
    ],
  },
  {
    group: 'AI Assistant',
    items: [
      { to: '/patient/symptoms', label: 'Symptom Analyzer', icon: '🩺', permission: 'symptom_analyzer' },
      { to: '/patient/risk', label: 'Risk Assessment', icon: '📊', permission: 'health_risk' },
      { to: '/patient/chat', label: 'Health Chat', icon: '💬', permission: 'ai_chat' },
    ],
  },
  {
    group: 'Pharmacy',
    items: [
      { to: '/patient/pharmacies', label: 'Pharmacy Locator', icon: '📍', permission: 'pharmacy_search' },
      { to: '/patient/medicines', label: 'Medicine Stock', icon: '🔍', permission: 'pharmacy_search' },
    ],
  },
];

export const DOCTOR_NAV = [
  { section: 'Clinical', items: [
    { to: '/doctor', label: 'Dashboard', icon: '📊', end: true, permission: 'view_dashboard' },
    { to: '/doctor/patients', label: 'Patients', icon: '👥', permission: 'view_patients' },
    { to: '/doctor/prescriptions', label: 'Prescriptions', icon: '💊', permission: 'create_prescription' },
    { to: '/doctor/labs', label: 'Lab Reports', icon: '🔬', permission: 'add_lab_results' },
  ]},
  { section: 'AI Tools', items: [
    { to: '/doctor/ai-recommend', label: 'AI Recommendations', icon: '🤖', permission: 'ai_drug_recommend' },
  ]},
];

export const PHARMACIST_NAV = [
  { section: 'Pharmacy', items: [
    { to: '/pharmacist', label: 'Dashboard', icon: '📊', end: true, permission: 'view_dashboard' },
    { to: '/pharmacist/inventory', label: 'Inventory', icon: '📦', permission: 'manage_inventory' },
    { to: '/pharmacist/prescriptions', label: 'Prescriptions', icon: '💊', permission: 'view_prescriptions' },
    { to: '/pharmacist/demand', label: 'Demand Trends', icon: '📈', permission: 'view_demand' },
  ]},
];

export const ADMIN_NAV = [
  { section: 'Management', items: [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true, permission: 'view_dashboard' },
    { to: '/admin/users', label: 'Users & Permissions', icon: '👤', permission: 'manage_users' },
    { to: '/admin/pharmacies', label: 'Pharmacies', icon: '🏪', permission: 'manage_pharmacies' },
    { to: '/admin/hospitals', label: 'Hospitals', icon: '🏥', permission: 'manage_hospitals' },
    { to: '/admin/medicines', label: 'Medicines', icon: '💊', permission: 'manage_medicines' },
  ]},
  { section: 'Insights', items: [
    { to: '/admin/analytics', label: 'Analytics', icon: '📈', permission: 'view_analytics' },
  ]},
];

export const PROFILE_ROUTES = {
  patient: '/patient/profile',
  doctor: '/doctor/profile',
  pharmacist: '/pharmacist/profile',
  admin: '/admin/profile',
};
