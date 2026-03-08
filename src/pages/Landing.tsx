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
  Star
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Official Logo */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Minute Burger" 
              className="h-12 w-auto"
            />
            <span className="text-2xl font-heading font-bold">
              <span className="text-red-600">Minute</span>
              <span className="text-gray-900">Burger</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login/customer">
              <Button variant="outline" size="default" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all">
                Customer Login
              </Button>
            </Link>
            <Link to="/login/admin">
              <Button variant="outline" size="default" className="border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 hover:bg-red-50">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">#1 Fastest Growing Burger Chain 2024</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Your Favorite
                <span className="text-yellow-300 block">Burgers, Ready in Minutes</span>
              </h1>
              
              <p className="text-xl text-white/90 max-w-lg">
                Join thousands of satisfied customers enjoying premium burgers made with 100% pure beef and fresh ingredients. Order online for quick pickup!
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div>
                  <div className="text-3xl font-bold text-yellow-300">5K+</div>
                  <div className="text-sm text-white/80">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">15min</div>
                  <div className="text-sm text-white/80">Avg. Prep Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">24/7</div>
                  <div className="text-sm text-white/80">Online Ordering</div>
                </div>
              </div>

              {/* CTA Buttons - IMPROVED VISIBILITY */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/menu">
                  <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg px-8 py-6 shadow-xl border-2 border-yellow-300">
                    Order Now <ShoppingBag className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold text-lg px-8 py-6 transition-all"
                  >
                    Create Account <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-transparent rounded-2xl" />
              <img 
                src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Delicious Burger"
                className="rounded-2xl shadow-2xl"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">10,000+ Orders</p>
                    <p className="text-xs text-gray-500">Completed today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Products Section */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Customer Favorites</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Featured Menu Items</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our most popular burgers, crafted with love and the finest ingredients
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/menu">
                <Button variant="outline" size="lg" className="border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all">
                  View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShoppingBag, title: 'Easy Ordering', desc: 'Browse our menu and add items to your cart in seconds' },
              { icon: Clock, title: 'Fast Pickup', desc: 'Your order will be ready for pickup in minutes' },
              { icon: Star, title: 'Quality Food', desc: 'Fresh ingredients and delicious recipes every time' },
            ].map((f, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-red-100 mb-4">
                  <f.icon className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Business Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Business Opportunity</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Grow With Minute Burger</h2>
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
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-red-600" />
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
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg">
                    Franchise Inquiry <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Minute Burger Restaurant"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Whether you're craving a delicious meal or ready to start your own business, we're here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg px-8 shadow-xl border-2 border-yellow-300">
                Order Now <ShoppingBag className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold text-lg px-8 transition-all"
              >
                Create Account <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer with Official Logo */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="Minute Burger" 
                  className="h-10 w-auto"
                />
                <span className="text-xl font-bold text-white">Minute Burger</span>
              </div>
              <p className="text-sm text-gray-400">
                Serving delicious burgers since 2010. Committed to quality and customer satisfaction.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/menu" className="text-gray-400 hover:text-red-500 transition-colors">Menu</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-red-500 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/faq" className="text-gray-400 hover:text-red-500 transition-colors">FAQ</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-red-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-red-500 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📞 (02) 8123-4567</li>
                <li>📧 info@minuteburger.com</li>
                <li>📍 Makati City, Philippines</li>
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