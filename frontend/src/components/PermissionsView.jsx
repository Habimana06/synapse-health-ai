import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, Badge } from './ui';

export default function PermissionsView({ title = 'My Permissions' }) {
  const { permissions: cached, refreshPermissions } = useAuth();
  const [data, setData] = useState(cached);

  useEffect(() => {
    api.get('/auth/permissions').then((r) => setData(r.data.data)).catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-synapse-teal border-t-transparent" />
      </div>
    );
  }

  const granted = data.permissions.filter((p) => p.granted);
  const denied = data.permissions.filter((p) => !p.granted);

  return (
    <div>
      <PageHeader title={title} subtitle={data.description} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="!bg-emerald-50">
          <p className="text-3xl font-bold text-emerald-700">{granted.length}</p>
          <p className="text-sm text-emerald-600">Enabled permissions</p>
        </Card>
        <Card className="!bg-red-50">
          <p className="text-3xl font-bold text-red-700">{denied.length}</p>
          <p className="text-sm text-red-600">Restricted features</p>
        </Card>
      </div>
      <Card title="Your Access Rights" subtitle="Admin can enable or disable features for your account">
        <div className="space-y-2">
          {data.permissions.map((p) => (
            <div key={p.key} className={`flex items-center justify-between rounded-xl px-4 py-3 ${p.granted ? 'bg-emerald-50/50' : 'bg-red-50/50'}`}>
              <div>
                <span className="text-sm font-semibold text-synapse-navy">{p.label}</span>
                {p.overridden && <Badge variant="info" className="ml-2 !text-[10px]">Custom</Badge>}
              </div>
              <Badge variant={p.granted ? 'success' : 'danger'}>{p.granted ? 'Enabled' : 'Disabled'}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <p className="mt-4 text-center text-xs text-gray-400">Contact administrator to request access changes</p>
    </div>
  );
}
