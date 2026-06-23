import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, StatCard, Card, ActionCard, SectionTitle, Badge } from '../../components/ui';

export default function PatientDashboard() {
  const { user, hasPermission } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRx, setRecentRx] = useState([]);

  useEffect(() => {
    api.get('/patients/dashboard').then((r) => setStats(r.data.data)).catch(() => {});
    if (hasPermission('view_prescriptions')) {
      api.get('/patients/prescriptions').then((r) => setRecentRx(r.data.data.slice(0, 3))).catch(() => {});
    }
  }, [hasPermission]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-synapse-navy via-synapse-navy to-synapse-teal p-6 text-white shadow-xl lg:p-8">
        <p className="text-sm font-medium text-synapse-green">{greeting}</p>
        <h1 className="mt-1 text-2xl font-bold lg:text-3xl">{user?.first_name} {user?.last_name}</h1>
        <p className="mt-2 max-w-xl text-sm text-blue-100">Your personal health command center — track records, AI insights, and pharmacy access.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="success" className="!bg-white/20 !text-white">Patient</Badge>
          <Badge variant="info" className="!bg-white/20 !text-white">{user?.language?.toUpperCase()}</Badge>
        </div>
      </div>

      <SectionTitle>Health Overview</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Allergies" value={stats?.allergies ?? '—'} icon="⚠️" color="red" subtitle="Recorded allergens" />
        <StatCard label="Active Conditions" value={stats?.activeConditions ?? '—'} icon="🩺" color="navy" subtitle="Chronic & active" />
        <StatCard label="Prescriptions" value={stats?.activePrescriptions ?? '—'} icon="💊" color="teal" subtitle="Approved orders" />
        <StatCard label="Abnormal Labs" value={stats?.abnormalLabs ?? '—'} icon="🔬" color="amber" subtitle="Needs attention" />
      </div>

      <div className="mt-10">
        <SectionTitle>Quick Actions</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hasPermission('symptom_analyzer') && (
          <ActionCard to="/patient/symptoms" icon="🩺" title="Symptom Analyzer" description="AI-powered condition suggestions" />
        )}
        {hasPermission('ai_chat') && (
          <ActionCard to="/patient/chat" icon="💬" title="AI Health Chat" description="Ask in EN, Kinyarwanda, or French" color="green" />
        )}
        {hasPermission('pharmacy_search') && (
          <ActionCard to="/patient/pharmacies" icon="📍" title="Find Pharmacy" description="Locate medicines near you" color="navy" />
        )}
        {hasPermission('health_risk') && (
          <ActionCard to="/patient/risk" icon="📊" title="Risk Assessment" description="Diabetes, heart & kidney risk" />
        )}
        {hasPermission('manage_profile') && (
          <ActionCard to="/patient/health" icon="📋" title="Health Records" description="Allergies, labs, vaccinations" color="green" />
        )}
        {hasPermission('view_prescriptions') && (
          <ActionCard to="/patient/prescriptions" icon="💊" title="My Prescriptions" description="View medication history" color="navy" />
        )}
      </div>
      </div>

      {hasPermission('view_prescriptions') && recentRx.length > 0 && (
        <Card title="Recent Prescriptions" subtitle="Latest from your doctors" className="mt-8">
          <div className="space-y-3">
            {recentRx.map((rx) => (
              <div key={rx.id} className="flex items-center justify-between rounded-xl bg-synapse-light p-4">
                <div>
                  <p className="font-semibold text-synapse-navy">{rx.diagnosis}</p>
                  <p className="text-sm text-gray-500">Dr. {rx.doctor_first_name} {rx.doctor_last_name}</p>
                </div>
                <Badge variant={rx.status === 'dispensed' ? 'success' : 'info'}>{rx.status}</Badge>
              </div>
            ))}
          </div>
          <Link to="/patient/prescriptions" className="mt-4 inline-block text-sm font-semibold text-synapse-teal hover:underline">View all →</Link>
        </Card>
      )}
    </div>
  );
}
