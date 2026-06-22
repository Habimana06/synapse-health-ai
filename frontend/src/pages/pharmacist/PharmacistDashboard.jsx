import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, StatCard, Card } from '../../components/ui';

export default function PharmacistDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/pharmacists/dashboard').then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Pharmacy Dashboard" subtitle="Inventory and prescription management" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Inventory Items" value={stats?.inventoryItems ?? '—'} icon="📦" color="teal" />
        <StatCard label="Low Stock" value={stats?.lowStock ?? '—'} icon="⚠️" color="red" />
        <StatCard label="Pending Rx" value={stats?.pendingPrescriptions ?? '—'} icon="💊" color="navy" />
      </div>
    </div>
  );
}
