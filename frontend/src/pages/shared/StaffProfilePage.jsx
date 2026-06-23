import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Card, Input, Select, Button, Badge } from '../../components/ui';

export default function StaffProfilePage({ roleLabel }) {
  const { user, profile, loadUser } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', language: 'en', password: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone || '',
        language: user.language || 'en',
        password: '',
      });
    }
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    await api.put('/auth/profile', form);
    setSaved(true);
    loadUser();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <PageHeader title="My Profile" subtitle={`${roleLabel} account settings`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-synapse-navy to-synapse-teal text-3xl font-bold text-white">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <h3 className="mt-4 text-xl font-bold text-synapse-navy">{user?.first_name} {user?.last_name}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <Badge variant="info" className="mt-3 capitalize">{roleLabel}</Badge>
          {profile?.hospital_name && <p className="mt-2 text-sm text-gray-600">🏥 {profile.hospital_name}</p>}
          {profile?.pharmacy_name && <p className="mt-2 text-sm text-gray-600">🏪 {profile.pharmacy_name}</p>}
          {profile?.specialization && <p className="mt-1 text-sm text-gray-500">{profile.specialization}</p>}
        </Card>
        <Card title="Account Settings" className="lg:col-span-2">
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <Input label="First Name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Last Name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Select label="Language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
              <option value="en">English</option>
              <option value="rw">Kinyarwanda</option>
              <option value="fr">French</option>
            </Select>
            <Input label="New Password (optional)" type="password" className="sm:col-span-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <div className="sm:col-span-2 flex items-center gap-3">
              <Button type="submit">Save Changes</Button>
              {saved && <span className="text-sm text-synapse-green font-medium">✓ Saved</span>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
