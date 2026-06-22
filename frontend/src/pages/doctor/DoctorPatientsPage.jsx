import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PageHeader, Card, Badge } from '../../components/ui';

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/doctors/patients').then((r) => setPatients(r.data.data)).catch(() => {});
  }, []);

  const viewPatient = async (id) => {
    const { data } = await api.get(`/doctors/patients/${id}`);
    setSelected(data.data);
  };

  return (
    <div>
      <PageHeader title="Patients" subtitle="Access patient records and history" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Patient List">
          {patients.map((p) => (
            <button key={p.id} type="button" onClick={() => viewPatient(p.id)}
              className="mb-2 flex w-full items-center justify-between rounded-lg border border-gray-100 p-3 text-left hover:border-synapse-teal">
              <div>
                <p className="font-medium text-synapse-navy">{p.first_name} {p.last_name}</p>
                <p className="text-sm text-gray-500">{p.email}</p>
              </div>
              <Badge>{p.blood_type || 'N/A'}</Badge>
            </button>
          ))}
        </Card>

        {selected && (
          <Card title={`${selected.first_name} ${selected.last_name}`}>
            <div className="space-y-4 text-sm">
              <div><strong>Allergies:</strong> {selected.allergies?.map((a) => a.allergen).join(', ') || 'None'}</div>
              <div><strong>Conditions:</strong> {selected.history?.map((h) => h.condition_name).join(', ') || 'None'}</div>
              <div><strong>Recent Labs:</strong> {selected.labs?.slice(0, 3).map((l) => `${l.test_name}: ${l.result_value}`).join(' · ') || 'None'}</div>
              <Link to="/doctor/prescriptions" className="inline-block text-synapse-teal font-medium">Create Prescription →</Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
