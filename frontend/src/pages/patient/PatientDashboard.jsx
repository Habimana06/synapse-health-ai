import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, StatCard, Card } from '../../components/ui';

export default function PatientDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/patients/dashboard').then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Patient Dashboard" subtitle="Your health overview at a glance" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Allergies" value={stats?.allergies ?? '—'} icon="⚠️" color="red" />
        <StatCard label="Active Conditions" value={stats?.activeConditions ?? '—'} icon="🩺" color="navy" />
        <StatCard label="Prescriptions" value={stats?.activePrescriptions ?? '—'} icon="💊" color="teal" />
        <StatCard label="Abnormal Labs" value={stats?.abnormalLabs ?? '—'} icon="🔬" color="green" />
      </div>
      <Card title="Quick Actions" className="mt-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { to: '/patient/symptoms', label: 'Check Symptoms', desc: 'AI symptom analyzer' },
            { to: '/patient/pharmacies', label: 'Find Pharmacy', desc: 'Nearby locations' },
            { to: '/patient/chat', label: 'AI Health Chat', desc: 'Ask health questions' },
          ].map((a) => (
            <a key={a.to} href={a.to} className="rounded-lg border border-gray-100 p-4 transition hover:border-synapse-teal hover:shadow-sm">
              <p className="font-semibold text-synapse-navy">{a.label}</p>
              <p className="text-sm text-gray-500">{a.desc}</p>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
