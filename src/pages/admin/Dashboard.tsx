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
  XCircle,
  Calendar,
  Package,
  Coffee,
  Award,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw
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
  Bar,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];

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
  weekRevenue: number;
  monthRevenue: number;
  growthRate: number;
  customerRetention: number;
  repeatCustomers: number;
  peakHour: number;
  avgPrepTime: number;
}

interface TopProduct {
  product_name: string;
  total_quantity_sold: number;
  total_revenue: number;
}

interface CategoryRevenue {
  category_name: string;
  total_revenue: number;
  order_count: number;
}

interface HourlyOrder {
  hour: number;
  orders: number;
  revenue: number;
}

interface DailyOrder {
  date: string;
  orders: number;
  revenue: number;
}

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenue[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyOrder[]>([]);
  const [dailyData, setDailyData] = useState<DailyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('week');
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
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    growthRate: 0,
    customerRetention: 0,
    repeatCustomers: 0,
    peakHour: 12,
    avgPrepTime: 15
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
      
      // Fetch analytics with different periods
      const weeklyAnalytics = await adminAPI.getAnalytics({ period: 'weekly' });
      const monthlyAnalytics = await adminAPI.getAnalytics({ period: 'monthly' });
      
      setOrders(ordersData);
      setAnalytics(Array.isArray(weeklyAnalytics.data) ? weeklyAnalytics.data : []);
      
      // Calculate comprehensive stats
      calculateStats(ordersData);
      
      // Calculate top products
      calculateTopProducts(ordersData);
      
      // Calculate category revenue
      calculateCategoryRevenue(ordersData);
      
      // Calculate hourly distribution
      calculateHourlyDistribution(ordersData);
      
      // Calculate daily trends
      calculateDailyTrends(ordersData);
      
      setError(null);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Dashboard updated');
  };

  const calculateStats = (ordersData: any[]) => {
    const today = new Date().toDateString();
    const now = new Date();
    const weekAgo = new Date(now.setDate(now.getDate() - 7));
    const monthAgo = new Date(now.setMonth(now.getMonth() - 1));

    const todayOrders = ordersData.filter((o: any) => 
      new Date(o.created_at).toDateString() === today
    );

    const weekOrders = ordersData.filter((o: any) => 
      new Date(o.created_at) >= weekAgo
    );

    const monthOrders = ordersData.filter((o: any) => 
      new Date(o.created_at) >= monthAgo
    );

    const totalRevenue = ordersData.reduce((sum: number, o: any) => 
      sum + parseFloat(o.total_amount || 0), 0
    );

    const weekRevenue = weekOrders.reduce((sum: number, o: any) => 
      sum + parseFloat(o.total_amount || 0), 0
    );

    const monthRevenue = monthOrders.reduce((sum: number, o: any) => 
      sum + parseFloat(o.total_amount || 0), 0
    );

    const uniqueCustomers = new Set(ordersData.map((o: any) => o.customer_email)).size;
    
    // Calculate repeat customers (customers with more than 1 order)
    const customerOrderCount = ordersData.reduce((acc: any, order: any) => {
      acc[order.customer_email] = (acc[order.customer_email] || 0) + 1;
      return acc;
    }, {});
    
    const repeatCustomers = Object.values(customerOrderCount).filter((count: any) => count > 1).length;
    const customerRetention = uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

    // Calculate peak hour
    const hourCounts = Array(24).fill(0);
    ordersData.forEach((order: any) => {
      const hour = new Date(order.created_at).getHours();
      hourCounts[hour]++;
    });
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

    // Calculate average preparation time (mock data - would come from backend)
    const avgPrepTime = 15;

    // Calculate growth rate (compare last 7 days vs previous 7 days)
    const twoWeeksAgo = new Date(now.setDate(now.getDate() - 14));
    const previousWeekOrders = ordersData.filter((o: any) => {
      const date = new Date(o.created_at);
      return date >= twoWeeksAgo && date < weekAgo;
    });
    const previousWeekRevenue = previousWeekOrders.reduce((sum: number, o: any) => 
      sum + parseFloat(o.total_amount || 0), 0
    );
    const growthRate = previousWeekRevenue > 0 
      ? ((weekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100 
      : 0;

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
      ),
      weekRevenue,
      monthRevenue,
      growthRate,
      customerRetention,
      repeatCustomers,
      peakHour,
      avgPrepTime
    });
  };

  const calculateTopProducts = (ordersData: any[]) => {
    const productMap = new Map<string, { quantity: number; revenue: number }>();
    
    ordersData.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const current = productMap.get(item.product_name) || { quantity: 0, revenue: 0 };
        productMap.set(item.product_name, {
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + parseFloat(item.subtotal || 0)
        });
      });
    });

    const topProductsList = Array.from(productMap.entries())
      .map(([name, data]) => ({
        product_name: name,
        total_quantity_sold: data.quantity,
        total_revenue: data.revenue
      }))
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 5);

    setTopProducts(topProductsList);
  };

  const calculateCategoryRevenue = (ordersData: any[]) => {
    const categoryMap = new Map<string, { revenue: number; count: number }>();
    
    ordersData.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        // You'd need category info from products - this is simplified
        const category = item.category_name || 'Other';
        const current = categoryMap.get(category) || { revenue: 0, count: 0 };
        categoryMap.set(category, {
          revenue: current.revenue + parseFloat(item.subtotal || 0),
          count: current.count + 1
        });
      });
    });

    const categoryList = Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        category_name: name,
        total_revenue: data.revenue,
        order_count: data.count
      }))
      .sort((a, b) => b.total_revenue - a.total_revenue);

    setCategoryRevenue(categoryList);
  };

  const calculateHourlyDistribution = (ordersData: any[]) => {
    const hourlyStats = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      orders: 0,
      revenue: 0
    }));

    ordersData.forEach((order: any) => {
      const hour = new Date(order.created_at).getHours();
      hourlyStats[hour].orders += 1;
      hourlyStats[hour].revenue += parseFloat(order.total_amount || 0);
    });

    setHourlyData(hourlyStats);
  };

  const calculateDailyTrends = (ordersData: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyStats = last7Days.map(date => {
      const dayOrders = ordersData.filter((o: any) => 
        o.created_at?.startsWith(date)
      );
      return {
        date,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum: number, o: any) => 
          sum + parseFloat(o.total_amount || 0), 0
        )
      };
    });

    setDailyData(dailyStats);
  };

  const formatCurrency = (value: number) => {
    return `₱${value.toFixed(2)}`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
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
      subValue: `${formatPercent((stats.todayOrders / (stats.totalOrders || 1)) * 100)} of total`,
      color: 'text-primary',
      bg: 'bg-primary/10',
      trend: stats.todayOrders > 0 ? 'up' : 'neutral'
    },
    { 
      icon: DollarSign, 
      label: "Today's Revenue", 
      value: formatCurrency(stats.todayRevenue), 
      subValue: formatPercent((stats.todayRevenue / (stats.totalRevenue || 1)) * 100),
      color: 'text-success',
      bg: 'bg-success/10',
      trend: stats.todayRevenue > 0 ? 'up' : 'neutral'
    },
    { 
      icon: TrendingUp, 
      label: 'Growth Rate', 
      value: formatPercent(stats.growthRate), 
      subValue: 'vs last week',
      color: stats.growthRate >= 0 ? 'text-success' : 'text-destructive',
      bg: stats.growthRate >= 0 ? 'bg-success/10' : 'bg-destructive/10',
      trend: stats.growthRate >= 0 ? 'up' : 'down'
    },
    { 
      icon: Users, 
      label: 'Customer Retention', 
      value: formatPercent(stats.customerRetention), 
      subValue: `${stats.repeatCustomers} returning`,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      trend: stats.customerRetention > 50 ? 'up' : 'neutral'
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Retry</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <Card key={i} className="p-5 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subValue}</p>
              </div>
              {stat.trend === 'up' && (
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <ArrowUp className="h-3 w-3 mr-1" /> +12%
                </Badge>
              )}
              {stat.trend === 'down' && (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                  <ArrowDown className="h-3 w-3 mr-1" /> -5%
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
          <p className="text-xl font-bold">{formatNumber(stats.totalOrders)}</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <Badge variant="outline" className="bg-primary/10 text-primary">+{stats.todayOrders} today</Badge>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-xl font-bold text-success">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-xs text-muted-foreground mt-2">Avg: {formatCurrency(stats.averageOrderValue)}/order</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Peak Hour</p>
          <p className="text-xl font-bold">{stats.peakHour}:00</p>
          <p className="text-xs text-muted-foreground mt-2">Busiest time of day</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Avg Prep Time</p>
          <p className="text-xl font-bold">{stats.avgPrepTime} min</p>
          <p className="text-xs text-success mt-2">Within target</p>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="timing">Timing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card className="p-6">
              <h3 className="font-heading font-semibold mb-4">Revenue & Orders Trend</h3>
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value: any, name: string) => {
                        if (name === 'revenue') return formatCurrency(value);
                        return value;
                      }}
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.2}
                      name="Revenue"
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.2}
                      name="Orders"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </Card>

            {/* Order Status Distribution */}
            <Card className="p-6">
              <h3 className="font-heading font-semibold mb-4">Order Status Distribution</h3>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
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
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">No order data available</p>
                </div>
              )}
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="p-6">
            <h3 className="font-heading font-semibold mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.order_number} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      order.status === 'completed' ? 'bg-success/10 text-success' :
                      order.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                      order.status === 'pending' ? 'bg-warning/10 text-warning' :
                      'bg-info/10 text-info'
                    }`}>
                      {order.status === 'completed' && <CheckCircle className="h-4 w-4" />}
                      {order.status === 'cancelled' && <XCircle className="h-4 w-4" />}
                      {order.status === 'pending' && <Clock className="h-4 w-4" />}
                      {order.status === 'preparing' && <Coffee className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₱{parseFloat(order.total_amount || 0).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No recent orders</p>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card className="p-6">
              <h3 className="font-heading font-semibold mb-4">Top Selling Products</h3>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.product_name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="font-medium">{product.product_name}</span>
                        </div>
                        <span className="text-primary font-bold">{formatCurrency(product.total_revenue)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2"
                          style={{ 
                            width: `${(product.total_revenue / topProducts[0].total_revenue) * 100}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {product.total_quantity_sold} units sold
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No product data available</p>
              )}
            </Card>

            {/* Category Revenue */}
            <Card className="p-6">
              <h3 className="font-heading font-semibold mb-4">Revenue by Category</h3>
              {categoryRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category_name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Bar dataKey="total_revenue" fill="#ef4444" radius={[4, 4, 0, 0]}>
                      {categoryRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">No category data available</p>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-heading font-semibold mb-4">Customer Insights</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold">{formatNumber(stats.totalCustomers)}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary opacity-50" />
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Repeat Customers</p>
                    <p className="text-2xl font-bold">{formatNumber(stats.repeatCustomers)}</p>
                  </div>
                  <Award className="h-8 w-8 text-success opacity-50" />
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Retention Rate</p>
                    <p className="text-2xl font-bold">{formatPercent(stats.customerRetention)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-info opacity-50" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-heading font-semibold mb-4">Customer Lifetime Value</h3>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Timing Tab */}
        <TabsContent value="timing" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Hourly Distribution */}
            <Card className="p-6">
              <h3 className="font-heading font-semibold mb-4">Hourly Order Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'revenue') return formatCurrency(value);
                      return value;
                    }}
                  />
                  <Bar dataKey="orders" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Peak Hours */}
            <Card className="p-6">
              <h3 className="font-heading font-semibold mb-4">Peak Hours Analysis</h3>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Busiest Hour</p>
                  <p className="text-3xl font-bold text-primary">{stats.peakHour}:00 - {stats.peakHour + 1}:00</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Morning Peak</p>
                    <p className="text-lg font-bold">11:00 - 13:00</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Evening Peak</p>
                    <p className="text-lg font-bold">18:00 - 20:00</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Footer */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Week Revenue</p>
            <p className="text-lg font-bold">{formatCurrency(stats.weekRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Month Revenue</p>
            <p className="text-lg font-bold">{formatCurrency(stats.monthRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Order Value</p>
            <p className="text-lg font-bold">{formatCurrency(stats.averageOrderValue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Completion Rate</p>
            <p className="text-lg font-bold text-success">
              {stats.totalOrders > 0 
                ? formatPercent((stats.completedOrders / stats.totalOrders) * 100)
                : '0%'}
            </p>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;