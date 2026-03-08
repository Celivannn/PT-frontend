import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Loader2, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
  pendingOrders: number;
  preparingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  todayOrders: number;
  todayRevenue: number;
}

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    todayOrders: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const ordersRes = await adminAPI.getOrders();
      const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data?.results || [];
      
      // Fetch analytics
      const analyticsRes = await adminAPI.getAnalytics({ period: 'weekly' });
      const analyticsData = Array.isArray(analyticsRes.data) ? analyticsRes.data : [];
      
      setOrders(ordersData);
      setAnalytics(analyticsData);
      
      // Calculate stats
      const today = new Date().toDateString();
      const todayOrders = ordersData.filter((o: any) => 
        new Date(o.created_at).toDateString() === today
      );
      
      const totalRevenue = ordersData.reduce((sum: number, o: any) => 
        sum + parseFloat(o.total_amount || 0), 0
      );
      
      const uniqueCustomers = new Set(ordersData.map((o: any) => o.customer_email)).size;
      
      setStats({
        totalOrders: ordersData.length,
        totalRevenue,
        averageOrderValue: ordersData.length > 0 ? totalRevenue / ordersData.length : 0,
        totalCustomers: uniqueCustomers,
        pendingOrders: ordersData.filter((o: any) => o.status === 'pending').length,
        preparingOrders: ordersData.filter((o: any) => o.status === 'preparing').length,
        completedOrders: ordersData.filter((o: any) => o.status === 'completed').length,
        cancelledOrders: ordersData.filter((o: any) => o.status === 'cancelled').length,
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((sum: number, o: any) => 
          sum + parseFloat(o.total_amount || 0), 0
        )
      });
      
      setError(null);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statusData = [
    { name: 'Pending', value: stats.pendingOrders },
    { name: 'Preparing', value: stats.preparingOrders },
    { name: 'Completed', value: stats.completedOrders },
    { name: 'Cancelled', value: stats.cancelledOrders },
  ].filter(d => d.value > 0);

  const statCards = [
    { 
      icon: ShoppingBag, 
      label: "Today's Orders", 
      value: stats.todayOrders, 
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    { 
      icon: DollarSign, 
      label: "Today's Revenue", 
      value: `₱${stats.todayRevenue.toFixed(2)}`, 
      color: 'text-success',
      bg: 'bg-success/10'
    },
    { 
      icon: TrendingUp, 
      label: 'Pending Orders', 
      value: stats.pendingOrders, 
      color: 'text-warning',
      bg: 'bg-warning/10'
    },
    { 
      icon: CheckCircle, 
      label: 'Completed', 
      value: stats.completedOrders, 
      color: 'text-success',
      bg: 'bg-success/10'
    },
    { 
      icon: Clock, 
      label: 'Preparing', 
      value: stats.preparingOrders, 
      color: 'text-info',
      bg: 'bg-info/10'
    },
    { 
      icon: XCircle, 
      label: 'Cancelled', 
      value: stats.cancelledOrders, 
      color: 'text-destructive',
      bg: 'bg-destructive/10'
    },
    { 
      icon: Users, 
      label: 'Total Customers', 
      value: stats.totalCustomers, 
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    { 
      icon: DollarSign, 
      label: 'Avg Order Value', 
      value: `₱${stats.averageOrderValue.toFixed(2)}`, 
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Retry</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Button variant="outline" onClick={fetchDashboardData}>
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <Card key={i} className="p-5 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Trend */}
        {analytics.length > 0 ? (
          <Card className="p-6">
            <h3 className="font-heading font-semibold mb-4">Sales Trend (Weekly)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="total_revenue" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  name="Revenue"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="total_orders" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        ) : (
          <Card className="p-6 flex items-center justify-center">
            <p className="text-muted-foreground">No analytics data available</p>
          </Card>
        )}

        {/* Order Status Distribution */}
        {statusData.length > 0 ? (
          <Card className="p-6">
            <h3 className="font-heading font-semibold mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={(e) => `${e.name}: ${e.value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        ) : (
          <Card className="p-6 flex items-center justify-center">
            <p className="text-muted-foreground">No order data available</p>
          </Card>
        )}
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <h3 className="font-heading font-semibold mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.order_number} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">#{order.order_number}</p>
                <p className="text-sm text-muted-foreground">{order.customer_name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">₱{parseFloat(order.total_amount || 0).toFixed(2)}</p>
                <p className={`text-xs capitalize ${
                  order.status === 'completed' ? 'text-success' :
                  order.status === 'cancelled' ? 'text-destructive' :
                  order.status === 'pending' ? 'text-warning' : 'text-info'
                }`}>
                  {order.status}
                </p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No recent orders</p>
          )}
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;