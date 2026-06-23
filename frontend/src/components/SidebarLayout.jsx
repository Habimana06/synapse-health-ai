import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { DOCTOR_NAV, PHARMACIST_NAV, ADMIN_NAV } from '../config/navigation';

const NAV_MAP = { doctor: DOCTOR_NAV, pharmacist: PHARMACIST_NAV, admin: ADMIN_NAV };
const ROLE_LABELS = { doctor: 'Doctor Portal', pharmacist: 'Pharmacy Portal', admin: 'Admin Console' };
const ROLE_GRADIENT = {
  doctor: 'from-synapse-navy to-blue-900',
  pharmacist: 'from-teal-800 to-synapse-teal',
  admin: 'from-synapse-navy via-synapse-navy to-synapse-green',
};

export default function SidebarLayout({ role }) {
  const { hasPermission } = useAuth();
  const [open, setOpen] = useState(false);
  const sections = NAV_MAP[role] || [];

  const visibleSections = sections.map((sec) => ({
    ...sec,
    items: sec.items.filter((item) => !item.permission || hasPermission(item.permission)),
  })).filter((s) => s.items.length > 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-gradient-to-b ${ROLE_GRADIENT[role]} text-white shadow-2xl transition lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <img src="/logo.png" alt="" className="h-10 w-10 rounded-lg bg-white/10 p-1" />
          <div>
            <p className="text-sm font-bold tracking-wide">SYNAPSE</p>
            <p className="text-[10px] text-synapse-green">{ROLE_LABELS[role]}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {visibleSections.map((section) => (
            <div key={section.section} className="mb-6">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">{section.section}</p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-synapse-navy shadow-lg'
                          : 'text-blue-100 hover:bg-white/10 hover:translate-x-0.5'
                      }`
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <ProfileDropdown role={role} />
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} role="presentation" />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur lg:px-8">
          <button type="button" className="rounded-xl bg-gray-100 p-2.5 text-synapse-navy lg:hidden" onClick={() => setOpen(true)}>☰</button>
          <Link to="/" className="text-sm font-medium text-gray-500 hover:text-synapse-teal">← Home</Link>
          <span className="rounded-full bg-synapse-teal/10 px-4 py-1.5 text-xs font-bold capitalize text-synapse-teal">{role} Portal</span>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
