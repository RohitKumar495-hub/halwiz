'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Import toast

interface ProductItem {
  productId: string;
  productName: string;
  quantity: number;
  originalPrice: number;
  images: string[];
  _id: string;
}

interface OrderItem {
  _id: string;
  items: ProductItem[];
  totalPrice: number;
  createdAt: string;
  status: string;
  customerName: string;
  customerPhone: string;
  paymentMode: string;
  address: {
    houseNumber: string;
    street: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [returnReason, setReturnReason] = useState<{ [key: string]: string }>({});

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const { data } = await axios.get('http://localhost:8000/api/auth/get-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        toast.error('Failed to fetch orders');
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let tempOrders = [...orders];

    if (search) {
      tempOrders = tempOrders.filter(order =>
        order.items.some(p =>
          p.productName.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'all') {
      tempOrders = tempOrders.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(tempOrders);
  }, [search, statusFilter, orders]);

  // Handle order return
  const handleReturnOrder = async (orderId: string) => {
    if (!returnReason[orderId]) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const { data } = await axios.post(
        'http://localhost:8000/api/auth/return-order',
        {
          orderId,
          reason: returnReason[orderId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success('Order returned successfully!');
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: 'returned' } : order
          )
        );
      }
    } catch (error) {
      console.error('Return order error:', error);
      toast.error('Failed to return order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
      <Toaster position="top-right" /> {/* Add toaster component */}

      {/* Left Sidebar - Fixed */}
      <div className="w-1/4 bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 sticky top-6 h-[calc(100vh-48px)]">
        <h3 className="font-semibold text-lg mb-2">Filters</h3>

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <div className="flex flex-col gap-2 mt-2">
          <label className="font-semibold">Order Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Right Content - Scrollable */}
      <div className="w-3/4 bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-48px)]">
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

        {loading ? (
          <p className="text-center py-6">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No orders found.</p>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Order ID: {order._id.slice(-6)}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    order.status === 'delivered'
                      ? 'bg-green-500'
                      : order.status === 'shipped'
                      ? 'bg-blue-500'
                      : order.status === 'pending'
                      ? 'bg-yellow-500'
                      : order.status === 'returned'
                      ? 'bg-red-500'
                      : 'bg-gray-500'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Customer Info */}
              <div className="text-gray-700 text-sm mt-1">
                <p>
                  <span className="font-semibold">Customer:</span> {order.customerName}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {order.customerPhone}
                </p>
                <p>
                  <span className="font-semibold">Payment:</span> {order.paymentMode}
                </p>
                <p className="font-semibold mt-1">Shipping Address:</p>
                <p>
                  {order.address.houseNumber}, {order.address.street}
                </p>
                <p>{order.address.landmark}</p>
                <p>
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
              </div>

              {/* Products List */}
              <div className="flex flex-col gap-2 mt-2">
                {(order.items || []).map(p => (
                  <div
                    key={p._id}
                    className="flex justify-between items-center border-b border-gray-200 pb-2"
                  >
                    <div>
                      <p className="font-semibold">{p.productName}</p>
                      <p className="text-gray-500 text-sm">Price: ₹{p.originalPrice}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span>Qty: {p.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Cancel Button */}
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-lg">Total: ₹{order.totalPrice}</span>
                {(order.status === 'pending' || order.status === 'shipped') && (
                  <div className="flex gap-2 items-center">
                    <select
                      value={returnReason[order._id] || ''}
                      onChange={e =>
                        setReturnReason(prev => ({ ...prev, [order._id]: e.target.value }))
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select return reason</option>
                      <option value="Ordered by mistake">Ordered by mistake</option>
                      <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
                      <option value="Product damaged">Product damaged</option>
                      <option value="Wrong item received">Wrong item received</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      onClick={() => handleReturnOrder(order._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel / Return
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
