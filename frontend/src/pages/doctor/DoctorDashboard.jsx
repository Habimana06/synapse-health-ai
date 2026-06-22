import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PageHeader, StatCard, Card } from '../../components/ui';

export default function DoctorDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/doctors/dashboard').then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Doctor Dashboard" subtitle="Clinical overview and patient management" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Patients" value={stats?.totalPatients ?? '—'} icon="👥" color="navy" />
        <StatCard label="Today's Prescriptions" value={stats?.todayPrescriptions ?? '—'} icon="💊" color="teal" />
        <StatCard label="Pending" value={stats?.pendingPrescriptions ?? '—'} icon="⏳" color="green" />
      </div>
      <Card title="Quick Links" className="mt-8">
        <div className="flex flex-wrap gap-3">
          <Link to="/doctor/patients" className="rounded-lg bg-synapse-teal/10 px-4 py-2 text-sm font-medium text-synapse-teal">View Patients</Link>
          <Link to="/doctor/ai-recommend" className="rounded-lg bg-synapse-green/10 px-4 py-2 text-sm font-medium text-synapse-green">AI Recommendations</Link>
        </div>
      </Card>
    </div>
  );
}
