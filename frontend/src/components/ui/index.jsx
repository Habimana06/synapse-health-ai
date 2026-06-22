export function Card({ title, children, className = '', action }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-6 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-synapse-navy">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({ label, value, color = 'teal', icon }) {
  const colors = {
    teal: 'bg-synapse-teal/10 text-synapse-teal',
    green: 'bg-synapse-green/10 text-synapse-green',
    navy: 'bg-synapse-navy/10 text-synapse-navy',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-synapse-navy">{value}</p>
        </div>
        {icon && <div className={`rounded-lg p-3 text-xl ${colors[color]}`}>{icon}</div>}
      </div>
    </div>
  );
}

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-synapse-green/15 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-synapse-teal/15 text-synapse-teal',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function Input({ label, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
      <input
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-synapse-teal focus:outline-none focus:ring-1 focus:ring-synapse-teal"
        {...props}
      />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
      <select
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-synapse-teal focus:outline-none focus:ring-1 focus:ring-synapse-teal"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-synapse-teal text-white hover:bg-teal-600',
    secondary: 'border-2 border-synapse-navy text-synapse-navy hover:bg-synapse-navy hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-synapse-navy hover:bg-gray-100',
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-synapse-navy">{title}</h1>
      {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
    </div>
  );
}
