import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Loader2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Calendar,
  CreditCard,
  ShoppingBag,
  Printer,
  Home
} from 'lucide-react';

interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: string;
  status: string;
  payment_status: string;
  payment_method: string;
  special_instructions?: string;
  items: OrderItem[];
  created_at: string;
}

const OrderConfirmation = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderNumber) {
      setError('No order number provided');
      setLoading(false);
      return;
    }
    
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.getOrder(orderNumber!);
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Unable to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string | number) => {
    return parseFloat(price.toString()).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mb-4" />
          <p className="text-gray-500">Loading your order confirmation...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (error || !order) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-12 max-w-lg text-center">
          <div className="bg-red-50 rounded-xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-500 mb-6">{error || "We couldn't find the order you're looking for."}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/orders')} variant="outline">
                View My Orders
              </Button>
              <Button onClick={() => navigate('/menu')} className="bg-red-600 hover:bg-red-700 text-white">
                Browse Menu
              </Button>
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const tax = subtotal * 0.12; // 12% VAT
  const total = parseFloat(order.total_amount);

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-500 text-lg">
            Thank you for your order. We'll start preparing it right away.
          </p>
        </div>

        {/* Order Summary Card */}
        <Card className="p-6 mb-6 shadow-lg border-0">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-2xl font-heading font-bold text-red-600 font-mono">
                {order.order_number}
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                {order.status}
              </Badge>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Customer Info */}
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4 text-red-600" /> Customer Details
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4 text-gray-400" />
                  {order.customer_name}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {order.customer_phone}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {order.customer_email}
                </p>
              </div>
            </div>

            {/* Order Info */}
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-600" /> Order Information
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {formatDate(order.created_at)}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  Payment: <span className="capitalize">{order.payment_method === 'cash' ? 'Cash on Pickup' : order.payment_method}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  Pickup at: Minute Burger Store
                </p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-6">
            <h3 className="font-heading font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-900 w-8">{item.quantity}x</span>
                    <span className="text-gray-600">{item.product_name}</span>
                  </div>
                  <span className="font-medium text-gray-900">₱{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₱{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (12%)</span>
                <span className="text-gray-900">₱{formatPrice(tax)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-red-600">₱{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {order.special_instructions && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-yellow-800 mb-1">Special Instructions:</p>
              <p className="text-sm text-yellow-700">{order.special_instructions}</p>
            </div>
          )}

          {/* Pickup Reminder */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Pickup Reminder</p>
                <p className="text-sm text-blue-600">
                  Your order will be ready for pickup in approximately 15-20 minutes. 
                  Please bring your order number when picking up.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="gap-2"
          >
            <Printer className="h-4 w-4" /> Print Receipt
          </Button>
          <Button 
            onClick={() => navigate('/orders')}
            variant="outline"
            className="gap-2"
          >
            <ShoppingBag className="h-4 w-4" /> View All Orders
          </Button>
          <Button 
            onClick={() => navigate('/menu')}
            className="bg-red-600 hover:bg-red-700 text-white gap-2"
          >
            <Home className="h-4 w-4" /> Order Again
          </Button>
        </div>

        {/* Need Help */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Need help? Contact us at{' '}
          <a href="tel:0281234567" className="text-red-600 hover:underline">(02) 8123-4567</a>
        </p>
      </div>
    </CustomerLayout>
  );
};

export default OrderConfirmation;