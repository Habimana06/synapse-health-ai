import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Badge, Button } from '../../components/ui';

export default function PharmacistPrescriptionsPage() {
  const [items, setItems] = useState([]);

  const load = () => api.get('/pharmacists/prescriptions').then((r) => setItems(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const dispense = async (id) => {
    await api.patch(`/pharmacists/prescriptions/${id}/dispense`);
    load();
  };

  return (
    <div>
      <PageHeader title="Prescriptions" subtitle="Review and dispense prescriptions" />
      <div className="space-y-4">
        {items.map((rx) => (
          <Card key={rx.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-synapse-navy">{rx.diagnosis}</h3>
                <p className="text-sm text-gray-500">{rx.first_name} {rx.last_name} · Dr. {rx.doctor_first} {rx.doctor_last}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info">{rx.status}</Badge>
                {rx.status !== 'dispensed' && (
                  <Button onClick={() => dispense(rx.id)} className="!px-3 !py-1 text-xs">Dispense</Button>
                )}
              </div>
            </div>
            {rx.items?.map((item) => (
              <p key={item.id} className="mt-2 text-sm text-gray-600">• {item.medicine_name} — {item.dosage}, {item.frequency}</p>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}
