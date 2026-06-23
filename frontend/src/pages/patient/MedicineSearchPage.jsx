import { useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Badge, Button, Input, Modal, DataTable, SearchBar, Pagination, EmptyState, DetailSection, DetailRow, ToastProvider, useToast, Select, Toast, ProgressBar, Checkbox } from '../../components/ui';

function MedicineSearchContent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [comparison, setComparison] = useState([]);
  const toast = useToast();

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get(`/pharmacies/search/medicine?q=${encodeURIComponent(query)}`);
      setResults(data.data);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompare = (item) => {
    setComparison((prev) =>
      prev.find((c) => c.id === item.id)
        ? prev.filter((c) => c.id !== item.id)
        : prev.length < 3 ? [...prev, item] : prev
    );
  };

  const comparePrices = () => {
    if (comparison.length < 2) {
      toast('Select at least 2 pharmacies to compare', 'warning');
      return;
    }
  };

  const pharmacyCounts = useMemo(() => {
    const counts = {};
    results.forEach((r) => {
      counts[r.name] = (counts[r.name] || 0) + 1;
    });
    return counts;
  }, [results]);

  return (
    <div className="animate-in">
      <PageHeader
        title="Medicine Availability"
        subtitle="Find where medicines are in stock across pharmacies"
        breadcrumb={[{ label: 'Patient Portal', href: '/patient' }, { label: 'Medicine Stock' }]}
      />

      <Card className="mb-6">
        <form onSubmit={search} className="flex flex-wrap gap-3">
          <Input
            placeholder="Search e.g. Paracetamol, Amoxicillin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 min-w-[200px]"
          />
          <Button type="submit" disabled={loading}>
            {loading ? '🔄 Searching...' : '🔍 Search'}
          </Button>
          {comparison.length > 0 && (
            <Button type="button" variant="outline" onClick={comparePrices}>
              ⚖️ Compare ({comparison.length}/3)
            </Button>
          )}
        </form>

        {searched && results.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(pharmacyCounts).map(([name, count]) => (
              <Badge key={name} variant="info">{name}: {count} items</Badge>
            ))}
          </div>
        )}
      </Card>

      {searched && results.length > 0 && (
        <Card title="Search Results" subtitle={`${results.length} pharmacies carrying "${query}"`} icon="💊">
          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((r, i) => (
              <div key={i} className={`rounded-2xl border-2 p-5 transition-all duration-200 ${
                comparison.find((c) => c.id === r.id)
                  ? 'border-synapse-teal bg-synapse-teal/5'
                  : 'border-gray-100 hover:border-synapse-navy'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-synapse-navy">{r.medicine_name} {r.strength}</p>
                    <p className="text-sm text-gray-600 mt-1">{r.name} — {r.address}, {r.city}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="success">{r.quantity} in stock</Badge>
                      {r.unit_price && <Badge variant="teal">{r.unit_price} RWF</Badge>}
                      {r.is_partner && <Badge variant="warning">Partner</Badge>}
                    </div>
                  </div>
                  <Checkbox
                    checked={!!comparison.find((c) => c.id === r.id)}
                    onChange={() => toggleCompare(r)}
                    label="Compare"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-synapse-teal hover:underline"
                >
                  📍 View on Map →
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}

      {comparison.length > 0 && (
        <Card title="Price Comparison" subtitle={`Comparing ${comparison.length} options`} icon="⚖️" className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-500">
                  <th className="pb-3 font-bold">Pharmacy</th>
                  <th className="pb-3 font-bold">Stock</th>
                  <th className="pb-3 font-bold">Price</th>
                  <th className="pb-3 font-bold">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {comparison.map((c) => {
                  const bestPrice = Math.min(...comparison.map((x) => x.unit_price || Infinity));
                  return (
                    <tr key={c.id}>
                      <td className="py-3 font-semibold text-synapse-navy">{c.name}</td>
                      <td className="py-3"><Badge variant={c.quantity > 50 ? 'success' : 'warning'}>{c.quantity} in stock</Badge></td>
                      <td className="py-3 font-bold text-synapse-navy">{c.unit_price ? `${c.unit_price.toLocaleString()} RWF` : '—'}</td>
                      <td className="py-3">
                        {c.unit_price === bestPrice ? (
                          <Badge variant="success">Best Price</Badge>
                        ) : c.unit_price ? (
                          <span className="text-xs text-gray-500">+{(c.unit_price - bestPrice).toLocaleString()} RWF vs best</span>
                        ) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {searched && !results.length && !loading && (
        <Card>
          <EmptyState
            icon="🔍"
            title="No pharmacies found"
            description={`No locations currently stock "${query}". Try a different medicine or check again later.`}
            action={
              <Button variant="outline" onClick={() => { setQuery(''); setSearched(false); setResults([]); }}>
                Try Another Search
              </Button>
            }
          />
        </Card>
      )}
    </div>
  );
}

export default function MedicineSearchPage() {
  return (
    <ToastProvider>
      <MedicineSearchContent />
    </ToastProvider>
  );
}
