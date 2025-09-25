'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const TrackOrder = () => {
  const pathName = usePathname()
  return (
    <div className='grid gap-10'>
      <div className='bg-[#f6f5f8] p-4 text-center py-6 grid gap-4'>
        <h1 className='font-semibold text-amber-700 md:text-3xl'>Track Your Order</h1>
        {
          <div className='flex gap-4 items-center justify-center'>
            <Link href="/">
              Home
            </Link>
            <p>/</p>
            <Link href='/track-order' className={`${pathName === '/track-order' ? 'font-semibold' : ' '}`}
            >Track Your Order</Link>
          </div>
        }

      </div>
      <div className='lg:px-20 px-4 grid gap-8'>
        <div className='bg-[#5a3ad4] w-full h-auto rounded-2xl text-white grid justify-center p-4 gap-4'>
          <h1 className='text-5xl font-semibold text-center'>Order Tracking</h1>
          <div className='lg:w-4xl'>
            <p className='text-[#ded0e9] text-lg'>To track your order please enter your Order ID in the box below and press the "Track" button. This was given to you on your receipt and in the confirmation email you should have received.</p>
          </div>
          <div>
            <form action="" className='flex gap-8 items-center justify-center flex-col md:flex-row'>
              <div className='grid'>
                <label htmlFor="order-id">Order Id</label>
                <input type="text" placeholder='Found in your confirmation email' className='bg-white lg:w-xs text-black p-2 outline-none font-semibold rounded' />
              </div>
              <div className='grid'>
                <label htmlFor="billing-id">Billing Id</label>
                <input type="text" placeholder='Email you used during checkout' className='bg-white lg:w-xs text-black p-2 outline-none font-semibold rounded' />
              </div>
              <button className='bg-[#f5a70c] p-2 mt-6 font-semibold rounded w-20 cursor-pointer'>Track</button>
            </form>
          </div>
        </div>
      </div >
    </div >
  )
}

export default TrackOrder