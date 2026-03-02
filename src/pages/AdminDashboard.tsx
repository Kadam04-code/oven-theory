import { useAppContext } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderManagement from '@/components/admin/OrderManagement';
import InventoryManagement from '@/components/admin/InventoryManagement';
import StaffManagement from '@/components/admin/StaffManagement';
import UserManagement from '@/components/admin/UserManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import MessageManagement from '@/components/admin/MessageManagement';
import { ClipboardList, Package, Users, BarChart3, ShieldAlert, UserCog, Tags, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminDashboard = () => {
  const { isAdmin, isLoading, user } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [isAdmin, isLoading, user, navigate]);

  if (isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <ShieldAlert className="h-16 w-16 text-destructive/50" />
        <h2 className="font-display text-2xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground">You don't have admin privileges.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold">Admin Dashboard</h1>
      <Tabs defaultValue="orders">
        <TabsList className="mb-6 h-auto w-full justify-start overflow-x-auto flex-nowrap bg-muted/50 p-1 border border-border/50 rounded-xl">
          <TabsTrigger value="orders" className="gap-1.5 py-2 px-4 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><ClipboardList className="h-4 w-4" />Orders</TabsTrigger>
          <TabsTrigger value="inventory" className="gap-1.5 py-2 px-4 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><Package className="h-4 w-4" />Inventory</TabsTrigger>
          <TabsTrigger value="categories" className="gap-1.5 py-2 px-4 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><Tags className="h-4 w-4" />Categories</TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5 py-2 px-4 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><Users className="h-4 w-4" />Users</TabsTrigger>
          <TabsTrigger value="staff" className="gap-1.5 py-2 px-4 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><UserCog className="h-4 w-4" />Staff</TabsTrigger>
          <TabsTrigger value="messages" className="gap-1.5 py-2 px-4 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><Mail className="h-4 w-4" />Messages</TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5 py-2 px-4 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><BarChart3 className="h-4 w-4" />Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="animate-in fade-in slide-in-from-bottom-2 duration-300"><OrderManagement /></TabsContent>
        <TabsContent value="inventory" className="animate-in fade-in slide-in-from-bottom-2 duration-300"><InventoryManagement /></TabsContent>
        <TabsContent value="categories" className="animate-in fade-in slide-in-from-bottom-2 duration-300"><CategoryManagement /></TabsContent>
        <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2 duration-300"><UserManagement /></TabsContent>
        <TabsContent value="staff" className="animate-in fade-in slide-in-from-bottom-2 duration-300"><StaffManagement /></TabsContent>
        <TabsContent value="messages" className="animate-in fade-in slide-in-from-bottom-2 duration-300"><MessageManagement /></TabsContent>
        <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-2 duration-300"><AnalyticsDashboard /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

