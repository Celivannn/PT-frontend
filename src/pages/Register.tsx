import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

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
      toast.success('Account created successfully!');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-0 mb-4 group">
            <img 
              src="/logo.png" 
              alt="Minute Burger" 
              className="h-12 w-auto transition-transform group-hover:scale-105"
            />
            <span className="text-2xl font-heading font-bold">
              <span className="text-red-600">Minute</span>
              <span className="text-gray-900">Burger</span>
            </span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join us to start ordering your favorite burgers</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-4 border border-gray-100">
          {/* Name Fields - Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-gray-700 font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-red-500" />
                First Name
              </Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={(e) => update('first_name', e.target.value)}
                placeholder="John"
                required
                className="pl-4 py-5 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-gray-700 font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-red-500" />
                Last Name
              </Label>
              <Input
                id="last_name"
                value={form.last_name}
                onChange={(e) => update('last_name', e.target.value)}
                placeholder="Doe"
                required
                className="pl-4 py-5 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all"
              />
            </div>
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700 font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-red-500" />
              Username
            </Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => update('username', e.target.value)}
              placeholder="Choose a username"
              required
              className="pl-4 py-5 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-red-500" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="john@example.com"
              required
              className="pl-4 py-5 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-500" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="Create a strong password"
              required
              className="pl-4 py-5 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-2 py-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="w-4 h-4 mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
              I agree to the{' '}
              <Link to="/terms" className="text-red-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-5 text-lg font-heading font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create Account
              </span>
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-400">already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm">
            <Link
              to="/login/customer"
              className="text-red-600 font-medium hover:text-red-700 hover:underline transition-all"
            >
              Sign in to your account
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-red-600 hover:underline">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;