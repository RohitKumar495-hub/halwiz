'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { useRouter } from 'next/navigation';

interface Address {
  _id: string;
  houseNumber: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
}

interface CartProduct {
  discountPrice: number;
  name: string;
}

interface CartItem {
  _id: string;
  product: CartProduct | null;
  quantity: number;
}

interface Order {
  _id: string;
  items: { product: CartProduct; quantity: number }[];
  totalAmount: number;
  status: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  addresses?: Address[];
  cartItems?: CartItem[];
  orders?: Order[];
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'addresses' | 'cart'>('cart');

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    houseNumber: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ name: '', description: '' });
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      try {
        const { data } = await axios.get('http://localhost:8000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          ...data.user,
          addresses: data.user.addresses || [],
          cartItems: data.user.cartItems || [],
          orders: data.user.orders || []
        });
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  // ---------- Address Handlers ----------
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddAddress = () => {
    setIsEditingAddress(true);
    setEditingAddressId(null);
    setAddressForm({ houseNumber: '', street: '', landmark: '', city: '', state: '', pincode: '' });
  };

  const openEditAddress = (addr: Address) => {
    setIsEditingAddress(true);
    setEditingAddressId(addr._id);
    setAddressForm({ ...addr });
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      if (editingAddressId) {
        const { data } = await axios.put(
          `http://localhost:8000/api/auth/edit-address/${editingAddressId}`,
          addressForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
          toast.success('Address updated!');
          setUser(prev => prev ? {
            ...prev,
            addresses: prev.addresses!.map(a => a._id === editingAddressId ? data.data : a)
          } : prev);
        }
      } else {
        const { data } = await axios.post(
          'http://localhost:8000/api/auth/add-address',
          addressForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
          toast.success('Address added!');
          setUser(prev => prev ? { ...prev, addresses: [...(prev.addresses || []), data.data] } : prev);
        }
      }
      setIsEditingAddress(false);
      setEditingAddressId(null);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const { data } = await axios.delete(`http://localhost:8000/api/auth/delete-address/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Address deleted!');
        setUser(prev => prev ? { ...prev, addresses: prev.addresses!.filter(a => a._id !== id) } : prev);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  // ---------- Testimonial Handlers ----------
  const handleTestimonialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTestimonialForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingTestimonial(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      // Replace with your actual testimonial endpoint
      const { data } = await axios.post(
        'http://localhost:8000/api/testimonials',
        testimonialForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success('Testimonial submitted!');
        setIsTestimonialModalOpen(false);
        setTestimonialForm({ name: '', description: '' });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit testimonial');
    } finally {
      setSubmittingTestimonial(false);
    }
  };

  // ---------- Cart Calculations ----------
  const totalItems = user?.cartItems?.reduce((acc, i) => acc + (i.quantity || 0), 0) || 0;
  const totalAmount = user?.cartItems?.reduce((acc, i) => {
    const price = i.product?.discountPrice ?? 0;
    const qty = i.quantity ?? 0;
    return acc + price * qty;
  }, 0) || 0;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md flex flex-col md:flex-row gap-6 p-6">
        {/* Sidebar */}
        <div className="md:w-1/3 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
          <div className="bg-red-500 w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-2">
            {userInitial}
          </div>
          <h2 className="text-2xl font-semibold">{user?.name || 'User'}</h2>
          <p className="text-gray-500">{user?.email || 'example@mail.com'}</p>
          <p className="text-gray-500 mt-1">{user?.phoneNumber || 'Phone not added'}</p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full mt-4">
            <button
              className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 rounded"
              onClick={() => setIsPhoneModalOpen(true)}
            >
              {user?.phoneNumber ? 'Edit Phone' : 'Add Phone'}
            </button>

            <button
              className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 rounded"
              onClick={openAddAddress}
            >
              {user?.addresses?.length ? 'Add New Address' : 'Add Address'}
            </button>

            <button
              className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 rounded"
              onClick={() => router.push('/orders')}
            >
              My Orders
            </button>

            <button
              className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 rounded"
              onClick={() => setIsTestimonialModalOpen(true)}
            >
              Write Testimonial
            </button>
          </div>

          {/* Tabs for Cart & Addresses */}
          <div className="flex gap-2 mt-6 w-full justify-around">
            <button
              className={`py-2 px-4 rounded ${activeTab === 'cart' ? 'bg-amber-400 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('cart')}
            >
              Cart
            </button>
            <button
              className={`py-2 px-4 rounded ${activeTab === 'addresses' ? 'bg-amber-400 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('addresses')}
            >
              Addresses
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="md:w-2/3 flex flex-col gap-4">
          {/* ADDRESSES */}
          {activeTab === 'addresses' && (
            <>
              {user?.addresses?.length ? (
                user.addresses.map(addr => (
                  <div key={addr._id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start shadow-sm relative">
                    <div className="flex flex-col gap-1 text-gray-700">
                      <p>{addr.houseNumber}, {addr.street}</p>
                      <p>{addr.landmark}</p>
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                    <div className="flex gap-2 absolute top-2 right-2">
                      <AiOutlineEdit className="cursor-pointer hover:text-blue-500" size={18} onClick={() => openEditAddress(addr)} />
                      <AiOutlineDelete className="cursor-pointer hover:text-red-500" size={18} onClick={() => handleDeleteAddress(addr._id)} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No addresses added</p>
              )}
            </>
          )}

          {/* CART */}
          {activeTab === 'cart' && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col gap-3">
              <h3 className="font-semibold text-lg mb-3">Cart Summary</h3>
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Total</span>
                <span>₹{totalAmount}</span>
              </div>
              <button className="w-full mt-3 bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 rounded">
                Proceed To Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PHONE MODAL */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{user?.phoneNumber ? 'Edit Phone' : 'Add Phone'}</h2>
            <input
              type="text"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold">
              Save
            </button>
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => setIsPhoneModalOpen(false)}>
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ADDRESS MODAL */}
      {isEditingAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative flex flex-col gap-4">
            <h3 className="font-semibold text-lg mb-3">{editingAddressId ? 'Edit Address' : 'Add Address'}</h3>
            <form className="flex flex-col gap-3" onSubmit={handleAddressSubmit}>
              {['houseNumber','street','landmark','city','state','pincode'].map(field => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={(addressForm as any)[field]}
                  onChange={handleAddressChange}
                  className="border border-gray-300 rounded px-3 py-2"
                />
              ))}
              <div className="flex gap-2 mt-2">
                <button type="submit" disabled={submitting} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setIsEditingAddress(false)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                  Cancel
                </button>
              </div>
            </form>
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => setIsEditingAddress(false)}>
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Write a Testimonial</h2>
            <form className="flex flex-col gap-3" onSubmit={handleTestimonialSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={testimonialForm.name}
                onChange={handleTestimonialChange}
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <textarea
                name="description"
                placeholder="Your Testimonial"
                value={testimonialForm.description}
                onChange={handleTestimonialChange}
                className="border border-gray-300 rounded px-3 py-2"
                rows={4}
                required
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={submittingTestimonial}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                >
                  {submittingTestimonial ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsTestimonialModalOpen(false)}
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
