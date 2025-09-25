'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AiOutlineHeart } from 'react-icons/ai';
import React, { useState } from 'react'

const NavbarPage = () => {
    const [isLogin, setIsLogin] = useState(false)
    const navItems = [
        { name: "Home", url: "/" },
        { name: "Shop", url: "/shop" },
        { name: "Cart", url: "/cart" },
        { name: "Track Your Order", url: "/track-order" },
        { name: "About Us", url: "/about" },
        { name: "Contact Us", url: "/contact" },
    ]

    const pathName = usePathname()

    return (
        <>
            <div className='h-22 w-full lg:flex items-center shadow-md justify-between px-10 py-10 p-4 fixed top-0 z-10 bg-white hidden'>
                <div>
                    <Link href="/">
                        <img src="/logo.png" alt="" className='w-25' />
                    </Link>
                </div>
                <nav>
                    <div className='flex gap-8'>
                        {
                            navItems.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <Link href={item.url} className={`${pathName === item.url ? 'underline underline-offset-4 decoration-red-500 decoration-[1.8px] text-gray-500' : ''}`}>
                                            {item.name}
                                        </Link>
                                    </div>
                                )
                            })
                        }
                    </div>

                </nav>
                <div className='flex items-center gap-8'>
                    {
                        isLogin ? (
                            <div className='flex items-center gap-8'>
                                <Link href='/wishlist' className='flex items-center gap-2 relative'>
                                    <AiOutlineHeart size={30} />
                                    <p>Wishlist</p>
                                    <p className='bg-red-500 rounded-full -top-1 right-15 text-white absolute w-4 h-4 text-xs flex items-center justify-center'>0</p>
                                </Link>
                                <div className='bg-red-500 w-16 h-16 rounded-full'>
                                </div>
                            </div>
                        ) : <div>
                            <Link href="/auth">Login / Signup</Link>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default NavbarPage