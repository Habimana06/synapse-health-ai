import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/patient', label: 'Dashboard', end: true },
  { to: '/patient/health', label: 'Health Profile' },
  { to: '/patient/prescriptions', label: 'Prescriptions' },
  { to: '/patient/symptoms', label: 'Symptom Analyzer' },
  { to: '/patient/risk', label: 'Risk Assessment' },
  { to: '/patient/chat', label: 'AI Chat' },
  { to: '/patient/pharmacies', label: 'Pharmacies' },
  { to: '/patient/medicines', label: 'Find Medicine' },
];

export default function PatientNavbarLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-synapse-light">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/patient" className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-9 w-9" />
            <span className="font-bold text-synapse-navy">SYNAPSE</span>
            <span className="text-xs font-medium text-synapse-teal">Patient</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-synapse-teal/10 text-synapse-teal' : 'text-gray-600 hover:bg-gray-50 hover:text-synapse-navy'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-600 sm:block">{user?.first_name} {user?.last_name}</span>
            <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
              Logout
            </button>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-gray-100 px-4 py-2 lg:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                  isActive ? 'bg-synapse-teal text-white' : 'bg-gray-100 text-gray-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
