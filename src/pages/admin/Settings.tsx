import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  DollarSign,
  Smartphone,
  Package,
  Users,
  Moon,
  Sun,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Settings as SettingsIcon,
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  taxRate: number;
  currency: string;
  timezone: string;
  logo?: string;
  favicon?: string;
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
  gcashNumber?: string;
  cardFee?: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderConfirmation: boolean;
  orderStatusUpdate: boolean;
  promotionalEmails: boolean;
  adminAlerts: boolean;
}

interface SystemSettings {
  version: string;
  environment: 'production' | 'staging' | 'development';
  lastUpdated: string;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maintenanceMode: boolean;
  debugMode: boolean;
  backupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('store');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Store Settings
  const [store, setStore] = useState<StoreSettings>({
    storeName: 'Minute Burger',
    storeEmail: 'info@minuteburger.com',
    storePhone: '09171234567',
    storeAddress: '123 Main Street, Manila',
    taxRate: 12,
    currency: 'PHP',
    timezone: 'Asia/Manila',
    logo: '/logo.png'
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
    paymentInstructions: 'Pay when you pick up your order at the store.',
    gcashNumber: '09123456789',
    cardFee: 2.5
  });

  // Notification Settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    orderConfirmation: true,
    orderStatusUpdate: true,
    promotionalEmails: false,
    adminAlerts: true
  });

  // System Settings
  const [system, setSystem] = useState<SystemSettings>({
    version: '1.0.0',
    environment: 'production',
    lastUpdated: 'March 8, 2026',
    twoFactorAuth: false,
    sessionTimeout: 30,
    maintenanceMode: false,
    debugMode: false,
    backupEnabled: true,
    backupFrequency: 'daily'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
      setLoading(false);
    }
  };

  const handleSave = async (section: string, saveFunction: () => Promise<void>) => {
    setSavingSection(section);
    try {
      await saveFunction();
      setUnsavedChanges(false);
      toast.success(`${section} settings saved successfully`);
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      toast.error(`Failed to save ${section} settings`);
    } finally {
      setSavingSection(null);
    }
  };

  const saveStoreSettings = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Store settings saved:', store);
  };

  const saveHoursSettings = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Hours settings saved:', hours);
  };

  const savePaymentSettings = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Payment settings saved:', payment);
  };

  const saveNotificationSettings = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Notification settings saved:', notifications);
  };

  const saveSystemSettings = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('System settings saved:', system);
  };

  const handleMaintenanceMode = () => {
    setSystem(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
    toast.info(`Maintenance mode ${!system.maintenanceMode ? 'enabled' : 'disabled'}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-red-600 mx-auto mb-4" />
              <div className="absolute inset-0 animate-ping">
                <div className="h-16 w-16 rounded-full bg-red-200 mx-auto"></div>
              </div>
            </div>
            <p className="text-muted-foreground animate-pulse">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  return (
    <AdminLayout>
      {/* Header with Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Configure your store and system preferences
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {system.maintenanceMode && (
            <Badge variant="destructive" className="animate-pulse">
              Maintenance Mode
            </Badge>
          )}
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-lg p-2 shadow-sm border sticky top-20 z-10">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full bg-transparent">
            <TabsTrigger value="store" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Store className="h-4 w-4 mr-2" /> Store
            </TabsTrigger>
            <TabsTrigger value="hours" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Clock className="h-4 w-4 mr-2" /> Hours
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <CreditCard className="h-4 w-4 mr-2" /> Payment
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Bell className="h-4 w-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" /> System
            </TabsTrigger>
            <TabsTrigger value="backup" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Database className="h-4 w-4 mr-2" /> Backup
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Store Settings */}
        <TabsContent value="store">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Settings */}
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-heading font-semibold">Store Information</h3>
                  <p className="text-sm text-muted-foreground">Manage your store details and preferences</p>
                </div>
                <Button 
                  onClick={() => handleSave('Store', saveStoreSettings)}
                  disabled={savingSection === 'Store'}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {savingSection === 'Store' ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>

              <div className="space-y-6">
                {/* Logo Upload */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg bg-red-100 border-2 border-dashed border-red-300 flex items-center justify-center">
                      {store.logo ? (
                        <img src={store.logo} alt="Store logo" className="w-20 h-20 object-contain" />
                      ) : (
                        <Store className="h-8 w-8 text-red-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label>Store Logo</Label>
                    <p className="text-sm text-muted-foreground mb-2">Upload a square logo for your store</p>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                      Change Logo
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName" className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-red-500" />
                      Store Name
                    </Label>
                    <Input
                      id="storeName"
                      value={store.storeName}
                      onChange={e => setStore({ ...store, storeName: e.target.value })}
                      className="focus-visible:ring-red-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-red-500" />
                      Email Address
                    </Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={store.storeEmail}
                      onChange={e => setStore({ ...store, storeEmail: e.target.value })}
                      className="focus-visible:ring-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storePhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    Phone Number
                  </Label>
                  <Input
                    id="storePhone"
                    value={store.storePhone}
                    onChange={e => setStore({ ...store, storePhone: e.target.value })}
                    className="focus-visible:ring-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeAddress" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    Store Address
                  </Label>
                  <Input
                    id="storeAddress"
                    value={store.storeAddress}
                    onChange={e => setStore({ ...store, storeAddress: e.target.value })}
                    className="focus-visible:ring-red-500"
                  />
                </div>

                <Separator />

                {/* Business Configuration */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={store.taxRate}
                      onChange={e => setStore({ ...store, taxRate: Number(e.target.value) })}
                      className="focus-visible:ring-red-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={store.currency}
                      onChange={e => setStore({ ...store, currency: e.target.value })}
                      className="focus-visible:ring-red-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={store.timezone}
                      onChange={e => setStore({ ...store, timezone: e.target.value })}
                      className="focus-visible:ring-red-500"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Preview Card */}
            <Card className="p-6 bg-gradient-to-br from-red-50 to-white">
              <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4 text-red-600" />
                Store Preview
              </h4>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    {store.logo && (
                      <img src={store.logo} alt="Logo" className="h-10 w-10" />
                    )}
                    <div>
                      <p className="font-semibold">{store.storeName}</p>
                      <p className="text-xs text-muted-foreground">{store.storeEmail}</p>
                    </div>
                  </div>
                  <p className="text-sm">{store.storeAddress}</p>
                  <p className="text-sm mt-2">Tax: {store.taxRate}% • {store.currency}</p>
                </div>

                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="h-3 w-3" />
                  Changes will reflect immediately on the storefront
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="hours">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-heading font-semibold">Business Hours</h3>
                <p className="text-sm text-muted-foreground">Set your store's operating hours</p>
              </div>
              <Button 
                onClick={() => handleSave('Hours', saveHoursSettings)}
                disabled={savingSection === 'Hours'}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {savingSection === 'Hours' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Hours
              </Button>
            </div>

            <div className="space-y-3 max-w-2xl">
              {daysOfWeek.map(({ key, label }) => {
                const day = key as keyof BusinessHours;
                const schedule = hours[day];
                
                return (
                  <div key={key} className={cn(
                    "flex items-center gap-4 p-4 rounded-lg transition-colors",
                    schedule.closed ? "bg-red-50" : "bg-gray-50"
                  )}>
                    <div className="w-24 font-medium">{label}</div>
                    
                    <div className="flex items-center gap-3 flex-1">
                      <Switch
                        checked={!schedule.closed}
                        onCheckedChange={(checked) => 
                          setHours(h => ({
                            ...h,
                            [day]: { ...h[day], closed: !checked }
                          }))
                        }
                        className="data-[state=checked]:bg-red-600"
                      />
                      <span className={cn(
                        "text-sm font-medium",
                        schedule.closed ? "text-red-600" : "text-green-600"
                      )}>
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
                              [day]: { ...h[day], open: e.target.value }
                            }))
                          }
                          className="w-24 focus-visible:ring-red-500"
                        />
                        <span className="text-muted-foreground">—</span>
                        <Input
                          type="time"
                          value={schedule.close}
                          onChange={(e) => 
                            setHours(h => ({
                              ...h,
                              [day]: { ...h[day], close: e.target.value }
                            }))
                          }
                          className="w-24 focus-visible:ring-red-500"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Timezone: {store.timezone}</p>
                  <p className="text-sm text-blue-600">
                    All hours are displayed in your store's timezone
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-heading font-semibold">Payment Methods</h3>
                <Button 
                  onClick={() => handleSave('Payment', savePaymentSettings)}
                  disabled={savingSection === 'Payment'}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {savingSection === 'Payment' ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-red-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Cash on Pickup</p>
                      <p className="text-sm text-muted-foreground">Customers pay when they pick up</p>
                    </div>
                  </div>
                  <Switch
                    checked={payment.cashOnPickup}
                    onCheckedChange={(checked) => setPayment({ ...payment, cashOnPickup: checked })}
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-red-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">GCash</p>
                      <p className="text-sm text-muted-foreground">Mobile payment via GCash</p>
                    </div>
                  </div>
                  <Switch
                    checked={payment.gcashEnabled}
                    onCheckedChange={(checked) => setPayment({ ...payment, gcashEnabled: checked })}
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-red-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">Online card payments</p>
                    </div>
                  </div>
                  <Switch
                    checked={payment.cardPayments}
                    onCheckedChange={(checked) => setPayment({ ...payment, cardPayments: checked })}
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>

                {payment.gcashEnabled && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <Label htmlFor="gcashNumber">GCash Number</Label>
                    <Input
                      id="gcashNumber"
                      value={payment.gcashNumber}
                      onChange={e => setPayment({ ...payment, gcashNumber: e.target.value })}
                      className="mt-1 focus-visible:ring-red-500"
                      placeholder="09123456789"
                    />
                  </div>
                )}

                {payment.cardPayments && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <Label htmlFor="cardFee">Transaction Fee (%)</Label>
                    <Input
                      id="cardFee"
                      type="number"
                      step="0.1"
                      value={payment.cardFee}
                      onChange={e => setPayment({ ...payment, cardFee: Number(e.target.value) })}
                      className="mt-1 focus-visible:ring-red-500"
                    />
                  </div>
                )}

                <div className="mt-6">
                  <Label htmlFor="paymentInstructions">Payment Instructions</Label>
                  <Input
                    id="paymentInstructions"
                    value={payment.paymentInstructions}
                    onChange={e => setPayment({ ...payment, paymentInstructions: e.target.value })}
                    className="mt-1 focus-visible:ring-red-500"
                    placeholder="Instructions for customers..."
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
              <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-red-600" />
                Payment Summary
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="font-medium mb-2">Active Methods</p>
                  <div className="space-y-2">
                    {payment.cashOnPickup && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Cash on Pickup</span>
                      </div>
                    )}
                    {payment.gcashEnabled && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>GCash ({payment.gcashNumber})</span>
                      </div>
                    )}
                    {payment.cardPayments && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Card Payments ({payment.cardFee}% fee)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Payment method changes may take a few minutes to reflect on the storefront.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-heading font-semibold">Notification Preferences</h3>
                <Button 
                  onClick={() => handleSave('Notifications', saveNotificationSettings)}
                  disabled={savingSection === 'Notifications'}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {savingSection === 'Notifications' ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
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
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
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
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 border rounded-lg">
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
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Status Updates</p>
                      <p className="text-sm text-muted-foreground">Send updates when order status changes</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.orderStatusUpdate}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, orderStatusUpdate: checked })}
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Promotional Emails</p>
                      <p className="text-sm text-muted-foreground">Send marketing and promotional content</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.promotionalEmails}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, promotionalEmails: checked })}
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Admin Alerts</p>
                      <p className="text-sm text-muted-foreground">Notify admins of important events</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.adminAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, adminAlerts: checked })}
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
              <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600" />
                Notification Summary
              </h3>
              
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="font-medium mb-2">Active Channels</p>
                  <div className="space-y-2">
                    {notifications.emailNotifications && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span>Email notifications enabled</span>
                      </div>
                    )}
                    {notifications.smsNotifications && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-green-500" />
                        <span>SMS notifications enabled</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="font-medium mb-2">Events Tracked</p>
                  <div className="space-y-1 text-sm">
                    {notifications.orderConfirmation && <div>• Order confirmations</div>}
                    {notifications.orderStatusUpdate && <div>• Status updates</div>}
                    {notifications.adminAlerts && <div>• Admin alerts</div>}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-heading font-semibold">System Configuration</h3>
                <Button 
                  onClick={() => handleSave('System', saveSystemSettings)}
                  disabled={savingSection === 'System'}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {savingSection === 'System' ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Version</Label>
                    <Input value={system.version} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <div className="flex items-center gap-2">
                      <Badge className={cn(
                        "capitalize",
                        system.environment === 'production' && "bg-green-100 text-green-700",
                        system.environment === 'staging' && "bg-yellow-100 text-yellow-700",
                        system.environment === 'development' && "bg-blue-100 text-blue-700"
                      )}>
                        {system.environment}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <Input value={system.lastUpdated} readOnly className="bg-gray-50" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">Temporarily disable customer ordering</p>
                    </div>
                    <Switch
                      checked={system.maintenanceMode}
                      onCheckedChange={handleMaintenanceMode}
                      className="data-[state=checked]:bg-red-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <Switch
                      checked={system.twoFactorAuth}
                      onCheckedChange={(checked) => setSystem({ ...system, twoFactorAuth: checked })}
                      className="data-[state=checked]:bg-red-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Debug Mode</p>
                      <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
                    </div>
                    <Switch
                      checked={system.debugMode}
                      onCheckedChange={(checked) => setSystem({ ...system, debugMode: checked })}
                      className="data-[state=checked]:bg-red-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      max="120"
                      value={system.sessionTimeout}
                      onChange={e => setSystem({ ...system, sessionTimeout: Number(e.target.value) })}
                      className="w-32 focus-visible:ring-red-500"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
              <h3 className="text-lg font-heading font-semibold mb-4">System Health</h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="font-medium">All systems operational</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Database</span>
                      <span className="text-green-600">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">API Status</span>
                      <span className="text-green-600">Healthy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cache</span>
                      <span className="text-green-600">Active</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check for Updates
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-heading font-semibold mb-6">Backup Configuration</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Automatic Backups</p>
                      <p className="text-sm text-muted-foreground">Schedule regular database backups</p>
                    </div>
                  </div>
                  <Switch
                    checked={system.backupEnabled}
                    onCheckedChange={(checked) => setSystem({ ...system, backupEnabled: checked })}
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>

                {system.backupEnabled && (
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                        <Button
                          key={freq}
                          variant={system.backupFrequency === freq ? 'default' : 'outline'}
                          onClick={() => setSystem({ ...system, backupFrequency: freq })}
                          className={system.backupFrequency === freq ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Last Backup</p>
                      <p className="text-sm text-blue-600">March 8, 2026 at 02:00 AM</p>
                      <p className="text-xs text-blue-500 mt-1">Size: 45.2 MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Now
                  </Button>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
              <h3 className="text-lg font-heading font-semibold mb-4">Backup History</h3>
              
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-medium">Mar 8, 2026</p>
                  <p className="text-xs text-muted-foreground">02:00 AM • 45.2 MB</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-medium">Mar 7, 2026</p>
                  <p className="text-xs text-muted-foreground">02:00 AM • 44.8 MB</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-medium">Mar 6, 2026</p>
                  <p className="text-xs text-muted-foreground">02:00 AM • 44.1 MB</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Global Save Indicator */}
      {unsavedChanges && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
          <AlertCircle className="h-5 w-5" />
          <span>You have unsaved changes</span>
          <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
            <Save className="h-4 w-4 mr-2" />
            Save All
          </Button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettings;