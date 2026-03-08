import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { cartAPI } from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    image?: string;
  };
  quantity: number;
  subtotal?: number;
}

interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  item_count: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    try {
      setLoading(true);
      const { data } = await cartAPI.getCart();
      setCart(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      const { data } = await cartAPI.addItem({ product_id: productId, quantity });
      setCart(data);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const { data } = await cartAPI.updateItem(itemId, { quantity });
      setCart(data);
    } catch {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const { data } = await cartAPI.removeItem(itemId);
      setCart(data);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await cartAPI.clearCart();
      setCart(data);
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
