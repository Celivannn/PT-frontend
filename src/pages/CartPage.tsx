import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CustomerLayout from '@/components/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, loading, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const API_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchCart();
    }
  }, [isAuthenticated, navigate]);

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/media/')) return `${API_URL}${imagePath}`;
    return `${API_URL}/media/${imagePath}`;
  };

  const formatPrice = (price: string | number): string => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return num.toFixed(2);
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Browse our menu and add some delicious items!</p>
          <Button onClick={() => navigate('/menu')} className="bg-red-600 hover:bg-red-700 text-white">
            Browse Menu
          </Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          className="mb-6 hover:text-red-600" 
          onClick={() => navigate('/menu')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
        </Button>
        
        <h1 className="text-3xl font-heading font-bold mb-6">Your Cart ({cart.item_count} items)</h1>

        <div className="space-y-4">
          {cart.items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-sm animate-fade-in border border-gray-100"
            >
              {/* Product Image */}
              <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {item.product.image ? (
                  <img 
                    src={getImageUrl(item.product.image)} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl">🍔</div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                <p className="text-sm text-red-600 font-medium">
                  ₱{formatPrice(item.product.price)} each
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                  disabled={item.quantity <= 1 || loading}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center font-medium text-gray-900">{item.quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                  disabled={loading}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Subtotal */}
              <p className="font-bold text-gray-900 w-20 text-right">
                ₱{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
              </p>

              {/* Remove Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeItem(item.id)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 bg-card rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span className="text-red-600">₱{formatPrice(cart.total)}</span>
          </div>
          <Button 
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-heading font-bold"
            onClick={() => navigate('/checkout')}
            disabled={loading}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CartPage;