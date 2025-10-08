'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsCart3 } from 'react-icons/bs';
import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  isAdmin?: boolean;
  addresses?: any[];
  cartItems?: { product: string; quantity: number; _id: string }[];
  wishlist?: string[];
}

const NavbarPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null); // ✅ Properly typed
  const { wishlist = [], cart = [] } = useCart();

  const navItems = [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: 'Cart', url: '/cart' },
    { name: 'Track Your Order', url: '/track-order' },
    { name: 'About Us', url: '/about' },
    { name: 'Contact Us', url: '/contact' },
  ];

  const pathName = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      setIsLogin(true);

      try {
        const { data } = await axios.get('http://localhost:8000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data.user); // ✅ Save user data
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

  // ✅ Calculate total cart items
  const totalCartItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

  // ✅ Get first letter of user's first name
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="h-22 w-full lg:flex items-center shadow-md justify-between px-10 py-4 fixed top-0 z-10 bg-white hidden">
      {/* Logo */}
      <div>
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="w-25" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav>
        <div className="flex gap-8">
          {navItems.map((item, index) => (
            <div key={index}>
              <Link
                href={item.url}
                className={`${
                  pathName === item.url
                    ? 'underline underline-offset-4 decoration-red-500 decoration-[1.8px] text-gray-500'
                    : ''
                }`}
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      </nav>

      {/* Right Side: Wishlist, Cart, User */}
      <div className="flex items-center gap-8">
        {isLogin ? (
          <div className="flex items-center gap-8">
            {/* Wishlist */}
            <Link href="/wishlist" className="flex items-center gap-2 relative">
              <AiOutlineHeart size={30} />
              <p>Wishlist</p>
              {wishlist.length > 0 && (
                <span className="bg-red-500 rounded-full -top-1 left-4 text-white absolute w-4 h-4 text-xs flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex items-center gap-2 relative">
              <BsCart3 size={28} />
              <p>Cart</p>
              {totalCartItems > 0 && (
                <span className="bg-red-500 rounded-full -top-1 left-4 text-white absolute w-4 h-4 text-xs flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* User Avatar */}
            <div className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
              <Link href={'/profile'}>
                {userInitial}
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <Link href="/auth">Login / Signup</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarPage;
