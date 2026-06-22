import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, StatCard } from '../../components/ui';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="System overview and management" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats?.totalUsers ?? '—'} icon="👤" color="navy" />
        <StatCard label="Pharmacies" value={stats?.activePharmacies ?? '—'} icon="🏪" color="teal" />
        <StatCard label="Hospitals" value={stats?.hospitals ?? '—'} icon="🏥" color="green" />
        <StatCard label="Prescriptions" value={stats?.totalPrescriptions ?? '—'} icon="💊" color="navy" />
      </div>
    </div>
  );
}
