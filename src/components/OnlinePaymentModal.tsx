import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, QrCode, CreditCard } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (transactionId: string) => void;
  total: number;
  loading: boolean;
};

const OnlinePaymentModal = ({ open, onClose, onConfirm, total, loading }: Props) => {
  const [transactionId, setTransactionId] = useState('');

  const handleConfirm = () => {
    if (!transactionId.trim()) return;
    onConfirm(transactionId.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <CreditCard className="h-5 w-5 text-accent" />
            Online Payment
          </DialogTitle>
          <DialogDescription>
            Scan QR code or use UPI details to complete your payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Amount */}
          <div className="rounded-lg bg-secondary p-4 text-center">
            <p className="text-sm text-muted-foreground">Amount to Pay</p>
            <p className="font-display text-3xl font-bold text-accent">₹{total.toFixed(2)}</p>
          </div>

          {/* QR Code Section */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <QrCode className="h-4 w-4 text-muted-foreground" />
              Scan QR Code
            </h4>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-40 w-40 items-center justify-center rounded-lg bg-card border border-border">
                  <p className="text-xs text-muted-foreground px-4">
                    <img src="/images/gpay_qr.jpeg" alt="GPay QR Code" className="mx-auto mt-2 w-48" />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* UPI Details */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              UPI / GPay Details
            </h4>
            <div className="rounded-lg border border-border bg-card p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">UPI ID</span>
                <span className="font-medium select-all">ankitakadam2845@okaxis</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GPay Number</span>
                <span className="font-medium select-all">+91 8237382845</span>
              </div>
            </div>
          </div>

          {/* Transaction ID */}
          <div>
            <Label htmlFor="txn-id">Transaction ID / Reference Number *</Label>
            <Input
              id="txn-id"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter your payment reference"
              maxLength={100}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Enter the transaction ID after completing your payment
            </p>
          </div>

          <Button
            onClick={handleConfirm}
            className="w-full"
            size="lg"
            disabled={!transactionId.trim() || loading}
          >
            {loading ? 'Placing Order...' : 'Confirm Payment & Place Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnlinePaymentModal;
