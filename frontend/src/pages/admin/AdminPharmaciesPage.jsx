import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Badge } from '../../components/ui';

export default function AdminPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    api.get('/admin/pharmacies').then((r) => setPharmacies(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Pharmacies" subtitle="Manage partner pharmacies" />
      <div className="grid gap-4 md:grid-cols-2">
        {pharmacies.map((p) => (
          <Card key={p.id}>
            <div className="flex justify-between">
              <h3 className="font-semibold text-synapse-navy">{p.name}</h3>
              <Badge variant={p.is_partner ? 'success' : 'default'}>{p.is_partner ? 'Partner' : 'Standard'}</Badge>
            </div>
            <p className="mt-2 text-sm text-gray-600">{p.address}, {p.city}</p>
            <p className="text-sm text-synapse-teal">{p.phone}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
