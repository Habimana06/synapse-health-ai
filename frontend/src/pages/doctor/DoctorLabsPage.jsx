import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Input, Button, Select, Badge } from '../../components/ui';

export default function DoctorLabsPage() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patientId: '', testName: '', resultValue: '', unit: '', referenceRange: '', status: 'normal', testDate: '' });

  useEffect(() => {
    api.get('/doctors/patients').then((r) => setPatients(r.data.data)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/doctors/labs', form);
    setForm({ patientId: '', testName: '', resultValue: '', unit: '', referenceRange: '', status: 'normal', testDate: '' });
    alert('Lab result recorded');
  };

  return (
    <div>
      <PageHeader title="Lab Reports" subtitle="Order and record laboratory results" />
      <Card title="Add Lab Result">
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Select label="Patient" required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
            <option value="">Select</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
          </Select>
          <Input label="Test Name" required value={form.testName} onChange={(e) => setForm({ ...form, testName: e.target.value })} />
          <Input label="Result" required value={form.resultValue} onChange={(e) => setForm({ ...form, resultValue: e.target.value })} />
          <Input label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          <Input label="Reference Range" value={form.referenceRange} onChange={(e) => setForm({ ...form, referenceRange: e.target.value })} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="normal">Normal</option>
            <option value="abnormal">Abnormal</option>
            <option value="critical">Critical</option>
          </Select>
          <Input label="Test Date" type="date" required value={form.testDate} onChange={(e) => setForm({ ...form, testDate: e.target.value })} />
          <div className="sm:col-span-2"><Button type="submit">Save Lab Result</Button></div>
        </form>
      </Card>
    </div>
  );
}
