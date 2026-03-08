import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getProfile()
      .then(({ data }) => setProfile(data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CustomerLayout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></CustomerLayout>;

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center mb-8">
          <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-bold">{profile?.first_name} {profile?.last_name}</h1>
          <p className="text-muted-foreground text-sm">{profile?.email}</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <Label>Username</Label>
            <Input value={profile?.username || ''} readOnly className="mt-1 bg-muted" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>First Name</Label>
              <Input value={profile?.first_name || ''} readOnly className="mt-1 bg-muted" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={profile?.last_name || ''} readOnly className="mt-1 bg-muted" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input value={profile?.email || ''} readOnly className="mt-1 bg-muted" />
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ProfilePage;
