import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { productAPI, adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  Upload,
  X,
  Image as ImageIcon,
  Package,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string | null;
  category: number;
  category_name: string;
  stock_quantity: number;
  is_available: boolean;
  is_featured: boolean;
  preparation_time: number;
  created_at?: string;
  updated_at?: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: '50',
    is_available: true,
    is_featured: false,
    preparation_time: '5'
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Clean up preview URL
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getProducts({ page_size: 100 }),
        productAPI.getCategories(),
      ]);
      
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : productsRes.data.results || []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openNew = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      description: '',
      price: '',
      category: categories[0]?.id.toString() || '',
      stock_quantity: '50',
      is_available: true,
      is_featured: false,
      preparation_time: '5'
    });
    setSelectedImage(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category.toString(),
      stock_quantity: product.stock_quantity.toString(),
      is_available: product.is_available,
      is_featured: product.is_featured,
      preparation_time: product.preparation_time.toString()
    });
    setImagePreview(product.image ? `${API_URL}${product.image}` : null);
    setSelectedImage(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!form.price || parseFloat(form.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('stock_quantity', form.stock_quantity);
      formData.append('is_available', String(form.is_available));
      formData.append('is_featured', String(form.is_featured));
      formData.append('preparation_time', form.preparation_time);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, formData);
        toast.success('Product updated successfully');
      } else {
        await adminAPI.createProduct(formData);
        toast.success('Product created successfully');
      }
      
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setDeleting(id);
    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.category !== Number(selectedCategory)) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  const formatCurrency = (price: string) => {
    return `₱${parseFloat(price).toFixed(2)}`;
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow animate-fade-in">
              {/* Product Image */}
              <div className="aspect-square rounded-lg bg-muted overflow-hidden mb-3">
                {product.image ? (
                  <img 
                    src={getImageUrl(product.image) || ''} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl">🍔</div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🍔
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-primary text-lg">
                    {formatCurrency(product.price)}
                  </span>
                  <Badge variant="outline" className="bg-muted">
                    {product.category_name}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    Stock: {product.stock_quantity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {product.preparation_time} min
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${product.is_available ? 'bg-success' : 'bg-destructive'}`} />
                    <span className="text-xs text-muted-foreground">
                      {product.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  {product.is_featured && (
                    <Badge className="bg-warning text-warning-foreground text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" /> Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 mt-3 pt-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openEdit(product)}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(product.id)}
                  disabled={deleting === product.id}
                >
                  {deleting === product.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
            </Card>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-16 bg-muted/50 rounded-lg">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products found</p>
              <Button onClick={openNew} variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" /> Add your first product
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) {
          setDialogOpen(false);
          setEditingProduct(null);
          handleRemoveImage();
        }
      }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={saving}
                      className="flex-1"
                    >
                      <Upload className="h-3 w-3 mr-2" />
                      {imagePreview ? 'Change' : 'Upload'}
                    </Button>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={saving}
                        className="text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Max 5MB. JPG, PNG, GIF
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="mt-1"
                placeholder="e.g., Classic Burger"
                disabled={saving}
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="mt-1"
                placeholder="Product description..."
                rows={3}
                disabled={saving}
              />
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="price">Price (₱) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="mt-1"
                  placeholder="0.00"
                  disabled={saving}
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={form.category} 
                  onValueChange={v => setForm(f => ({ ...f, category: v }))}
                  disabled={saving || categories.length === 0}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stock and Prep Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={form.stock_quantity}
                  onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))}
                  className="mt-1"
                  disabled={saving}
                />
              </div>
              <div>
                <Label htmlFor="prepTime">Prep Time (min)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  min="1"
                  value={form.preparation_time}
                  onChange={e => setForm(f => ({ ...f, preparation_time: e.target.value }))}
                  className="mt-1"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Switches */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="available">Available for order</Label>
                <Switch
                  id="available"
                  checked={form.is_available}
                  onCheckedChange={v => setForm(f => ({ ...f, is_available: v }))}
                  disabled={saving}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured product</Label>
                <Switch
                  id="featured"
                  checked={form.is_featured}
                  onCheckedChange={v => setForm(f => ({ ...f, is_featured: v }))}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {editingProduct ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  editingProduct ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;