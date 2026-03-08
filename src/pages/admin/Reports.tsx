import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  BarChart3, 
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  FileText
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
  Cell
} from 'recharts';
import { toast } from 'sonner';

// Import Excel and PDF libraries
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

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
  };
  dailyStats: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  categoryRevenue: Array<{
    category: string;
    revenue: number;
    orders: number;
  }>;
  orderStatus: Array<{
    status: string;
    count: number;
  }>;
}

interface AnalyticsItem {
  date: string;
  total_orders?: number;
  total_revenue?: number;
  average_order_value?: number;
  total_customers?: number;
  completed_orders?: number;
  cancelled_orders?: number;
  pending_orders?: number;
}

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [period, setPeriod] = useState('weekly');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const params: any = { period };
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;
      
      const { data } = await adminAPI.getAnalytics(params);
      const analyticsData: AnalyticsItem[] = Array.isArray(data) ? data : [];
      
      // Transform API data into report format
      const report: ReportData = {
        period,
        fromDate: fromDate || new Date().toISOString().split('T')[0],
        toDate: toDate || new Date().toISOString().split('T')[0],
        summary: {
          totalOrders: analyticsData.reduce((sum, item) => sum + (item.total_orders || 0), 0),
          totalRevenue: analyticsData.reduce((sum, item) => sum + (item.total_revenue || 0), 0),
          averageOrderValue: analyticsData.length > 0 
            ? analyticsData.reduce((sum, item) => sum + (item.average_order_value || 0), 0) / analyticsData.length 
            : 0,
          totalCustomers: analyticsData.reduce((sum, item) => sum + (item.total_customers || 0), 0),
          completedOrders: analyticsData.reduce((sum, item) => sum + (item.completed_orders || 0), 0),
          cancelledOrders: analyticsData.reduce((sum, item) => sum + (item.cancelled_orders || 0), 0),
        },
        dailyStats: analyticsData.map((item) => ({
          date: item.date,
          orders: item.total_orders || 0,
          revenue: item.total_revenue || 0,
        })),
        topProducts: [], // This would come from a separate endpoint
        categoryRevenue: [], // This would come from a separate endpoint
        orderStatus: [
          { status: 'Pending', count: analyticsData.reduce((sum, item) => sum + (item.pending_orders || 0), 0) },
          { status: 'Completed', count: analyticsData.reduce((sum, item) => sum + (item.completed_orders || 0), 0) },
          { status: 'Cancelled', count: analyticsData.reduce((sum, item) => sum + (item.cancelled_orders || 0), 0) },
        ].filter(s => s.count > 0),
      };
      
      setReportData(report);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData) return;
    
    setExporting(true);
    try {
      const summaryData: any[][] = [
        ['Minute Burger Report', ''],
        ['Period', reportData.period],
        ['Date Range', `${reportData.fromDate} to ${reportData.toDate}`],
        ['Generated', new Date().toLocaleString()],
        [],
        ['Summary Statistics', ''],
        ['Total Orders', reportData.summary.totalOrders],
        ['Total Revenue', `₱${reportData.summary.totalRevenue.toFixed(2)}`],
        ['Average Order Value', `₱${reportData.summary.averageOrderValue.toFixed(2)}`],
        ['Total Customers', reportData.summary.totalCustomers],
        ['Completed Orders', reportData.summary.completedOrders],
        ['Cancelled Orders', reportData.summary.cancelledOrders],
      ];
      
      if (reportData.dailyStats.length > 0) {
        summaryData.push(
          [],
          ['Daily Performance', 'Orders', 'Revenue'],
          ...reportData.dailyStats.map(d => [d.date, d.orders, `₱${d.revenue.toFixed(2)}`])
        );
      }
      
      if (reportData.orderStatus.length > 0) {
        summaryData.push(
          [],
          ['Order Status', 'Count'],
          ...reportData.orderStatus.map(s => [s.status, s.count])
        );
      }
      
      const ws = XLSX.utils.aoa_to_sheet(summaryData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      
      XLSX.writeFile(wb, `minute-burger-report-${reportData.period}-${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('Report exported as CSV');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = () => {
    if (!reportData) return;
    
    setExporting(true);
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(200, 0, 0);
      doc.text('Minute Burger Report', 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Period: ${reportData.period}`, 14, 32);
      doc.text(`Date Range: ${reportData.fromDate} to ${reportData.toDate}`, 14, 38);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 44);
      
      // Summary
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Summary', 14, 54);
      
      const summaryData = [
        ['Total Orders', reportData.summary.totalOrders.toString()],
        ['Total Revenue', `₱${reportData.summary.totalRevenue.toFixed(2)}`],
        ['Avg Order Value', `₱${reportData.summary.averageOrderValue.toFixed(2)}`],
        ['Total Customers', reportData.summary.totalCustomers.toString()],
        ['Completed Orders', reportData.summary.completedOrders.toString()],
        ['Cancelled Orders', reportData.summary.cancelledOrders.toString()],
      ];
      
      autoTable(doc, {
        startY: 58,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [200, 0, 0] }
      });
      
      // Daily Stats
      if (reportData.dailyStats.length > 0) {
        doc.text('Daily Performance', 14, (doc as any).lastAutoTable.finalY + 10);
        
        const dailyData = reportData.dailyStats.map(d => [
          d.date,
          d.orders.toString(),
          `₱${d.revenue.toFixed(2)}`
        ]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 14,
          head: [['Date', 'Orders', 'Revenue']],
          body: dailyData,
          theme: 'striped',
          headStyles: { fillColor: [200, 0, 0] }
        });
      }
      
      // Order Status
      if (reportData.orderStatus.length > 0) {
        doc.text('Order Status', 14, (doc as any).lastAutoTable.finalY + 10);
        
        const statusData = reportData.orderStatus.map(s => [s.status, s.count.toString()]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 14,
          head: [['Status', 'Count']],
          body: statusData,
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

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate and export business reports</p>
        </div>
      </div>

      {/* Report Controls */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-48">
            <Label>Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
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
          
          <Button onClick={generateReport} disabled={loading} className="sm:ml-auto">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <BarChart3 className="h-4 w-4 mr-2" />
            )}
            Generate Report
          </Button>
          
          {reportData && (
            <>
              <Button variant="outline" onClick={exportToCSV} disabled={exporting}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" onClick={exportToPDF} disabled={exporting}>
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Report Display */}
      {reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{reportData.summary.totalOrders}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(reportData.summary.totalRevenue)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(reportData.summary.averageOrderValue)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Customers</p>
              <p className="text-2xl font-bold">{reportData.summary.totalCustomers}</p>
            </Card>
            <Card className="p-4 bg-green-50">
              <p className="text-sm text-green-700">Completed</p>
              <p className="text-2xl font-bold text-green-700">{reportData.summary.completedOrders}</p>
            </Card>
            <Card className="p-4 bg-red-50">
              <p className="text-sm text-red-700">Cancelled</p>
              <p className="text-2xl font-bold text-red-700">{reportData.summary.cancelledOrders}</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Daily Performance Chart */}
            {reportData.dailyStats.length > 0 && (
              <Card className="p-6">
                <h3 className="font-heading font-semibold mb-4">Daily Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      name="Revenue"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Order Status Pie Chart */}
            {reportData.orderStatus.length > 0 && (
              <Card className="p-6">
                <h3 className="font-heading font-semibold mb-4">Order Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.orderStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                      label={(e) => `${e.status}: ${e.count}`}
                    >
                      {reportData.orderStatus.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>

          {/* Data Tables */}
          <Tabs defaultValue="daily" className="w-full">
            <TabsList>
              <TabsTrigger value="daily">Daily Stats</TabsTrigger>
              <TabsTrigger value="status">Order Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily">
              <Card className="p-6">
                <h3 className="font-heading font-semibold mb-4">Daily Statistics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Date</th>
                        <th className="text-right py-2">Orders</th>
                        <th className="text-right py-2">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.dailyStats.map((day, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{day.date}</td>
                          <td className="text-right py-2">{day.orders}</td>
                          <td className="text-right py-2 font-medium text-green-600">
                            {formatCurrency(day.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="status">
              <Card className="p-6">
                <h3 className="font-heading font-semibold mb-4">Order Status</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Status</th>
                        <th className="text-right py-2">Count</th>
                        <th className="text-right py-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.orderStatus.map((status, i) => {
                        const total = reportData.orderStatus.reduce((sum, s) => sum + s.count, 0);
                        const percentage = total > 0 ? ((status.count / total) * 100).toFixed(1) : '0';
                        
                        return (
                          <tr key={i} className="border-b">
                            <td className="py-2 capitalize">{status.status}</td>
                            <td className="text-right py-2">{status.count}</td>
                            <td className="text-right py-2">{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-heading font-semibold mb-2">No Report Generated</h3>
          <p className="text-muted-foreground mb-6">
            Select a period and click "Generate Report" to view analytics
          </p>
        </Card>
      )}
    </AdminLayout>
  );
};

export default AdminReports;