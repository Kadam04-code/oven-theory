import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/lib/api';

type OrderItem = { id: string; name: string; price: number; quantity: number; product_id: string | null };
type Order = {
  id: string;
  customer_email: string;
  customer_address: string;
  subtotal: number;
  gst: number;
  delivery_fee: number;
  total_price: number;
  payment_method: string;
  status: string;
  created_at: string;
  transaction_id: string | null;
  items: OrderItem[];
};

const statusColors: Record<string, string> = {
  'Pending': 'bg-badge-pending/20 text-badge-pending border-badge-pending/30',
  'Cooking': 'bg-badge-cooking/20 text-badge-cooking border-badge-cooking/30',
  'Ready': 'bg-badge-shipped/20 text-badge-shipped border-badge-shipped/30',
  'Out for Delivery': 'bg-badge-delivery/20 text-badge-delivery border-badge-delivery/30',
  'Delivered': 'bg-badge-delivered/20 text-badge-delivered border-badge-delivered/30',
};

const statusFlow = ['Pending', 'Cooking', 'Ready', 'Out for Delivery', 'Delivered'];

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const ordersData = await api.get('/orders');
      setOrders(ordersData);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const advanceStatus = async (orderId: string, currentStatus: string) => {
    const currentIdx = statusFlow.indexOf(currentStatus);
    if (currentIdx < 0 || currentIdx >= statusFlow.length - 1) return;
    const nextStatus = statusFlow[currentIdx + 1];

    try {
      const response = await api.patch(`/orders/${orderId}`, { status: nextStatus });
      if (response.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
        toast.success(`Status → ${nextStatus}`);
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  if (loading) return <p className="py-12 text-center text-muted-foreground">Loading orders...</p>;
  if (orders.length === 0) return <p className="py-12 text-center text-muted-foreground">No orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map(order => {
        const currentIdx = statusFlow.indexOf(order.status);
        const canAdvance = currentIdx >= 0 && currentIdx < statusFlow.length - 1;

        return (
          <div key={order.id} className="rounded-xl border border-border bg-card p-5 animate-fade-in">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-semibold">#{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={statusColors[order.status] || ''}>
                  {order.status}
                </Badge>
                {canAdvance && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs"
                    onClick={() => advanceStatus(order.id, order.status)}
                  >
                    {statusFlow[currentIdx + 1]} <ChevronRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Status Progress */}
            <div className="mt-3 flex items-center gap-1 overflow-x-auto text-[10px]">
              {statusFlow.map((s, i) => {
                const done = i <= currentIdx;
                return (
                  <div key={s} className="flex items-center gap-1">
                    <span className={`rounded-full px-2 py-0.5 font-medium ${done ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {s}
                    </span>
                    {i < statusFlow.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 space-y-1 text-sm">
              {(order.items || []).map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-1 font-semibold">
                <span>Total ({order.payment_method})</span>
                <span>₹{Number(order.total_price).toFixed(2)}</span>
              </div>
              {order.transaction_id && (
                <p className="text-xs text-muted-foreground">Txn ID: <span className="font-medium text-foreground">{order.transaction_id}</span></p>
              )}
            </div>

            <Link to={`/admin/invoice/${order.id}`}>
              <Button variant="outline" size="sm" className="mt-3 gap-1.5 hover:bg-accent hover:text-accent-foreground transition-all">
                <FileDown className="h-4 w-4" /> View / Generate Bill
              </Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default OrderManagement;
