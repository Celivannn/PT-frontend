import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

const OrderConfirmation = () => {
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

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-12 max-w-lg text-center animate-fade-in">
        <CheckCircle className="h-20 w-20 text-success mx-auto mb-6" />
        <h1 className="text-3xl font-heading font-bold mb-2">Order Placed!</h1>
        <p className="text-muted-foreground mb-6">Your order has been received and is being processed.</p>
        
        {order && (
          <div className="bg-card rounded-xl p-6 shadow-sm text-left mb-6">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-2xl font-heading font-bold text-primary">{order.order_number}</p>
            <div className="mt-4 space-y-2">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.product_name || item.product?.name}</span>
                  <span>₱{parseFloat(item.subtotal || 0).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">₱{parseFloat(order.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/orders')}>View My Orders</Button>
          <Button variant="outline" onClick={() => navigate('/menu')}>Continue Shopping</Button>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default OrderConfirmation;
