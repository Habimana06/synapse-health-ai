import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, StatCard } from '../../components/ui';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then((r) => setData(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Healthcare Analytics" subtitle="Disease trends, medicine demand, and regional statistics" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {data?.roleCounts?.map((r) => (
          <StatCard key={r.role} label={`${r.role}s`} value={r.count} color="teal" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Event Types">
          {data?.events?.map((e) => (
            <div key={e.event_type} className="mb-2 flex justify-between border-b border-gray-50 pb-2">
              <span className="capitalize text-synapse-navy">{e.event_type.replace('_', ' ')}</span>
              <span className="font-semibold text-synapse-teal">{e.count}</span>
            </div>
          ))}
        </Card>

        <Card title="By Region">
          {data?.byRegion?.map((r) => (
            <div key={r.region} className="mb-2 flex justify-between border-b border-gray-50 pb-2">
              <span className="text-synapse-navy">{r.region}</span>
              <span className="font-semibold text-synapse-green">{r.count}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
