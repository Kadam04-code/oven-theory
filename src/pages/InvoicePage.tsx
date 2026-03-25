import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Printer, Download, ChevronLeft, ChefHat } from 'lucide-react';
import { api } from '@/lib/api';
import { generateInvoicePDF } from '@/lib/pdf';
import { toast } from 'sonner';

const InvoicePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) {
                console.error('Fetch order error:', err);
                toast.error('Failed to load invoice');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        if (!order) return;
        generateInvoicePDF({
            ...order,
            items: order.items.map((i: any) => ({
                productId: i.product_id || i.id,
                name: i.name,
                price: Number(i.price),
                quantity: i.quantity
            }))
        });
    };

    if (loading) return <div className="flex min-h-screen items-center justify-center">Loading Invoice...</div>;
    if (!order) return <div className="flex min-h-screen items-center justify-center text-destructive">Order Not Found</div>;

    return (
        <div className="min-h-screen bg-muted/30 py-10 px-4 print:bg-white print:p-0">
            <div className="mx-auto max-w-3xl space-y-6">
                {/* Actions Bar */}
                <div className="flex items-center justify-between print:hidden">
                    <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
                        <ChevronLeft className="h-4 w-4" /> Back
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2" onClick={handlePrint}>
                            <Printer className="h-4 w-4" /> Print
                        </Button>
                        <Button className="gap-2" onClick={handleDownload}>
                            <Download className="h-4 w-4" /> Download PDF
                        </Button>
                    </div>
                </div>

                {/* Invoice UI */}
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all print:border-none print:shadow-none sm:p-12">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-start">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <ChefHat className="h-7 w-7" />
                            </div>
                            <div>
                                <h1 className="font-display text-2xl font-bold">Oven Theory</h1>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">Premium Bakery</p>
                            </div>
                        </div>
                        <div className="text-center sm:text-right">
                            <h2 className="font-display text-3xl font-bold text-muted-foreground/30 uppercase tracking-tighter">INVOICE</h2>
                            <p className="font-mono text-sm font-semibold">#{order.id.slice(0, 8)}</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid gap-8 py-10 sm:grid-cols-2">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Customer Details</h3>
                            <p className="font-bold text-lg">{order.customer_email}</p>
                            <p className="mt-1 text-muted-foreground leading-relaxed italic">{order.customer_address}</p>
                        </div>
                        <div className="flex flex-col sm:items-end">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between sm:justify-end gap-6 text-sm">
                                    <span className="text-muted-foreground">Date:</span>
                                    <span className="font-semibold">{new Date(order.created_at).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6 text-sm">
                                    <span className="text-muted-foreground">Payment:</span>
                                    <span className="font-semibold">{order.payment_method}</span>
                                </div>
                                {order.transaction_id && (
                                    <div className="flex items-center justify-between sm:justify-end gap-6 text-sm">
                                        <span className="text-muted-foreground">Txn ID:</span>
                                        <span className="font-mono text-xs font-bold">{order.transaction_id}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">Item Description</th>
                                    <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-xs">Qty</th>
                                    <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-xs">Unit Price</th>
                                    <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-xs">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {order.items.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-semibold">{item.name}</td>
                                        <td className="px-6 py-4 text-center text-muted-foreground">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right text-muted-foreground">Rs. {Number(item.price).toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right font-bold text-foreground">Rs. {(Number(item.price) * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="mt-10 flex justify-end">
                        <div className="w-full max-w-xs space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">Rs. {Number(order.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">GST (5%)</span>
                                <span className="font-semibold">Rs. {Number(order.gst).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery Fee</span>
                                <span className="font-semibold">Rs. {Number(order.delivery_fee).toFixed(2)}</span>
                            </div>
                            <div className="pt-4 border-t-2 border-border flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-bold text-accent">Rs. {Number(order.total_price).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-20 border-t border-border pt-10 text-center">
                        <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                            Thank you for choosing Oven Theory.<br />
                            Please visit again for fresh delights!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;
