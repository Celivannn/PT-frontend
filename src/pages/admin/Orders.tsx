import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { adminAPI } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Phone,
  Mail,
  DollarSign,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
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

const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
const paymentStatusOptions = ['pending', 'paid', 'failed', 'refunded'];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getOrders();
      setOrders(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchOrders(); 
  }, []);

  const updateStatus = async (orderNumber: string, newStatus: string) => {
    setUpdating(orderNumber);
    try {
      await adminAPI.updateOrder(orderNumber, { status: newStatus });
      toast.success(`Order updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setUpdating(null);
    }
  };

  const updatePaymentStatus = async (orderNumber: string, newStatus: string) => {
    setUpdating(orderNumber);
    try {
      await adminAPI.updateOrder(orderNumber, { payment_status: newStatus });
      toast.success(`Payment status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment status');
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (filterPayment !== 'all' && order.payment_status !== filterPayment) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        order.order_number.toLowerCase().includes(searchLower) ||
        order.customer_name.toLowerCase().includes(searchLower) ||
        order.customer_email.toLowerCase().includes(searchLower) ||
        order.customer_phone.includes(search)
      );
    }
    return true;
  });

  const getStatusCount = (status: string) => orders.filter(o => o.status === status).length;
  const getPaymentCount = (status: string) => orders.filter(o => o.payment_status === status).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: string) => {
    return `₱${parseFloat(amount).toFixed(2)}`;
  };

  const toggleExpand = (orderNumber: string) => {
    setExpandedOrder(expandedOrder === orderNumber ? null : orderNumber);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and update customer orders</p>
        </div>
        <Button variant="outline" onClick={fetchOrders}>
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-800">{getStatusCount('pending')}</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <p className="text-sm text-green-700">Completed</p>
          <p className="text-2xl font-bold text-green-800">{getStatusCount('completed')}</p>
        </Card>
        <Card className="p-4 bg-blue-50">
          <p className="text-sm text-blue-700">Paid</p>
          <p className="text-2xl font-bold text-blue-800">{getPaymentCount('paid')}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by order #, customer, email..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(s => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPayment} onValueChange={setFilterPayment}>
          <SelectTrigger className="w-40">
            <DollarSign className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            {paymentStatusOptions.map(s => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card key={order.order_number} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading font-bold text-primary">
                      #{order.order_number}
                    </h3>
                    <Badge variant="outline" className="capitalize">
                      {order.payment_method}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <User className="h-3 w-3" /> {order.customer_name}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Mail className="h-3 w-3" /> {order.customer_email}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-3 w-3" /> {order.customer_phone}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" /> {formatDate(order.created_at)}
                    </span>
                  </div>

                  {/* Compact View */}
                  {expandedOrder !== order.order_number && (
                    <div className="flex items-center gap-3 mt-3">
                      <OrderStatusBadge status={order.status} />
                      <Badge 
                        variant={order.payment_status === 'paid' ? 'default' : 'outline'}
                        className={order.payment_status === 'paid' ? 'bg-success' : ''}
                      >
                        {order.payment_status}
                      </Badge>
                      <span className="font-bold text-primary">
                        {formatCurrency(order.total_amount)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {order.items?.length || 0} items
                      </span>
                    </div>
                  )}

                  {/* Expanded View */}
                  {expandedOrder === order.order_number && (
                    <div className="mt-4 space-y-4">
                      {/* Items */}
                      <div>
                        <h4 className="font-semibold mb-2">Items</h4>
                        <div className="space-y-2">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span>
                                {item.product_name} x{item.quantity}
                              </span>
                              <span className="font-medium">
                                {formatCurrency(item.subtotal.toString())}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Special Instructions */}
                      {order.special_instructions && (
                        <div>
                          <h4 className="font-semibold mb-1">Special Instructions</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.special_instructions}
                          </p>
                        </div>
                      )}

                      {/* Update Controls */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Status:</span>
                          <Select 
                            value={order.status} 
                            onValueChange={(v) => updateStatus(order.order_number, v)}
                            disabled={updating === order.order_number}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(s => (
                                <SelectItem key={s} value={s} className="capitalize">
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Payment:</span>
                          <Select 
                            value={order.payment_status} 
                            onValueChange={(v) => updatePaymentStatus(order.order_number, v)}
                            disabled={updating === order.order_number}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentStatusOptions.map(s => (
                                <SelectItem key={s} value={s} className="capitalize">
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => toggleExpand(order.order_number)}
                >
                  {expandedOrder === order.order_number ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Card>
          ))}
          {filteredOrders.length === 0 && (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </Card>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;