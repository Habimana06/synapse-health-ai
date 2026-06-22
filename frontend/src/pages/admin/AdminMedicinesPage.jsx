import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Badge } from '../../components/ui';

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    api.get('/admin/medicines').then((r) => setMedicines(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Medicines" subtitle="Medicine catalog management" />
      <Card>
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-gray-500"><th className="pb-3">Name</th><th>Category</th><th>Strength</th><th>Rx Required</th></tr></thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id} className="border-b border-gray-50">
                <td className="py-3 font-medium text-synapse-navy">{m.name}</td>
                <td>{m.category}</td>
                <td>{m.strength}</td>
                <td><Badge variant={m.requires_prescription ? 'warning' : 'success'}>{m.requires_prescription ? 'Yes' : 'OTC'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
