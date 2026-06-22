import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Input, Button, Badge } from '../../components/ui';

export default function PharmacistInventoryPage() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');

  const load = () => api.get('/pharmacists/inventory').then((r) => setItems(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async (id) => {
    await api.put(`/pharmacists/inventory/${id}`, { quantity: parseInt(qty, 10), unitPrice: parseFloat(price) });
    setEditId(null);
    load();
  };

  return (
    <div>
      <PageHeader title="Medicine Inventory" subtitle="Manage stock levels and pricing" />
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3">Medicine</th><th>Category</th><th>Quantity</th><th>Price (RWF)</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="py-3 font-medium text-synapse-navy">{item.name} {item.strength}</td>
                <td>{item.category}</td>
                <td>
                  {editId === item.id ? (
                    <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="!w-20" />
                  ) : item.quantity}
                </td>
                <td>
                  {editId === item.id ? (
                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="!w-24" />
                  ) : item.unit_price}
                </td>
                <td><Badge variant={item.quantity < 50 ? 'danger' : 'success'}>{item.quantity < 50 ? 'Low' : 'OK'}</Badge></td>
                <td>
                  {editId === item.id ? (
                    <Button onClick={() => save(item.id)} className="!px-2 !py-1 text-xs">Save</Button>
                  ) : (
                    <button type="button" onClick={() => { setEditId(item.id); setQty(item.quantity); setPrice(item.unit_price); }}
                      className="text-sm text-synapse-teal hover:underline">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
