import { PageHeader, Card } from '../../components/ui';

export default function PharmacistDemandPage() {
  const trends = [
    { medicine: 'Paracetamol', demand: 'High', change: '+12%' },
    { medicine: 'Amoxicillin', demand: 'Medium', change: '+5%' },
    { medicine: 'Artemether/Lumefantrine', demand: 'High', change: '+18%' },
    { medicine: 'Metformin', demand: 'Low', change: '-2%' },
  ];

  return (
    <div>
      <PageHeader title="Demand Trends" subtitle="Medicine demand monitoring" />
      <Card>
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-gray-500"><th className="pb-3">Medicine</th><th>Demand</th><th>Change</th></tr></thead>
          <tbody>
            {trends.map((t) => (
              <tr key={t.medicine} className="border-b border-gray-50">
                <td className="py-3 font-medium text-synapse-navy">{t.medicine}</td>
                <td>{t.demand}</td>
                <td className={t.change.startsWith('+') ? 'text-synapse-green' : 'text-red-500'}>{t.change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
