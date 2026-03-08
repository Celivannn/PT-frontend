import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI, orderAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  User, 
  Loader2, 
  Mail, 
  Phone, 
  Calendar,
  ShoppingBag,
  TrendingUp,
  Edit2,
  Save,
  X,
  Package,
  Clock,
  CheckCircle
} from 'lucide-react';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_staff?: boolean;
  date_joined?: string;
  last_login?: string;
}

interface OrderStats {
  total_orders: number;
  total_spent: number;
  pending_orders: number;
  completed_orders: number;
  favorite_item?: string;
}

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total_orders: 0,
    total_spent: 0,
    pending_orders: 0,
    completed_orders: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login/customer');
      return;
    }
    fetchProfileData();
  }, [isAuthenticated]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Fetch profile
      const { data } = await authAPI.getProfile();
      setProfile(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || ''
      });

      // Fetch orders for stats
      const ordersResponse = await orderAPI.getOrders();
      const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : ordersResponse.data.results || [];
      
      const totalSpent = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total_amount), 0);
      const pendingOrders = orders.filter((o: any) => ['pending', 'confirmed', 'preparing'].includes(o.status)).length;
      const completedOrders = orders.filter((o: any) => o.status === 'completed').length;

      // Find favorite item
      const itemCounts: Record<string, number> = {};
      orders.forEach((order: any) => {
        order.items?.forEach((item: any) => {
          itemCounts[item.product_name] = (itemCounts[item.product_name] || 0) + item.quantity;
        });
      });
      
      const favoriteItem = Object.entries(itemCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];

      setOrderStats({
        total_orders: orders.length,
        total_spent: totalSpent,
        pending_orders: pendingOrders,
        completed_orders: completedOrders,
        favorite_item: favoriteItem
      });

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // API call to update profile
      await authAPI.updateProfile(formData);
      setProfile(prev => prev ? { ...prev, ...formData } : null);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      phone: profile?.phone || ''
    });
    setEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `₱${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mb-4" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account information and view order statistics</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-0 right-0 rounded-full"
                  onClick={() => toast.info('Profile picture upload coming soon!')}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>

              <h2 className="text-xl font-heading font-bold text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-gray-500 text-sm mb-4">@{profile?.username}</p>

              {profile?.is_staff && (
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">
                  Administrator
                </Badge>
              )}

              <div className="space-y-3 text-left mt-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profile?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profile?.phone || 'No phone added'}</span>
                </div>
                {profile?.date_joined && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Member since {formatDate(profile.date_joined)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/orders')}
              >
                <Package className="h-4 w-4 mr-2" />
                View Order History
              </Button>
            </Card>
          </div>

          {/* Right Column - Edit Profile & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-gray-900">Personal Information</h3>
                {!editing ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditing(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={!editing || saving}
                      className={!editing ? 'bg-gray-50' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      disabled={!editing || saving}
                      className={!editing ? 'bg-gray-50' : ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editing || saving}
                    className={!editing ? 'bg-gray-50' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="09123456789"
                    disabled={!editing || saving}
                    className={!editing ? 'bg-gray-50' : ''}
                  />
                </div>
              </div>
            </Card>

            {/* Order Statistics Card */}
            <Card className="p-6">
              <h3 className="font-heading font-semibold text-gray-900 mb-4">Order Statistics</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <ShoppingBag className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-heading font-bold text-blue-700">{orderStats.total_orders}</p>
                  <p className="text-xs text-blue-600">Total Orders</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-heading font-bold text-green-700">{orderStats.completed_orders}</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <Clock className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                  <p className="text-2xl font-heading font-bold text-yellow-700">{orderStats.pending_orders}</p>
                  <p className="text-xs text-yellow-600">Pending</p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <TrendingUp className="h-5 w-5 text-red-600 mx-auto mb-1" />
                  <p className="text-xl font-heading font-bold text-red-700">{formatPrice(orderStats.total_spent)}</p>
                  <p className="text-xs text-red-600">Total Spent</p>
                </div>
              </div>

              {orderStats.favorite_item && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Most Ordered Item</p>
                  <p className="text-lg font-heading font-semibold text-gray-900">{orderStats.favorite_item}</p>
                </div>
              )}

              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/orders')}
                  className="text-red-600 hover:text-red-700"
                >
                  View detailed order history →
                </Button>
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="p-6">
              <h3 className="font-heading font-semibold text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-600 hover:text-red-600 hover:border-red-200"
                  onClick={() => toast.info('Password change feature coming soon!')}
                >
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-600 hover:text-red-600 hover:border-red-200"
                  onClick={() => toast.info('Notification preferences coming soon!')}
                >
                  Notification Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      toast.info('Account deletion coming soon!');
                    }
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ProfilePage;