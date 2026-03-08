import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Loader2, 
  ShoppingBag, 
  Search,
  Calendar,
  ChevronRight,
  Filter,
  Package,
  Clock,
  TrendingUp
} from 'lucide-react';

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
  total_amount: string;
  status: string;
  payment_status: string;
  items: OrderItem[];
  created_at: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.getOrders();
      const ordersData = Array.isArray(data) ? data : data.results || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      
      // Calculate stats
      const totalSpent = ordersData.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      const pendingOrders = ordersData.filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing').length;
      const completedOrders = ordersData.filter(o => o.status === 'completed').length;
      
      setStats({
        totalOrders: ordersData.length,
        totalSpent,
        pendingOrders,
        completedOrders
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(2);
  };

  const getItemSummary = (items: OrderItem[]) => {
    if (items.length === 0) return 'No items';
    if (items.length === 1) return `${items[0].quantity}x ${items[0].product_name}`;
    return `${items[0].quantity}x ${items[0].product_name} +${items.length - 1} more`;
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mb-4" />
          <p className="text-gray-500">Loading your order history...</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">Track and manage your orders</p>
          </div>
          
          {orders.length > 0 && (
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-xl font-heading font-bold text-red-600">₱{formatPrice(stats.totalSpent.toString())}</p>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Orders</p>
                <p className="text-xl font-heading font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Orders</p>
                  <p className="text-lg font-heading font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-lg font-heading font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShoppingBag className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="text-lg font-heading font-bold text-gray-900">{stats.completedOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Spent</p>
                  <p className="text-lg font-heading font-bold text-red-600">₱{formatPrice(stats.totalSpent.toString())}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Looks like you haven't placed any orders yet. Browse our menu and order your favorite burgers!
            </p>
            <Button 
              onClick={() => navigate('/menu')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by order number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                    className={statusFilter === 'all' ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('pending')}
                    className={statusFilter === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('completed')}
                    className={statusFilter === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    Completed
                  </Button>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-3 text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.order_number}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-red-200 group"
                  onClick={() => navigate(`/orders/${order.order_number}`)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold text-red-600 text-lg">
                          #{order.order_number}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(order.created_at)}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{order.items?.length || 0} items</span>
                      </div>

                      <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                        {getItemSummary(order.items || [])}
                      </p>
                    </div>

                    {/* Right: Total & Arrow */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Total Amount</p>
                        <p className="text-xl font-heading font-bold text-red-600">
                          ₱{formatPrice(order.total_amount)}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                    </div>
                  </div>

                  {/* Payment Status Indicator */}
                  {order.payment_status === 'paid' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        ✓ Payment received
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </CustomerLayout>
  );
};

export default OrderHistory;