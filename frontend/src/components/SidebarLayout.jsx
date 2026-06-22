import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MENUS = {
  doctor: [
    { to: '/doctor', label: 'Dashboard', icon: '📊', end: true },
    { to: '/doctor/patients', label: 'Patients', icon: '👥' },
    { to: '/doctor/prescriptions', label: 'Prescriptions', icon: '💊' },
    { to: '/doctor/ai-recommend', label: 'AI Recommendations', icon: '🤖' },
    { to: '/doctor/labs', label: 'Lab Reports', icon: '🔬' },
    { to: '/doctor/permissions', label: 'Permissions', icon: '🔐' },
  ],
  pharmacist: [
    { to: '/pharmacist', label: 'Dashboard', icon: '📊', end: true },
    { to: '/pharmacist/inventory', label: 'Inventory', icon: '📦' },
    { to: '/pharmacist/prescriptions', label: 'Prescriptions', icon: '💊' },
    { to: '/pharmacist/demand', label: 'Demand Trends', icon: '📈' },
    { to: '/pharmacist/permissions', label: 'Permissions', icon: '🔐' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/users', label: 'Users', icon: '👤' },
    { to: '/admin/pharmacies', label: 'Pharmacies', icon: '🏪' },
    { to: '/admin/hospitals', label: 'Hospitals', icon: '🏥' },
    { to: '/admin/medicines', label: 'Medicines', icon: '💊' },
    { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { to: '/admin/permissions', label: 'Permissions', icon: '🔐' },
  ],
};

const ROLE_LABELS = { doctor: 'Doctor Portal', pharmacist: 'Pharmacy Portal', admin: 'Admin Portal' };

export default function SidebarLayout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menu = MENUS[role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-synapse-light">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-synapse-navy text-white transition lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <img src="/logo.png" alt="" className="h-8 w-8 rounded" />
          <div>
            <p className="text-sm font-bold">SYNAPSE</p>
            <p className="text-[10px] text-synapse-green">{ROLE_LABELS[role]}</p>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-synapse-teal text-white' : 'text-blue-100 hover:bg-white/10'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <p className="truncate text-sm font-medium">{user?.first_name} {user?.last_name}</p>
          <p className="truncate text-xs text-blue-200">{user?.email}</p>
          <button type="button" onClick={handleLogout} className="mt-3 w-full rounded-lg bg-white/10 py-2 text-sm hover:bg-white/20">
            Logout
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} role="presentation" />}

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8">
          <button type="button" className="rounded-lg p-2 text-synapse-navy lg:hidden" onClick={() => setOpen(true)}>
            ☰
          </button>
          <Link to="/" className="text-sm text-gray-500 hover:text-synapse-teal">← Back to Home</Link>
          <span className="rounded-full bg-synapse-green/15 px-3 py-1 text-xs font-semibold text-synapse-green capitalize">{role}</span>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
