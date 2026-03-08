import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, LogIn } from 'lucide-react';

const CustomerLogin = () => {
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
      if (user.is_staff) {
        toast.error('Please use the admin login page');
        return;
      }
      toast.success('Welcome back!');
      navigate('/menu');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-0 mb-4 group">
            <img 
              src="/logo.png" 
              alt="Minute Burger" 
              className="h-16 w-auto transition-transform group-hover:scale-105"
            />
            <span className="text-2xl font-heading font-bold">
              <span className="text-red-600">Minute</span>
              <span className="text-gray-900">Burger</span>
            </span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your customer account to order your favorites</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700 font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-red-500" />
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="pl-4 py-6 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-500" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="pl-4 py-6 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                Remember me
              </Label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-all"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-heading font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn className="h-5 w-5" />
                Sign In
              </span>
            )}
          </Button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-red-600 font-semibold hover:text-red-700 hover:underline transition-all"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-400">or</span>
            </div>
          </div>

          {/* Admin Link */}
          <div className="text-center">
            <Link
              to="/login/admin"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Are you an admin? <span className="font-medium text-red-600">Login here</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-red-600 hover:underline">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;