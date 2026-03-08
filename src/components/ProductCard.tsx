import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import axios from 'axios';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string | null;
  is_available: boolean;
  category_name?: string;
  stock_quantity?: number;
  preparation_time?: number;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { fetchCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const API_URL = 'http://127.0.0.1:8000';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (!product.is_available) {
      toast.error('This item is currently unavailable');
      return;
    }

    setAddingToCart(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `${API_URL}/api/cart/add/`,
        { product_id: product.id, quantity: quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success(`${quantity}x ${product.name} added to cart`);
      await fetchCart();
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to add to cart');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const getImageUrl = () => {
    // If image error or no image, show placeholder
    if (imageError || !product.image) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }

    let imagePath = product.image;

    // If it's already a full URL, use it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Clean up the path - remove any double slashes except for the protocol
    imagePath = imagePath.replace(/^\/+/, ''); // Remove leading slashes
    
    // Construct the full URL
    // Common Django media URL patterns:
    // - /media/product/image.jpg
    // - media/product/image.jpg
    // - product/image.jpg
    if (imagePath.startsWith('media/')) {
      return `${API_URL}/${imagePath}`;
    } else if (imagePath.startsWith('/media/')) {
      return `${API_URL}${imagePath}`;
    } else {
      return `${API_URL}/media/${imagePath}`;
    }
  };

  const handleImageError = () => {
    console.log('Image failed to load for product:', product.name, 'URL:', getImageUrl());
    setImageError(true);
  };

  const formatPrice = (price: string): string => {
    return parseFloat(price).toFixed(2);
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // List View Layout
  if (viewMode === 'list') {
    return (
      <div className="block group">
        <Link to={`/product/${product.id}`} className="block">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="sm:w-48 h-48 bg-gray-100 flex-shrink-0">
                <img 
                  src={getImageUrl()} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex flex-col h-full">
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900 text-xl mb-1">{product.name}</h3>
                    {product.category_name && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mb-3">
                        {product.category_name}
                      </span>
                    )}
                    <p className="text-gray-600 mb-4">{product.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-heading font-bold text-2xl text-red-600">
                      ₱{formatPrice(product.price)}
                    </span>
                    
                    {product.is_available ? (
                      <div className="flex items-center gap-3" onClick={(e) => e.preventDefault()}>
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none hover:bg-gray-100"
                            onClick={decrementQuantity}
                            disabled={quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none hover:bg-gray-100"
                            onClick={incrementQuantity}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={handleAddToCart}
                          disabled={addingToCart}
                        >
                          {addingToCart ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Grid View Layout (Default)
  return (
    <div className="block group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
          {/* Image */}
          <div className="aspect-square overflow-hidden bg-gray-100">
            <img 
              src={getImageUrl()} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          </div>
          
          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-gray-900 truncate">{product.name}</h3>
              {product.category_name && (
                <p className="text-xs text-gray-500 mb-2">{product.category_name}</p>
              )}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
            </div>
            
            {/* Price and Add to Cart Section */}
            <div className="flex items-center justify-between mt-2">
              <span className="font-heading font-bold text-lg text-red-600">
                ₱{formatPrice(product.price)}
              </span>
              
              {product.is_available ? (
                <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-r-none hover:bg-gray-100"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-xs font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-l-none hover:bg-gray-100"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white h-7 px-2"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? (
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ShoppingCart className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-red-600 font-medium">Out of Stock</span>
              )}
            </div>
            
            {/* Stock Warning */}
            {product.stock_quantity !== undefined && product.stock_quantity < 10 && product.is_available && (
              <p className="text-xs text-orange-600 mt-2">
                Only {product.stock_quantity} left!
              </p>
            )}

            {/* Prep Time */}
            {product.preparation_time && (
              <p className="text-xs text-gray-400 mt-1">
                Prep time: {product.preparation_time} min
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}