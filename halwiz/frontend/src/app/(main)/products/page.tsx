'use client'
import CartModal from '@/components/CartModal';
import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa';

const Products = () => {
  const productItem = [
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      stars: 3,
      image : 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      previousPrice: '2,250.00',
      discountPrice: '1,009.00',
    },
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      stars: 2,
      image : 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      previousPrice: '2,250.00',
      discountPrice: '1,009.00',
      discountPercentage : '4'
    },
    {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      stars: 4,
      image : 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      previousPrice: '2,250.00',
      discountPrice: '1,009.00',
    },
        {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      stars: 4,
      image : 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      previousPrice: '2,250.00',
      discountPrice: '1,009.00',
    },
        {
      name: '3 Flavour Combo Pack(Thekua 450g each)',
      stars: 4,
      image : 'https://desitesi.com/wp-content/uploads/2025/05/7-300x300.png',
      previousPrice: '2,250.00',
      discountPrice: '1,009.00',
    },
  ]

  // 👇 Array of quantities, initialized with 0 for each product
  const [cartItems, setCartItems] = useState(Array(productItem.length).fill(0))
  const [openModal , setOpenModal] = useState(false)


  const addCartItem = (index:any) => {
    const newCart = [...cartItems]
    newCart[index] += 1
    setCartItems(newCart)
  }

  const subCartItem = (index:any) => {
    const newCart = [...cartItems]
    if (newCart[index] > 0) newCart[index] -= 1
    setCartItems(newCart)
  }

  return (
    <>
    <div className='mt-10 bg-gray-50 p-4 w-full'>
      <h2 className='text-xl font-semibold'>Our Products</h2>
      <div className='mt-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-6 md:gap-8'>
        {productItem.map((item, index) => {
          return (
            <div
              className='lg:w-70 md:w-45 w-38 h-auto bg-white shadow rounded p-2 md:p-3 grid gap-2'
              key={index}
            >
              <div className='h-auto md:h-45 w-full relative'>
                <img
                  src={item.image}
                  alt=''
                  className='h-full w-full object-scale-down md:object-fill'
                />
                {
                  item.discountPercentage &&                 
                    <div className='md:w-12 md:h-12 w-8 h-8 rounded-full bg-red-500 absolute top-2 left-1 flex items-center justify-center text-white font-semibold'>
                      <p className='text-xs lg:text-base'>- {item.discountPercentage}%</p>
                    </div>
                }
              </div>
              <div className='text-center grid gap-2'>
                <p className='font-semibold text-sm'>{item.name}</p>

                {/* Show stars properly */}
                <div className='text-[#ebbf13] flex items-center justify-center gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={16}
                      color={i < item.stars ? '#ebbf13' : '#ddd'}
                    />
                  ))}
                </div>

                <div className='flex justify-center gap-4 text-xs'>
                  <p className='line-through text-gray-300'>₹{item.previousPrice}</p>
                  <p className='text-red-500'>₹{item.discountPrice}</p>
                </div>

                <div>
                  <div className='flex lg:flex-row flex-col items-center justify-center gap-4 lg:gap-8'>
                    {/* Quantity counter */}
                    <div className='flex border rounded border-gray-200'>
                      <button
                        className='px-2 py-1 cursor-pointer hover:bg-red-500 hover:text-white'
                        onClick={() => subCartItem(index)}
                      >
                        -
                      </button>
                      <p className='border px-2 border-t-0 border-b-0 py-1 border-gray-200 rounded'>
                        {cartItems[index]}
                      </p>
                      <button
                        className='px-2 py-1 cursor-pointer hover:bg-red-500 hover:text-white'
                        onClick={() => addCartItem(index)}
                      >
                        +
                      </button>
                    </div>

                    {/* Add to cart button */}
                    <div className='bg-[#f5a70c] text-white rounded py-1 px-2'>
                      <button className='cursor-pointer font-bold text-xs' onClick={() => setOpenModal(true)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>

    {
        openModal && 
            <CartModal close={() => setOpenModal(false)} />
    }
    </>
  )
}

export default Products
