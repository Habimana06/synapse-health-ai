import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Synapse Health AI" className="h-10 w-10 object-contain" />
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight text-synapse-navy">SYNAPSE</span>
              <span className="ml-1 text-xs font-medium uppercase tracking-widest text-synapse-teal">Health AI</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-synapse-teal">Features</a>
            <a href="#languages" className="text-sm font-medium text-gray-600 hover:text-synapse-teal">Languages</a>
            <a href="#roles" className="text-sm font-medium text-gray-600 hover:text-synapse-teal">For Providers</a>
          </nav>

          <div className="flex items-center gap-3">
            <button type="button" className="hidden text-sm font-medium text-synapse-navy sm:block">
              Sign In
            </button>
            <button type="button" className="btn-primary !px-4 !py-2 text-xs sm:!px-6 sm:!py-3 sm:text-sm">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="" className="h-8 w-8" />
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Synapse Health AI. All rights reserved.
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Clinical decision support only — not a substitute for professional medical care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
