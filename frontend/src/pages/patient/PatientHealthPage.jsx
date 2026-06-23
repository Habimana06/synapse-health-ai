import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Card, Badge, Button, Input, EmptyState, SectionTitle } from '../../components/ui';

export default function PatientHealthPage() {
  const { hasPermission } = useAuth();
  const [allergies, setAllergies] = useState([]);
  const [history, setHistory] = useState([]);
  const [labs, setLabs] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [tab, setTab] = useState('allergies');
  const [newAllergy, setNewAllergy] = useState({ allergen: '', reaction: '', severity: 'moderate' });

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

  const addAllergy = async (e) => {
    e.preventDefault();
    await api.post('/patients/allergies', newAllergy);
    const { data } = await api.get('/patients/allergies');
    setAllergies(data.data);
    setNewAllergy({ allergen: '', reaction: '', severity: 'moderate' });
  };

  const tabs = [
    { id: 'allergies', label: 'Allergies', count: allergies.length, icon: '⚠️' },
    { id: 'history', label: 'Conditions', count: history.length, icon: '🩺' },
    { id: 'labs', label: 'Lab Results', count: labs.length, icon: '🔬' },
    { id: 'vaccines', label: 'Vaccinations', count: vaccinations.length, icon: '💉' },
  ];

  return (
    <div>
      <PageHeader title="Digital Health Profile" subtitle="Complete medical history in one secure place" />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.id ? 'bg-synapse-navy text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.icon} {t.label} <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === 'allergies' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Recorded Allergies" subtitle="Critical for drug interaction checks">
            {allergies.length ? allergies.map((a) => (
              <div key={a.id} className="mb-4 flex items-start justify-between rounded-xl border border-gray-100 p-4">
                <div>
                  <p className="font-bold text-synapse-navy">{a.allergen}</p>
                  <p className="text-sm text-gray-500">{a.reaction}</p>
                  {a.recorded_at && <p className="mt-1 text-xs text-gray-400">Since {a.recorded_at}</p>}
                </div>
                <Badge variant={a.severity === 'severe' ? 'danger' : 'warning'}>{a.severity}</Badge>
              </div>
            )) : <EmptyState icon="✅" title="No allergies recorded" description="Add any known allergens below" />}
          </Card>
          {hasPermission('manage_profile') && (
            <Card title="Add Allergy">
              <form onSubmit={addAllergy} className="space-y-3">
                <Input label="Allergen" required value={newAllergy.allergen} onChange={(e) => setNewAllergy({ ...newAllergy, allergen: e.target.value })} />
                <Input label="Reaction" value={newAllergy.reaction} onChange={(e) => setNewAllergy({ ...newAllergy, reaction: e.target.value })} />
                <select className="w-full rounded-xl border px-4 py-2.5 text-sm" value={newAllergy.severity} onChange={(e) => setNewAllergy({ ...newAllergy, severity: e.target.value })}>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
                <Button type="submit">Add Allergy</Button>
              </form>
            </Card>
          )}
        </div>
      )}

      {tab === 'history' && (
        <Card title="Medical History">
          {history.length ? history.map((h) => (
            <div key={h.id} className="mb-4 rounded-xl bg-synapse-light p-4">
              <div className="flex justify-between">
                <p className="font-bold text-synapse-navy">{h.condition_name}</p>
                <Badge variant={h.status === 'chronic' ? 'warning' : h.status === 'active' ? 'info' : 'success'}>{h.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-gray-600">{h.notes}</p>
              {h.diagnosis_date && <p className="mt-1 text-xs text-gray-400">Diagnosed: {h.diagnosis_date}</p>}
            </div>
          )) : <EmptyState title="No conditions" description="Your medical history will appear here" />}
        </Card>
      )}

      {tab === 'labs' && (
        <Card title="Laboratory Results">
          {labs.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-gray-500"><th className="pb-3">Test</th><th>Result</th><th>Reference</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {labs.map((l) => (
                    <tr key={l.id} className="border-b border-gray-50">
                      <td className="py-3 font-semibold">{l.test_name}</td>
                      <td>{l.result_value} {l.unit}</td>
                      <td className="text-gray-500">{l.reference_range}</td>
                      <td>{l.test_date}</td>
                      <td><Badge variant={l.status === 'normal' ? 'success' : 'danger'}>{l.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState icon="🔬" title="No lab results" description="Lab reports from your doctor appear here" />}
        </Card>
      )}

      {tab === 'vaccines' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {vaccinations.length ? vaccinations.map((v) => (
            <Card key={v.id}>
              <p className="font-bold text-synapse-navy">{v.vaccine_name}</p>
              <p className="text-sm text-gray-500">Dose {v.dose_number} · {v.administered_date}</p>
              {v.next_due_date && <Badge variant="info" className="mt-2">Next: {v.next_due_date}</Badge>}
            </Card>
          )) : <EmptyState icon="💉" title="No vaccinations" description="Vaccination records will be stored here" />}
        </div>
      )}
    </div>
  );
}
