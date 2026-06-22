import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Badge } from '../../components/ui';

export default function PatientHealthPage() {
  const [allergies, setAllergies] = useState([]);
  const [history, setHistory] = useState([]);
  const [labs, setLabs] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/patients/allergies'),
      api.get('/patients/history'),
      api.get('/patients/labs'),
      api.get('/patients/vaccinations'),
    ]).then(([a, h, l, v]) => {
      setAllergies(a.data.data);
      setHistory(h.data.data);
      setLabs(l.data.data);
      setVaccinations(v.data.data);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Digital Health Profile" subtitle="Medical history, allergies, labs, and vaccinations" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Allergies">
          {allergies.length ? allergies.map((a) => (
            <div key={a.id} className="mb-3 flex items-center justify-between border-b border-gray-50 pb-3">
              <div>
                <p className="font-medium text-synapse-navy">{a.allergen}</p>
                <p className="text-sm text-gray-500">{a.reaction}</p>
              </div>
              <Badge variant={a.severity === 'severe' ? 'danger' : 'warning'}>{a.severity}</Badge>
            </div>
          )) : <p className="text-sm text-gray-400">No allergies recorded</p>}
        </Card>

        <Card title="Medical History">
          {history.length ? history.map((h) => (
            <div key={h.id} className="mb-3 border-b border-gray-50 pb-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-synapse-navy">{h.condition_name}</p>
                <Badge variant={h.status === 'chronic' ? 'warning' : h.status === 'active' ? 'info' : 'success'}>{h.status}</Badge>
              </div>
              <p className="text-sm text-gray-500">{h.notes}</p>
            </div>
          )) : <p className="text-sm text-gray-400">No history recorded</p>}
        </Card>

        <Card title="Laboratory Results">
          {labs.length ? (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500"><th className="pb-2">Test</th><th>Result</th><th>Status</th></tr></thead>
              <tbody>
                {labs.map((l) => (
                  <tr key={l.id} className="border-t border-gray-50">
                    <td className="py-2 font-medium">{l.test_name}</td>
                    <td>{l.result_value} {l.unit}</td>
                    <td><Badge variant={l.status === 'normal' ? 'success' : 'danger'}>{l.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-sm text-gray-400">No lab results</p>}
        </Card>

        <Card title="Vaccinations">
          {vaccinations.length ? vaccinations.map((v) => (
            <div key={v.id} className="mb-3 border-b border-gray-50 pb-3">
              <p className="font-medium text-synapse-navy">{v.vaccine_name} — Dose {v.dose_number}</p>
              <p className="text-sm text-gray-500">Administered: {v.administered_date}</p>
            </div>
          )) : <p className="text-sm text-gray-400">No vaccinations recorded</p>}
        </Card>
      </div>
    </div>
  );
}
