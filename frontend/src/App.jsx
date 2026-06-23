import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PermissionGate from './components/PermissionGate';
import Layout from './components/Layout';
import PatientNavbarLayout from './components/PatientNavbarLayout';
import SidebarLayout from './components/SidebarLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import PatientDashboard from './pages/patient/PatientDashboard';
import PatientHealthPage from './pages/patient/PatientHealthPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';
import PatientPrescriptionsPage from './pages/patient/PatientPrescriptionsPage';
import SymptomAnalyzerPage from './pages/patient/SymptomAnalyzerPage';
import RiskAssessmentPage from './pages/patient/RiskAssessmentPage';
import ChatPage from './pages/patient/ChatPage';
import PharmacyLocatorPage from './pages/patient/PharmacyLocatorPage';
import MedicineSearchPage from './pages/patient/MedicineSearchPage';
import PatientPermissionsPage from './pages/patient/PatientPermissionsPage';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatientsPage from './pages/doctor/DoctorPatientsPage';
import DoctorPrescriptionsPage from './pages/doctor/DoctorPrescriptionsPage';
import DoctorAIRecommendPage from './pages/doctor/DoctorAIRecommendPage';
import DoctorLabsPage from './pages/doctor/DoctorLabsPage';
import DoctorPermissionsPage from './pages/doctor/DoctorPermissionsPage';

import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import PharmacistInventoryPage from './pages/pharmacist/PharmacistInventoryPage';
import PharmacistPrescriptionsPage from './pages/pharmacist/PharmacistPrescriptionsPage';
import PharmacistDemandPage from './pages/pharmacist/PharmacistDemandPage';
import PharmacistPermissionsPage from './pages/pharmacist/PharmacistPermissionsPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPharmaciesPage from './pages/admin/AdminPharmaciesPage';
import AdminHospitalsPage from './pages/admin/AdminHospitalsPage';
import AdminMedicinesPage from './pages/admin/AdminMedicinesPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminPermissionsPage from './pages/admin/AdminPermissionsPage';

import StaffProfilePage from './pages/shared/StaffProfilePage';

function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={getDashboardPath(user.role)} replace />;
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/patient" element={<ProtectedRoute roles={['patient']}><PatientNavbarLayout /></ProtectedRoute>}>
        <Route index element={<PermissionGate permission="view_dashboard"><PatientDashboard /></PermissionGate>} />
        <Route path="profile" element={<PatientProfilePage />} />
        <Route path="health" element={<PermissionGate permission="manage_profile"><PatientHealthPage /></PermissionGate>} />
        <Route path="prescriptions" element={<PermissionGate permission="view_prescriptions"><PatientPrescriptionsPage /></PermissionGate>} />
        <Route path="symptoms" element={<PermissionGate permission="symptom_analyzer"><SymptomAnalyzerPage /></PermissionGate>} />
        <Route path="risk" element={<PermissionGate permission="health_risk"><RiskAssessmentPage /></PermissionGate>} />
        <Route path="chat" element={<PermissionGate permission="ai_chat"><ChatPage /></PermissionGate>} />
        <Route path="pharmacies" element={<PermissionGate permission="pharmacy_search"><PharmacyLocatorPage /></PermissionGate>} />
        <Route path="medicines" element={<PermissionGate permission="pharmacy_search"><MedicineSearchPage /></PermissionGate>} />
        <Route path="permissions" element={<PatientPermissionsPage />} />
      </Route>

      <Route path="/doctor" element={<ProtectedRoute roles={['doctor']}><SidebarLayout role="doctor" /></ProtectedRoute>}>
        <Route index element={<PermissionGate permission="view_dashboard"><DoctorDashboard /></PermissionGate>} />
        <Route path="profile" element={<StaffProfilePage roleLabel="Doctor" />} />
        <Route path="patients" element={<PermissionGate permission="view_patients"><DoctorPatientsPage /></PermissionGate>} />
        <Route path="prescriptions" element={<PermissionGate permission="create_prescription"><DoctorPrescriptionsPage /></PermissionGate>} />
        <Route path="ai-recommend" element={<PermissionGate permission="ai_drug_recommend"><DoctorAIRecommendPage /></PermissionGate>} />
        <Route path="labs" element={<PermissionGate permission="add_lab_results"><DoctorLabsPage /></PermissionGate>} />
        <Route path="permissions" element={<DoctorPermissionsPage />} />
      </Route>

      <Route path="/pharmacist" element={<ProtectedRoute roles={['pharmacist']}><SidebarLayout role="pharmacist" /></ProtectedRoute>}>
        <Route index element={<PermissionGate permission="view_dashboard"><PharmacistDashboard /></PermissionGate>} />
        <Route path="profile" element={<StaffProfilePage roleLabel="Pharmacist" />} />
        <Route path="inventory" element={<PermissionGate permission="manage_inventory"><PharmacistInventoryPage /></PermissionGate>} />
        <Route path="prescriptions" element={<PermissionGate permission="view_prescriptions"><PharmacistPrescriptionsPage /></PermissionGate>} />
        <Route path="demand" element={<PermissionGate permission="view_demand"><PharmacistDemandPage /></PermissionGate>} />
        <Route path="permissions" element={<PharmacistPermissionsPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><SidebarLayout role="admin" /></ProtectedRoute>}>
        <Route index element={<PermissionGate permission="view_dashboard"><AdminDashboard /></PermissionGate>} />
        <Route path="profile" element={<StaffProfilePage roleLabel="Administrator" />} />
        <Route path="users" element={<PermissionGate permission="manage_users"><AdminUsersPage /></PermissionGate>} />
        <Route path="pharmacies" element={<PermissionGate permission="manage_pharmacies"><AdminPharmaciesPage /></PermissionGate>} />
        <Route path="hospitals" element={<PermissionGate permission="manage_hospitals"><AdminHospitalsPage /></PermissionGate>} />
        <Route path="medicines" element={<PermissionGate permission="manage_medicines"><AdminMedicinesPage /></PermissionGate>} />
        <Route path="analytics" element={<PermissionGate permission="view_analytics"><AdminAnalyticsPage /></PermissionGate>} />
        <Route path="permissions" element={<AdminPermissionsPage />} />
      </Route>

      <Route path="/dashboard" element={<RoleRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
