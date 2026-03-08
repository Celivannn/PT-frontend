import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation items
  const navItems = [
    { path: '/menu', label: 'Menu', icon: Home },
    { path: '/orders', label: 'My Orders', icon: History },
  ];

  const isActive = (path: string) => location.pathname === path;

  const cartItemCount = cart?.item_count || 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header 
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-md" 
            : "bg-white border-b"
        )}
      >
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          {/* Logo - Using official logo.png from public folder */}
          <Link 
            to="/menu" 
            className="flex items-center gap-2 group"
            onClick={() => setMobileOpen(false)}
          >
            <img 
              src="/logo.png" 
              alt="Minute Burger" 
              className="h-10 w-auto md:h-12 transition-transform group-hover:scale-105"
            />
            <span className="text-xl md:text-2xl font-heading font-bold">
              <span className="text-red-600">Minute</span>
              <span className="text-gray-900">Burger</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors relative group",
                    isActive(item.path)
                      ? "text-red-600"
                      : "text-gray-600 hover:text-red-600"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative transition-all",
                isActive('/cart') ? "text-red-600 bg-red-50" : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              )}
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2",
                    isActive('/profile') && "text-red-600 bg-red-50"
                  )}
                  onClick={() => navigate('/profile')}
                >
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-600">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </span>
                  </div>
                  <span className="max-w-[100px] truncate">
                    {user.first_name || user.username}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login/customer')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white animate-in slide-in-from-top">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {/* Mobile Menu Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-colors",
                      isActive(item.path)
                        ? "bg-red-50 text-red-600"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              {/* Cart Link (Mobile) */}
              <Link
                to="/cart"
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  isActive('/cart')
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">Cart</span>
                {cartItemCount > 0 && (
                  <Badge className="ml-auto bg-red-600 text-white">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>

              {/* Divider */}
              <div className="border-t my-2" />

              {/* User Actions (Mobile) */}
              {user ? (
                <>
                  <div className="px-2 py-1">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  {/* Profile link in mobile menu */}
                  <Link
                    to="/profile"
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-colors",
                      isActive('/profile')
                        ? "bg-red-50 text-red-600"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="flex w-full items-center gap-3 p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigate('/login/customer');
                      setMobileOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      navigate('/register');
                      setMobileOpen(false);
                    }}
                  >
                    Create Account
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img 
                  src="/logo.png" 
                  alt="Minute Burger" 
                  className="h-8 w-auto"
                />
                <span className="text-xl font-heading font-bold text-white">
                  Minute<span className="text-red-500">Burger</span>
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Serving delicious burgers since 2010. Quality ingredients, fast service.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading font-semibold text-white mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/menu" className="text-gray-400 hover:text-red-500 transition-colors">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="text-gray-400 hover:text-red-500 transition-colors">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-gray-400 hover:text-red-500 transition-colors">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-heading font-semibold text-white mb-3">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-red-500 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-heading font-semibold text-white mb-3">Contact Us</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📍 123 Burger St, Manila</li>
                <li>📞 (02) 8123-4567</li>
                <li>📧 support@minuteburger.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Minute Burger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;