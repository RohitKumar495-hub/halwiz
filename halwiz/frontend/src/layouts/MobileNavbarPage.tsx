'use client'
import Link from 'next/link';
import React, { useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai';
import { AiOutlineClose } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { usePathname } from 'next/navigation';
import { BsHandbag } from 'react-icons/bs';
import { AiOutlineHome } from 'react-icons/ai';
import { MdAccountCircle } from 'react-icons/md';
import { AiOutlineHeart } from 'react-icons/ai';

const MobileNavbarPage = () => {
    const [openLeftMenu, setOpenLeftMenu] = useState(false)
    const pathName = usePathname()
    const navItems = [
        {name : 'Home' , url: '/'},
        {name : 'About Us' , url: '/about'},
        {name : 'Shop' , url: '/shop'},
        {name : 'Track Your Order' , url: '/track-order'},
        {name : 'FAQs' , url : '/faqs'}
    ]

    const iconItems = [
        {name: 'Home' , url: '/' , 'icon' : AiOutlineHome},
        {name: 'Wishlist' , url: '/wishlist' , 'icon' : AiOutlineHeart, 'wishListQuantity' : '6'},
        {name: 'Cart' , url: '/cart' , 'icon' : BsHandbag , 'cratQuantity' : '5'},
        {name: 'My account' , url: '/account' , 'icon' : MdAccountCircle}
    ]
  return (
    <>
    <div className='lg:hidden block w-full bg-white shadow fixed top-0 z-10'>

        <nav className='flex items-center px-5 justify-between'>
            <div>
                <Link href="/">
                    <img src="/logo.png" alt="" className='w-15'/>
                </Link>
            </div>
            <div onClick={() => setOpenLeftMenu(prev => !prev)} className='cursor-pointer'>
                <AiOutlineMenu size={30} />
            </div>

        </nav>

        <nav className='bg-white fixed bottom-0 z-20 p-2 w-full shadow flex items-center justify-evenly gap-4'>
            {
                iconItems.map((item, index) => {
                    return (
                        <div key={index + item.name}>
                            <Link href={item.url} className='grid place-items-center'>
                                {<item.icon size={25}/>}
                                <div className='relative'>
                                    <p className='text-xs font-semibold'>{item.name}</p>
                                    {
                                        item.wishListQuantity && (
                                            <p className='bg-red-500 rounded-full -top-7 right-0 text-white absolute w-4 h-4 text-xs flex items-center justify-center'>{item.wishListQuantity}</p>
                                        )
                                    }
                                                                    {
                                        item.cratQuantity && (
                                            <p className='bg-red-500 rounded-full -top-7 -right-2 text-white absolute w-4 h-4 text-xs flex items-center justify-center'>{item.cratQuantity}</p>
                                        )
                                    }
                                </div>
                            </Link>
                        </div>
                    )
                })
            }
        </nav>
    </div>
    {
        openLeftMenu && (

            <div className='bg-black/40 w-full h-screen z-10 fixed inset-0'>
                <div className='bg-white w-60 h-full'>
                    <div className='w-full flex items-center p-2 justify-end border-b border-b-gray-300 h-16 hover:text-red-500 cursor-pointer' onClick={() => setOpenLeftMenu(false)}>
                        <AiOutlineClose size={20} />
                    </div>
                    <div className='w-full h-18 shadow p-2 flex items-center px-3'>
                        <input type="text" placeholder='Search for products' className='font-semibold outline-none h-full w-45'/>
                        <BiSearch color='gray' size={25}/>
                    </div>
                    <nav className='p-2'>
                        {
                            navItems.map((navItem , index) => {
                                return (
                                    <div key={index + navItem.name} className='w-full grid items-center p-2 border-b border-b-gray-300 h-12 hover:text-red-500' onClick={() => setOpenLeftMenu(false)}>
                                        <Link href={navItem.url} className={`text-xs font-semibold ${pathName === navItem.url ? 'text-red-500' : ''}`}>{navItem.name}</Link>
                                    </div>
                                )
                            })
                        }
                    </nav>
                </div>
            </div>
            
        )
    }
    </>
  )
}

export default MobileNavbarPage