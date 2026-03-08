import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  BarChart3, 
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  FileText,
  PieChart,
  LineChart as LineChartIcon,
  Printer,
  Mail,
  Clock,
  Package,
  Award,
  ArrowUp,
  ArrowDown,
  ChevronDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];

interface ReportData {
  period: string;
  fromDate: string;
  toDate: string;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalCustomers: number;
    completedOrders: number;
    cancelledOrders: number;
    pendingOrders: number;
    preparingOrders: number;
    newCustomers: number;
    returningCustomers: number;
    peakHour: number;
    avgPrepTime: number;
  };
  dailyStats: Array<{
    date: string;
    orders: number;
    revenue: number;
    customers: number;
  }>;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
    category: string;
  }>;
  categoryRevenue: Array<{
    category: string;
    revenue: number;
    orders: number;
    percentage: number;
  }>;
  orderStatus: Array<{
    status: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  hourlyDistribution: Array<{
    hour: number;
    orders: number;
    revenue: number;
  }>;
  customerMetrics: {
    lifetimeValue: number;
    repeatRate: number;
    avgOrdersPerCustomer: number;
  };
}

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [period, setPeriod] = useState('weekly');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    setToDate(today.toISOString().split('T')[0]);
    setFromDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      const params: any = { period };
      if (period === 'custom') {
        if (!fromDate || !toDate) {
          toast.error('Please select date range');
          setLoading(false);
          return;
        }
        params.from = fromDate;
        params.to = toDate;
      }
      
      const { data } = await adminAPI.getAnalytics(params);
      const analyticsData: any[] = Array.isArray(data) ? data : [];
      
      // Fetch additional data
      const ordersRes = await adminAPI.getOrders();
      const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data?.results || [];
      
      // Calculate comprehensive metrics
      const report = await calculateReportData(analyticsData, ordersData, params);
      setReportData(report);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const calculateReportData = async (analyticsData: any[], ordersData: any[], params: any): Promise<ReportData> => {
    // Filter orders by date range if custom
    let filteredOrders = ordersData;
    if (params.from && params.to) {
      const from = new Date(params.from);
      const to = new Date(params.to);
      to.setHours(23, 59, 59, 999);
      
      filteredOrders = ordersData.filter((order: any) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= from && orderDate <= to;
      });
    }

    // Calculate customer metrics
    const customerEmails = filteredOrders.map((o: any) => o.customer_email);
    const uniqueCustomers = new Set(customerEmails).size;
    
    const customerOrderCount = filteredOrders.reduce((acc: any, order: any) => {
      acc[order.customer_email] = (acc[order.customer_email] || 0) + 1;
      return acc;
    }, {});
    
    const returningCustomers = Object.values(customerOrderCount).filter((count: any) => count > 1).length;
    const newCustomers = uniqueCustomers - returningCustomers;
    const repeatRate = uniqueCustomers > 0 ? (returningCustomers / uniqueCustomers) * 100 : 0;
    const avgOrdersPerCustomer = uniqueCustomers > 0 ? filteredOrders.length / uniqueCustomers : 0;
    
    // Calculate lifetime value (average revenue per customer)
    const totalRevenue = filteredOrders.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0);
    const lifetimeValue = uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0;

    // Calculate hourly distribution
    const hourlyStats = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      orders: 0,
      revenue: 0
    }));

    filteredOrders.forEach((order: any) => {
      const hour = new Date(order.created_at).getHours();
      hourlyStats[hour].orders += 1;
      hourlyStats[hour].revenue += parseFloat(order.total_amount || 0);
    });

    const peakHour = hourlyStats.reduce((max, curr) => curr.orders > max.orders ? curr : max).hour;

    // Calculate average preparation time (mock - would come from backend)
    const avgPrepTime = 15;

    // Calculate daily stats
    const dailyMap = new Map();
    filteredOrders.forEach((order: any) => {
      const date = order.created_at?.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { orders: 0, revenue: 0, customers: new Set() });
      }
      const day = dailyMap.get(date);
      day.orders += 1;
      day.revenue += parseFloat(order.total_amount || 0);
      day.customers.add(order.customer_email);
    });

    const dailyStats = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: data.revenue,
        customers: data.customers.size
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate top products
    const productMap = new Map();
    filteredOrders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const current = productMap.get(item.product_name) || { quantity: 0, revenue: 0, category: item.category_name || 'Other' };
        productMap.set(item.product_name, {
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + parseFloat(item.subtotal || 0),
          category: current.category
        });
      });
    });

    const topProducts = Array.from(productMap.entries())
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue,
        category: data.category
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Calculate category revenue
    const categoryMap = new Map();
    filteredOrders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const category = item.category_name || 'Other';
        const current = categoryMap.get(category) || { revenue: 0, orders: 0 };
        categoryMap.set(category, {
          revenue: current.revenue + parseFloat(item.subtotal || 0),
          orders: current.orders + 1
        });
      });
    });

    const totalCategoryRevenue = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.revenue, 0);
    const categoryRevenue = Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        category: name,
        revenue: data.revenue,
        orders: data.orders,
        percentage: totalCategoryRevenue > 0 ? (data.revenue / totalCategoryRevenue) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate order status counts
    const statusCounts = {
      pending: filteredOrders.filter((o: any) => o.status === 'pending').length,
      confirmed: filteredOrders.filter((o: any) => o.status === 'confirmed').length,
      preparing: filteredOrders.filter((o: any) => o.status === 'preparing').length,
      ready: filteredOrders.filter((o: any) => o.status === 'ready').length,
      completed: filteredOrders.filter((o: any) => o.status === 'completed').length,
      cancelled: filteredOrders.filter((o: any) => o.status === 'cancelled').length,
    };

    const totalOrders = filteredOrders.length;
    const orderStatus = [
      { status: 'Pending', count: statusCounts.pending, percentage: (statusCounts.pending / totalOrders) * 100, color: '#f97316' },
      { status: 'Confirmed', count: statusCounts.confirmed, percentage: (statusCounts.confirmed / totalOrders) * 100, color: '#3b82f6' },
      { status: 'Preparing', count: statusCounts.preparing, percentage: (statusCounts.preparing / totalOrders) * 100, color: '#a855f7' },
      { status: 'Ready', count: statusCounts.ready, percentage: (statusCounts.ready / totalOrders) * 100, color: '#14b8a6' },
      { status: 'Completed', count: statusCounts.completed, percentage: (statusCounts.completed / totalOrders) * 100, color: '#22c55e' },
      { status: 'Cancelled', count: statusCounts.cancelled, percentage: (statusCounts.cancelled / totalOrders) * 100, color: '#ef4444' },
    ].filter(s => s.count > 0);

    return {
      period: params.period || 'custom',
      fromDate: params.from || new Date().toISOString().split('T')[0],
      toDate: params.to || new Date().toISOString().split('T')[0],
      summary: {
        totalOrders: filteredOrders.length,
        totalRevenue,
        averageOrderValue: filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0,
        totalCustomers: uniqueCustomers,
        completedOrders: statusCounts.completed,
        cancelledOrders: statusCounts.cancelled,
        pendingOrders: statusCounts.pending,
        preparingOrders: statusCounts.preparing,
        newCustomers,
        returningCustomers,
        peakHour,
        avgPrepTime
      },
      dailyStats,
      topProducts,
      categoryRevenue,
      orderStatus,
      hourlyDistribution: hourlyStats,
      customerMetrics: {
        lifetimeValue,
        repeatRate,
        avgOrdersPerCustomer
      }
    };
  };

  const exportToCSV = () => {
    if (!reportData) return;
    
    setExporting(true);
    try {
      const wb = XLSX.utils.book_new();
      
      // Summary Sheet
      const summaryData = [
        ['Minute Burger Report', ''],
        ['Period', reportData.period],
        ['Date Range', `${reportData.fromDate} to ${reportData.toDate}`],
        ['Generated', new Date().toLocaleString()],
        [''],
        ['SUMMARY STATISTICS', ''],
        ['Total Orders', reportData.summary.totalOrders],
        ['Total Revenue', `₱${reportData.summary.totalRevenue.toFixed(2)}`],
        ['Average Order Value', `₱${reportData.summary.averageOrderValue.toFixed(2)}`],
        ['Total Customers', reportData.summary.totalCustomers],
        ['New Customers', reportData.summary.newCustomers],
        ['Returning Customers', reportData.summary.returningCustomers],
        ['Repeat Rate', `${reportData.customerMetrics.repeatRate.toFixed(1)}%`],
        ['Completed Orders', reportData.summary.completedOrders],
        ['Cancelled Orders', reportData.summary.cancelledOrders],
        ['Pending Orders', reportData.summary.pendingOrders],
        ['Peak Hour', `${reportData.summary.peakHour}:00`],
        ['Avg Prep Time', `${reportData.summary.avgPrepTime} min`],
        ['LTV', `₱${reportData.customerMetrics.lifetimeValue.toFixed(2)}`],
      ];
      
      const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

      // Daily Stats Sheet
      if (reportData.dailyStats.length > 0) {
        const dailySheetData = [
          ['Date', 'Orders', 'Revenue', 'Customers'],
          ...reportData.dailyStats.map(d => [
            d.date,
            d.orders,
            `₱${d.revenue.toFixed(2)}`,
            d.customers
          ])
        ];
        const ws2 = XLSX.utils.aoa_to_sheet(dailySheetData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Daily Stats');
      }

      // Top Products Sheet
      if (reportData.topProducts.length > 0) {
        const productsSheetData = [
          ['Product', 'Category', 'Quantity Sold', 'Revenue'],
          ...reportData.topProducts.map(p => [
            p.name,
            p.category,
            p.quantity,
            `₱${p.revenue.toFixed(2)}`
          ])
        ];
        const ws3 = XLSX.utils.aoa_to_sheet(productsSheetData);
        XLSX.utils.book_append_sheet(wb, ws3, 'Top Products');
      }

      // Category Revenue Sheet
      if (reportData.categoryRevenue.length > 0) {
        const categorySheetData = [
          ['Category', 'Orders', 'Revenue', 'Percentage'],
          ...reportData.categoryRevenue.map(c => [
            c.category,
            c.orders,
            `₱${c.revenue.toFixed(2)}`,
            `${c.percentage.toFixed(1)}%`
          ])
        ];
        const ws4 = XLSX.utils.aoa_to_sheet(categorySheetData);
        XLSX.utils.book_append_sheet(wb, ws4, 'Categories');
      }

      // Order Status Sheet
      if (reportData.orderStatus.length > 0) {
        const statusSheetData = [
          ['Status', 'Count', 'Percentage'],
          ...reportData.orderStatus.map(s => [
            s.status,
            s.count,
            `${s.percentage.toFixed(1)}%`
          ])
        ];
        const ws5 = XLSX.utils.aoa_to_sheet(statusSheetData);
        XLSX.utils.book_append_sheet(wb, ws5, 'Order Status');
      }

      XLSX.writeFile(wb, `minute-burger-report-${reportData.period}-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Report exported as Excel');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = () => {
    if (!reportData) return;
    
    setExporting(true);
    try {
      const doc = new jsPDF();
      let pageHeight = doc.internal.pageSize.height;
      let yOffset = 20;

      // Title
      doc.setFontSize(24);
      doc.setTextColor(200, 0, 0);
      doc.text('Minute Burger Report', 14, yOffset);
      yOffset += 10;

      // Report Info
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Period: ${reportData.period}`, 14, yOffset);
      yOffset += 6;
      doc.text(`Date Range: ${reportData.fromDate} to ${reportData.toDate}`, 14, yOffset);
      yOffset += 6;
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yOffset);
      yOffset += 15;

      // Summary
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Summary', 14, yOffset);
      yOffset += 8;

      const summaryData = [
        ['Total Orders', reportData.summary.totalOrders.toString()],
        ['Total Revenue', `₱${reportData.summary.totalRevenue.toFixed(2)}`],
        ['Average Order Value', `₱${reportData.summary.averageOrderValue.toFixed(2)}`],
        ['Total Customers', reportData.summary.totalCustomers.toString()],
        ['New Customers', reportData.summary.newCustomers.toString()],
        ['Returning Customers', reportData.summary.returningCustomers.toString()],
        ['Repeat Rate', `${reportData.customerMetrics.repeatRate.toFixed(1)}%`],
        ['Completed Orders', reportData.summary.completedOrders.toString()],
        ['Cancelled Orders', reportData.summary.cancelledOrders.toString()],
        ['Peak Hour', `${reportData.summary.peakHour}:00`],
        ['Avg Prep Time', `${reportData.summary.avgPrepTime} min`],
        ['Customer LTV', `₱${reportData.customerMetrics.lifetimeValue.toFixed(2)}`],
      ];

      autoTable(doc, {
        startY: yOffset,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [200, 0, 0] }
      });

      yOffset = (doc as any).lastAutoTable.finalY + 15;

      // Check if we need a new page
      if (yOffset > pageHeight - 60) {
        doc.addPage();
        yOffset = 20;
      }

      // Top Products
      if (reportData.topProducts.length > 0) {
        doc.text('Top Products', 14, yOffset);
        yOffset += 8;

        const productsData = reportData.topProducts.map(p => [
          p.name,
          p.category,
          p.quantity.toString(),
          `₱${p.revenue.toFixed(2)}`
        ]);

        autoTable(doc, {
          startY: yOffset,
          head: [['Product', 'Category', 'Qty', 'Revenue']],
          body: productsData,
          theme: 'striped',
          headStyles: { fillColor: [200, 0, 0] }
        });

        yOffset = (doc as any).lastAutoTable.finalY + 15;
      }

      // Check page again
      if (yOffset > pageHeight - 60) {
        doc.addPage();
        yOffset = 20;
      }

      // Category Revenue
      if (reportData.categoryRevenue.length > 0) {
        doc.text('Revenue by Category', 14, yOffset);
        yOffset += 8;

        const categoryData = reportData.categoryRevenue.map(c => [
          c.category,
          c.orders.toString(),
          `₱${c.revenue.toFixed(2)}`,
          `${c.percentage.toFixed(1)}%`
        ]);

        autoTable(doc, {
          startY: yOffset,
          head: [['Category', 'Orders', 'Revenue', '%']],
          body: categoryData,
          theme: 'striped',
          headStyles: { fillColor: [200, 0, 0] }
        });
      }

      doc.save(`minute-burger-report-${reportData.period}-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Report exported as PDF');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive business intelligence and reporting</p>
        </div>
      </div>

      {/* Report Controls */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-48">
            <Label>Report Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {period === 'custom' && (
            <>
              <div className="w-full sm:w-48">
                <Label>From</Label>
                <Input 
                  type="date" 
                  value={fromDate} 
                  onChange={(e) => setFromDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="w-full sm:w-48">
                <Label>To</Label>
                <Input 
                  type="date" 
                  value={toDate} 
                  onChange={(e) => setToDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </>
          )}
          
          <Button onClick={generateReport} disabled={loading} className="sm:ml-auto bg-red-600 hover:bg-red-700 text-white">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <BarChart3 className="h-4 w-4 mr-2" />
            )}
            Generate Report
          </Button>
          
          {reportData && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV} disabled={exporting}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={exportToPDF} disabled={exporting}>
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={() => window.print()} disabled={exporting}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Report Display */}
      {reportData ? (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{reportData.summary.totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.summary.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </Card>
            
            <Card className="p-4">
              <p className="text-2xl font-bold">{formatCurrency(reportData.summary.averageOrderValue)}</p>
              <p className="text-xs text-muted-foreground">Avg Order Value</p>
            </Card>
            
            <Card className="p-4">
              <p className="text-2xl font-bold">{reportData.summary.totalCustomers}</p>
              <p className="text-xs text-muted-foreground">Customers</p>
              <p className="text-xs text-green-600">+{reportData.summary.newCustomers} new</p>
            </Card>
            
            <Card className="p-4">
              <p className="text-2xl font-bold text-green-600">{reportData.summary.completedOrders}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </Card>
            
            <Card className="p-4">
              <p className="text-2xl font-bold text-orange-600">{reportData.summary.pendingOrders + reportData.summary.preparingOrders}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </Card>
            
            <Card className="p-4">
              <p className="text-2xl font-bold text-red-600">{reportData.summary.cancelledOrders}</p>
              <p className="text-xs text-muted-foreground">Cancelled</p>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Daily Performance Chart */}
                <Card className="p-6">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-primary" />
                    Daily Performance
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={reportData.dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: any, name: string) => {
                          if (name === 'revenue') return formatCurrency(value);
                          return value;
                        }}
                      />
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
                </Card>

                {/* Order Status Pie Chart */}
                <Card className="p-6">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Order Status Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={reportData.orderStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="status"
                        label={(e) => `${e.status}: ${e.percentage.toFixed(0)}%`}
                      >
                        {reportData.orderStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name: string, props: any) => {
                          if (name === 'percentage') return `${value.toFixed(1)}%`;
                          return value;
                        }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Customer Metrics */}
              <Card className="p-6">
                <h3 className="font-heading font-semibold mb-4">Customer Insights</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Lifetime Value</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(reportData.customerMetrics.lifetimeValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Repeat Rate</p>
                    <p className="text-2xl font-bold text-green-600">{formatPercent(reportData.customerMetrics.repeatRate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Orders/Customer</p>
                    <p className="text-2xl font-bold">{reportData.customerMetrics.avgOrdersPerCustomer.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Peak Hour</p>
                    <p className="text-2xl font-bold text-orange-600">{reportData.summary.peakHour}:00</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Sales Tab */}
            <TabsContent value="sales" className="space-y-6 mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Hourly Distribution */}
                <Card className="p-6">
                  <h3 className="font-heading font-semibold mb-4">Hourly Order Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.hourlyDistribution}>
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

                {/* Category Revenue */}
                <Card className="p-6">
                  <h3 className="font-heading font-semibold mb-4">Revenue by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.categoryRevenue}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="revenue"
                        nameKey="category"
                        label={(e) => `${e.category}: ${e.percentage.toFixed(0)}%`}
                      >
                        {reportData.categoryRevenue.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="mt-6">
              <Card className="p-6">
                <h3 className="font-heading font-semibold mb-4">Top Selling Products</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Rank</th>
                        <th className="text-left py-3">Product</th>
                        <th className="text-left py-3">Category</th>
                        <th className="text-right py-3">Quantity</th>
                        <th className="text-right py-3">Revenue</th>
                        <th className="text-right py-3">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.topProducts.map((product, index) => {
                        const percentage = (product.revenue / reportData.summary.totalRevenue) * 100;
                        return (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                  index === 1 ? 'bg-gray-100 text-gray-700' : 
                                  index === 2 ? 'bg-orange-100 text-orange-700' : 
                                  'bg-muted'}`}>
                                {index + 1}
                              </div>
                            </td>
                            <td className="py-3 font-medium">{product.name}</td>
                            <td className="py-3 text-muted-foreground">{product.category}</td>
                            <td className="py-3 text-right">{formatNumber(product.quantity)}</td>
                            <td className="py-3 text-right font-medium text-green-600">{formatCurrency(product.revenue)}</td>
                            <td className="py-3 text-right text-muted-foreground">{percentage.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-heading font-semibold mb-4">Customer Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">New Customers</span>
                        <span className="text-sm font-bold text-green-600">{reportData.summary.newCustomers}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-600 rounded-full h-2"
                          style={{ width: `${(reportData.summary.newCustomers / reportData.summary.totalCustomers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Returning Customers</span>
                        <span className="text-sm font-bold text-blue-600">{reportData.summary.returningCustomers}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${(reportData.summary.returningCustomers / reportData.summary.totalCustomers) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-heading font-semibold mb-4">Customer Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Repeat Rate</span>
                      <span className="font-bold">{formatPercent(reportData.customerMetrics.repeatRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Orders per Customer</span>
                      <span className="font-bold">{reportData.customerMetrics.avgOrdersPerCustomer.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer Lifetime Value</span>
                      <span className="font-bold text-primary">{formatCurrency(reportData.customerMetrics.lifetimeValue)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="mt-6">
              <Card className="p-6">
                <h3 className="font-heading font-semibold mb-4">Daily Statistics</h3>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b">
                        <th className="text-left py-3">Date</th>
                        <th className="text-right py-3">Orders</th>
                        <th className="text-right py-3">Revenue</th>
                        <th className="text-right py-3">Customers</th>
                        <th className="text-right py-3">Avg Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.dailyStats.map((day, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="py-3">{new Date(day.date).toLocaleDateString()}</td>
                          <td className="py-3 text-right">{day.orders}</td>
                          <td className="py-3 text-right font-medium text-green-600">{formatCurrency(day.revenue)}</td>
                          <td className="py-3 text-right">{day.customers}</td>
                          <td className="py-3 text-right">{day.orders > 0 ? formatCurrency(day.revenue / day.orders) : '₱0.00'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card className="p-16 text-center">
          <BarChart3 className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-heading font-semibold mb-2">No Report Generated</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Select a time period and click "Generate Report" to view comprehensive business analytics and insights
          </p>
          <Button onClick={generateReport} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <BarChart3 className="h-4 w-4 mr-2" />
            )}
            Generate Your First Report
          </Button>
        </Card>
      )}
    </AdminLayout>
  );
};

export default AdminReports;