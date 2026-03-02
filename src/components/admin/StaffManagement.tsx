import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '@/lib/api';

type Staff = { id: string; name: string; role: string; contact: string | null; date_joined: string };

const roles = ['Cook', 'Housekeeping', 'Cleaner', 'Sales'];

const StaffManagement = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'Cook', contact: '', date_joined: '' });

  const fetchStaff = async () => {
    try {
      const data = await api.get('/staff');
      if (data) setStaff(data);
    } catch (err) {
      console.error('Fetch staff error:', err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openAdd = () => {
    setEditStaff(null);
    setForm({ name: '', role: 'Cook', contact: '', date_joined: new Date().toISOString().split('T')[0] });
    setDialogOpen(true);
  };

  const openEdit = (s: Staff) => {
    setEditStaff(s);
    setForm({ name: s.name, role: s.role, contact: s.contact || '', date_joined: s.date_joined });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    try {
      if (editStaff) {
        const response = await api.patch(`/staff/${editStaff.id}`, {
          name: form.name.trim(),
          role: form.role,
          contact: form.contact.trim() || null,
          date_joined: form.date_joined,
        });
        if (response.success) {
          setStaff(prev => prev.map(s => s.id === editStaff.id ? { ...s, ...form, name: form.name.trim(), contact: form.contact.trim() || null } : s));
          toast.success('Staff updated');
        } else {
          throw new Error(response.message || 'Failed to update staff');
        }
      } else {
        const staffData = {
          id: crypto.randomUUID ? crypto.randomUUID() : (Math.random() * 1e16).toString(36),
          name: form.name.trim(),
          role: form.role,
          contact: form.contact.trim() || null,
          date_joined: form.date_joined,
        };
        const response = await api.post('/staff', staffData);
        if (response.success) {
          setStaff(prev => [...prev, staffData as Staff]);
          toast.success('Staff added');
        } else {
          throw new Error(response.message || 'Failed to add staff');
        }
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save staff');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.delete(`/staff/${id}`);
      if (response.success) {
        setStaff(prev => prev.filter(s => s.id !== id));
        toast.success('Staff removed');
      } else {
        throw new Error(response.message || 'Failed to delete staff');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete staff');
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Staff ({staff.length})</h2>
        <Button onClick={openAdd} className="gap-1.5"><Plus className="h-4 w-4" /> Add Staff</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map(s => (
          <div key={s.id} className="rounded-lg border border-border bg-card p-4 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{s.name}</h3>
                <Badge variant="secondary" className="mt-1">{s.role}</Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{s.contact}</p>
            <p className="text-xs text-muted-foreground">Joined: {new Date(s.date_joined).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">{editStaff ? 'Edit Staff' : 'Add Staff'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} maxLength={100} /></div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Contact</Label><Input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} maxLength={100} /></div>
            <div><Label>Date Joined</Label><Input type="date" value={form.date_joined} onChange={e => setForm(f => ({ ...f, date_joined: e.target.value }))} /></div>
            <Button onClick={handleSave} className="w-full">{editStaff ? 'Update' : 'Add'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
