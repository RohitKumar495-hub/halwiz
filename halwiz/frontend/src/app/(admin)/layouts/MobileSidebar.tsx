'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { usePathname, useRouter } from 'next/navigation';

const MobileSidebar = () => {
    const [openLeftMenu, setOpenLeftMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathName = usePathname();
    const router = useRouter();

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const isAuth = localStorage.getItem('isAdmin'); // or 'isAuth' if you use that
        setIsLoggedIn(!!token && isAuth === 'true');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.setItem('isAdmin', 'false'); // or 'isAuth'
        setIsLoggedIn(false);
        router.push('/auth');
        setOpenLeftMenu(false);
    };

    const navItems = [
        { name: 'Dashboard', url: '/admin-home', private: true },
        { name: 'Products', url: '/product-list', private: true },
        { name: 'Orders', url: '/order-list', private: true },
        { name: 'Customers', url: '/customer-list', private: true },
    ];

    const publicNavItems = [
        { name: 'Login', url: '/auth' },
        { name: 'Signup', url: '/auth' },
    ];

    return (
        <>
            {/* Top bar */}
            <div className='lg:hidden block w-full bg-white shadow fixed top-0 z-10'>
                <nav className='flex items-center px-5 justify-between'>
                    <div>
                        <Link href="/">
                            <img src="/logo.png" alt="Logo" className='w-15' />
                        </Link>
                    </div>
                    <div onClick={() => setOpenLeftMenu(prev => !prev)} className='cursor-pointer'>
                        <AiOutlineMenu size={30} />
                    </div>
                </nav>
            </div>

            {/* Sidebar */}
            {openLeftMenu && (
                <div className='bg-black/40 w-full h-screen z-10 fixed inset-0'>
                    <div className='bg-white w-60 h-full'>
                        {/* Close button */}
                        <div className='w-full flex items-center p-2 justify-end border-b border-b-gray-300 h-16 hover:text-red-500 cursor-pointer' onClick={() => setOpenLeftMenu(false)}>
                            <AiOutlineClose size={20} />
                        </div>

                        <nav className='p-2'>
                            {/* Private nav items */}
                            {isLoggedIn && navItems.map((navItem, index) => (
                                <div key={index + navItem.name} className='w-full grid items-center p-2 border-b border-b-gray-300 h-12 hover:text-red-500' onClick={() => setOpenLeftMenu(false)}>
                                    <Link href={navItem.url} className={`text-xs font-semibold ${pathName === navItem.url ? 'text-red-500' : ''}`}>{navItem.name}</Link>
                                </div>
                            ))}

                            {/* Public nav items */}
                            {!isLoggedIn && publicNavItems.map((navItem, index) => (
                                <div key={index + navItem.name} className='w-full grid items-center p-2 border-b border-b-gray-300 h-12 hover:text-red-500' onClick={() => setOpenLeftMenu(false)}>
                                    <Link href={navItem.url} className={`text-xs font-semibold ${pathName === navItem.url ? 'text-red-500' : ''}`}>{navItem.name}</Link>
                                </div>
                            ))}

                            {/* Logout button */}
                            {isLoggedIn && (
                                <div className='w-full grid items-center p-2 border-b border-b-gray-300 h-12 hover:text-red-500'>
                                    <button onClick={handleLogout} className='text-xs font-semibold text-left'>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </>
    )
}

export default MobileSidebar;
