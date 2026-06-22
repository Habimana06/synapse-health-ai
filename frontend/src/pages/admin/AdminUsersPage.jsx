import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Badge, Button } from '../../components/ui';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  const load = () => api.get('/admin/users').then((r) => setUsers(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    await api.patch(`/admin/users/${id}/toggle`);
    load();
  };

  return (
    <div>
      <PageHeader title="User Management" subtitle="Manage all system users" />
      <Card>
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-gray-500"><th className="pb-3">Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50">
                <td className="py-3 font-medium text-synapse-navy">{u.first_name} {u.last_name}</td>
                <td>{u.email}</td>
                <td><Badge variant="info">{u.role}</Badge></td>
                <td><Badge variant={u.is_active ? 'success' : 'danger'}>{u.is_active ? 'Active' : 'Inactive'}</Badge></td>
                <td><Button variant="ghost" onClick={() => toggle(u.id)} className="!text-xs">Toggle</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
