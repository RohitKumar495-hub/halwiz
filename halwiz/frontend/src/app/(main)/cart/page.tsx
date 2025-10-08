'use client';

import Link from 'next/link';
import React, { useMemo, useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaCheck } from 'react-icons/fa';
import Products from '../products/page';
import { useCart } from '@/context/CartContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const CartPage = () => {
  const { cart, products, loading, removeItemCompletely, clearCart } = useCart(); // added clearCart
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Fetch user details (for address & phone check)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:8000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

  // Map cart items with product details
  const cartWithDetails = useMemo(() => {
    return cart
      .map(item => {
        const product = products.find(p => p._id === item.productId);
        if (!product) return null;
        return {
          ...product,
          quantity: item.quantity,
          subTotal: item.quantity * product.discountPrice,
        };
      })
      .filter(Boolean) as any[];
  }, [cart, products]);

  // Calculate totals
  const orderTotal = useMemo(() => {
    return cartWithDetails.reduce((acc, item) => acc + item.subTotal, 0);
  }, [cartWithDetails]);

  const shipping = 160;
  const totalToPay = orderTotal + shipping;

  if (loading) return <p className="p-4">Loading cart...</p>;
  if (!cartWithDetails.length) return <><p className="p-4 text-center">Your cart is empty.</p>
  <div className='w-full flex items-center justify-center'>
    <Link href={'/shop'} className='bg-amber-400 text-white w-50 text-center p-2 hover:bg-amber-500 rounded-md'>Continue Shopping</Link>
  </div>
  </>
  ;

  // ✅ Handle COD order
  const handleCODOrder = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      if (!user) {
        toast.error('Please wait, fetching your profile...');
        return;
      }

      if (!user.phoneNumber) {
        toast.error('Please add your phone number before placing the order.');
        return;
      }

      if (!user.addresses || user.addresses.length === 0) {
        toast.error('Please add your address before placing the order.');
        return;
      }

      setCreatingOrder(true);

      const response = await axios.post(
        'http://localhost:8000/api/auth/create-order',
        {
          items: cartWithDetails.map(item => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          addressIndex: 0,
          paymentMode: 'COD',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Order placed successfully via COD!');
        setIsModalOpen(false);

        // ✅ Clear cart in frontend
        clearCart();

        // ✅ Clear cart in DB
        await axios.post(
          'http://localhost:8000/api/auth/clear-cart',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        toast.error(response.data.message || 'Failed to place order.');
      }
    } catch (err: any) {
      console.error('Create order error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to place order.');
    } finally {
      setCreatingOrder(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="grid lg:grid-cols-[65%_30%] gap-8 bg-[#f6f5f7] p-4 h-full">
        {/* Order Items */}
        <div className="bg-white rounded-md p-4 max-h-[600px] overflow-y-scroll scrollbar-hidden">
          <div className="lg:flex justify-between font-semibold hidden">
            <h2 className="px-50">PRODUCT</h2>
            <div className="flex gap-20">
              <h2>PRICE</h2>
              <h2>QUANTITY</h2>
              <h2>SUBTOTAL</h2>
            </div>
          </div>
          <div className="border-b-2 w-full mt-5 border-b-gray-300" />

          {cartWithDetails.map(item => (
            <React.Fragment key={item._id}>
              <div className="flex items-center lg:gap-20 flex-col md:flex-row p-2 md:p-0 mb-4">
                <div className="cursor-pointer hover:text-red-500 ml-auto mb-2 md:hidden">
                  <AiOutlineClose onClick={() => removeItemCompletely(item._id)} />
                </div>
                <div className="flex items-center gap-10">
                  <div className="cursor-pointer hover:text-red-500 hidden md:block">
                    <AiOutlineClose onClick={() => removeItemCompletely(item._id)} />
                  </div>
                  <Link href="/" className="flex items-center gap-10">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white mt-2">
                      <img
                        src={item.images?.[0] || '/placeholder.png'}
                        alt={item.name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-2">
                      <p className="font-semibold text-sm lg:text-base">{item.name}</p>
                      <p className="lg:hidden block text-sm">₹{item.discountPrice.toLocaleString()}</p>
                    </div>
                  </Link>
                </div>

                <div className="flex items-center gap-18 flex-col lg:flex-row ml-auto lg:ml-45">
                  <p className="lg:block hidden">₹{item.discountPrice.toLocaleString()}</p>
                  <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-20 mt-2">
                    <p className="font-semibold text-sm lg:ml-12 flex gap-2 items-center">
                      <span className="lg:hidden block">Quantity :</span> {item.quantity}
                    </p>
                    <div className="text-[#e81e61] font-semibold">
                      <p className="text-sm lg:ml-14 flex items-center gap-2">
                        <span className="lg:hidden block">Subtotal :</span>₹{item.subTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="border-t border-gray-300 my-2" />
            </React.Fragment>
          ))}
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-md p-4 grid gap-4 h-fit">
          <h2 className="font-semibold text-xl">Cart Total</h2>
          <div className="w-full h-60 border border-gray-300 bg-[#fafafa] rounded-xl p-4 grid gap-2">
            <h3 className="font-semibold text-lg">Price Summary</h3>
            <div className="grid gap-1">
              <div className="flex justify-between">
                <p>Order Total</p>
                <p className="font-semibold">₹{orderTotal.toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p className="font-semibold">₹{shipping.toLocaleString()}</p>
              </div>
            </div>
            <div className="border-b w-full border-b-gray-300" />
            <div className="flex justify-between">
              <p>To Pay</p>
              <p className="font-semibold">₹{totalToPay.toLocaleString()}</p>
            </div>
            <div className="flex text-green-500 items-center gap-2">
              <FaCheck />
              <p>You are saving ₹{shipping.toLocaleString()} on this order.</p>
            </div>
          </div>
          <div className="flex justify-between">
            <p>Total</p>
            <p className="text-[#e81e61] font-semibold">₹{totalToPay.toLocaleString()}</p>
          </div>
          <button
            className="bg-[#f5a70c] px-2 py-2 text-white rounded-md cursor-pointer hover:bg-amber-300 font-semibold"
            onClick={() => setIsModalOpen(true)}
          >
            Proceed To Checkout
          </button>
        </div>
      </div>

      <Products />

      {/* Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 flex flex-col gap-4 relative">
            <h2 className="text-xl font-semibold">Choose Payment Method</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => toast('Online payment coming soon!')}
            >
              Pay Online
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleCODOrder}
              disabled={creatingOrder}
            >
              {creatingOrder ? 'Placing Order...' : 'Cash on Delivery (COD)'}
            </button>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsModalOpen(false)}
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
