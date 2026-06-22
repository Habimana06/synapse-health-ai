import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Badge, Button, Input, Select } from '../../components/ui';

const EMPTY_FORM = {
  email: '', password: '', firstName: '', lastName: '', phone: '', role: 'patient', language: 'en',
  licenseNumber: '', specialization: '', hospitalId: '', pharmacyId: '',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/admin/users').then((r) => setUsers(r.data.data)).catch(() => {});
  };

  useEffect(() => {
    load();
    api.get('/admin/hospitals').then((r) => setHospitals(r.data.data)).catch(() => {});
    api.get('/admin/pharmacies').then((r) => setPharmacies(r.data.data)).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError('');
    setModal('form');
  };

  const openEdit = (u) => {
    setEditId(u.id);
    setForm({
      email: u.email,
      password: '',
      firstName: u.first_name,
      lastName: u.last_name,
      phone: u.phone || '',
      role: u.role,
      language: u.language,
      licenseNumber: '',
      specialization: '',
      hospitalId: '',
      pharmacyId: '',
    });
    setError('');
    setModal('form');
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.put(`/admin/users/${editId}`, {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          language: form.language,
          role: form.role,
          password: form.password || undefined,
        });
      } else {
        await api.post('/admin/users', {
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          role: form.role,
          language: form.language,
          licenseNumber: form.licenseNumber,
          specialization: form.specialization,
          hospitalId: form.hospitalId || null,
          pharmacyId: form.pharmacyId || null,
        });
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const toggleActive = async (id) => {
    await api.patch(`/admin/users/${id}/toggle-active`);
    load();
  };

  const toggleBlock = async (id) => {
    await api.patch(`/admin/users/${id}/toggle-block`);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div>
      <PageHeader title="User Management" subtitle="Create, edit, block, activate, or delete users" />
      <div className="mb-4">
        <Button onClick={openCreate}>+ Create New User</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 pr-4">Name</th>
                <th className="pr-4">Email</th>
                <th className="pr-4">Role</th>
                <th className="pr-4">Active</th>
                <th className="pr-4">Blocked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50">
                  <td className="py-3 pr-4 font-medium text-synapse-navy">{u.first_name} {u.last_name}</td>
                  <td className="pr-4">{u.email}</td>
                  <td className="pr-4"><Badge variant="info">{u.role}</Badge></td>
                  <td className="pr-4">
                    <Badge variant={u.is_active ? 'success' : 'danger'}>{u.is_active ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="pr-4">
                    <Badge variant={u.is_blocked ? 'danger' : 'success'}>{u.is_blocked ? 'Blocked' : 'OK'}</Badge>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      <Button variant="ghost" className="!px-2 !py-1 !text-xs" onClick={() => openEdit(u)}>Edit</Button>
                      <Button variant="ghost" className="!px-2 !py-1 !text-xs" onClick={() => toggleActive(u.id)}>
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="ghost" className="!px-2 !py-1 !text-xs" onClick={() => toggleBlock(u.id)}>
                        {u.is_blocked ? 'Unblock' : 'Block'}
                      </Button>
                      <Button variant="danger" className="!px-2 !py-1 !text-xs" onClick={() => remove(u.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal === 'form' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-synapse-navy">{editId ? 'Edit User' : 'Create User'}</h3>
            <form onSubmit={save} className="mt-4 space-y-3">
              {!editId && <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />}
              <div className="grid grid-cols-2 gap-3">
                <Input label="First Name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <Input label="Last Name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <Input label={editId ? 'New Password (optional)' : 'Password'} type="password" required={!editId} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="admin">Admin</option>
              </Select>
              {form.role === 'doctor' && !editId && (
                <>
                  <Input label="License Number" required value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
                  <Input label="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
                  <Select label="Hospital" value={form.hospitalId} onChange={(e) => setForm({ ...form, hospitalId: e.target.value })}>
                    <option value="">Select hospital</option>
                    {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </Select>
                </>
              )}
              {form.role === 'pharmacist' && !editId && (
                <>
                  <Input label="License Number" required value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
                  <Select label="Pharmacy" value={form.pharmacyId} onChange={(e) => setForm({ ...form, pharmacyId: e.target.value })}>
                    <option value="">Select pharmacy</option>
                    {pharmacies.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </Select>
                </>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2 pt-2">
                <Button type="submit">{editId ? 'Save Changes' : 'Create User'}</Button>
                <Button type="button" variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
