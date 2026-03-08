import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(username, password);
      if (!user.is_staff) {
        toast.error('Access denied. Admin credentials required.');
        return;
      }
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-heading font-bold text-sidebar-primary">🍔 Minute Burger</Link>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="h-5 w-5 text-sidebar-primary" />
            <h1 className="text-2xl font-heading font-bold text-sidebar-foreground">Admin Login</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Access the admin dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-lg p-8 space-y-5">
          <div>
            <Label htmlFor="username">Admin Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter admin username" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required className="mt-1.5" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login/customer" className="hover:underline">Customer? Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
