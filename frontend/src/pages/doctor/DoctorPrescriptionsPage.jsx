import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Input, Select, Button, Badge } from '../../components/ui';

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ patientId: '', diagnosis: '', notes: '', medicineId: '', dosage: '', frequency: '', duration: '' });

  useEffect(() => {
    Promise.all([
      api.get('/doctors/prescriptions'),
      api.get('/doctors/patients'),
      api.get('/medicines'),
    ]).then(([rx, p, m]) => {
      setPrescriptions(rx.data.data);
      setPatients(p.data.data);
      setMedicines(m.data.data);
    }).catch(() => {});
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/doctors/prescriptions', {
      patientId: parseInt(form.patientId, 10),
      diagnosis: form.diagnosis,
      notes: form.notes,
      items: [{ medicineId: parseInt(form.medicineId, 10), dosage: form.dosage, frequency: form.frequency, duration: form.duration, quantity: 20 }],
    });
    const { data } = await api.get('/doctors/prescriptions');
    setPrescriptions(data.data);
    setForm({ patientId: '', diagnosis: '', notes: '', medicineId: '', dosage: '', frequency: '', duration: '' });
  };

  return (
    <div>
      <PageHeader title="Prescriptions" subtitle="Create and manage patient prescriptions" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="New Prescription">
          <form onSubmit={create} className="space-y-3">
            <Select label="Patient" required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
            </Select>
            <Input label="Diagnosis" required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
            <Select label="Medicine" required value={form.medicineId} onChange={(e) => setForm({ ...form, medicineId: e.target.value })}>
              <option value="">Select medicine</option>
              {medicines.map((m) => <option key={m.id} value={m.id}>{m.name} {m.strength}</option>)}
            </Select>
            <div className="grid grid-cols-3 gap-2">
              <Input label="Dosage" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
              <Input label="Frequency" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} />
              <Input label="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <Button type="submit">Create Prescription</Button>
          </form>
        </Card>

        <Card title="Recent Prescriptions">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="mb-3 border-b border-gray-50 pb-3">
              <div className="flex justify-between">
                <p className="font-medium text-synapse-navy">{rx.diagnosis}</p>
                <Badge variant="info">{rx.status}</Badge>
              </div>
              <p className="text-sm text-gray-500">{rx.first_name} {rx.last_name} · {new Date(rx.prescribed_at).toLocaleDateString()}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
