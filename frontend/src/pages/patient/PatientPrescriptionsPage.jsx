import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Badge } from '../../components/ui';

export default function PatientPrescriptionsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/patients/prescriptions').then((r) => setItems(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="My Prescriptions" subtitle="View your prescribed medications" />
      <div className="space-y-4">
        {items.map((rx) => (
          <Card key={rx.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-synapse-navy">{rx.diagnosis}</h3>
                <p className="text-sm text-gray-500">Dr. {rx.doctor_first_name} {rx.doctor_last_name} · {new Date(rx.prescribed_at).toLocaleDateString()}</p>
              </div>
              <Badge variant={rx.status === 'dispensed' ? 'success' : 'info'}>{rx.status}</Badge>
            </div>
            {rx.items?.length > 0 && (
              <div className="mt-4 space-y-2">
                {rx.items.map((item) => (
                  <div key={item.id} className="rounded-lg bg-synapse-light p-3 text-sm">
                    <p className="font-medium text-synapse-navy">{item.medicine_name}</p>
                    <p className="text-gray-600">{item.dosage} · {item.frequency} · {item.duration}</p>
                    {item.instructions && <p className="text-gray-500">{item.instructions}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
        {!items.length && <p className="text-center text-gray-400">No prescriptions yet</p>}
      </div>
    </div>
  );
}
