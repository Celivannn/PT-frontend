import React, { useEffect, useState } from 'react';
import { productAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Loader2, 
  Filter, 
  X, 
  Grid3x3,
  List,
  ChevronDown,
  Sparkles,
  Pizza,
  Flame,
  Star
} from 'lucide-react';

interface Category { 
  id: number; 
  name: string; 
  description?: string;
  image?: string;
}

interface Product { 
  id: number; 
  name: string; 
  description: string; 
  price: string; 
  image?: string; 
  is_available: boolean; 
  category_name?: string;
  category?: number;
  preparation_time?: number;
  is_featured?: boolean;
}

const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCat) params.category = selectedCat;
      if (search) params.search = search;
      
      const { data } = await productAPI.getProducts(params);
      const productsData = Array.isArray(data) ? data : data.results || [];
      setProducts(productsData);
      setTotalProducts(productsData.length);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await productAPI.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => { 
    fetchProducts(); 
  }, [selectedCat, search]);

  const clearFilters = () => {
    setSelectedCat(null);
    setSearch('');
    setShowFilters(false);
  };

  const activeFiltersCount = (selectedCat ? 1 : 0) + (search ? 1 : 0);

  return (
    <CustomerLayout>
      {/* 3D Animation Styles */}
      <style>{`
        @keyframes float-3d {
          0%, 100% { transform: translateZ(0px) translateY(0px) rotateX(0deg); }
          50% { transform: translateZ(30px) translateY(-10px) rotateX(5deg); }
        }
        
        @keyframes pulse-3d {
          0%, 100% { transform: scale(1) translateZ(0px); opacity: 0.5; }
          50% { transform: scale(1.2) translateZ(20px); opacity: 0.8; }
        }
        
        @keyframes bounce-3d {
          0%, 100% { transform: translateZ(0px) translateY(0); }
          50% { transform: translateZ(20px) translateY(-8px); }
        }
        
        @keyframes rotate-3d {
          0% { transform: rotateY(0deg) translateZ(0px); }
          50% { transform: rotateY(10deg) translateZ(20px); }
          100% { transform: rotateY(0deg) translateZ(0px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .perspective-1000 { perspective: 1000px; }
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
        .-translate-z-10 { transform: translateZ(-10px); }
        
        .rotate-y-5 { transform: rotateY(5deg); }
        .rotate-x-5 { transform: rotateX(5deg); }
        
        .hover\\:translate-z-10:hover { transform: translateZ(10px); }
        .hover\\:translate-z-20:hover { transform: translateZ(20px); }
        .hover\\:translate-z-30:hover { transform: translateZ(30px); }
        .hover\\:rotate-y-0:hover { transform: rotateY(0deg); }
        
        .animate-float-3d { animation: float-3d 6s ease-in-out infinite; }
        .animate-pulse-3d { animation: pulse-3d 3s ease-in-out infinite; }
        .animate-bounce-3d { animation: bounce-3d 2s ease-in-out infinite; }
        .animate-rotate-3d { animation: rotate-3d 8s ease-in-out infinite; }
        
        .card-3d {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .card-3d:hover {
          transform: translateZ(30px) scale(1.02);
          box-shadow: 0 20px 40px -10px rgba(220, 38, 38, 0.3),
                      0 0 0 1px rgba(220, 38, 38, 0.1) inset;
        }
        
        .glass-morphism {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .text-3d {
          text-shadow: 0 2px 4px rgba(0,0,0,0.1),
                      0 4px 8px rgba(0,0,0,0.05),
                      0 8px 16px rgba(0,0,0,0.025);
        }
        
        .text-3d-red {
          text-shadow: 0 2px 4px rgba(220, 38, 38, 0.2),
                      0 4px 8px rgba(220, 38, 38, 0.1),
                      0 8px 16px rgba(220, 38, 38, 0.05);
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        .category-chip-3d {
          transition: all 0.2s ease;
          transform: translateZ(5px);
        }
        
        .category-chip-3d:hover {
          transform: translateZ(15px) scale(1.05);
        }
        
        .category-chip-3d.active {
          transform: translateZ(20px);
          box-shadow: 0 10px 20px -5px rgba(220, 38, 38, 0.4);
        }
        
        .floating-bg-element {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.1;
          animation: float-3d 15s ease-in-out infinite;
        }
      `}</style>

      {/* 3D Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-bg-element bg-red-500 w-96 h-96 -top-48 -left-48"></div>
        <div className="floating-bg-element bg-yellow-500 w-80 h-80 top-1/2 -right-40" style={{ animationDelay: '2s' }}></div>
        <div className="floating-bg-element bg-orange-500 w-64 h-64 bottom-0 left-1/3" style={{ animationDelay: '4s' }}></div>
        <div className="floating-bg-element bg-red-400 w-72 h-72 top-1/3 left-1/4" style={{ animationDelay: '6s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with 3D Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 preserve-3d">
          <div className="transform-gpu translate-z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Pizza className="h-10 w-10 text-red-600 animate-rotate-3d" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse-3d" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 text-3d">
                Our <span className="text-red-600 text-3d-red">Menu</span>
              </h1>
            </div>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              {initialLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                  <span>Loading delicious items...</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse-3d"></span>
                  <span className="font-medium text-gray-700">{totalProducts} items</span>
                  <span className="text-gray-400">available now</span>
                </>
              )}
            </p>
          </div>
          
          {/* 3D View Toggle */}
          <div className="flex items-center gap-2 mt-4 md:mt-0 preserve-3d">
            <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-lg border border-gray-100 transform-gpu translate-z-20">
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-red-600 text-white shadow-lg scale-110 translate-z-10' 
                    : 'hover:bg-red-50 text-gray-600'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-red-600 text-white shadow-lg scale-110 translate-z-10' 
                    : 'hover:bg-red-50 text-gray-600'
                }`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 3D Search & Filters Card */}
        <div className="glass-morphism rounded-2xl shadow-2xl p-6 mb-8 transform-gpu translate-z-20 hover:translate-z-30 transition-all duration-300 preserve-3d">
          {/* Floating Decoration */}
          <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-red-400 to-yellow-400 rounded-full filter blur-2xl opacity-30 animate-pulse-3d"></div>
          
          {/* Mobile Filter Toggle */}
          <div className="flex items-center gap-3 lg:hidden mb-4">
            <Button
              variant="outline"
              className="flex-1 h-12 border-2 hover:border-red-300 transition-all duration-300 relative overflow-hidden group"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse-3d">
                  {activeFiltersCount}
                </span>
              )}
              {showFilters && (
                <ChevronDown className="ml-2 h-4 w-4 rotate-180 transition-transform" />
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters} 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-12 px-4"
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          {/* Search and Filters Content */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block transition-all duration-500`}>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 3D Search Input */}
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors z-10" />
                <Input
                  placeholder="Search by product name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-12 h-14 text-lg border-2 border-gray-200 focus:border-red-300 rounded-xl shadow-inner hover:shadow-lg transition-all duration-300 transform-gpu focus:translate-z-10"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-300 bg-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* 3D Category Filters */}
              <div className="flex flex-wrap items-center gap-3 bg-gray-50/50 p-3 rounded-xl backdrop-blur-sm">
                <span className="text-sm font-medium text-gray-500 hidden lg:flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Category:
                </span>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                  <Button
                    variant={selectedCat === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCat(null)}
                    className={`category-chip-3d ${selectedCat === null ? 'active bg-red-600 hover:bg-red-700 text-white shadow-lg' : 'bg-white hover:bg-red-50 border-2'}`}
                  >
                    All
                    {selectedCat === null && (
                      <Star className="ml-2 h-3 w-3 fill-current" />
                    )}
                  </Button>
                  {categories.map((cat, index) => (
                    <Button
                      key={cat.id}
                      variant={selectedCat === cat.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCat(cat.id)}
                      className={`category-chip-3d ${selectedCat === cat.id ? 'active bg-red-600 hover:bg-red-700 text-white shadow-lg' : 'bg-white hover:bg-red-50 border-2'}`}
                      style={{ transitionDelay: `${index * 30}ms` }}
                    >
                      {cat.name}
                      {selectedCat === cat.id && (
                        <Sparkles className="ml-2 h-3 w-3 animate-pulse-3d" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3D Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-200/50">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  Active filters:
                </span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {selectedCat && (
                    <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-full text-sm shadow-md transform-gpu translate-z-5 hover:translate-z-10 transition-all duration-300">
                      <span className="font-medium">Category:</span> {categories.find(c => c.id === selectedCat)?.name}
                      <button 
                        onClick={() => setSelectedCat(null)} 
                        className="ml-1 hover:text-red-900 hover:scale-110 transition-transform"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-full text-sm shadow-md transform-gpu translate-z-5 hover:translate-z-10 transition-all duration-300">
                      <span className="font-medium">Search:</span> "{search}"
                      <button 
                        onClick={() => setSearch('')} 
                        className="ml-1 hover:text-red-900 hover:scale-110 transition-transform"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters} 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium group"
                >
                  Clear all
                  <X className="ml-1 h-3 w-3 group-hover:rotate-90 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 3D Results Section */}
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center py-20 preserve-3d">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full filter blur-2xl animate-pulse-3d"></div>
              <Loader2 className="h-16 w-16 animate-spin text-red-600 mb-4 relative z-10" />
            </div>
            <p className="text-gray-500 text-lg animate-pulse-3d">Loading our delicious menu...</p>
            <div className="flex gap-2 mt-4">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce-3d" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce-3d" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce-3d" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 backdrop-blur-sm rounded-3xl shadow-2xl transform-gpu preserve-3d hover:translate-z-20 transition-all duration-500">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full filter blur-2xl animate-pulse-3d"></div>
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-xl">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <p className="text-2xl font-heading font-semibold text-gray-900 mb-2">No products found</p>
            <p className="text-gray-500 mb-6">We couldn't find any items matching your criteria</p>
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:translate-z-10 px-8 py-6 text-lg shadow-lg group"
            >
              <X className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            {/* 3D Results Count */}
            <div className="flex items-center justify-between mb-6 preserve-3d">
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform-gpu translate-z-10">
                <div className="flex -space-x-2">
                  <Flame className="h-5 w-5 text-red-500 animate-pulse-3d" />
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse-3d" style={{ animationDelay: '0.5s' }} />
                </div>
                <p className="text-sm">
                  Showing <span className="font-bold text-red-600">{products.length}</span> delicious items
                </p>
              </div>
              {loading && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                  <span className="text-sm text-gray-500">Updating...</span>
                </div>
              )}
            </div>

            {/* 3D Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 preserve-3d">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="transform-gpu transition-all duration-500 hover:scale-105 hover:translate-z-30 animate-float-3d"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 preserve-3d">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="transform-gpu transition-all duration-500 hover:translate-x-2 hover:translate-z-20"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={product} viewMode="list" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 3D Decorative Elements */}
        <div className="fixed bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full filter blur-3xl opacity-20 animate-float-3d pointer-events-none z-0"></div>
        <div className="fixed top-20 left-20 w-40 h-40 bg-gradient-to-r from-orange-400 to-red-400 rounded-full filter blur-3xl opacity-20 animate-float-3d pointer-events-none z-0" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dc2626;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b91c1c;
        }
      `}</style>
    </CustomerLayout>
  );
};

export default MenuPage;