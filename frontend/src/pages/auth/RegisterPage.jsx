import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../../context/AuthContext';
import { Input, Select, Button } from '../../components/ui';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '', language: 'en', gender: '', dateOfBirth: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(getDashboardPath(user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-synapse-light px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="" className="mx-auto h-14 w-14" />
          <h2 className="mt-4 text-2xl font-bold text-synapse-navy">Patient Registration</h2>
          <p className="mt-1 text-sm text-gray-500">Only patients can self-register. Doctors & pharmacists are created by admin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First Name" required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
            <Input label="Last Name" required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
          </div>
          <Input label="Email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
          <Input label="Password" type="password" required minLength={5} value={form.password} onChange={(e) => set('password', e.target.value)} />
          <Input label="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <Select label="Language" value={form.language} onChange={(e) => set('language', e.target.value)}>
            <option value="en">English</option>
            <option value="rw">Kinyarwanda</option>
            <option value="fr">French</option>
          </Select>
          <Select label="Gender" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
          <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full !py-3" disabled={loading}>
            {loading ? 'Creating...' : 'Register as Patient'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="font-semibold text-synapse-teal">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
