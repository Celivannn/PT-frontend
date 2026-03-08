import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, Lock, UserCog, LogIn, Server } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo and Header - REMOVED brightness-0 invert */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-0 mb-6 group">
            <img 
              src="/logo.png" 
              alt="Minute Burger" 
              className="h-16 w-auto transition-transform group-hover:scale-105"
            />
            <span className="text-2xl font-heading font-bold">
              <span className="text-red-500">Minute</span>
              <span className="text-white">Burger</span>
            </span>
          </Link>
          
          {/* Admin Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 rounded-full border border-red-600/20 mb-4">
            <Server className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">Administrator Access</span>
          </div>
          
          <h1 className="text-2xl font-heading font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-2">Secure access for authorized personnel only</p>
        </div>

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-700">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 p-3 bg-red-600/10 rounded-lg border border-red-600/20">
            <Shield className="h-4 w-4 text-red-500" />
            <span className="text-xs text-slate-300">Protected area · Admin credentials required</span>
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-300 font-medium flex items-center gap-2">
              <UserCog className="h-4 w-4 text-red-500" />
              Admin Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                className="pl-4 py-6 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/50 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300 font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-500" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="pl-4 py-6 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/50 transition-all"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-600 focus:ring-red-500/50 focus:ring-offset-0"
              />
              <Label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                Remember me
              </Label>
            </div>
            <Link
              to="/admin/forgot-password"
              className="text-sm text-red-500 hover:text-red-400 font-medium hover:underline transition-all"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-heading font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn className="h-5 w-5" />
                Access Admin Dashboard
              </span>
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-800 text-slate-400">secure access</span>
            </div>
          </div>

          {/* Customer Login Link */}
          <div className="text-center">
            <Link
              to="/login/customer"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors group"
            >
              <span>Not an admin?</span>
              <span className="font-medium text-red-500 group-hover:text-red-400">Customer Login</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
            <Shield className="h-3 w-3" />
            This area is restricted to authorized administrators only
          </p>
          <p className="text-xs text-slate-600 mt-2">
            © {new Date().getFullYear()} Minute Burger. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;