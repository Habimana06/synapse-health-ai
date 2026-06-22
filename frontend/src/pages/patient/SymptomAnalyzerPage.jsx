import { useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Input, Button, Badge } from '../../components/ui';

export default function SymptomAnalyzerPage() {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [conditions, setConditions] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/ai/symptoms', {
        symptoms: symptoms.split(',').map((s) => s.trim()).filter(Boolean),
        age: parseInt(age, 10),
        gender,
        existingConditions: conditions,
      });
      setResult(data.data);
    } catch {
      setResult({ error: 'Analysis failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="AI Symptom Analyzer" subtitle="Decision support — not a medical diagnosis" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Enter Symptoms">
          <form onSubmit={analyze} className="space-y-4">
            <Input label="Symptoms (comma separated)" placeholder="Fever, Headache, Cough" required value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
            <Input label="Age" type="number" required value={age} onChange={(e) => setAge(e.target.value)} />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Gender</span>
              <select className="w-full rounded-lg border border-gray-200 px-3 py-2" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <Input label="Existing Conditions" value={conditions} onChange={(e) => setConditions(e.target.value)} />
            <Button type="submit" disabled={loading}>{loading ? 'Analyzing...' : 'Analyze Symptoms'}</Button>
          </form>
        </Card>

        {result && (
          <Card title="Possible Conditions">
            {result.error ? <p className="text-red-600">{result.error}</p> : (
              <>
                <div className="space-y-2">
                  {result.possibleConditions?.map((c) => (
                    <div key={c} className="flex items-center gap-2 rounded-lg bg-synapse-teal/5 p-3">
                      <span className="text-synapse-teal">●</span>
                      <span className="font-medium text-synapse-navy">{c}</span>
                    </div>
                  ))}
                </div>
                <Badge variant="warning" className="mt-4">{result.confidence} confidence</Badge>
                <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{result.disclaimer}</p>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
