'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  images: string[];
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  quantity: number;
  stars?: number;
}

interface CartItem {
  productId: string;
  quantity: number;
  product: Product | null;
}

interface CartContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  removeItemCompletely: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  toggleWishlist: (productId: string) => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // Fetch products, cart & wishlist from backend
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const productRes = await axios.get('http://localhost:8000/api/auth/get-product', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (productRes.data.success) setProducts(productRes.data.products);

        const res = await axios.get('http://localhost:8000/api/auth/cart-wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const backendCart: CartItem[] = res.data.cartItems.map((item: any) => {
            const productObj = productRes.data.products.find((p: Product) => p._id === (item.product._id || item.product)) || null;
            return {
              productId: item.product._id || item.product,
              quantity: item.quantity,
              product: productObj,
            };
          });
          setCart(backendCart);
          setWishlist(res.data.wishlist.map((p: any) => (p._id ? p._id : p)));
        }
      } catch (err: any) {
        console.error('Error fetching cart/wishlist:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Add to cart
  const addToCart = async (productId: string) => {
    if (!token) return;
    try {
      const res = await axios.post(
        'http://localhost:8000/api/auth/cart',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const updatedCart: CartItem[] = res.data.cartItems.map((item: any) => {
          const productObj = products.find(p => p._id === (item.product._id || item.product)) || null;
          return {
            productId: item.product._id || item.product,
            quantity: item.quantity,
            product: productObj,
          };
        });
        setCart(updatedCart);
      }
    } catch (err: any) {
      console.error('Error adding to cart:', err.response?.data || err.message);
    }
  };

  // Remove/decrement cart item
  const removeFromCart = async (productId: string) => {
    if (!token) return;
    try {
      const res = await axios.delete(`http://localhost:8000/api/auth/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const updatedCart: CartItem[] = res.data.cartItems.map((item: any) => {
          const productObj = products.find(p => p._id === (item.product._id || item.product)) || null;
          return {
            productId: item.product._id || item.product,
            quantity: item.quantity,
            product: productObj,
          };
        });
        setCart(updatedCart);
      }
    } catch (err: any) {
      console.error('Error removing from cart:', err.response?.data || err.message);
    }
  };

  // Remove item completely
  const removeItemCompletely = async (productId: string) => {
    if (!token) return;
    try {
      const res = await axios.delete(`http://localhost:8000/api/auth/cart/all/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const updatedCart: CartItem[] = res.data.cartItems.map((item: any) => {
          const productObj = products.find(p => p._id === (item.product._id || item.product)) || null;
          return {
            productId: item.product._id || item.product,
            quantity: item.quantity,
            product: productObj,
          };
        });
        setCart(updatedCart);
      }
    } catch (err: any) {
      console.error('Error removing product completely:', err.response?.data || err.message);
    }
  };

  // Clear cart (frontend + backend)
  const clearCart = async () => {
    if (!token) return;
    try {
      // Clear backend cart
      await axios.post(
        'http://localhost:8000/api/auth/clear-cart',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Clear frontend cart
      setCart([]);
    } catch (err: any) {
      console.error('Error clearing cart:', err.response?.data || err.message);
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (productId: string) => {
    if (!token) return;
    try {
      const res = await axios.post(
        'http://localhost:8000/api/auth/wishlist',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setWishlist(res.data.wishlist.map((p: any) => (p._id ? p._id : p)));
      }
    } catch (err: any) {
      console.error('Error toggling wishlist:', err.response?.data || err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        products,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        removeItemCompletely,
        clearCart,
        setCart,
        toggleWishlist,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
