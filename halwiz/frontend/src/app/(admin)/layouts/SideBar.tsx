'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { GoHome } from "react-icons/go";
import { RiProductHuntLine } from "react-icons/ri";
import { FaCartShopping } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { usePathname } from 'next/navigation';
import AdminGuard from '../components/AdminGuard';

const SideBar = () => {
  const pathName = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', icon: GoHome, url: '/admin-home' },
    { name: 'Products', icon: RiProductHuntLine, url: '/product-list' },
    { name: 'Orders', icon: FaCartShopping, url: '/order-list' },
    { name: 'Customers', icon: IoIosPeople, url: '/customer-list' },
    { name: 'LogOut', icon: MdLogout, url: '/auth' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');   // remove token
    localStorage.setItem('isAdmin', 'false'); // set isAdmin false
    router.push('/auth'); // redirect to login
  };

  return (
    <AdminGuard>
      <div className='p-2 grid gap-3 fixed top-0 left-0'>
        <div className='flex items-center gap-4'>
          <img src="/logo.png" alt="Logo" className='w-16 h-16' />
          <h1 className='text-center font-semibold text-xl'>Admin Panel</h1>
        </div>
        <hr className='text-amber-300 border-1' />
        {navItems.map((item, index) => {
          if (item.name === 'LogOut') {
            return (
              <button
                key={index + item.name}
                onClick={handleLogout}
                className='p-2 font-semibold rounded-md hover:translate-x-1 hover:translate-y-1 hover:bg-amber-200 flex gap-2 items-center w-53 text-left cursor-pointer'
              >
                {<item.icon size={25} />}
                {item.name}
              </button>
            );
          }
          return (
            <Link
              href={item.url}
              key={index + item.name}
              className={`p-2 font-semibold rounded-md hover:translate-x-1 hover:translate-y-1 hover:bg-amber-200 flex gap-2 items-center w-53 ${pathName === item.url ? 'bg-amber-200' : 'bg-white'}`}
            >
              {<item.icon size={25} />}
              {item.name}
            </Link>
          );
        })}
      </div>
    </AdminGuard>
  );
};

export default SideBar;
