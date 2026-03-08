import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: user ? `${user.first_name} ${user.last_name}` : '',
    customer_phone: '',
    customer_email: user?.email || '',
    special_instructions: '',
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;
    setLoading(true);
    try {
      const { data } = await orderAPI.create({ ...form, payment_method: 'cash' });
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${data.order_number}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/cart')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
        </Button>
        <h1 className="text-3xl font-heading font-bold mb-6">Checkout</h1>

        <div className="grid gap-6">
          {/* Order Summary */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-lg mb-4">Order Summary</h2>
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                <span className="text-sm">{item.quantity}x {item.product.name}</span>
                <span className="text-sm font-medium">₱{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between mt-4 pt-2 border-t font-bold">
              <span>Total</span>
              <span className="text-primary">₱{cart.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Customer Info */}
          <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-semibold text-lg">Your Details</h2>
            <div>
              <Label>Full Name</Label>
              <Input value={form.customer_name} onChange={(e) => update('customer_name', e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input value={form.customer_phone} onChange={(e) => update('customer_phone', e.target.value)} placeholder="09123456789" required className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.customer_email} onChange={(e) => update('customer_email', e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label>Special Instructions (Optional)</Label>
              <Textarea value={form.special_instructions} onChange={(e) => update('special_instructions', e.target.value)} placeholder="e.g., Extra spicy, no onions..." className="mt-1" />
            </div>

            <div className="bg-accent rounded-lg p-4">
              <p className="text-sm font-medium">Payment Method: <span className="text-primary">Cash on Pickup</span></p>
            </div>

            <Button type="submit" className="w-full btn-hero" disabled={loading}>
              {loading ? 'Placing Order...' : `Place Order — ₱${cart.total.toFixed(2)}`}
            </Button>
          </form>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CheckoutPage;
