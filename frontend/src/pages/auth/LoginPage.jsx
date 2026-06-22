import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(getDashboardPath(user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'hntaganira06@gmail.com', role: 'Admin' },
    { email: 'patient@synapse.rw', role: 'Patient' },
    { email: 'doctor@synapse.rw', role: 'Doctor' },
    { email: 'pharmacist@synapse.rw', role: 'Pharmacist' },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-center bg-gradient-to-br from-synapse-navy to-synapse-teal p-12 text-white lg:flex">
        <img src="/logo.png" alt="" className="mb-8 h-24 w-24" />
        <h1 className="text-4xl font-bold">Synapse Health AI</h1>
        <p className="mt-4 text-lg text-blue-100">Connecting Intelligence to Better Healthcare</p>
        <p className="mt-8 text-sm text-blue-200">Admin: hntaganira06@gmail.com · Demo patients use Password123!</p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <img src="/logo.png" alt="" className="mb-6 h-14 w-14 lg:hidden" />
          <h2 className="text-2xl font-bold text-synapse-navy">Sign In</h2>
          <p className="mt-1 text-gray-500">Access your healthcare portal</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-synapse-teal focus:outline-none focus:ring-1 focus:ring-synapse-teal" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-synapse-teal focus:outline-none focus:ring-1 focus:ring-synapse-teal" />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-synapse-teal py-3 font-semibold text-white hover:bg-teal-600 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">Demo Accounts</p>
            <div className="mt-2 space-y-1">
              {demoAccounts.map((a) => (
                <button key={a.email} type="button" onClick={() => {
                  setEmail(a.email);
                  setPassword(a.role === 'Admin' ? '62001' : 'Password123!');
                }}
                  className="block w-full rounded px-2 py-1 text-left text-sm text-synapse-navy hover:bg-white">
                  {a.role}: {a.email}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            No account? <Link to="/register" className="font-semibold text-synapse-teal">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
