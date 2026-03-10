import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Loader2,
  ChevronRight,
  CheckCircle,
  Award,
  Truck,
  Star,
  Flame,
  Zap,
  Shield,
  Coffee,
  Heart
} from 'lucide-react';
import { productAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
  is_available: boolean;
  is_featured?: boolean;
  category_name?: string;
}

const Landing = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getProducts({ featured: true });
      setFeaturedProducts(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      {/* Custom 3D Animation Styles */}
      <style>{`
        @keyframes float-3d {
          0%, 100% { transform: translateZ(0px) translateY(0px) rotateX(0deg); }
          50% { transform: translateZ(50px) translateY(-20px) rotateX(5deg); }
        }
        
        @keyframes pulse-3d {
          0%, 100% { transform: scale(1) translateZ(0px); opacity: 0.5; }
          50% { transform: scale(1.3) translateZ(30px); opacity: 0.9; }
        }
        
        @keyframes bounce-3d {
          0%, 100% { transform: translateZ(0px) translateY(0); }
          50% { transform: translateZ(40px) translateY(-15px); }
        }
        
        @keyframes text-pop {
          0% { transform: translateZ(0px) scale(1); text-shadow: 0 0 0 rgba(255,255,255,0); }
          50% { transform: translateZ(60px) scale(1.1); text-shadow: 0 10px 20px rgba(0,0,0,0.3); }
          100% { transform: translateZ(0px) scale(1); text-shadow: 0 0 0 rgba(255,255,255,0); }
        }
        
        @keyframes slow-spin {
          from { transform: rotate(0deg) translateZ(0px) scale(1); }
          to { transform: rotate(360deg) translateZ(30px) scale(1.2); }
        }
        
        @keyframes rotate-3d {
          0% { transform: rotateY(0deg) rotateX(5deg); }
          50% { transform: rotateY(180deg) rotateX(15deg); }
          100% { transform: rotateY(360deg) rotateX(5deg); }
        }
        
        @keyframes tilt-3d {
          0%, 100% { transform: rotateX(0deg) rotateY(0deg) translateZ(0px); }
          25% { transform: rotateX(10deg) rotateY(5deg) translateZ(20px); }
          75% { transform: rotateX(-5deg) rotateY(-5deg) translateZ(10px); }
        }
        
        @keyframes glow-3d {
          0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.3), 0 0 40px rgba(220, 38, 38, 0.2), 0 0 60px rgba(220, 38, 38, 0.1); }
          50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.6), 0 0 60px rgba(220, 38, 38, 0.4), 0 0 80px rgba(220, 38, 38, 0.2); }
        }
        
        .animate-float-3d { animation: float-3d 6s ease-in-out infinite; }
        .animate-pulse-3d { animation: pulse-3d 3s ease-in-out infinite; }
        .animate-bounce-3d { animation: bounce-3d 2s ease-in-out infinite; }
        .animate-text-pop { animation: text-pop 3s ease-in-out infinite; }
        .animate-slow-spin { animation: slow-spin 20s linear infinite; }
        .animate-rotate-3d { animation: rotate-3d 10s linear infinite; }
        .animate-tilt-3d { animation: tilt-3d 8s ease-in-out infinite; }
        .animate-glow-3d { animation: glow-3d 2s ease-in-out infinite; }
        
        .perspective-1000 { perspective: 1000px; }
        .perspective-1500 { perspective: 1500px; }
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        
        .transform-gpu {
          transform: translate3d(0, 0, 0);
          -webkit-transform: translate3d(0, 0, 0);
        }
        
        .translate-z-5 { transform: translateZ(5px); }
        .translate-z-10 { transform: translateZ(10px); }
        .translate-z-20 { transform: translateZ(20px); }
        .translate-z-30 { transform: translateZ(30px); }
        .translate-z-40 { transform: translateZ(40px); }
        .translate-z-50 { transform: translateZ(50px); }
        .translate-z-60 { transform: translateZ(60px); }
        .-translate-z-10 { transform: translateZ(-10px); }
        .-translate-z-20 { transform: translateZ(-20px); }
        
        .rotate-y-5 { transform: rotateY(5deg); }
        .rotate-y-10 { transform: rotateY(10deg); }
        .rotate-y-180 { transform: rotateY(180deg); }
        .rotate-x-5 { transform: rotateX(5deg); }
        .rotate-x-10 { transform: rotateX(10deg); }
        
        .hover\\:rotate-y-0:hover { transform: rotateY(0deg); }
        .hover\\:rotate-x-0:hover { transform: rotateX(0deg); }
        .hover\\:translate-z-10:hover { transform: translateZ(10px); }
        .hover\\:translate-z-20:hover { transform: translateZ(20px); }
        .hover\\:translate-z-30:hover { transform: translateZ(30px); }
        .hover\\:translate-z-40:hover { transform: translateZ(40px); }
        .hover\\:translate-z-50:hover { transform: translateZ(50px); }
        .hover\\:-translate-z-20:hover { transform: translateZ(-20px); }
        
        .group:hover .group-hover\\:rotate-y-180 { transform: rotateY(180deg); }
        .group:hover .group-hover\\:bounce-3d { animation: bounce-3d 1s ease-in-out; }
        .group:hover .group-hover\\:scale-3d { transform: scale(1.1) translateZ(20px); }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
        
        .bg-3d-pattern {
          background-image: radial-gradient(circle at 20px 20px, rgba(255,255,255,0.1) 2px, transparent 2px);
          background-size: 40px 40px;
        }
        
        .text-3d {
          text-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.05);
        }
        
        .text-3d-red {
          text-shadow: 0 2px 4px rgba(220,38,38,0.3), 0 4px 8px rgba(220,38,38,0.2), 0 8px 16px rgba(220,38,38,0.1);
        }
        
        .shadow-3d {
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset;
        }
        
        .shadow-3d-hover:hover {
          box-shadow: 0 20px 30px -10px rgba(220,38,38,0.4), 0 0 0 2px rgba(220,38,38,0.2) inset;
        }
      `}</style>

      {/* 3D Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full mix-blend-multiply filter blur-3xl animate-float-3d`}
            style={{
              width: `${200 + i * 60}px`,
              height: `${200 + i * 60}px`,
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? 'rgba(220, 38, 38, 0.15)' : 'rgba(250, 204, 21, 0.15)'
              } 0%, transparent 70%)`,
              left: `${i * 8}%`,
              top: `${i * 5}%`,
              animationDelay: `${i * 0.3}s`,
              transform: `translateZ(${i * 30}px) rotateX(${i * 10}deg) rotateY(${i * 15}deg)`,
              zIndex: -1,
            }}
          />
        ))}
      </div>

      {/* Header with 3D Logo */}
      <header className="bg-white/80 backdrop-blur-md border-b shadow-lg sticky top-0 z-50 preserve-3d">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group perspective-1000">
            <div className="relative transform-gpu transition-all duration-700 group-hover:rotate-y-180 preserve-3d">
              <img 
                src="/logo.png" 
                alt="Minute Burger" 
                className="h-12 w-auto relative z-10 drop-shadow-2xl backface-hidden"
              />
              <div className="absolute inset-0 bg-red-500 rounded-full filter blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-3d" />
            </div>
            <span className="text-2xl font-heading font-bold transform-gpu translate-z-10 text-3d">
              <span className="text-red-600 text-3d-red">Minute</span>
              <span className="text-gray-900">Burger</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login/customer">
              <Button 
                variant="outline" 
                size="default" 
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:translate-z-10 shadow-lg hover:shadow-red-500/50 preserve-3d"
              >
                Customer Login
              </Button>
            </Link>
            <Link to="/login/admin">
              <Button 
                variant="outline" 
                size="default" 
                className="border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 transform hover:scale-110 hover:translate-z-10"
              >
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with 3D Parallax */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800 preserve-3d perspective-2000">
        {/* 3D Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-slow-spin bg-3d-pattern" style={{
            transform: 'translateZ(30px) rotateX(60deg)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content with 3D Text */}
            <div className="text-white space-y-8 transform-gpu translate-z-20 preserve-3d">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transform hover:scale-105 hover:translate-z-10 transition-all duration-300 shadow-lg animate-tilt-3d">
                <TrendingUp className="h-4 w-4 animate-bounce-3d" />
                <span className="text-sm font-medium">#1 Fastest Growing Burger Chain 2024</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight preserve-3d">
                Your Favorite
                <span className="text-yellow-300 block animate-text-pop">Burgers, Ready in Minutes</span>
              </h1>
              
              <p className="text-xl text-white/90 max-w-lg drop-shadow-lg transform-gpu translate-z-10">
                Join thousands of satisfied customers enjoying premium burgers made with 100% pure beef and fresh ingredients. Order online for quick pickup!
              </p>

              {/* 3D Stats Cards */}
              <div className="grid grid-cols-3 gap-6 pt-4 preserve-3d">
                {[
                  { value: '5K+', label: 'Happy Customers', icon: Users, color: 'text-blue-300' },
                  { value: '15min', label: 'Avg. Prep Time', icon: Clock, color: 'text-green-300' },
                  { value: '24/7', label: 'Online Ordering', icon: Zap, color: 'text-purple-300' }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="transform-gpu transition-all duration-500 hover:scale-110 hover:translate-z-30 preserve-3d group"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-2xl hover:shadow-3d-hover">
                      <stat.icon className={`h-6 w-6 ${stat.color} mb-2 group-hover:bounce-3d`} />
                      <div className="text-3xl font-bold text-yellow-300">{stat.value}</div>
                      <div className="text-sm text-white/80">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 3D CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 preserve-3d">
                <Link to="/menu">
                  <Button 
                    size="lg" 
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg px-8 py-6 shadow-2xl border-2 border-yellow-300 transform hover:scale-110 hover:-translate-y-2 hover:rotate-2 transition-all duration-300 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Order Now 
                      <ShoppingBag className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-3d" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold text-lg px-8 py-6 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 hover:shadow-2xl group"
                  >
                    Create Account 
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - 3D Hero Image */}
            <div className="hidden lg:block relative preserve-3d perspective-1500">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-transparent rounded-2xl transform-gpu translate-z-10" />
              <img 
                src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Delicious Burger"
                className="rounded-2xl shadow-2xl transform-gpu rotate-y-5 translate-z-30 hover:rotate-y-0 hover:translate-z-60 transition-all duration-700 hover:shadow-3d"
              />
              
              {/* 3D Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-2xl transform-gpu translate-z-40 animate-float-3d hover:scale-110 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full animate-pulse-3d">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">10,000+ Orders</p>
                    <p className="text-xs text-gray-500">Completed today</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-red-600 text-white p-4 rounded-xl shadow-2xl transform-gpu translate-z-50 animate-float-3d" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <Flame className="h-5 w-5 text-yellow-300 animate-pulse-3d" />
                  <div>
                    <p className="text-sm font-semibold">Hot & Fresh</p>
                    <p className="text-xs opacity-90">Always</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 bg-yellow-400 text-gray-900 p-3 rounded-xl shadow-2xl transform-gpu translate-z-60 animate-float-3d" style={{ animationDelay: '1.8s' }}>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-bold">Customer Favorite</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 transform-gpu translate-z-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Products Section with 3D Cards */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-20 bg-gray-50 perspective-2000 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wider inline-block transform hover:scale-110 transition-transform animate-bounce-3d">Customer Favorites</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4 text-3d">Featured Menu Items</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our most popular burgers, crafted with love and the finest ingredients
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 preserve-3d">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="transform-gpu transition-all duration-500 hover:scale-105 hover:translate-z-30 preserve-3d"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/menu">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all duration-300 transform hover:scale-110 hover:translate-z-10 group shadow-3d hover:shadow-3d-hover"
                >
                  View Full Menu 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features with 3D Cards */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 preserve-3d">
            {[
              { icon: ShoppingBag, title: 'Easy Ordering', desc: 'Browse our menu and add items to your cart in seconds', color: 'from-blue-500 to-blue-600' },
              { icon: Clock, title: 'Fast Pickup', desc: 'Your order will be ready for pickup in minutes', color: 'from-green-500 to-green-600' },
              { icon: Star, title: 'Quality Food', desc: 'Fresh ingredients and delicious recipes every time', color: 'from-yellow-500 to-yellow-600' },
            ].map((feature, i) => (
              <div 
                key={i}
                className="group relative text-center p-8 rounded-2xl bg-gray-50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:rotate-1 preserve-3d overflow-hidden"
              >
                {/* 3D Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-red-100 mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <feature.icon className="h-8 w-8 text-red-600 group-hover:animate-bounce-3d" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>

                {/* 3D Shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent rounded-2xl -z-10 transform -translate-z-10 group-hover:-translate-z-20 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Business Section with 3D Elements */}
      <section className="py-20 bg-gray-50 perspective-1500 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="transform-gpu translate-z-10">
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wider animate-pulse-3d inline-block">Business Opportunity</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6 text-3d">Grow With Minute Burger</h2>
              <p className="text-gray-600 mb-8">
                Join our successful franchise network and be part of the fastest-growing burger chain in the country.
              </p>

              <div className="space-y-6">
                {[
                  { icon: TrendingUp, title: 'Proven Business Model', desc: 'Over 50 successful franchises nationwide' },
                  { icon: Users, title: 'Comprehensive Training', desc: 'Full support for franchisees and staff' },
                  { icon: Truck, title: 'Supply Chain Excellence', desc: 'Reliable ingredient delivery to all locations' },
                  { icon: Award, title: 'Quality Standards', desc: 'Consistent taste and quality across all branches' },
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="flex gap-4 group transform hover:translate-x-2 hover:translate-z-10 transition-all duration-300 preserve-3d"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <item.icon className="h-7 w-7 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/franchise">
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Franchise Inquiry 
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-3d" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative preserve-3d perspective-1000">
              <img 
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Minute Burger Restaurant"
                className="rounded-2xl shadow-2xl transform-gpu rotate-y-5 translate-z-20 hover:rotate-y-0 hover:translate-z-50 transition-all duration-700 hover:shadow-3d"
              />
              
              {/* 3D Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 rounded-2xl shadow-2xl transform-gpu translate-z-30 animate-float-3d hover:scale-110 transition-transform">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </div>

              {/* Additional 3D Element */}
              <div className="absolute -top-6 left-6 bg-yellow-400 text-gray-900 p-4 rounded-xl shadow-2xl transform-gpu translate-z-40 animate-float-3d" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Trusted Brand</span>
                </div>
              </div>

              <div className="absolute top-1/2 -left-8 bg-green-500 text-white p-3 rounded-xl shadow-2xl transform-gpu translate-z-50 animate-float-3d" style={{ animationDelay: '2.2s' }}>
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  <span className="text-xs font-bold">50+ Locations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with 3D Effects */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 relative overflow-hidden">
        {/* 3D Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animate-slow-spin" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 2px)`,
            backgroundSize: '40px 40px',
            transform: 'rotateX(60deg) translateZ(30px)',
          }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-text-pop">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-pulse-3d">
            Whether you're craving a delicious meal or ready to start your own business, we're here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center preserve-3d">
            <Link to="/menu">
              <Button 
                size="lg" 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg px-8 shadow-2xl border-2 border-yellow-300 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Order Now 
                  <ShoppingBag className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-3d" />
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold text-lg px-8 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Create Account 
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 3D Floating Elements */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/20 rounded-full filter blur-3xl animate-float-3d" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full filter blur-3xl animate-float-3d" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-red-400/20 rounded-full filter blur-3xl animate-float-3d" style={{ animationDelay: '1.8s' }} />
      </section>

      {/* Footer with 3D Effects */}
      <footer className="bg-gray-900 text-gray-300 py-12 relative overflow-hidden">
        {/* 3D Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 animate-slow-spin" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
            transform: 'rotateX(60deg) translateZ(20px)',
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info with 3D Logo */}
            <div className="preserve-3d">
              <Link to="/" className="flex items-center gap-3 mb-4 group perspective-1000">
                <div className="relative transform-gpu transition-all duration-700 group-hover:rotate-y-180 preserve-3d">
                  <img 
                    src="/logo.png" 
                    alt="Minute Burger" 
                    className="h-10 w-auto relative z-10"
                  />
                  <div className="absolute inset-0 bg-red-500 rounded-full filter blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-3d" />
                </div>
                <span className="text-xl font-bold text-white transform-gpu translate-z-5">Minute Burger</span>
              </Link>
              <p className="text-sm text-gray-400">
                Serving delicious burgers since 2010. Committed to quality and customer satisfaction.
              </p>
            </div>

            {/* Footer Links with 3D Hover */}
            {[
              { title: 'Quick Links', links: ['Menu', 'About Us', 'Contact'] },
              { title: 'Support', links: ['FAQ', 'Privacy Policy', 'Terms of Service'] },
            ].map((section, i) => (
              <div key={i} className="preserve-3d">
                <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link 
                        to={`/${link.toLowerCase().replace(' ', '-')}`} 
                        className="text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:translate-x-2 hover:translate-z-5 inline-block group"
                      >
                        <span className="relative">
                          {link}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact with 3D Icons */}
            <div className="preserve-3d">
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2 group hover:text-red-500 transition-colors transform hover:translate-x-2 hover:translate-z-5">
                  <span className="transform group-hover:scale-110 group-hover:rotate-12 transition-transform">📞</span>
                  (02) 8123-4567
                </li>
                <li className="flex items-center gap-2 group hover:text-red-500 transition-colors transform hover:translate-x-2 hover:translate-z-5">
                  <span className="transform group-hover:scale-110 group-hover:rotate-12 transition-transform">📧</span>
                  info@minuteburger.com
                </li>
                <li className="flex items-center gap-2 group hover:text-red-500 transition-colors transform hover:translate-x-2 hover:translate-z-5">
                  <span className="transform group-hover:scale-110 group-hover:rotate-12 transition-transform">📍</span>
                  Makati City, Philippines
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Minute Burger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;