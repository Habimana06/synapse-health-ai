import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Input, Badge } from '../../components/ui';

export default function PharmacyLocatorPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  const load = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city) params.set('city', city);
    api.get(`/pharmacies?${params}`).then((r) => setPharmacies(r.data.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageHeader title="Pharmacy Locator" subtitle="Find nearby pharmacies in Rwanda" />
      <div className="mb-6 flex flex-wrap gap-3">
        <Input placeholder="Search pharmacy..." value={search} onChange={(e) => setSearch(e.target.value)} className="!w-auto flex-1" />
        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="!w-40" />
        <button type="button" onClick={load} className="rounded-lg bg-synapse-teal px-4 py-2 text-sm font-semibold text-white">Search</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pharmacies.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-synapse-navy">{p.name}</h3>
              {p.is_partner ? <Badge variant="success">Partner</Badge> : null}
            </div>
            <p className="mt-2 text-sm text-gray-600">{p.address}</p>
            <p className="text-sm text-gray-500">{p.city}, {p.district}</p>
            <p className="mt-2 text-sm font-medium text-synapse-teal">{p.phone}</p>
            {p.latitude && (
              <a href={`https://www.google.com/maps?q=${p.latitude},${p.longitude}`} target="_blank" rel="noreferrer"
                className="mt-3 inline-block text-sm font-medium text-synapse-green hover:underline">
                Open in Google Maps →
              </a>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
