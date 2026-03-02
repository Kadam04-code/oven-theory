import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type OrderForPDF = {
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
  transaction_id?: string | null;
  items: { productId: string; name: string; price: number; quantity: number }[];
};

export const generateInvoicePDF = (order: OrderForPDF) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Golden Crust Bakery', 20, 25);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('INVOICE', 20, 33);
  doc.setFontSize(9);
  doc.text(`Order: ${order.id.slice(0, 8)}`, 20, 40);
  doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 20, 46);
  doc.text(`Customer: ${order.customer_email}`, 20, 52);
  doc.text(`Address: ${order.customer_address}`, 20, 58);
  doc.text(`Payment: ${order.payment_method}`, 20, 64);

  let nextY = 70;
  if (order.payment_method === 'Online Payment' && order.transaction_id) {
    doc.text(`Transaction ID: ${order.transaction_id}`, 20, nextY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 128, 0);
    doc.text('Payment Status: Online ✓', 120, nextY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    nextY += 6;
  }

  doc.setDrawColor(200);
  doc.line(20, nextY + 2, 190, nextY + 2);

  autoTable(doc, {
    startY: nextY + 6,
    head: [['Item', 'Qty', 'Unit Price', 'Total']],
    body: order.items.map(item => [
      item.name,
      item.quantity.toString(),
      `₹${item.price.toFixed(2)}`,
      `₹${(item.price * item.quantity).toFixed(2)}`,
    ]),
    theme: 'striped',
    headStyles: { fillColor: [139, 90, 43] },
    margin: { left: 20, right: 20 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  const totals = [
    ['Subtotal', `₹${Number(order.subtotal).toFixed(2)}`],
    ['GST (5%)', `₹${Number(order.gst).toFixed(2)}`],
    ['Delivery Fee', `₹${Number(order.delivery_fee).toFixed(2)}`],
  ];
  totals.forEach(([label, value], i) => {
    doc.text(label, 130, finalY + i * 7);
    doc.text(value, 175, finalY + i * 7, { align: 'right' });
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total', 130, finalY + 28);
  doc.text(`₹${Number(order.total_price).toFixed(2)}`, 175, finalY + 28, { align: 'right' });

  doc.save(`invoice-${order.id.slice(0, 8)}.pdf`);
};

export const generateDailyReportPDF = (orders: OrderForPDF[]) => {
  const doc = new jsPDF();
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
  const totalRevenue = todayOrders.reduce((s, o) => s + o.total_price, 0);
  const totalGST = todayOrders.reduce((s, o) => s + o.gst, 0);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Golden Crust Bakery', 20, 25);
  doc.setFontSize(12);
  doc.text('Daily Sales Report', 20, 33);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 41);
  doc.text(`Total Orders: ${todayOrders.length}`, 20, 48);
  doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`, 20, 55);
  doc.text(`Total GST Collected: ₹${totalGST.toFixed(2)}`, 20, 62);

  if (todayOrders.length > 0) {
    autoTable(doc, {
      startY: 69,
      head: [['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Txn ID', 'Status']],
      body: todayOrders.map(o => [
        o.id.slice(0, 8),
        o.customer_email,
        o.items.map(i => `${i.name} x${i.quantity}`).join(', '),
        `₹${o.total_price.toFixed(2)}`,
        o.payment_method,
        o.transaction_id || '-',
        o.status,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [139, 90, 43] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 7 },
    });
  }

  doc.save(`daily-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
