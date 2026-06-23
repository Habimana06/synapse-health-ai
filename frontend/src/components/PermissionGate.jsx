import { Navigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../context/AuthContext';

export default function PermissionGate({ permission, children, fallback = null }) {
  const { hasPermission, loading, user } = useAuth();

  if (loading) return null;
  if (!hasPermission(permission)) {
    if (fallback) return fallback;
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }
  return children;
}

export function AccessDenied({ message = 'You do not have permission to access this feature.' }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
      <span className="text-4xl">🔒</span>
      <h3 className="mt-4 text-lg font-semibold text-synapse-navy">Access Restricted</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{message}</p>
      <p className="mt-1 text-xs text-gray-400">Contact your administrator to enable this permission.</p>
    </div>
  );
}
