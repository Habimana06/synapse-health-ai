import { useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Input, Button, Badge } from '../../components/ui';

export default function DoctorAIRecommendPage() {
  const [form, setForm] = useState({ diagnosis: '', age: '', medicalHistory: '', currentMedications: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/ai/drug-recommendation', {
        ...form,
        age: parseInt(form.age, 10),
      });
      setResult(data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="AI Drug Recommendations" subtitle="Treatment support for healthcare professionals" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Patient Context">
          <form onSubmit={getRecommendations} className="space-y-4">
            <Input label="Diagnosis" required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
            <Input label="Patient Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            <Input label="Medical History" value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} />
            <Input label="Current Medications" value={form.currentMedications} onChange={(e) => setForm({ ...form, currentMedications: e.target.value })} />
            <Button type="submit" disabled={loading}>{loading ? 'Analyzing...' : 'Get Recommendations'}</Button>
          </form>
        </Card>

        {result && (
          <Card title="Recommendations">
            {result.recommendations?.map((r, i) => (
              <div key={i} className="mb-3 rounded-lg bg-synapse-light p-3">
                <p className="font-semibold text-synapse-navy">{r.name}</p>
                <p className="text-sm text-gray-600">{r.dosage} · {r.frequency}</p>
              </div>
            ))}
            {result.interactionWarnings?.map((w, i) => (
              <div key={i} className="mb-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">
                <Badge variant="danger">{w.severity}</Badge> {w.message}
              </div>
            ))}
            <p className="mt-4 text-xs text-gray-500">{result.disclaimer}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
