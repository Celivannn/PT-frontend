import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import CustomerLayout from '@/components/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  ArrowLeft, 
  Loader2, 
  Clock, 
  Flame,
  Star,
  CheckCircle,
  AlertCircle,
  Heart,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
  category?: number;
  category_name?: string;
  is_available: boolean;
  is_featured?: boolean;
  stock_quantity?: number;
  preparation_time?: number;
  calories?: number;
  created_at?: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useAuth();
  const { addToCart, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      fetchRelatedProducts();
    }
  }, [product]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getProduct(Number(id));
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const { data } = await productAPI.getProducts({ 
        category: product?.category,
        page_size: 4 
      });
      const products = Array.isArray(data) ? data : data.results || [];
      // Filter out current product
      setRelatedProducts(products.filter((p: Product) => p.id !== product?.id).slice(0, 4));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) { 
      toast.error('Please login to add items to cart');
      navigate('/login/customer'); 
      return; 
    }

    if (!product?.is_available) {
      toast.error('This item is currently unavailable');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      await fetchCart(); // Refresh cart count
      toast.success(`${quantity}x ${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const getImageUrl = () => {
    if (imageError || !product?.image) {
      return null;
    }
    
    if (product.image.startsWith('http')) {
      return product.image;
    }
    
    if (product.image.startsWith('/media/')) {
      return `http://127.0.0.1:8000${product.image}`;
    }
    
    return `http://127.0.0.1:8000/media/${product.image}`;
  };

  const formatPrice = (price: string | number) => {
    return parseFloat(price.toString()).toFixed(2);
  };

  const incrementQuantity = () => {
    if (product?.stock_quantity && quantity < product.stock_quantity) {
      setQuantity(prev => prev + 1);
    } else if (!product?.stock_quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mb-4" />
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (!product) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-12 max-w-lg text-center">
          <div className="bg-red-50 rounded-xl p-8">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/menu')} className="bg-red-600 hover:bg-red-700 text-white">
              Browse Menu
            </Button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const imageUrl = getImageUrl();

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" className="hover:text-red-600" onClick={() => navigate('/menu')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Menu
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info('Feature coming soon!')}>
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info('Feature coming soon!')}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 animate-fade-in">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl filter drop-shadow-lg">🍔</span>
                </div>
              )}
            </div>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_featured && (
                <Badge className="bg-red-600 text-white border-0 px-3 py-1">
                  <Star className="h-3 w-3 mr-1 fill-white" /> Featured
                </Badge>
              )}
              {!product.is_available && (
                <Badge variant="destructive" className="px-3 py-1">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              {product.category_name && (
                <div className="flex items-center gap-2 text-sm text-red-600 font-medium mb-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  <span>{product.category_name}</span>
                </div>
              )}
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900">
                {product.name}
              </h1>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl lg:text-5xl font-bold text-red-600">
                ₱{formatPrice(product.price)}
              </span>
              {product.stock_quantity !== undefined && product.is_available && (
                <span className="text-sm text-gray-500">
                  {product.stock_quantity} available
                </span>
              )}
            </div>

            {/* Product Meta Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
              {product.preparation_time && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{product.preparation_time} min prep</span>
                </div>
              )}
              {product.calories && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">{product.calories} cal</span>
                </div>
              )}
              {product.is_available && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">In Stock</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            {product.is_available ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-lg hover:bg-white"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-lg hover:bg-white"
                      onClick={incrementQuantity}
                      disabled={product.stock_quantity ? quantity >= product.stock_quantity : false}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-heading font-bold shadow-lg shadow-red-200"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Adding...
                    </span>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart • ₱{(parseFloat(product.price) * quantity).toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-red-600 font-medium">Currently Unavailable</p>
                <p className="text-sm text-red-500 mt-1">This item is out of stock</p>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Important Information</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Made with fresh ingredients daily
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Prepared when you order
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Cash on pickup only
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <div className="aspect-square bg-gray-100">
                    {relatedProduct.image ? (
                      <img 
                        src={relatedProduct.image.startsWith('http') ? relatedProduct.image : `http://127.0.0.1:8000${relatedProduct.image}`}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl">🍔</div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🍔</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-heading font-semibold text-gray-900 truncate">{relatedProduct.name}</h3>
                    <p className="text-red-600 font-bold mt-1">₱{formatPrice(relatedProduct.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default ProductDetails;