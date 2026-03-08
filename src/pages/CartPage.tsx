import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import CustomerLayout from '@/components/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, loading } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Browse our menu and add some delicious items!</p>
          <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/menu')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
        </Button>
        <h1 className="text-3xl font-heading font-bold mb-6">Your Cart</h1>

        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-sm animate-fade-in">
              <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.product.name}</h3>
                <p className="text-sm text-primary font-medium">₱{parseFloat(item.product.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || loading}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={loading}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <p className="font-bold text-sm w-20 text-right">₱{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-card rounded-xl p-6 shadow-sm">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">₱{cart.total.toFixed(2)}</span>
          </div>
          <Button className="w-full mt-4 btn-hero" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CartPage;
