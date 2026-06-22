import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card } from '../../components/ui';

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    api.get('/admin/hospitals').then((r) => setHospitals(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Hospitals" subtitle="Manage healthcare facilities" />
      <div className="grid gap-4 md:grid-cols-2">
        {hospitals.map((h) => (
          <Card key={h.id}>
            <h3 className="font-semibold text-synapse-navy">{h.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{h.address}, {h.city}</p>
            <p className="text-sm text-gray-500">{h.phone}</p>
          </Card>
        ))}
        {!hospitals.length && <p className="text-gray-400">No hospitals registered yet</p>}
      </div>
    </div>
  );
}
