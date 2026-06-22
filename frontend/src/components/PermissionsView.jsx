import { useEffect, useState } from 'react';
import api from '../services/api';
import { PageHeader, Card, Badge } from './ui';

export default function PermissionsView({ title = 'My Permissions' }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/auth/permissions').then((r) => setData(r.data.data)).catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-synapse-teal border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={title} subtitle={data.description} />
      <Card title={`${data.label} Role Access`}>
        <div className="space-y-3">
          {data.permissions.map((p) => (
            <div key={p.key} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
              <span className="text-sm font-medium text-synapse-navy">{p.label}</span>
              <Badge variant={p.granted ? 'success' : 'danger'}>{p.granted ? 'Allowed' : 'Denied'}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <p className="mt-4 text-xs text-gray-400">
        Permissions are managed by system administrators. Contact admin for access changes.
      </p>
    </div>
  );
}
