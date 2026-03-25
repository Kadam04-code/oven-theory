import { Order } from '@/data/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, FileDown } from 'lucide-react';
import { generateInvoicePDF } from '@/lib/pdf';

type Props = {
  order: Order;
  onClose: () => void;
};

const OrderConfirmationModal = ({ order, onClose }: Props) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <CheckCircle className="h-6 w-6 text-badge-delivered" /> Order Confirmed!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-secondary/50 p-4 text-sm">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> Simulated email to <strong className="text-foreground">{order.customer_email}</strong>
            </div>
            <div className="border-t border-border pt-3 space-y-1">
              <p className="font-semibold">Order #{order.id}</p>
              {order.items.map(item => (
                <div key={item.productId} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-border mt-2 pt-2 space-y-1">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>GST (5%)</span><span>₹{order.gst.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>₹{order.delivery_fee.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-foreground"><span>Total</span><span>₹{order.total_price.toFixed(2)}</span></div>
              </div>
              <div className="mt-3 rounded-md bg-accent/10 px-3 py-2 text-xs">
                <strong>Payment:</strong> {order.payment_method}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2" onClick={() => generateInvoicePDF(order)}>
              <FileDown className="h-4 w-4" /> Download Bill
            </Button>
            <Button onClick={onClose} className="flex-1">Continue Shopping</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmationModal;
