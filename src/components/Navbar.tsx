import { ShoppingCart, User, LogOut, ChefHat, LayoutDashboard, ClipboardList } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAppContext();
  const location = useLocation();

  return (
    <nav className={`${location.pathname === '/login' ? 'absolute bg-transparent border-transparent text-white' : 'sticky bg-card/90 border-b border-border text-foreground'} top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300`}>
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <ChefHat className={`h-7 w-7 ${location.pathname === '/login' ? 'text-white' : 'text-accent'}`} />
          <span className="font-display text-xl font-bold">Oven Theory</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:opacity-80 transition-opacity">Home</Link>
          <Link to="/contact" className="text-sm font-medium hover:opacity-80 transition-opacity">Contact Us</Link>
        </div>

        <div className="flex items-center gap-3">
          {user && !isAdmin && (
            <>
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/my-orders">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  <ClipboardList className="h-4 w-4" /> My Orders
                </Button>
              </Link>
            </>
          )}

          {user && isAdmin && location.pathname !== '/admin' && (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <LayoutDashboard className="h-3.5 w-3.5" /> Admin
              </Button>
            </Link>
          )}

          {user && isAdmin && location.pathname === '/admin' && (
            <Link to="/">
              <Button variant="outline" size="sm" className="text-xs">Store</Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                <User className="mr-1 h-4 w-4" /> Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
