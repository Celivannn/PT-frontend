import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Clock, Star, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-2xl font-heading font-bold text-primary">🍔 Minute Burger</span>
          <div className="flex items-center gap-3">
            <Link to="/login/customer">
              <Button variant="outline" size="sm">Customer Login</Button>
            </Link>
            <Link to="/login/admin">
              <Button variant="ghost" size="sm">Admin Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground leading-tight">
              Your Favorite
              <span className="text-primary block">Burgers</span>
              Just a Click Away
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-lg">
              Order delicious Minute Burgers online. Fast, easy, and ready for pickup in minutes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/menu">
                <Button className="btn-hero">
                  <ShoppingBag className="h-5 w-5 mr-2" /> Order Now
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Create Account <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShoppingBag, title: 'Easy Ordering', desc: 'Browse our menu and add items to your cart in seconds' },
              { icon: Clock, title: 'Fast Pickup', desc: 'Your order will be ready for pickup in minutes' },
              { icon: Star, title: 'Quality Food', desc: 'Fresh ingredients and delicious recipes every time' },
            ].map((f, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-background animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-accent mb-4">
                  <f.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <p className="font-heading text-lg font-semibold text-foreground mb-1">🍔 Minute Burger</p>
        <p>© {new Date().getFullYear()} Minute Burger Online Ordering System</p>
      </footer>
    </div>
  );
};

export default Landing;
