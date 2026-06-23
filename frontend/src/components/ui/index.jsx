export function Card({ title, children, className = '', action, subtitle }) {
  return (
    <div className={`rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm transition hover:shadow-md ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-bold text-synapse-navy">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({ label, value, color = 'teal', icon, trend, subtitle }) {
  const colors = {
    teal: 'from-synapse-teal/20 to-synapse-teal/5 text-synapse-teal border-synapse-teal/20',
    green: 'from-synapse-green/20 to-synapse-green/5 text-synapse-green border-synapse-green/20',
    navy: 'from-synapse-navy/15 to-synapse-navy/5 text-synapse-navy border-synapse-navy/20',
    red: 'from-red-100 to-red-50 text-red-600 border-red-200',
    amber: 'from-amber-100 to-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ${colors[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
          <p className="mt-2 text-3xl font-bold text-synapse-navy">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
          {trend && <p className="mt-2 text-xs font-medium">{trend}</p>}
        </div>
        {icon && <span className="text-3xl opacity-80">{icon}</span>}
      </div>
    </div>
  );
}

export function ActionCard({ to, icon, title, description, color = 'teal' }) {
  const borders = { teal: 'hover:border-synapse-teal', green: 'hover:border-synapse-green', navy: 'hover:border-synapse-navy' };
  return (
    <a href={to} className={`group block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${borders[color]}`}>
      <span className="text-3xl">{icon}</span>
      <h4 className="mt-3 font-bold text-synapse-navy group-hover:text-synapse-teal">{title}</h4>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <span className="mt-3 inline-block text-xs font-semibold text-synapse-teal opacity-0 transition group-hover:opacity-100">Open →</span>
    </a>
  );
}

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Input({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span>}
      <input
        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition focus:border-synapse-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-synapse-teal/20"
        {...props}
      />
    </label>
  );
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span>}
      <select
        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm focus:border-synapse-teal focus:outline-none focus:ring-2 focus:ring-synapse-teal/20"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-synapse-teal to-teal-600 text-white shadow-md shadow-synapse-teal/25 hover:shadow-lg',
    secondary: 'border-2 border-synapse-navy bg-white text-synapse-navy hover:bg-synapse-navy hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-synapse-navy hover:bg-gray-100',
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-synapse-navy">{title}</h1>
        {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <span className="text-5xl">{icon}</span>
      <h4 className="mt-4 font-semibold text-synapse-navy">{title}</h4>
      <p className="mt-1 max-w-xs text-sm text-gray-500">{description}</p>
    </div>
  );
}

export function SectionTitle({ children }) {
  return <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">{children}</h2>;
}
