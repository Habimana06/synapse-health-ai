import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PROFILE_ROUTES } from '../config/navigation';

export default function ProfileDropdown({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase();
  const profilePath = PROFILE_ROUTES[role] || '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-synapse-teal hover:shadow-md"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-synapse-teal to-synapse-green text-sm font-bold text-white">
          {initials || '?'}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold text-synapse-navy leading-tight">{user?.first_name}</p>
          <p className="text-[10px] capitalize text-gray-400">{role}</p>
        </div>
        <svg className={`h-4 w-4 text-gray-400 transition ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          <div className="border-b border-gray-100 bg-gradient-to-r from-synapse-navy to-synapse-teal px-4 py-3 text-white">
            <p className="font-semibold">{user?.first_name} {user?.last_name}</p>
            <p className="truncate text-xs text-blue-100">{user?.email}</p>
          </div>
          <div className="py-1">
            <Link
              to={profilePath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-synapse-light"
            >
              <span>👤</span> My Profile
            </Link>
            <Link
              to={`/${role}/permissions`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-synapse-light"
            >
              <span>🔐</span> My Permissions
            </Link>
          </div>
          <div className="border-t border-gray-100 py-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
