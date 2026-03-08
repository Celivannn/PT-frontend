import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    image: string | null;
  };
  quantity: number;
  price: string;
  subtotal: string;
}

interface Cart {
  id: number;
  items: CartItem[];
  total: string;
  item_count: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const API_URL = 'http://127.0.0.1:8000';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/cart/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `${API_URL}/api/cart/add/`,
        { product_id: productId, quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await fetchCart(); // Refresh cart after adding
      toast.success('Item added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to add item to cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        `${API_URL}/api/cart/update/${itemId}/`,
        { quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/api/cart/remove/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart(); // Refresh cart after removal
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/api/cart/clear/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart(); // Refresh cart after clearing
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      fetchCart,
      addToCart,
      updateQuantity, 
      removeItem, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};