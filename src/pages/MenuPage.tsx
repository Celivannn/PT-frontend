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
  ChevronDown
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
      <div className="container mx-auto px-4 py-8">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Our Menu</h1>
            <p className="text-gray-500 mt-1">
              {initialLoading ? 'Loading...' : `${totalProducts} items available`}
            </p>
          </div>
          
          {/* View Toggle (Optional) */}
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              className={`h-9 w-9 ${viewMode === 'grid' ? 'bg-red-50 border-red-200' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className={`h-4 w-4 ${viewMode === 'grid' ? 'text-red-600' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`h-9 w-9 ${viewMode === 'list' ? 'bg-red-50 border-red-200' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-red-600' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center gap-3 lg:hidden mb-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600">
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          {/* Search and Filters Content */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by product name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-10"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-500 hidden lg:block">Category:</span>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                  <Button
                    variant={selectedCat === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCat(null)}
                    className={selectedCat === null ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    All
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={selectedCat === cat.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCat(cat.id)}
                      className={selectedCat === cat.id ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-gray-500">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedCat && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                      Category: {categories.find(c => c.id === selectedCat)?.name}
                      <button onClick={() => setSelectedCat(null)} className="hover:text-red-900">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                      Search: "{search}"
                      <button onClick={() => setSearch('')} className="hover:text-red-900">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 text-sm ml-auto">
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-red-600 mb-4" />
            <p className="text-gray-500">Loading our delicious menu...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-xl font-heading font-semibold text-gray-900 mb-2">No products found</p>
            <p className="text-gray-500 mb-6">We couldn't find any items matching your criteria</p>
            <Button onClick={clearFilters} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{products.length}</span> items
              </p>
              {loading && <Loader2 className="h-4 w-4 animate-spin text-red-600" />}
            </div>

            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode="list" />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </CustomerLayout>
  );
};

export default MenuPage;