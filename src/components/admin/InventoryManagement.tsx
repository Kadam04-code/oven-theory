import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

type Product = { id: string; name: string; price: number; category: string; image_url: string | null };

const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string }[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', category: '', image_url: '' });

  const fetchProducts = async () => {
    try {
      const data = await api.get('/products');
      if (data) setProducts(data);
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get('/categories');
      if (data && data.length > 0) {
        setDbCategories(data);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm({
      name: '',
      price: '',
      category: dbCategories.length > 0 ? dbCategories[0].name : 'Breads',
      image_url: ''
    });
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, price: p.price.toString(), category: p.category, image_url: p.image_url || '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) { toast.error('Fill all required fields'); return; }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) { toast.error('Invalid price'); return; }

    try {
      if (editProduct) {
        const response = await api.patch(`/products/${editProduct.id}`, {
          name: form.name.trim(),
          price,
          category: form.category,
          image_url: form.image_url || null,
        });
        if (response.success) {
          setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, name: form.name.trim(), price, category: form.category, image_url: form.image_url || null } : p));
          toast.success('Product updated');
        } else {
          throw new Error(response.message || 'Failed to update product');
        }
      } else {
        const productId = (Math.random() * 1e16).toString(36);
        const productData = {
          id: productId,
          name: form.name.trim(),
          price,
          category: form.category,
          image_url: form.image_url || null,
        };
        const response = await api.post('/products', productData);
        if (response.success) {
          setProducts(prev => [...prev, productData as Product]);
          toast.success('Product added');
        } else {
          throw new Error(response.message || 'Failed to add product');
        }
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.delete(`/products/${id}`);
      if (response.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success('Product deleted');
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Products ({products.length})</h2>
        <Button onClick={openAdd} className="gap-1.5"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 text-right">₹{Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {editProduct ? 'update the' : 'add a new'} product.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} maxLength={100} placeholder="e.g. Chocolate Cake" /></div>
            <div><Label>Price (₹)</Label><Input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {dbCategories.length > 0 ? (
                    dbCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)
                  ) : (
                    <SelectItem value="Breads">Breads (Default)</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Image URL (optional)</Label><Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} maxLength={500} /></div>
            <Button onClick={handleSave} className="w-full">{editProduct ? 'Update' : 'Add'} Product</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
