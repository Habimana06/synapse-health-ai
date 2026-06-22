import { useEffect, useState } from 'react';
import api from '../services/api';

const FEATURES = [
  {
    title: 'AI Symptom Analyzer',
    description: 'Enter symptoms and receive possible condition suggestions to assist clinical decisions.',
    icon: '🩺',
  },
  {
    title: 'Drug Interaction Detection',
    description: 'Automatic checks against current medications, allergies, and medical conditions.',
    icon: '💊',
  },
  {
    title: 'Pharmacy Locator',
    description: 'Find nearby pharmacies in Rwanda with real-time medicine availability.',
    icon: '📍',
  },
  {
    title: 'Multilingual Chat',
    description: 'AI health assistant in English, Kinyarwanda, and French.',
    icon: '💬',
  },
  {
    title: 'Health Risk Prediction',
    description: 'Predictive scores for diabetes, hypertension, heart and kidney disease.',
    icon: '📊',
  },
  {
    title: 'Role Dashboards',
    description: 'Dedicated portals for doctors, pharmacists, patients, and administrators.',
    icon: '👥',
  },
];

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
];

const ROLES = [
  { role: 'Patient', desc: 'Manage profile, view prescriptions, search pharmacies, chat with AI.' },
  { role: 'Doctor', desc: 'Access records, create prescriptions, review AI recommendations.' },
  { role: 'Pharmacist', desc: 'Update inventory, manage prescriptions, track demand.' },
  { role: 'Administrator', desc: 'Manage users, pharmacies, hospitals, and analytics.' },
];

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    api.get('/health')
      .then((res) => setApiStatus(res.data))
      .catch(() => setApiStatus({ status: 'offline' }));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-synapse-navy via-[#003366] to-synapse-teal">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-synapse-green blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-white">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-synapse-green">
                Rwanda Healthcare Innovation
              </p>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Connecting Intelligence to{' '}
                <span className="text-synapse-green">Better Healthcare</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-blue-100">
                AI-powered decision support for safer prescriptions, drug interaction detection,
                pharmacy integration, and multilingual patient care across Rwanda.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button type="button" className="btn-primary bg-synapse-green hover:bg-green-600">
                  Explore Platform
                </button>
                <button type="button" className="btn-secondary border-white text-white hover:bg-white hover:text-synapse-navy">
                  For Healthcare Providers
                </button>
              </div>

              {apiStatus && (
                <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                  <span className={`h-2 w-2 rounded-full ${apiStatus.status === 'ok' ? 'bg-synapse-green' : 'bg-red-400'}`} />
                  API {apiStatus.status === 'ok' ? 'Online' : 'Offline'}
                  {apiStatus.database && (
                    <span className="text-blue-200">· DB {apiStatus.database}</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <img
                src="/logo.png"
                alt="Synapse Health AI Logo"
                className="h-64 w-64 object-contain drop-shadow-2xl sm:h-80 sm:w-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-synapse-navy sm:text-4xl">Platform Features</h2>
            <p className="mt-4 text-lg text-gray-600">
              An intelligent healthcare ecosystem built for Rwanda and beyond.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-synapse-navy">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section id="languages" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-synapse-navy">Multilingual Support</h2>
            <p className="mt-4 text-lg text-gray-600">
              Accessible healthcare assistance in three languages.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className="flex items-center gap-4 rounded-xl border border-gray-200 px-8 py-5 shadow-sm"
              >
                <span className="text-4xl">{lang.flag}</span>
                <div>
                  <p className="font-semibold text-synapse-navy">{lang.name}</p>
                  <p className="text-xs uppercase tracking-wider text-gray-400">{lang.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-synapse-navy">Built for Every Role</h2>
            <p className="mt-4 text-lg text-gray-600">
              Tailored experiences for patients, providers, and administrators.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((item) => (
              <div key={item.role} className="rounded-xl bg-synapse-navy p-6 text-white">
                <h3 className="text-lg font-bold text-synapse-green">{item.role}</h3>
                <p className="mt-3 text-sm leading-relaxed text-blue-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-synapse-teal to-synapse-green py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">Ready to Transform Healthcare?</h2>
          <p className="mt-4 text-lg text-white/90">
            Join Synapse Health AI — reducing medication errors and improving patient outcomes across Rwanda.
          </p>
          <button type="button" className="mt-8 rounded-lg bg-white px-8 py-3 font-semibold text-synapse-navy shadow-lg transition hover:bg-gray-50">
            Start Building With Us
          </button>
        </div>
      </section>
    </>
  );
}
