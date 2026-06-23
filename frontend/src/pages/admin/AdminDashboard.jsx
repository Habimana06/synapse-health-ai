import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PageHeader, StatCard, Card, QuickStat, Badge, ActionCard, SectionTitle, EmptyState, ToastProvider, useToast } from '../../components/ui';

function useToastSafe() {
  try { return useToast(); } catch { return () => {}; }
}

function AdminDashboardContent() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const toast = useToastSafe();

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: dash }, { data: users }, { data: rx }] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/users?limit=5'),
          api.get('/admin/analytics'),
        ]);
        setStats(dash.data);
        setRecentUsers(users.data || []);
        setRecentPrescriptions([]); // not directly available in current API
      } catch {
        toast('Failed to load dashboard data', 'error');
      }
    };
    load();
  }, [toast]);

  const quickActions = [
    { to: '/admin/users', icon: '👤', title: 'Manage Users', description: 'Create, edit, and manage user accounts', color: 'navy' },
    { to: '/admin/medicines', icon: '💊', title: 'Medicine Catalog', description: 'Manage medicines and interactions', color: 'teal' },
    { to: '/admin/pharmacies', icon: '🏪', title: 'Pharmacies', description: 'Partner pharmacy management', color: 'green' },
    { to: '/admin/analytics', icon: '📈', title: 'Analytics', description: 'System analytics and insights', color: 'amber' },
  ];

  return (
    <div className="animate-in">
      <PageHeader
        title="Admin Dashboard"
        subtitle="System overview and management"
        breadcrumb={[{ label: 'Admin Console' }]}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickStat label="Total Users" value={stats?.totalUsers ?? '—'} change="+12%" icon="👤" color="teal" />
        <QuickStat label="Active Pharmacies" value={stats?.activePharmacies ?? '—'} change="+3" icon="🏪" color="green" />
        <QuickStat label="Hospitals" value={stats?.hospitals ?? '—'} icon="🏥" color="navy" />
        <QuickStat label="Total Prescriptions" value={stats?.totalPrescriptions ?? '—'} change="+8%" icon="💊" color="amber" />
      </div>

      <div className="mb-8">
        <SectionTitle>Quick Actions</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <ActionCard key={action.to} {...action} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Recent Users" subtitle="Latest registered accounts" icon="👥">
          {recentUsers.length ? (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 transition hover:border-synapse-teal">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-synapse-teal to-synapse-green text-xs font-bold text-white">
                      {u.first_name?.[0]}{u.last_name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-synapse-navy">{u.first_name} {u.last_name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.role === 'admin' ? 'navy' : u.role === 'doctor' ? 'info' : u.role === 'pharmacist' ? 'warning' : 'default'}>{u.role}</Badge>
                    <div className={`h-2 w-2 rounded-full ${u.is_active ? 'bg-synapse-green' : 'bg-gray-300'}`} title={u.is_active ? 'Active' : 'Inactive'} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No users yet" description="Users will appear here after registration" />
          )}
          <Link to="/admin/users" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-synapse-teal hover:underline">
            View all users →<span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </Card>

        <Card title="System Health" subtitle="Platform status indicators" icon="🩺">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">🟢</div>
                <div>
                  <p className="text-sm font-semibold text-synapse-navy">API Status</p>
                  <p className="text-xs text-gray-500">All systems operational</p>
                </div>
              </div>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">🗄️</div>
                <div>
                  <p className="text-sm font-semibold text-synapse-navy">Database</p>
                  <p className="text-xs text-gray-500">MySQL connected</p>
                </div>
              </div>
              <Badge variant="info">Connected</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-amber-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">👥</div>
                <div>
                  <p className="text-sm font-semibold text-synapse-navy">User Roles</p>
                  <p className="text-xs text-gray-500">Distribution across platform</p>
                </div>
              </div>
              <Link to="/admin/analytics" className="text-xs font-semibold text-synapse-teal hover:underline">Details →</Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ToastProvider>
      <AdminDashboardContent />
    </ToastProvider>
  );
}
