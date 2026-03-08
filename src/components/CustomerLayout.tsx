import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/menu" className="flex items-center gap-2">
            <span className="text-2xl font-heading font-bold text-primary">🍔 Minute Burger</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/menu" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Menu</Link>
            <Link to="/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">My Orders</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="h-5 w-5" />
              {cart && cart.item_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cart.item_count}
                </span>
              )}
            </Button>
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-1" /> {user.first_name}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => navigate('/login/customer')}>Sign In</Button>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t bg-card px-4 py-4 space-y-3 animate-fade-in">
            <Link to="/menu" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Menu</Link>
            <Link to="/cart" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>
              Cart {cart && cart.item_count > 0 && `(${cart.item_count})`}
            </Link>
            <Link to="/orders" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>My Orders</Link>
            {user ? (
              <>
                <Link to="/profile" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Profile</Link>
                <button className="text-sm font-medium text-destructive" onClick={() => { handleLogout(); setMobileOpen(false); }}>Logout</button>
              </>
            ) : (
              <Link to="/login/customer" className="block text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>Sign In</Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-heading text-lg font-semibold text-foreground mb-2">🍔 Minute Burger</p>
          <p>© {new Date().getFullYear()} Minute Burger. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
