import { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { IndianRupee, ShoppingCart, FileDown } from 'lucide-react';
import { generateDailyReportPDF } from '@/lib/pdf';
import { api } from '@/lib/api';

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
  items: { name: string; quantity: number; price: number; productId: string }[];
};

const AnalyticsDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get('/orders');
        if (data) setOrders(data);
      } catch (err) {
        console.error('Fetch orders error:', err);
      }
    };
    fetchOrders();
  }, []);

  const { todayRevenue, todayOrders, last7Days } = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrd = orders.filter(o => new Date(o.created_at).toDateString() === today);
    const todayRev = todayOrd.reduce((s, o) => s + (Number(o.total_price) || 0), 0);

    const days: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toDateString();
      const dayOrders = orders.filter(o => new Date(o.created_at).toDateString() === ds);
      days.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        revenue: dayOrders.reduce((s, o) => s + (Number(o.total_price) || 0), 0),
        orders: dayOrders.length,
      });
    }
    return { todayRevenue: todayRev, todayOrders: todayOrd.length, last7Days: days };
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <IndianRupee className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Revenue</p>
              <p className="text-2xl font-bold">₹{Number(todayRevenue).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <ShoppingCart className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Orders</p>
              <p className="text-2xl font-bold">{todayOrders}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center sm:col-span-2 lg:col-span-1">
          <Button variant="outline" className="gap-1.5" onClick={() => generateDailyReportPDF(orders as any)}>
            <FileDown className="h-4 w-4" /> Export Daily Report
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">Last 7 Days Sales</h3>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No sales data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }} />
              <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
