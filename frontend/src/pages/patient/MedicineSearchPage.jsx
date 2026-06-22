import { useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Input, Button, Badge } from '../../components/ui';

export default function MedicineSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/pharmacies/search/medicine?q=${encodeURIComponent(query)}`);
      setResults(data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Medicine Availability" subtitle="Find where medicines are in stock" />
      <Card className="mb-6">
        <form onSubmit={search} className="flex gap-3">
          <Input placeholder="Search e.g. Paracetamol, Amoxicillin..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />
          <Button type="submit" disabled={loading}>{loading ? 'Searching...' : 'Search'}</Button>
        </form>
      </Card>

      <div className="space-y-3">
        {results.map((r, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-synapse-navy">{r.medicine_name} {r.strength}</p>
                <p className="text-sm text-gray-600">{r.name} — {r.address}, {r.city}</p>
              </div>
              <div className="text-right">
                <Badge variant="success">{r.quantity} in stock</Badge>
                {r.unit_price && <p className="mt-1 text-sm text-gray-500">{r.unit_price} RWF</p>}
              </div>
            </div>
          </Card>
        ))}
        {!results.length && query && !loading && <p className="text-center text-gray-400">No results found</p>}
      </div>
    </div>
  );
}
