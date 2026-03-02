import { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Package } from 'lucide-react';
import { api } from '@/lib/api';

type OrderItem = { id: string; name: string; price: number; quantity: number };
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
};

const statusColors: Record<string, string> = {
  'Pending': 'bg-badge-pending/20 text-badge-pending border-badge-pending/30',
  'Cooking': 'bg-badge-cooking/20 text-badge-cooking border-badge-cooking/30',
  'Ready': 'bg-badge-shipped/20 text-badge-shipped border-badge-shipped/30',
  'Out for Delivery': 'bg-badge-delivery/20 text-badge-delivery border-badge-delivery/30',
  'Delivered': 'bg-badge-delivered/20 text-badge-delivered border-badge-delivered/30',
};

const statusFlow = ['Pending', 'Cooking', 'Ready', 'Out for Delivery', 'Delivered'];

const MyOrdersPage = () => {
  const { user, isLoading: authLoading } = useAppContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<(Order & { items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }

    const fetchOrders = async () => {
      try {
        const ordersData = await api.get(`/orders?user_id=${user.id}`);
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Realtime removed for simple MySQL setup
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 animate-fade-in">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <h2 className="font-display text-2xl font-semibold">No orders yet</h2>
        <p className="text-muted-foreground">Start shopping to see your orders here!</p>
        <Button onClick={() => navigate('/')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="rounded-lg border border-border bg-card p-5 animate-fade-in">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-display font-semibold">Order #{order.id.slice(0, 8)}</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <Badge variant="outline" className={statusColors[order.status] || ''}>
                {order.status}
              </Badge>
            </div>

            {/* Status Progress */}
            <div className="mt-3 flex items-center gap-1 overflow-x-auto text-[10px]">
              {statusFlow.map((s, i) => {
                const currentIdx = statusFlow.indexOf(order.status);
                const done = i <= currentIdx;
                return (
                  <div key={s} className="flex items-center gap-1">
                    <span className={`rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${done ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {s}
                    </span>
                    {i < statusFlow.length - 1 && <span className="text-muted-foreground">→</span>}
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
                <span className="text-accent">₹{Number(order.total_price).toFixed(2)}</span>
              </div>
              {(order as any).transaction_id && (
                <p className="text-xs text-muted-foreground">Txn ID: <span className="font-medium text-foreground">{(order as any).transaction_id}</span></p>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">📍 {order.customer_address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
