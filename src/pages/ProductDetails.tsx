import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import CustomerLayout from '@/components/CustomerLayout';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    productAPI.getProduct(Number(id))
      .then(({ data }) => setProduct(data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { navigate('/login/customer'); return; }
    await addToCart(product.id, quantity);
  };

  if (loading) return <CustomerLayout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></CustomerLayout>;
  if (!product) return <CustomerLayout><div className="text-center py-20 text-muted-foreground">Product not found</div></CustomerLayout>;

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/menu')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Menu
        </Button>
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🍔</div>
            )}
          </div>
          <div>
            {product.category_name && (
              <span className="text-sm font-medium text-primary uppercase tracking-wider">{product.category_name}</span>
            )}
            <h1 className="text-3xl font-heading font-bold mt-2">{product.name}</h1>
            <p className="text-muted-foreground mt-3 leading-relaxed">{product.description}</p>
            <p className="text-4xl font-bold text-primary mt-6">₱{parseFloat(product.price).toFixed(2)}</p>

            {product.is_available !== false ? (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button className="w-full md:w-auto btn-hero" onClick={handleAdd}>
                  <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart — ₱{(parseFloat(product.price) * quantity).toFixed(2)}
                </Button>
              </div>
            ) : (
              <div className="mt-8 p-4 bg-destructive/10 rounded-lg text-center">
                <p className="font-medium text-destructive">Currently Unavailable</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ProductDetails;
