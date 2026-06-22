import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PatientNavbarLayout from './components/PatientNavbarLayout';
import SidebarLayout from './components/SidebarLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import PatientDashboard from './pages/patient/PatientDashboard';
import PatientHealthPage from './pages/patient/PatientHealthPage';
import PatientPrescriptionsPage from './pages/patient/PatientPrescriptionsPage';
import SymptomAnalyzerPage from './pages/patient/SymptomAnalyzerPage';
import RiskAssessmentPage from './pages/patient/RiskAssessmentPage';
import ChatPage from './pages/patient/ChatPage';
import PharmacyLocatorPage from './pages/patient/PharmacyLocatorPage';
import MedicineSearchPage from './pages/patient/MedicineSearchPage';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatientsPage from './pages/doctor/DoctorPatientsPage';
import DoctorPrescriptionsPage from './pages/doctor/DoctorPrescriptionsPage';
import DoctorAIRecommendPage from './pages/doctor/DoctorAIRecommendPage';
import DoctorLabsPage from './pages/doctor/DoctorLabsPage';

import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import PharmacistInventoryPage from './pages/pharmacist/PharmacistInventoryPage';
import PharmacistPrescriptionsPage from './pages/pharmacist/PharmacistPrescriptionsPage';
import PharmacistDemandPage from './pages/pharmacist/PharmacistDemandPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPharmaciesPage from './pages/admin/AdminPharmaciesPage';
import AdminHospitalsPage from './pages/admin/AdminHospitalsPage';
import AdminMedicinesPage from './pages/admin/AdminMedicinesPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

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

      {/* Patient — top navbar layout */}
      <Route path="/patient" element={<ProtectedRoute roles={['patient']}><PatientNavbarLayout /></ProtectedRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="health" element={<PatientHealthPage />} />
        <Route path="prescriptions" element={<PatientPrescriptionsPage />} />
        <Route path="symptoms" element={<SymptomAnalyzerPage />} />
        <Route path="risk" element={<RiskAssessmentPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="pharmacies" element={<PharmacyLocatorPage />} />
        <Route path="medicines" element={<MedicineSearchPage />} />
      </Route>

      {/* Doctor — sidebar layout */}
      <Route path="/doctor" element={<ProtectedRoute roles={['doctor']}><SidebarLayout role="doctor" /></ProtectedRoute>}>
        <Route index element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatientsPage />} />
        <Route path="prescriptions" element={<DoctorPrescriptionsPage />} />
        <Route path="ai-recommend" element={<DoctorAIRecommendPage />} />
        <Route path="labs" element={<DoctorLabsPage />} />
      </Route>

      {/* Pharmacist — sidebar layout */}
      <Route path="/pharmacist" element={<ProtectedRoute roles={['pharmacist']}><SidebarLayout role="pharmacist" /></ProtectedRoute>}>
        <Route index element={<PharmacistDashboard />} />
        <Route path="inventory" element={<PharmacistInventoryPage />} />
        <Route path="prescriptions" element={<PharmacistPrescriptionsPage />} />
        <Route path="demand" element={<PharmacistDemandPage />} />
      </Route>

      {/* Admin — sidebar layout */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><SidebarLayout role="admin" /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="pharmacies" element={<AdminPharmaciesPage />} />
        <Route path="hospitals" element={<AdminHospitalsPage />} />
        <Route path="medicines" element={<AdminMedicinesPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
      </Route>

      <Route path="/dashboard" element={<RoleRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
