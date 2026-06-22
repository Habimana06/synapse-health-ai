import { useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Select, Input, Button, Badge } from '../../components/ui';

const RISKS = [
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'hypertension', label: 'Hypertension' },
  { value: 'heart_disease', label: 'Heart Disease' },
  { value: 'kidney_disease', label: 'Kidney Disease' },
];

export default function RiskAssessmentPage() {
  const [form, setForm] = useState({ riskType: 'diabetes', age: '', bmi: '', conditions: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const assess = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/ai/health-risk', {
        ...form,
        age: parseInt(form.age, 10),
        bmi: parseFloat(form.bmi),
        conditions: form.conditions.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setResult(data.data);
    } finally {
      setLoading(false);
    }
  };

  const levelColor = { low: 'success', moderate: 'warning', high: 'danger', critical: 'danger' };

  return (
    <div>
      <PageHeader title="Health Risk Assessment" subtitle="AI-powered risk prediction and prevention tips" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Your Information">
          <form onSubmit={assess} className="space-y-4">
            <Select label="Risk Type" value={form.riskType} onChange={(e) => setForm({ ...form, riskType: e.target.value })}>
              {RISKS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </Select>
            <Input label="Age" type="number" required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            <Input label="BMI" type="number" step="0.1" value={form.bmi} onChange={(e) => setForm({ ...form, bmi: e.target.value })} />
            <Input label="Conditions (comma separated)" value={form.conditions} onChange={(e) => setForm({ ...form, conditions: e.target.value })} />
            <Button type="submit" disabled={loading}>{loading ? 'Assessing...' : 'Assess Risk'}</Button>
          </form>
        </Card>

        {result && (
          <Card title="Risk Results">
            <div className="text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-synapse-navy/5">
                <span className="text-4xl font-bold text-synapse-navy">{result.riskScore}%</span>
              </div>
              <Badge variant={levelColor[result.riskLevel]} className="mt-4">{result.riskLevel} risk</Badge>
              <p className="mt-4 text-sm text-gray-600">{result.recommendations}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
