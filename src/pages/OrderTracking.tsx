import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

const statusSteps = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];

const OrderTracking = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderNumber) return;
    orderAPI.getOrder(orderNumber)
      .then(({ data }) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return <CustomerLayout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></CustomerLayout>;
  if (!order) return <CustomerLayout><div className="text-center py-20 text-muted-foreground">Order not found</div></CustomerLayout>;

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </Button>

        <div className="bg-card rounded-xl p-6 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Order</p>
              <p className="text-2xl font-heading font-bold text-primary">#{order.order_number}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          {/* Status timeline */}
          {order.status !== 'cancelled' && (
            <div className="flex items-center mb-8">
              {statusSteps.map((step, i) => (
                <React.Fragment key={step}>
                  <div className={`flex flex-col items-center ${i <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-[10px] mt-1 capitalize whitespace-nowrap">{step === 'ready' ? 'Ready' : step}</span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 ${i < currentStep ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Items */}
          <h3 className="font-semibold mb-3">Items</h3>
          <div className="space-y-2 mb-4">
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b last:border-0">
                <span>{item.quantity}x {item.product_name || item.product?.name}</span>
                <span>₱{parseFloat(item.subtotal || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold border-t pt-3">
            <span>Total</span>
            <span className="text-primary">₱{parseFloat(order.total_amount || 0).toFixed(2)}</span>
          </div>

          {order.special_instructions && (
            <div className="mt-4 p-3 bg-accent rounded-lg">
              <p className="text-xs font-medium text-accent-foreground">Special Instructions</p>
              <p className="text-sm mt-1">{order.special_instructions}</p>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default OrderTracking;
