'use client';
import React, { useState } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';
import CartModal from '@/components/CartModal';
import { useCart } from '@/context/CartContext';
import toast, { Toaster } from 'react-hot-toast';

const Products = () => {
  const { products, cart, wishlist, addToCart, removeFromCart, toggleWishlist, loading } = useCart();
  const [openModal, setOpenModal] = useState(false);

  // Get quantity of a product in cart
  const getQuantity = (productId: string) => {
    const item = cart.find(c => c.productId === productId);
    return item ? item.quantity : 0;
  };

  // Handle add to cart + toast
  const handleAdd = (productId: string) => {
    addToCart(productId);
    toast.success('Product added successfully!');
  };

  // Handle remove from cart + toast
  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    toast('Product removed successfully!');
  };

  return (
    <>
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="mt-24 bg-gray-50 p-4 w-full">
        <h2 className="text-xl font-semibold">Our Products</h2>

        {loading ? (
          <p className="text-center mt-8 text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center mt-8 text-gray-500">No products found.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-6 md:gap-8">
            {products.map(product => (
              <div
                key={product._id}
                className="relative lg:w-70 md:w-45 w-38 h-auto bg-white shadow rounded p-2 md:p-3 grid gap-2 hover:shadow-lg transition-shadow"
              >
                {/* Wishlist */}
                <button
                  className="absolute top-3 right-3 z-1 cursor-pointer text-red-500"
                  onClick={() => toggleWishlist(product._id)}
                  aria-label="Toggle wishlist"
                >
                  {wishlist.includes(product._id) ? <AiFillHeart size={22} /> : <AiOutlineHeart size={22} />}
                </button>

                {/* Product Image */}
                <div className="h-40 w-full relative">
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="h-full w-full object-cover rounded-md"
                  />
                  {product.discountPercent > 0 && (
                    <div className="absolute top-2 left-2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
                      <p className="text-xs lg:text-base">-{product.discountPercent}%</p>
                    </div>
                  )}
                </div>

                {/* Product Name */}
                <p className="font-semibold text-sm text-center">{product.name}</p>

                {/* Stars */}
                <div className="text-[#ebbf13] flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={16} color={i < (product.stars || 0) ? '#ebbf13' : '#ddd'} />
                  ))}
                </div>

                {/* Price */}
                <div className="flex justify-center gap-4 text-xs">
                  <p className="line-through text-gray-300">₹{product.originalPrice}</p>
                  <p className="text-red-500">₹{product.discountPrice}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex lg:flex-row flex-col items-center justify-center gap-4 lg:gap-8 mt-2">
                  <div className="flex border rounded border-gray-200">
                    <button
                      className="px-2 py-1 cursor-pointer hover:bg-red-500 hover:text-white"
                      onClick={() => handleRemove(product._id)}
                    >
                      -
                    </button>
                    <p className="border px-2 border-t-0 border-b-0 py-1 border-gray-200 rounded">
                      {getQuantity(product._id)}
                    </p>
                    <button
                      className="px-2 py-1 cursor-pointer hover:bg-red-500 hover:text-white"
                      onClick={() => handleAdd(product._id)}
                    >
                      +
                    </button>
                  </div>

                  {/* Open Cart Modal */}
                  <div className="bg-[#f5a70c] text-white rounded py-1 px-2">
                    <button className="cursor-pointer font-bold text-xs" onClick={() => setOpenModal(true)}>
                      View Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {openModal && <CartModal close={() => setOpenModal(false)} />}
    </>
  );
};

export default Products;
