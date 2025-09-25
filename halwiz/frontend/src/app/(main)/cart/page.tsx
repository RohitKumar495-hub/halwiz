'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import Products from '../products/page';
import { FaCheck } from 'react-icons/fa';

const CartPage = () => {

  const productItem = [
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      image: 'https://desitesi.com/wp-content/uploads/2025/05/pack-of-3-1-768x768.png',
      price: '2,250.00',
      subTotal: '2,250.00',
    },
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      image: 'https://desitesi.com/wp-content/uploads/2025/05/pack-of-3-1-768x768.png',
      price: '2,250.00',
      subTotal: '2,250.00',
    },
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      image: 'https://desitesi.com/wp-content/uploads/2025/05/pack-of-3-1-768x768.png',
      price: '2,250.00',
      subTotal: '2,250.00',
    },
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      image: 'https://desitesi.com/wp-content/uploads/2025/05/pack-of-3-1-768x768.png',
      price: '2,250.00',
      subTotal: '2,250.00',
    },
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      image: 'https://desitesi.com/wp-content/uploads/2025/05/pack-of-3-1-768x768.png',
      price: '2,250.00',
      subTotal: '2,250.00',
    },
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      image: 'https://desitesi.com/wp-content/uploads/2025/05/pack-of-3-1-768x768.png',
      price: '2,250.00',
      subTotal: '2,250.00',
    },
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      image: 'https://desitesi.com/wp-content/uploads/2025/05/pack-of-3-1-768x768.png',
      price: '2,250.00',
      subTotal: '2,250.00',
    },
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      image: 'https://desitesi.com/wp-content/uploads/2025/05/pack-of-3-1-768x768.png',
      price: '2,250.00',
      subTotal: '2,250.00',
    },
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      image: 'https://desitesi.com/wp-content/uploads/2025/05/pack-of-3-1-768x768.png',
      price: '2,250.00',
      subTotal: '2,250.00',
    },
  ]

  // 👇 Array of quantities, initialized with 0 for each product
  const [cartItems, setCartItems] = useState(Array(productItem.length).fill(1))

  const addCartItem = (index: any) => {
    const newCart = [...cartItems]
    newCart[index] += 1
    setCartItems(newCart)
  }

  const subCartItem = (index: any) => {
    const newCart = [...cartItems]
    if (newCart[index] > 0) newCart[index] -= 1
    setCartItems(newCart)
  }
  return (
    <>
      <div className='grid lg:grid-cols-[65%_30%] gap-8 bg-[#f6f5f7] p-4 h-full'>

        {/* order items */}
        <div className='bg-white rounded-md p-4 max-h-[600px] overflow-y-scroll scrollbar-hidden'>
          <div className='lg:flex justify-between font-semibold hidden'>
            <h2 className='px-50'>PRODUCT</h2>
            <div className='flex gap-20'>
              <h2>PRICE</h2>
              <h2>QUANTITY</h2>
              <h2>SUBTOTAL</h2>
            </div>
          </div>
          <div className='border-b-2 w-full mt-5 border-b-gray-300' />
          <div>
            {
              productItem.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <div className='flex items-center lg:gap-20 flex-col md:flex-row p-2 md:p-0'>
                      <div className='cursor-pointer hover:text-red-500 ml-auto mb-2 md:hidden'>
                        <AiOutlineClose />
                      </div>
                      <div className='flex items-center gap-10'>
                        <div className='cursor-pointer hover:text-red-500 hidden md:block'>
                          <AiOutlineClose />
                        </div>
                        <Link href='/' className='flex items-center gap-10'>
                          <img src={item.image} alt="" className='lg:w-24 w-20' />
                          <div className='flex flex-col lg:flex-row gap-2'>
                            <p className='font-semibold text-sm lg:text-base'>{item.name}</p>
                            <p className='lg:hidden block text-sm'>₹{item.price}</p>
                          </div>
                        </Link>
                      </div>
                      <div className='flex items-center gap-18 flex-col lg:flex-row ml-auto lg:ml-0'>
                        <p className='lg:block hidden'>₹{item.price}</p>
                        <div className='flex'>
                          <div className='flex flex-row items-center justify-center gap-4 lg:gap-20 mt-2'>
                            {/* Quantity counter */}
                            <div className='flex border rounded border-gray-200'>
                              <button
                                className='lg:px-2 px-1 lg:py-1 py-[1px] cursor-pointer hover:bg-red-500 hover:text-white'
                                onClick={() => subCartItem(index)}
                              >
                                -
                              </button>
                              <p className='border lg:px-2 px-1 border-t-0 border-b-0 py-1 border-gray-200 rounded'>
                                {cartItems[index]}
                              </p>
                              <button
                                className='lg:px-2 px-1 lg:py-1 py-[1px] cursor-pointer hover:bg-red-500 hover:text-white'
                                onClick={() => addCartItem(index)}
                              >
                                +
                              </button>
                            </div>

                            <div className='text-[#e81e61] font-semibold'>
                              <p className='text-sm'>₹{item.subTotal}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className='border-b mt-1 w-full border-b-gray-300' />
                  </React.Fragment>
                )
              })
            }
          </div>
        </div>

        {/* price summary */}
        <div className='bg-white rounded-md p-4 grid gap-4 h-fit'>
          <h2 className='font-semibold text-xl'>Cart Total</h2>
          <div className='w-full h-60 border border-gray-300 bg-[#fafafa] rounded-xl p-4 grid gap-2'>
            <h3 className='font-semibold text-lg'>Price Summary</h3>
            <div className='grid gap-1'>
              <div className='flex justify-between'>
                <p>Order Total</p>
                <p className='font-semibold'>₹2691.00</p>
              </div>
              <div className='flex justify-between'>
                <p>Shipping</p>
                <p className='font-semibold'>₹160.00</p>
              </div>
            </div>
            <div className='border-b w-full border-b-gray-300' />
            <div className='flex justify-between'>
              <p>To Pay</p>
              <p className='font-semibold'>₹2691.00</p>
            </div>
            <div className='flex text-green-500 items-center gap-2'>
              <FaCheck />
              <p>You are saving ₹160.00 on this order.</p>
            </div>
          </div>
          <div className='flex justify-between'>
            <p>Total</p>
            <p className='text-[#e81e61] font-semibold'>₹2569.00</p>
          </div>
          <button className='bg-[#f5a70c] px-2 py-2 text-white rounded-md cursor-pointer hover:bg-amber-300 font-semibold'>Proceed To Checkout</button>
        </div>
      </div>

      <Products />
    </>

  )
}

export default CartPage