import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import OnlinePaymentModal from '@/components/OnlinePaymentModal';
import { api } from '@/lib/api';

const DELIVERY_FEE = 5.00;
const GST_RATE = 0.05;

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Online Payment'>('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst = subtotal * GST_RATE;
  const total = subtotal + gst + (items.length > 0 ? DELIVERY_FEE : 0);

  const placeOrder = async (transactionId?: string) => {
    setLoading(true);
    try {
      const orderData = {
        id: crypto.randomUUID ? crypto.randomUUID() : (Math.random() * 1e16).toString(36),
        user_id: user!.id,
        customer_email: email.trim(),
        customer_address: address.trim(),
        subtotal,
        gst,
        delivery_fee: DELIVERY_FEE,
        total_price: total,
        payment_method: paymentMethod,
        status: 'Pending',
        transaction_id: transactionId || null,
        items: items
      };

      const response = await api.post('/orders', orderData);

      if (response.success) {
        clearCart();
        setShowPaymentModal(false);
        toast.success('Order placed successfully!');
        navigate('/my-orders');
      } else {
        throw new Error(response.message || 'Failed to place order');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in first'); navigate('/login'); return; }
    if (items.length === 0) { toast.error('Cart is empty'); return; }
    if (!address.trim()) { toast.error('Please enter delivery address'); return; }
    if (!email.trim() || !email.includes('@')) { toast.error('Please enter a valid email'); return; }

    if (paymentMethod === 'Online Payment') {
      setShowPaymentModal(true);
    } else {
      placeOrder();
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 animate-fade-in">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <h2 className="font-display text-2xl font-semibold">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-3">
          {items.map(item => (
            <div key={item.productId} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 animate-fade-in">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground">₹{Number(item.price).toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="w-20 text-right font-semibold">₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.productId)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleCheckout} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div>
              <Label htmlFor="checkout-email">Email</Label>
              <Input id="checkout-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={255} />
            </div>
            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Baker Street" required maxLength={500} />
            </div>
            <div>
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)} className="mt-2 space-y-2">
                <div className="flex items-center gap-2 rounded-md border border-border p-3">
                  <RadioGroupItem value="Cash on Delivery" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer font-normal">Cash on Delivery</Label>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-border p-3">
                  <RadioGroupItem value="Online Payment" id="online" />
                  <Label htmlFor="online" className="cursor-pointer font-normal">Online Payment (UPI / GPay)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{Number(subtotal).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><span>₹{Number(gst).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>₹{DELIVERY_FEE.toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                <span>Total</span><span className="text-accent">₹{Number(total).toFixed(2)}</span>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {paymentMethod === 'Online Payment' ? 'Proceed to Pay' : loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </form>
        </div>
      </div>

      <OnlinePaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={(txnId) => placeOrder(txnId)}
        total={total}
        loading={loading}
      />
    </div>
  );
};

export default CartPage;
