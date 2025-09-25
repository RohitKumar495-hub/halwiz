'use client'
import React from 'react'
import Products from '../products/page'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BiSearch } from 'react-icons/bi'

const ShopPage = () => {
  const pathName = usePathname()
  const categoryDetails = [
    {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
        {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
        {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
        {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
        {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
        {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
        {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
        {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
    {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
    {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
    {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
    {
      img: 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      name : 'Snacks'
    },
  ]
  return (
    <div className='p-4'>
      <div className='flex justify-between gap-4'>
        <div>
          <h2 className='font-semibold text-2xl'>Shop</h2>
          <div className='flex gap-2 mt-3'>
            <Link href='/' >Home</Link>
            <p>/</p>
            <Link href='/shop' className={`${pathName === '/shop' ? 'font-semibold' : ''}`}>Shop</Link>
          </div>
        </div>
        <div className='lg:w-lg w-sm h-18 shadow p-2 flex items-center justify-between px-3 rounded'>
          <input type="text" placeholder='Search for products' className='font-semibold outline-none h-full w-45'/>
            <BiSearch color='gray' size={25}/>
        </div>
      </div>

      <div className="mt-8 flex gap-6 overflow-x-auto flex-nowrap scrollbar-hidden">
        {categoryDetails.map((category, index) => (
          <div className="w-28 shrink-0 flex flex-col items-center" key={index}>
            <Link href="/shop" className="flex flex-col items-center">
              <img
                src={category.img}
                alt={category.name}
                className="w-28 h-28 rounded-full object-cover"
              />
              <p className="font-semibold text-center mt-2">{category.name}</p>
            </Link>
          </div>
        ))}
      </div>
      
      <Products />
    </div>
  )
}

export default ShopPage