import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { adminAPI } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Loader2, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag, 
  DollarSign,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

interface CustomerStats {
  order_count: number;
  total_spent: number;
  average_order_value: number;
  last_order_date?: string;
}

interface CustomerWithStats extends Customer {
  stats: CustomerStats;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [search, customers]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Fetch users (you'll need to add this endpoint to your adminAPI)
      // For now, we'll fetch from orders to get customer data
      const ordersRes = await adminAPI.getOrders();
      const orders = ordersRes.data;
      
      // Extract unique customers from orders
      const customerMap = new Map<string, CustomerWithStats>();
      
      orders.forEach((order: any) => {
        const email = order.customer_email;
        if (!email) return;
        
        if (!customerMap.has(email)) {
          customerMap.set(email, {
            id: email, // Using email as ID temporarily
            username: email.split('@')[0],
            email: email,
            first_name: order.customer_name?.split(' ')[0] || '',
            last_name: order.customer_name?.split(' ').slice(1).join(' ') || '',
            phone: order.customer_phone || '',
            is_staff: false,
            is_superuser: false,
            is_active: true,
            date_joined: order.created_at,
            last_login: undefined,
            stats: {
              order_count: 0,
              total_spent: 0,
              average_order_value: 0,
              last_order_date: undefined
            }
          });
        }
        
        const customer = customerMap.get(email)!;
        customer.stats.order_count += 1;
        customer.stats.total_spent += parseFloat(order.total_amount || '0');
        customer.stats.average_order_value = customer.stats.total_spent / customer.stats.order_count;
        customer.stats.last_order_date = order.created_at;
      });
      
      const customersArray = Array.from(customerMap.values());
      
      // Calculate stats
      const totalOrders = customersArray.reduce((sum, c) => sum + c.stats.order_count, 0);
      const totalRevenue = customersArray.reduce((sum, c) => sum + c.stats.total_spent, 0);
      
      setCustomers(customersArray);
      setFilteredCustomers(customersArray);
      setStats({
        totalCustomers: customersArray.length,
        activeCustomers: customersArray.length,
        totalOrders,
        totalRevenue
      });
      
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!search.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = customers.filter(c => 
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchLower) ||
      c.email?.toLowerCase().includes(searchLower) ||
      c.phone?.toLowerCase().includes(searchLower)
    );
    
    setFilteredCustomers(filtered);
  };

  const formatCurrency = (amount: number): string => {
    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and view customer information</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold mt-1">{stats.totalCustomers}</p>
            </div>
            <Users className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Customers</p>
              <p className="text-2xl font-bold mt-1">{stats.activeCustomers}</p>
            </div>
            <User className="h-8 w-8 text-success opacity-50" />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-warning opacity-50" />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-info opacity-50" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search customers..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10"
        />
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No customers found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map((customer, index) => (
            <Card key={customer.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">
                        {customer.first_name?.[0] || customer.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {customer.first_name} {customer.last_name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {customer.email}
                        </span>
                        {customer.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {customer.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      {customer.stats.order_count} orders
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {formatCurrency(customer.stats.total_spent)}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Joined {formatDate(customer.date_joined)}
                    </span>
                  </div>

                  {/* Expanded Details */}
                  {expandedCustomer === index && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Avg Order Value</p>
                          <p className="font-medium">{formatCurrency(customer.stats.average_order_value)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Order</p>
                          <p className="font-medium">{formatDate(customer.stats.last_order_date)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Username</p>
                          <p className="font-medium">@{customer.username}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setExpandedCustomer(expandedCustomer === index ? null : index)}
                >
                  {expandedCustomer === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCustomers;