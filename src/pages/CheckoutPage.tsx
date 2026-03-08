import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Added Link here
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  ShoppingBag, 
  CreditCard, 
  Phone, 
  Mail, 
  User,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const CheckoutPage = () => {
  const { cart, clearCart, loading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    customer_name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    customer_phone: '',
    customer_email: user?.email || '',
    special_instructions: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      toast.error('Please login to checkout');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Clear error for this field when user starts typing
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.customer_name.trim()) {
      newErrors.customer_name = 'Full name is required';
    }

    if (!form.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone number is required';
    } else if (!/^[0-9]{11}$/.test(form.customer_phone.replace(/\s/g, ''))) {
      newErrors.customer_phone = 'Please enter a valid 11-digit phone number';
    }

    if (!form.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) {
      newErrors.customer_email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    setLoading(true);
    try {
      const { data } = await orderAPI.create({ 
        ...form, 
        payment_method: 'cash' 
      });
      
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${data.order_number}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Failed to place order';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null; // Will redirect in useEffect
  }

  const subtotal = parseFloat(cart.total);
  const estimatedTax = subtotal * 0.12; // 12% VAT
  const total = subtotal + estimatedTax;

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" className="hover:text-red-600" onClick={() => navigate('/cart')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
          </Button>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">Checkout</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-red-600" />
                Customer Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.customer_name}
                    onChange={(e) => update('customer_name', e.target.value)}
                    placeholder="John Doe"
                    className={`mt-1 ${errors.customer_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.customer_name && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.customer_name}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={form.customer_phone}
                        onChange={(e) => update('customer_phone', e.target.value)}
                        placeholder="09123456789"
                        className={`pl-10 mt-1 ${errors.customer_phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.customer_phone && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.customer_phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={form.customer_email}
                        onChange={(e) => update('customer_email', e.target.value)}
                        placeholder="john@example.com"
                        className={`pl-10 mt-1 ${errors.customer_email ? 'border-red-500 focus:ring-red-500' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.customer_email && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.customer_email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructions" className="text-sm font-medium">
                    Special Instructions
                  </Label>
                  <Textarea
                    id="instructions"
                    value={form.special_instructions}
                    onChange={(e) => update('special_instructions', e.target.value)}
                    placeholder="e.g., Extra spicy, no onions, add extra cheese..."
                    className="mt-1"
                    rows={3}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Optional: Let us know if you have any special requests
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-red-600" />
                Payment Method
              </h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Cash on Pickup</p>
                    <p className="text-sm text-green-600">
                      Pay when you pick up your order at the store
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-red-600" />
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      <span className="font-medium text-gray-900">{item.quantity}x</span> {item.product.name}
                    </span>
                    <span className="font-medium text-gray-900">
                      ₱{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT (12%)</span>
                  <span className="text-gray-900">₱{estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pickup Time</span>
                  <span className="text-gray-900 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 15-20 min
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-heading font-semibold text-lg">Total</span>
                  <span className="font-heading font-bold text-2xl text-red-600">
                    ₱{total.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">
                  Including VAT
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-heading font-bold py-6"
                disabled={loading || cartLoading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Place Order • ₱${total.toFixed(2)}`
                )}
              </Button>

              <p className="text-xs text-center text-gray-400 mt-4">
                By placing your order, you agree to our 
                <Link to="/terms" className="text-red-600 hover:underline mx-1">Terms</Link>
                and
                <Link to="/privacy" className="text-red-600 hover:underline ml-1">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CheckoutPage;