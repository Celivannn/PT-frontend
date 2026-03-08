import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Loader2, 
  Clock, 
  CheckCircle, 
  Package, 
  ChefHat, 
  ShoppingBag,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  XCircle
} from 'lucide-react';

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: Clock, description: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Your order has been confirmed' },
  { key: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Our chefs are preparing your food' },
  { key: 'ready', label: 'Ready for Pickup', icon: Package, description: 'Your order is ready to pick up' },
  { key: 'completed', label: 'Completed', icon: ShoppingBag, description: 'Order completed' }
];

const cancelledStep = { key: 'cancelled', label: 'Cancelled', icon: XCircle, description: 'This order has been cancelled' };

interface OrderItem {
  id: number;
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
  updated_at: string;
}

const OrderTracking = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderNumber) {
      setError('No order number provided');
      setLoading(false);
      return;
    }
    fetchOrder();
  }, [orderNumber]);

  useEffect(() => {
    if (order && order.status !== 'completed' && order.status !== 'cancelled') {
      calculateTimeRemaining();
    }
  }, [order]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.getOrder(orderNumber!);
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Unable to load order details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = () => {
    // Simulate estimated time based on status
    const status = order?.status;
    if (status === 'pending') setTimeRemaining('~15 minutes');
    else if (status === 'confirmed') setTimeRemaining('~12 minutes');
    else if (status === 'preparing') setTimeRemaining('~8 minutes');
    else if (status === 'ready') setTimeRemaining('Ready now!');
    else setTimeRemaining('');
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

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    if (order.status === 'cancelled') return -1;
    return statusSteps.findIndex(step => step.key === order.status);
  };

  const currentStepIndex = getCurrentStepIndex();
  const isCancelled = order?.status === 'cancelled';

  if (loading) {
    return (
      <CustomerLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mb-4" />
          <p className="text-gray-500">Tracking your order...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (error || !order) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-12 max-w-lg text-center">
          <div className="bg-red-50 rounded-xl p-8">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-500 mb-6">{error || "We couldn't find the order you're looking for."}</p>
            <Button onClick={() => navigate('/orders')} variant="outline">
              View My Orders
            </Button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" className="hover:text-red-600" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
          </Button>
          <Link to="/menu">
            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
              Order Again
            </Button>
          </Link>
        </div>

        {/* Order Header Card */}
        <Card className="p-6 mb-6 shadow-sm border-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <h1 className="text-3xl font-heading font-bold text-red-600 font-mono">
                #{order.order_number}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                <p className="text-xs text-gray-600">₱{formatPrice(order.total_amount)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Time</p>
              <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment</p>
              <p className="font-medium text-gray-900 capitalize">{order.payment_method === 'cash' ? 'Cash on Pickup' : order.payment_method}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium capitalize text-green-600">{order.payment_status}</p>
            </div>
          </div>
        </Card>

        {/* Status Timeline */}
        {!isCancelled ? (
          <Card className="p-6 mb-6 shadow-sm border-0">
            <h2 className="font-heading font-semibold text-lg mb-6">Order Status</h2>
            
            {/* Estimated Time */}
            {timeRemaining && currentStepIndex < 4 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Estimated time remaining</p>
                    <p className="text-lg font-bold text-blue-600">{timeRemaining}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Steps */}
            <div className="relative">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex items-start gap-4 mb-6 last:mb-0">
                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}
                      ${isCurrent ? 'ring-4 ring-red-200' : ''}
                    `}>
                      <StepIcon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-heading font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </h3>
                        {isCurrent && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                      {isCurrent && order.updated_at && (
                        <p className="text-xs text-gray-400 mt-1">
                          Updated {new Date(order.updated_at).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          // Cancelled Order View
          <Card className="p-6 mb-6 shadow-sm border-0 bg-red-50">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
              <h2 className="text-xl font-heading font-bold text-red-700 mb-2">Order Cancelled</h2>
              <p className="text-red-600 mb-4">This order has been cancelled and will not be processed.</p>
              {order.updated_at && (
                <p className="text-sm text-red-500">
                  Cancelled on {new Date(order.updated_at).toLocaleString()}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Order Details */}
        <Card className="p-6 shadow-sm border-0">
          <h2 className="font-heading font-semibold text-lg mb-4">Order Details</h2>

          {/* Items List */}
          <div className="space-y-3 mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-900 w-8">{item.quantity}x</span>
                    <div>
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-xs text-gray-500">₱{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                </div>
                <span className="font-medium text-gray-900">₱{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Price Summary */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">₱{formatPrice(order.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT (12%)</span>
              <span className="text-gray-900">₱{(parseFloat(order.total_amount) * 0.12 / 1.12).toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-900">Total</span>
              <span className="text-red-600">₱{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-600">
                <span className="font-medium text-gray-700">Name:</span> {order.customer_name}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="h-3 w-3 text-gray-400" /> {order.customer_phone}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Mail className="h-3 w-3 text-gray-400" /> {order.customer_email}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-3 w-3 text-gray-400" /> Pickup at Minute Burger Store
              </p>
            </div>
          </div>

          {/* Special Instructions */}
          {order.special_instructions && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-xs font-medium text-yellow-800 mb-1">Special Instructions</p>
              <p className="text-sm text-yellow-700">{order.special_instructions}</p>
            </div>
          )}
        </Card>

        {/* Need Help */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Need help with your order?{' '}
            <a href="tel:0281234567" className="text-red-600 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default OrderTracking;