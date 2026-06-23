import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Badge, EmptyState } from '../../components/ui';

export default function PatientPrescriptionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patients/prescriptions').then((r) => setItems(r.data.data)).finally(() => setLoading(false));
  }, []);

  const statusVariant = { dispensed: 'success', approved: 'info', pending: 'warning', cancelled: 'danger' };

  return (
    <div>
      <PageHeader title="My Prescriptions" subtitle="Track medications prescribed by your doctors" />
      {loading ? (
        <div className="py-16 text-center text-gray-400">Loading prescriptions...</div>
      ) : items.length ? (
        <div className="space-y-4">
          {items.map((rx) => (
            <Card key={rx.id} className="overflow-hidden !p-0">
              <div className="border-b border-gray-100 bg-gradient-to-r from-synapse-navy/5 to-synapse-teal/5 px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-synapse-navy">{rx.diagnosis}</h3>
                    <p className="text-sm text-gray-500">
                      Dr. {rx.doctor_first_name} {rx.doctor_last_name} · {new Date(rx.prescribed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={statusVariant[rx.status] || 'default'}>{rx.status}</Badge>
                </div>
              </div>
              <div className="p-6">
                {rx.notes && <p className="mb-4 text-sm italic text-gray-500">{rx.notes}</p>}
                <div className="grid gap-3 sm:grid-cols-2">
                  {rx.items?.map((item) => (
                    <div key={item.id} className="rounded-xl border border-gray-100 bg-synapse-light p-4">
                      <p className="font-bold text-synapse-navy">{item.medicine_name}</p>
                      <p className="mt-1 text-sm text-gray-600">{item.dosage} · {item.frequency}</p>
                      <p className="text-sm text-gray-500">{item.duration} · Qty: {item.quantity}</p>
                      {item.instructions && <p className="mt-2 text-xs text-synapse-teal">{item.instructions}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon="💊" title="No prescriptions yet" description="Prescriptions from your doctor will appear here" />
      )}
    </div>
  );
}
