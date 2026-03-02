import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Tags } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

type Category = {
    id: string;
    name: string;
    created_at: string;
};

const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const data = await api.get('/categories');
            if (data) setCategories(data);
        } catch (err) {
            console.error('Fetch categories error:', err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) {
            toast.error('Category name is required');
            return;
        }

        setLoading(true);
        try {
            const id = crypto.randomUUID ? crypto.randomUUID() : (Math.random() * 1e16).toString(36);
            const response = await api.post('/categories', { id, name: newName.trim() });
            if (response.success) {
                toast.success('Category added');
                setNewName('');
                setDialogOpen(false);
                fetchCategories();
            } else {
                throw new Error(response.message || 'Failed to add category');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to add category');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category? Current products in this category will not be deleted but may become uncategorized.')) return;

        try {
            const response = await api.delete(`/categories/${id}`);
            if (response.success) {
                toast.success('Category deleted');
                setCategories(prev => prev.filter(c => c.id !== id));
            } else {
                throw new Error(response.message || 'Failed to delete category');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete category');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Tags className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="font-display text-2xl font-bold">Categories</h2>
                        <p className="text-sm text-muted-foreground">Manage product categories for your bakery</p>
                    </div>
                </div>
                <Button onClick={() => setDialogOpen(true)} className="gap-1.5 rounded-xl">
                    <Plus className="h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map(category => (
                    <div key={category.id} className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md animate-fade-in">
                        <div className="flex flex-col">
                            <span className="font-semibold text-lg">{category.name}</span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                                Added {new Date(category.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={() => handleDelete(category.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {categories.length === 0 && (
                    <div className="col-span-full py-12 text-center rounded-3xl border-2 border-dashed border-border/50">
                        <p className="text-muted-foreground">No categories found. Add your first category to get started.</p>
                    </div>
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-sm rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="font-display text-xl">New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold ml-1">Category Name</Label>
                            <Input
                                id="name"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="e.g. Cakes, Pastries"
                                className="rounded-xl border-border bg-muted/30 focus:bg-background h-12"
                            />
                        </div>
                        <div className="pt-2">
                            <Button
                                onClick={handleAdd}
                                className="w-full h-12 rounded-xl font-bold uppercase tracking-widest"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Save Category'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CategoryManagement;
