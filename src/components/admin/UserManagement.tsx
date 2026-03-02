import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '@/lib/api';

type User = {
    id: string;
    email: string;
    display_name: string | null;
    role: string;
    created_at: string
};

const roles = ['customer', 'admin'];

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({ display_name: '', role: 'customer' });

    const fetchUsers = async () => {
        try {
            const data = await api.get('/users');
            if (data) setUsers(data);
        } catch (err) {
            console.error('Fetch users error:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openEdit = (u: User) => {
        setEditUser(u);
        setForm({ display_name: u.display_name || '', role: u.role });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editUser) return;
        try {
            const response = await api.patch(`/users/${editUser.id}`, {
                display_name: form.display_name.trim() || null,
                role: form.role,
            });
            if (response.success) {
                setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, display_name: form.display_name.trim() || null, role: form.role } : u));
                toast.success('User updated');
                setDialogOpen(false);
            } else {
                throw new Error(response.message || 'Failed to update user');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to save user');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const response = await api.delete(`/users/${id}`);
            if (response.success) {
                setUsers(prev => prev.filter(u => u.id !== id));
                toast.success('User removed');
            } else {
                throw new Error(response.message || 'Failed to delete user');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete user');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserCog className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="font-display text-2xl font-bold">User Management</h2>
                        <p className="text-sm text-muted-foreground">Manage your bakery customers and admins</p>
                    </div>
                </div>
                <Badge variant="secondary" className="px-4 py-1 text-sm font-semibold">
                    Total Users: {users.length}
                </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {users.map(u => (
                    <div key={u.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-lg animate-fade-in">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg leading-tight">{u.display_name || 'Anonymous User'}</h3>
                                <p className="text-sm text-muted-foreground break-all">{u.email}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                        {u.role}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => openEdit(u)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={() => handleDelete(u.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                            <span>Member Since</span>
                            <span>{new Date(u.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="font-display text-xl">Edit User Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest font-bold ml-1">Display Name</Label>
                            <Input
                                value={form.display_name}
                                onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                                placeholder="Full Name"
                                className="rounded-xl border-border bg-muted/30 focus:bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest font-bold ml-1">User Role</Label>
                            <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                                <SelectTrigger className="rounded-xl border-border bg-muted/30">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {roles.map(r => (
                                        <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="pt-4">
                            <Button onClick={handleSave} className="w-full h-12 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                                Update Security Profile
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagement;
