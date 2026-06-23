import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Card, Input, Select, Button, Badge } from '../../components/ui';

export default function PatientProfilePage() {
  const { user, loadUser } = useAuth();
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patients/profile').then((r) => {
      const d = r.data.data;
      setForm({
        firstName: d.first_name,
        lastName: d.last_name,
        phone: d.phone || '',
        language: d.language || 'en',
        dateOfBirth: d.date_of_birth?.split('T')[0] || '',
        gender: d.gender || '',
        bloodType: d.blood_type || '',
        emergencyContact: d.emergency_contact || '',
        emergencyPhone: d.emergency_phone || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.put('/patients/profile', form);
    setSaved(true);
    loadUser();
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Loading profile...</div>;

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal and emergency information" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-synapse-teal to-synapse-green text-3xl font-bold text-white">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <h3 className="mt-4 text-xl font-bold text-synapse-navy">{user?.first_name} {user?.last_name}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <Badge variant="info" className="mt-3">Patient Account</Badge>
        </Card>

        <Card title="Personal Information" className="lg:col-span-2">
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <Input label="First Name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Last Name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Select label="Language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
              <option value="en">English</option>
              <option value="rw">Kinyarwanda</option>
              <option value="fr">French</option>
            </Select>
            <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
            <Select label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
            <Select label="Blood Type" value={form.bloodType} onChange={(e) => setForm({ ...form, bloodType: e.target.value })}>
              <option value="">Unknown</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => <option key={b} value={b}>{b}</option>)}
            </Select>
            <Input label="Emergency Contact" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
            <Input label="Emergency Phone" value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} />
            <div className="sm:col-span-2 flex items-center gap-3">
              <Button type="submit">Save Profile</Button>
              {saved && <span className="text-sm font-medium text-synapse-green">✓ Saved successfully</span>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
