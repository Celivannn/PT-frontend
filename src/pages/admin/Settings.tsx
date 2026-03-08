import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Save,
  Store,
  Clock,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  taxRate: number;
  currency: string;
  timezone: string;
}

interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

interface PaymentSettings {
  cashOnPickup: boolean;
  gcashEnabled: boolean;
  cardPayments: boolean;
  paymentInstructions: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderConfirmation: boolean;
  orderStatusUpdate: boolean;
}

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('store');

  // Store Settings
  const [store, setStore] = useState<StoreSettings>({
    storeName: 'Minute Burger',
    storeEmail: 'info@minuteburger.com',
    storePhone: '09171234567',
    storeAddress: '123 Main Street, Manila',
    taxRate: 12,
    currency: 'PHP',
    timezone: 'Asia/Manila'
  });

  // Business Hours
  const [hours, setHours] = useState<BusinessHours>({
    monday: { open: '09:00', close: '21:00', closed: false },
    tuesday: { open: '09:00', close: '21:00', closed: false },
    wednesday: { open: '09:00', close: '21:00', closed: false },
    thursday: { open: '09:00', close: '21:00', closed: false },
    friday: { open: '09:00', close: '22:00', closed: false },
    saturday: { open: '10:00', close: '22:00', closed: false },
    sunday: { open: '10:00', close: '20:00', closed: true }
  });

  // Payment Settings
  const [payment, setPayment] = useState<PaymentSettings>({
    cashOnPickup: true,
    gcashEnabled: false,
    cardPayments: false,
    paymentInstructions: 'Pay when you pick up your order at the store.'
  });

  // Notification Settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    orderConfirmation: true,
    orderStatusUpdate: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // This would fetch from your backend settings endpoints
      // For now, we'll just simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
      setLoading(false);
    }
  };

  const saveStoreSettings = async () => {
    setSaving(true);
    try {
      // This would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Store settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const saveHoursSettings = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Business hours saved successfully');
    } catch (error) {
      console.error('Error saving hours:', error);
      toast.error('Failed to save business hours');
    } finally {
      setSaving(false);
    }
  };

  const savePaymentSettings = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Payment settings saved successfully');
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast.error('Failed to save payment settings');
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification settings saved successfully');
    } catch (error) {
      console.error('Error saving notifications:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-3xl font-heading font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your store and system preferences</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full">
          <TabsTrigger value="store" className="gap-2">
            <Store className="h-4 w-4" /> Store
          </TabsTrigger>
          <TabsTrigger value="hours" className="gap-2">
            <Clock className="h-4 w-4" /> Hours
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="h-4 w-4" /> Payment
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Shield className="h-4 w-4" /> System
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">Store Information</h3>
            
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={store.storeName}
                    onChange={e => setStore({ ...store, storeName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={store.storeEmail}
                    onChange={e => setStore({ ...store, storeEmail: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="storePhone">Phone</Label>
                <Input
                  id="storePhone"
                  value={store.storePhone}
                  onChange={e => setStore({ ...store, storePhone: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="storeAddress">Address</Label>
                <Input
                  id="storeAddress"
                  value={store.storeAddress}
                  onChange={e => setStore({ ...store, storeAddress: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    value={store.taxRate}
                    onChange={e => setStore({ ...store, taxRate: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={store.currency}
                    onChange={e => setStore({ ...store, currency: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button 
                onClick={saveStoreSettings} 
                disabled={saving}
                className="mt-4"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Store Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="hours">
          <Card className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">Business Hours</h3>
            
            <div className="space-y-4 max-w-md">
              {Object.entries(hours).map(([day, schedule]) => (
                <div key={day} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-24 font-medium capitalize">{day}</div>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <Switch
                      checked={!schedule.closed}
                      onCheckedChange={(checked) => 
                        setHours(h => ({
                          ...h,
                          [day]: { ...h[day as keyof BusinessHours], closed: !checked }
                        }))
                      }
                    />
                    <span className="text-sm">
                      {schedule.closed ? 'Closed' : 'Open'}
                    </span>
                  </div>

                  {!schedule.closed && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={schedule.open}
                        onChange={(e) => 
                          setHours(h => ({
                            ...h,
                            [day]: { ...h[day as keyof BusinessHours], open: e.target.value }
                          }))
                        }
                        className="w-24"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={schedule.close}
                        onChange={(e) => 
                          setHours(h => ({
                            ...h,
                            [day]: { ...h[day as keyof BusinessHours], close: e.target.value }
                          }))
                        }
                        className="w-24"
                      />
                    </div>
                  )}
                </div>
              ))}

              <Button 
                onClick={saveHoursSettings} 
                disabled={saving}
                className="mt-4"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Business Hours
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">Payment Methods</h3>
            
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Cash on Pickup</p>
                    <p className="text-sm text-muted-foreground">Customers pay when they pick up</p>
                  </div>
                </div>
                <Switch
                  checked={payment.cashOnPickup}
                  onCheckedChange={(checked) => setPayment({ ...payment, cashOnPickup: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <img src="/gcash-logo.png" alt="GCash" className="h-5 w-5" />
                  <div>
                    <p className="font-medium">GCash</p>
                    <p className="text-sm text-muted-foreground">Mobile payment via GCash</p>
                  </div>
                </div>
                <Switch
                  checked={payment.gcashEnabled}
                  onCheckedChange={(checked) => setPayment({ ...payment, gcashEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">Online card payments</p>
                  </div>
                </div>
                <Switch
                  checked={payment.cardPayments}
                  onCheckedChange={(checked) => setPayment({ ...payment, cardPayments: checked })}
                />
              </div>

              <div className="mt-6">
                <Label htmlFor="paymentInstructions">Payment Instructions</Label>
                <Input
                  id="paymentInstructions"
                  value={payment.paymentInstructions}
                  onChange={e => setPayment({ ...payment, paymentInstructions: e.target.value })}
                  className="mt-1"
                  placeholder="Instructions for customers..."
                />
              </div>

              <Button 
                onClick={savePaymentSettings} 
                disabled={saving}
                className="mt-4"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Payment Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">Notification Preferences</h3>
            
            <div className="space-y-4 max-w-md">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-muted-foreground">Send confirmation when order is placed</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.orderConfirmation}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, orderConfirmation: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Status Updates</p>
                    <p className="text-sm text-muted-foreground">Send updates when order status changes</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.orderStatusUpdate}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, orderStatusUpdate: checked })}
                />
              </div>

              <Button 
                onClick={saveNotificationSettings} 
                disabled={saving}
                className="mt-4"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Notification Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">System Configuration</h3>
            
            <div className="space-y-4 max-w-md">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">System Information</p>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Version: 1.0.0</p>
                  <p>Environment: Production</p>
                  <p>Last Updated: March 8, 2026</p>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">Security</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <Switch checked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Timeout (minutes)</span>
                    <Input type="number" defaultValue="30" className="w-20" />
                  </div>
                </div>
              </div>

              <Button className="mt-4">
                <Save className="h-4 w-4 mr-2" />
                Save System Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;