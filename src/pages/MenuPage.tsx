import React, { useEffect, useState } from 'react';
import { productAPI } from '@/lib/api';
import CustomerLayout from '@/components/CustomerLayout';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

interface Category { id: number; name: string; }
interface Product { id: number; name: string; description: string; price: string; image?: string; is_available: boolean; category_name?: string; }

const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCat) params.category = selectedCat;
      if (search) params.search = search;
      const { data } = await productAPI.getProducts(params);
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    productAPI.getCategories().then(({ data }) => setCategories(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  useEffect(() => { fetchProducts(); }, [selectedCat, search]);

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-6">Our Menu</h1>

        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCat === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCat(null)}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCat === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCat(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl font-heading">No products found</p>
            <p className="text-sm mt-2">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default MenuPage;
