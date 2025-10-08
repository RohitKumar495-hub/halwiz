'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose, AiOutlineHome, AiOutlineHeart } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { BsHandbag } from 'react-icons/bs';
import { MdAccountCircle } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext'; // dynamic cart & wishlist

const MobileNavbarPage = () => {
  const [openLeftMenu, setOpenLeftMenu] = useState(false);
  const pathName = usePathname();
  const { cart, wishlist } = useCart();

  const navItems = [
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' },
    { name: 'Shop', url: '/shop' },
    { name: 'Track Your Order', url: '/track-order' },
    { name: 'FAQs', url: '/faqs' },
    { name: 'Login', url: '/auth' },
    { name: 'Signup', url: '/auth' },
  ];

  const iconItems = [
    { name: 'Home', url: '/', icon: AiOutlineHome, quantity: 0 },
    { name: 'Wishlist', url: '/wishlist', icon: AiOutlineHeart, quantity: wishlist?.length ?? 0 },
    { name: 'Cart', url: '/cart', icon: BsHandbag, quantity: cart?.reduce((acc, item) => acc + (item.quantity ?? 0), 0) ?? 0 },
    { name: 'My account', url: '/account', icon: MdAccountCircle, quantity: 0 },
  ];

  return (
    <>
      {/* Top Navbar */}
      <div className="lg:hidden block w-full bg-white shadow fixed top-0 z-10">
        <nav className="flex items-center px-5 justify-between">
          <div>
            <Link href="/">
              <img src="/logo.png" alt="Logo" className="w-15" />
            </Link>
          </div>
          <div onClick={() => setOpenLeftMenu(prev => !prev)} className="cursor-pointer">
            <AiOutlineMenu size={30} />
          </div>
        </nav>

        {/* Bottom Navbar */}
        <nav className="bg-white fixed bottom-0 z-20 p-2 w-full shadow flex items-center justify-evenly gap-4">
          {iconItems.map((item, index) => (
            <div key={index + item.name}>
              <Link href={item.url} className="grid place-items-center relative">
                <item.icon size={25} />
                {item.quantity > 0 && (
                  <p className="bg-red-500 rounded-full -top-1 -right-0 text-white absolute w-4 h-4 text-xs flex items-center justify-center">
                    {item.quantity}
                  </p>
                )}
                <p className="text-xs font-semibold mt-1">{item.name}</p>
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Left Slide Menu */}
      {openLeftMenu && (
        <div className="bg-black/40 w-full h-screen z-10 fixed inset-0">
          <div className="bg-white w-60 h-full">
            <div
              className="w-full flex items-center p-2 justify-end border-b border-b-gray-300 h-16 hover:text-red-500 cursor-pointer"
              onClick={() => setOpenLeftMenu(false)}
            >
              <AiOutlineClose size={20} />
            </div>
            <div className="w-full h-18 shadow p-2 flex items-center px-3">
              <input
                type="text"
                placeholder="Search for products"
                className="font-semibold outline-none h-full w-45"
              />
              <BiSearch color="gray" size={25} />
            </div>
            <nav className="p-2">
              {navItems.map((navItem, index) => (
                <div
                  key={index + navItem.name}
                  className="w-full grid items-center p-2 border-b border-b-gray-300 h-12 hover:text-red-500"
                  onClick={() => setOpenLeftMenu(false)}
                >
                  <Link
                    href={navItem.url}
                    className={`text-xs font-semibold ${pathName === navItem.url ? 'text-red-500' : ''}`}
                  >
                    {navItem.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbarPage;
