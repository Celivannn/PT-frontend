import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingBag } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    orderAPI.getOrders()
      .then(({ data }) => setOrders(Array.isArray(data) ? data : data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CustomerLayout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></CustomerLayout>;

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-heading font-bold mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-heading font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-4">Start ordering from our delicious menu!</p>
            <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.order_number}
                className="bg-card rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
                onClick={() => navigate(`/orders/${order.order_number}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-heading font-bold text-primary">#{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
                  <p className="font-bold">₱{parseFloat(order.total_amount || 0).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default OrderHistory;
