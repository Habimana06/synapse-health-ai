import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { PATIENT_NAV } from '../config/navigation';

export default function PatientNavbarLayout() {
  const { hasPermission, user } = useAuth();

  const visibleNav = PATIENT_NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || hasPermission(item.permission)),
  })).filter((g) => g.items.length > 0);

  const flatNav = visibleNav.flatMap((g) => g.items);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <Link to="/patient" className="flex shrink-0 items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-10 w-10 drop-shadow-sm" />
            <div>
              <p className="text-base font-bold tracking-tight text-synapse-navy">SYNAPSE</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-synapse-teal">Patient Portal</p>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 xl:flex">
            {visibleNav.map((group) => (
              <div key={group.group} className="flex items-center gap-1">
                <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{group.group}</span>
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-synapse-teal text-white shadow-md shadow-synapse-teal/25'
                          : 'text-gray-600 hover:bg-synapse-teal/5 hover:text-synapse-navy'
                      }`
                    }
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-lg bg-synapse-green/10 px-3 py-1.5 text-xs font-medium text-synapse-green md:block">
              {user?.language?.toUpperCase() || 'EN'}
            </div>
            <ProfileDropdown role="patient" />
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto border-t border-gray-100 px-4 py-3 xl:hidden">
          {flatNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                end={item.end}
                className={({ isActive }) =>
                    `flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                      isActive ? 'bg-synapse-navy text-white' : 'bg-gray-100 text-gray-600'
                    }`
                  }
                >
                  {item.icon} {item.label}
                </NavLink>
              ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
        Synapse Health AI · Clinical decision support only
      </footer>
    </div>
  );
}
