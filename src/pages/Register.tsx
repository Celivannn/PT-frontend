import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/menu');
    } catch (err: any) {
      const errors = err.response?.data;
      const msg = errors ? Object.values(errors).flat().join(', ') : 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-heading font-bold text-primary">🍔 Minute Burger</Link>
          <h1 className="text-2xl font-heading font-bold mt-4">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join us to start ordering</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-lg p-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>First Name</Label>
              <Input value={form.first_name} onChange={(e) => update('first_name', e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={form.last_name} onChange={(e) => update('last_name', e.target.value)} required className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Username</Label>
            <Input value={form.username} onChange={(e) => update('username', e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login/customer" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
