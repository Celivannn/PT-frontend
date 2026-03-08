import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description?: string;
    price: string;
    image?: string;
    is_available?: boolean;
    category_name?: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login/customer');
      return;
    }
    await addToCart(product.id, 1);
  };

  return (
    <div className="card-product cursor-pointer" onClick={() => navigate(`/menu/${product.id}`)}>
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍔</div>
        )}
      </div>
      <div className="p-4">
        {product.category_name && (
          <span className="text-xs font-medium text-primary uppercase tracking-wider">{product.category_name}</span>
        )}
        <h3 className="font-heading font-semibold text-lg mt-1 text-card-foreground">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-primary">₱{parseFloat(product.price).toFixed(2)}</span>
          {product.is_available !== false ? (
            <Button size="sm" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-1" /> Add
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground font-medium">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
