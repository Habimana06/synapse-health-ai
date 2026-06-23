import { useEffect, useState } from 'react';
import api from '../services/api';
import { Button, Badge } from './ui';

export default function UserPermissionsEditor({ userId, onClose, onSaved }) {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (userId) {
      api.get(`/admin/users/${userId}/permissions`).then((r) => setData(r.data.data)).catch(() => {});
    }
  }, [userId]);

  const toggle = (key) => {
    setData((d) => ({
      ...d,
      permissions: {
        ...d.permissions,
        permissions: d.permissions.permissions.map((p) =>
          p.key === key ? { ...p, granted: !p.granted, overridden: true } : p
        ),
      },
    }));
  };

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const payload = data.permissions.permissions.map((p) => ({ key: p.key, granted: p.granted }));
      await api.put(`/admin/users/${userId}/permissions`, { permissions: payload });
      setMsg('Permissions saved — user access updated immediately');
      onSaved?.();
    } catch {
      setMsg('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <div className="py-8 text-center text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-4 rounded-xl bg-synapse-light p-4">
        <p className="font-bold text-synapse-navy">{data.user.first_name} {data.user.last_name}</p>
        <p className="text-sm text-gray-500">{data.user.email} · {data.user.role}</p>
      </div>
      <p className="mb-4 text-sm text-gray-600">Toggle permissions for this user. Disabled permissions hide features until you re-enable them.</p>
      <div className="max-h-80 space-y-2 overflow-y-auto">
        {data.permissions.permissions.map((p) => (
          <div key={p.key} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
            <div>
              <p className="text-sm font-semibold text-synapse-navy">{p.label}</p>
              {p.overridden && <span className="text-[10px] text-synapse-teal">Custom override</span>}
            </div>
            <button
              type="button"
              onClick={() => toggle(p.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                p.granted ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {p.granted ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        ))}
      </div>
      {msg && <p className={`mt-4 text-sm ${msg.includes('saved') ? 'text-synapse-green' : 'text-red-600'}`}>{msg}</p>}
      <div className="mt-6 flex gap-2">
        <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Permissions'}</Button>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
